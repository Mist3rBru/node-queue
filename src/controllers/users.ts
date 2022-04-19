import { User } from '../domain'
import { Request, Response } from 'express'
import { Queue } from '../queue'

const queue = new Queue()

class UsersController {
  async save (req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body
    const user: User = { name, email, password }
    queue.add(user, 'RegistrationMail')
    res.json({ message: 'Queue is running' })
  }

  async saveBulk (req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body
    const { count } = req.params
    const user: User = { name, email, password }
    const bulk = Array(Number(count)).fill(user)
    queue.addBulk(bulk, 'RegistrationMail')
    res.json({ message: 'Bulk queue is running' })
  }
}

export const usersController = new UsersController()
