import { IMailer } from '../../protocols/mailer-model'
import { IJob } from '../../protocols/queue-model'

export class RegistrationEmailJob implements IJob {
  constructor (private readonly mailer: IMailer) {}

  async promise (user: RegistrationEmailJob.Params): Promise<void> {
    console.log('Sending email to', user.name)
    await this.mailer.sendMail({
      from: process.env.MAIL_HOST,
      to: user.email,
      subject: `Welcome ${user.name}`,
      html: '<p>Test user registration email</p>'
    })
    console.log('Email sent to', user.name)
  }
}

export namespace RegistrationEmailJob {
  export interface Params {
    name: string
    email: string
    email2: string
    password: string
  }
}
