import { IAddQueue } from '../protocols/queue-model'
import { AddUserController } from './add-user-controller'
import { faker } from '@faker-js/faker'

interface SutTypes {
  sut: AddUserController
  queueSpy: QueueSpy
}

const makeSut = (): SutTypes => {
  const queueSpy = new QueueSpy()
  const sut = new AddUserController(queueSpy)
  return {
    sut,
    queueSpy
  }
}

const mockRequest = (): AddUserController.Request => ({
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

class QueueSpy implements IAddQueue {
  data: any
  calledTimes = 0
  add (data: any): void {
    this.calledTimes++
    this.data = data
  }
}

describe('AddUserController', () => {
  it('should call queue with correct values', async () => {
    const { sut, queueSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(queueSpy.calledTimes).toBe(1)
    expect(queueSpy.data).toStrictEqual(request)
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toStrictEqual({
      statusCode: 200,
      body: {
        message: 'Queue is running'
      }
    })
  })

  it('should throw if any dependency throws', async () => {
    const suts: AddUserController[] = [].concat(
      new AddUserController({
        add: () => {
          throw new Error()
        }
      })
    )
    for (const sut of suts) {
      const promise = sut.handle(mockRequest())
      await expect(promise).rejects.toThrow()
    }
  })
})
