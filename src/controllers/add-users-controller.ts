import { HttpResponse, IController } from '../protocols/controller-model'
import { IAddQueueBulk } from '../protocols/queue-model'
import { IUser } from '../protocols/user-model'

export class AddUsersController implements IController {
  constructor (public queue: IAddQueueBulk) {}

  async handle (request: AddUsersController.Request): Promise<HttpResponse> {
    try {
      const { name, email, password, count } = request
      const user: IUser = { name, email, password }
      const bulk: IUser[] = new Array(parseInt(count)).fill(user)
      this.queue.addBulk(bulk)
      return {
        statusCode: 200,
        body: {
          message: 'Bulk queue is running'
        }
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: {
          error
        }
      }
    }
  }
}

export namespace AddUsersController {
  export interface Request {
    name: string
    email: string
    password: string
    count: string
  }
}
