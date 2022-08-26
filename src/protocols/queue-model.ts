export interface IAddQueue {
  add(data: any): void
}

export interface IAddQueueBulk {
  addBulk(dataBulk: any[]): void
}

export interface IJob {
  promise(data: any): Promise<void>
}

export interface IQueueJob {
  data: any
  attempts: number
}
