import { Job, QueueJob } from './domain'
import { readdirSync } from 'fs'
import { resolve } from 'path'

export class Queue {
  private readonly maxParallelProcs: number
  private readonly maxAttempts: number
  constructor (maxParallelProcs?: number, maxAttempts?: number) {
    this.maxParallelProcs = maxParallelProcs || 2
    this.maxAttempts = maxAttempts || 3
  }

  private readonly jobs = this.getJobs()
  private waitingQueue: QueueJob[] = []
  private runningQueue: number = 0

  private getJobs (): Job[] {
    const jobs: Job[] = []
    const files = readdirSync(resolve(__dirname, 'jobs'))
    files.forEach(async file => {
      jobs.push((await import(`./jobs/${file}`)).default)
    })
    return jobs
  }

  add (data: any, jobKey: string): void {
    const job = this.jobs.find(job => job.key === jobKey)
    this.waitingQueue.push(Object.assign(job, { data, attempts: 0 }))
    this.process()
  }

  addBulk (dataBulk: any[], jobKey: string): void {
    dataBulk.forEach(data => this.add(data, jobKey))
  }

  private async process (): Promise<void> {
    if (this.runningQueue >= this.maxParallelProcs) {
      process.stdout.write(`Waiting 1 of ${this.runningQueue} jobs to end (${this.waitingQueue.length} on waiting queue)\n`)
      setTimeout(() => this.process(), 200)
      return
    }
    const queueJob = this.waitingQueue.shift()
    this.runningQueue++
    try {
      await queueJob.promise(queueJob.data)
    } catch (error) {
      process.stdout.write(`☢ ${queueJob?.attempts} tries \n`)
      if (!queueJob) {
        process.stdout.write('*** ENDING QUEUE *** \n')
      } else if (queueJob.attempts < this.maxAttempts) {
        queueJob.attempts++
        this.waitingQueue.unshift(queueJob)
        this.process()
      } else {
        this.waitingQueue = this.waitingQueue.filter(job => job !== queueJob)
        process.stdout.write('♨ MAX ATTEMPTS REACHED \n')
      }
    }
    this.runningQueue--
  }
}
