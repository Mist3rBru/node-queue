import { IAddQueueBulk } from '../protocols/queue-model'
import { AddUsersController } from './add-users-controller'
import { faker } from '@faker-js/faker'

interface SutTypes {
  sut: AddUsersController
  queueSpy: QueueSpy
}

const makeSut = (): SutTypes => {
  const queueSpy = new QueueSpy()
  const sut = new AddUsersController(queueSpy)
  return {
    sut,
    queueSpy
  }
}

const mockRequest = (): AddUsersController.Request => ({
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  count: faker.datatype.number().toString()
})

class QueueSpy implements IAddQueueBulk {
  data: any[]
  calledTimes = 0
  addBulk (data: any[]): void {
    this.calledTimes++
    this.data = data
  }
}

describe('AddUsersController', () => {
  it('should call queue with correct values', async () => {
    const { sut, queueSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(queueSpy.calledTimes).toBe(1)
    expect(queueSpy.data).toStrictEqual(
      new Array(parseInt(request.count)).fill({
        name: request.name,
        email: request.email,
        password: request.password
      })
    )
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toStrictEqual({
      statusCode: 200,
      body: {
        message: 'Bulk queue is running'
      }
    })
  })

  it('should return 500 if any dependency throws', async () => {
    const suts: AddUsersController[] = [].concat(
      new AddUsersController({
        addBulk: () => {
          throw new Error()
        }
      })
    )
    for (const sut of suts) {
      const httpResponse = await sut.handle(mockRequest())
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBeTruthy()
    }
  })
})
