export type Job = {
  key: string
  promise: any
}

export type QueueJob = {
  key: string
  promise: any
  data: any
  attempts: number
}
