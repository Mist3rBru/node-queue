import { Request, Response } from 'express'
import { MailerAdapter } from './mailer-adapter'
import { IAddQueue, IAddQueueBulk } from './protocols/queue-model'
import { IUser } from './protocols/user-model'
import { RegistrationEmailJob } from './queue/jobs/RegistrationMail'
import { Queue } from './queue/queue'

export class UsersController {
  constructor (private readonly queue: IAddQueue & IAddQueueBulk) {}

  async save (req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body
    const user: IUser = { name, email, password }
    this.queue.add(user)
    res.json({ message: 'Queue is running' })
  }

  async saveBulk (req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body
    const { count } = req.params
    const user: IUser = { name, email, password }
    const bulk = Array(Number(count)).fill(user)
    this.queue.addBulk(bulk)
    res.json({ message: 'Bulk queue is running' })
  }
}

const mailer = new MailerAdapter()
const job = new RegistrationEmailJob(mailer)
const queue = new Queue(job, 1, 3)

export const usersController = new UsersController(queue)
