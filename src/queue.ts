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
  private readonly waitingQueue: QueueJob[] = []
  private runningQueue: number = 0

  private getJobs (): Job[] {
    const jobs = []
    readdirSync(resolve(__dirname, 'jobs')).forEach(async file => {
      const job = (await import(`./jobs/${file}`)).default
      jobs.push(job)
    })
    return jobs
  }

  add (data: any, jobKey: string): void {
    const job = this.jobs.find(job => job.key === jobKey)
    this.waitingQueue.push({
      job,
      data,
      attempts: 0
    })
    this.process()
  }

  addBulk (dataBulk: any[], jobKey: string): void {
    dataBulk.forEach(data => this.add(data, jobKey))
  }

  private async process (): Promise<void> {
    if (this.runningQueue >= this.maxParallelProcs) {
      setTimeout(() => {
        process.stdout.write(`Waiting 1 of ${this.runningQueue} jobs to end \n`)
        this.process()
      }, 1000)
      return
    }
    this.runningQueue++
    const queueJob = this.waitingQueue.shift()
    await queueJob.job.promise(queueJob.data).catch(() => {
      process.stdout.write(`☢ ${queueJob.attempts} tries \n`)
      if (queueJob.attempts < this.maxAttempts) {
        queueJob.attempts++
        this.waitingQueue.unshift(queueJob)
        this.process()
      } else {
        process.stdout.write('♨ MAX ATTEMPTS REACHED \n')
      }
    })
    this.runningQueue--
  }
}
