import { MailerAdapter } from './mailer-adapter'
import { IMailer } from '../protocols/mailer-model'
import { faker } from '@faker-js/faker'

const sendMailMock = jest.fn()
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(() => ({
    sendMail: sendMailMock
  }))
}))

const makeSut = (): MailerAdapter => {
  return new MailerAdapter()
}

const mockRequest = (): IMailer.Params => ({
  from: faker.internet.email(),
  subject: faker.company.catchPhrase(),
  to: faker.internet.email(),
  html: faker.lorem.paragraph(),
  text: faker.lorem.paragraph()
})

describe('MailerAdapter', () => {
  it('should call sendEmail', async () => {
    const sut = makeSut()
    const request = mockRequest()
    await sut.sendMail(request)
    expect(sendMailMock).toBeCalledWith(request)
  })

  it('should throw if any dependency throws', async () => {
    const sut = makeSut()
    sendMailMock.mockImplementationOnce(() => {
      throw new Error()
    })
    const request = mockRequest()
    const promise = sut.sendMail(request)
    await expect(promise).rejects.toThrow()
  })
})
