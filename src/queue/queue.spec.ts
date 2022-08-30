import { IJob } from '../protocols/queue-model'
import { Queue } from './queue'
import { faker } from '@faker-js/faker'

interface SutTypes {
  sut: Queue
  jobSpy: JobSpy
}

class JobSpy implements IJob {
  calledTimes = 0
  data: any
  async promise (data: any): Promise<void> {
    this.calledTimes++
    this.data = data
    throw new Error()
  }
}

const makeSut = (): SutTypes => {
  const jobSpy = new JobSpy()
  const sut = new Queue(jobSpy)
  return {
    sut,
    jobSpy
  }
}

const clearSut = (sut: Queue): void => {
  sut.maxAttempts = 0
}

describe('Queue', () => {
  describe('add()', () => {
    it('should call process once', async () => {
      const { sut } = makeSut()
      const processSpy = jest.spyOn(sut, 'process')
      processSpy.mockImplementationOnce(() => null)
      const data = faker.datatype.string()
      sut.add(data)
      expect(sut.waitingQueue).toEqual([{
        attempts: 0,
        data
      }])
      expect(processSpy).toBeCalledTimes(1)
      clearSut(sut)
    })
  })

  describe('addBulk()', () => {
    it('should call add in bulk', async () => {
      const { sut } = makeSut()
      const addSpy = jest.spyOn(sut, 'add')
      sut.addBulk(['', '', ''])
      expect(addSpy).toBeCalledTimes(3)
      clearSut(sut)
    })
  })

  describe('process()', () => {
    beforeAll(async () => {
      jest.useFakeTimers()
    })

    afterEach(async () => {
      jest.clearAllMocks()
      jest.clearAllTimers()
    })

    it('should waits 1 second before calling process() again', async () => {
      const { sut } = makeSut()
      jest.spyOn(global, 'setTimeout')
      const processSpy = jest.spyOn(sut, 'process')
      sut.runningQueue = sut.maxParallelProcs
      void sut.process()
      expect(processSpy).toBeCalledTimes(1)
      expect(setTimeout).toBeCalledTimes(1)
      expect(setTimeout).toBeCalledWith(expect.any(Function), 1000)
      jest.advanceTimersByTime(1000)
      expect(processSpy).toBeCalledTimes(2)
      clearSut(sut)
    })

    it('should call job promise with correct values', async () => {
      const { sut, jobSpy } = makeSut()
      const data = faker.datatype.string()
      sut.waitingQueue = [{
        attempts: sut.maxAttempts,
        data
      }]
      await sut.process()
      expect(jobSpy.calledTimes).toBe(1)
      expect(jobSpy.data).toBe(data)
      clearSut(sut)
    })

    it('should call job until reach maxAttempts', async () => {
      const { sut, jobSpy } = makeSut()
      sut.waitingQueue = [{
        attempts: sut.maxAttempts - 1,
        data: ''
      }]
      await sut.process()
      expect(jobSpy.calledTimes).toBe(1)
      expect(sut.waitingQueue.length).toBe(1)

      jest.advanceTimersByTime(1000)
      expect(jobSpy.calledTimes).toBe(2)
      expect(sut.waitingQueue.length).toBe(0)
      clearSut(sut)
    })
  })
})
