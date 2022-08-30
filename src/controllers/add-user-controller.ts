import { HttpResponse, IController } from '../protocols/controller-model'
import { IAddQueue } from '../protocols/queue-model'
import { IUser } from '../protocols/user-model'

export class AddUserController implements IController {
  constructor (public queue: IAddQueue) {}

  async handle (request: AddUserController.Request): Promise<HttpResponse> {
    const { name, email, password } = request
    const user: IUser = { name, email, password }
    this.queue.add(user)
    return {
      statusCode: 200,
      body: {
        message: 'Queue is running'
      }
    }
  }
}

export namespace AddUserController {
  export interface Request {
    name: string
    email: string
    password: string
  }
}
