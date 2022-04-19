export type Job = {
  key: string
  promise: any
}

export type QueueJob = {
  job: Job
  data: any
  attempts: number
}
