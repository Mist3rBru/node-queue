import { User } from '../domain'
import { Request, Response } from 'express'
import Queue from '../jobs'

class UsersController {
  async save (req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body
    const user: User = { name, email, password }
    await Queue.add({ user })
    res.json(user)
  }
}

export const usersController = new UsersController()
