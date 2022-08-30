import { Request, Response } from 'express'
import { IAddQueue, IAddQueueBulk } from '../protocols/queue-model'
import { IUser } from '../protocols/user-model'

export class UsersController {
  constructor (public queue: IAddQueue & IAddQueueBulk) {}

  save (req: Request, res: Response): void {
    const { name, email, password } = req.body
    const user: IUser = { name, email, password }
    this.queue.add(user)
    res.json({ message: 'Queue is running' })
  }

  saveBulk (req: Request, res: Response): void {
    const { name, email, password } = req.body
    const { count } = req.params
    const user: IUser = { name, email, password }
    const bulk = Array(Number(count)).fill(user)
    this.queue.addBulk(bulk)
    res.json({ message: 'Bulk queue is running' })
  }
}
