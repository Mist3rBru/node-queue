import {
  IAddQueue,
  IAddQueueBulk,
  IJob,
  IQueueJob
} from '../protocols/queue-model'

interface IQueue extends IAddQueue, IAddQueueBulk {
}

export class Queue implements IQueue {
  constructor (
    private readonly job: IJob,
    readonly maxParallelProcs: number,
    readonly maxAttempts: number
  ) {}

  waitingQueue: IQueueJob[] = []
  runningQueue: number = 0

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
