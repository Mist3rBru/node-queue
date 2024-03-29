import {
  IAddQueue,
  IAddQueueBulk,
  IJob,
  IQueueJob
} from '../protocols/queue-model'

interface IQueue extends IAddQueue, IAddQueueBulk {}

export class Queue implements IQueue {
  private readonly job: IJob
  public waitingQueue: IQueueJob[]
  public runningQueue: number
  public maxParallelProcs: number
  public maxAttempts: number
  constructor (job: IJob, maxParallelProcs = 1, maxAttempts = 3) {
    this.job = job
    this.maxParallelProcs = maxParallelProcs
    this.maxAttempts = maxAttempts
    this.runningQueue = 0
    this.waitingQueue = []
  }

  add (data: any): void {
    this.waitingQueue.push({
      data,
      attempts: 0
    })
    void this.process()
  }

  addBulk (dataBulk: any[]): void {
    dataBulk.forEach(data => this.add(data))
  }

  async process (): Promise<void> {
    if (this.runningQueue >= this.maxParallelProcs) {
      setTimeout(() => {
        process.stdout.write(`Waiting 1 of ${this.runningQueue} jobs to end \n`)
        void this.process()
      }, 1000)
      return
    }
    this.runningQueue++
    const queueJob = this.waitingQueue.shift()
    await this.job.promise(queueJob.data).catch(() => {
      process.stdout.write(`☢ ${queueJob.attempts} tries \n`)
      if (queueJob.attempts < this.maxAttempts) {
        queueJob.attempts++
        this.waitingQueue.unshift(queueJob)
        void this.process()
      } else {
        process.stdout.write('♨ MAX ATTEMPTS REACHED \n')
      }
    })
    this.runningQueue--
  }
}
