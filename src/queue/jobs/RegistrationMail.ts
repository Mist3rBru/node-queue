import { IMailer } from '../../protocols/mailer-model'
import { IJob } from '../../protocols/queue-model'

export class RegistrationEmailJob implements IJob {
  constructor (private readonly mailer: IMailer) {}

  async promise (user: RegistrationEmailJob.Params): Promise<void> {
    await this.mailer.sendMail({
      from: process.env.MAIL_HOST,
      to: user.email,
      subject: `Welcome ${user.name}`,
      html: '<p>Test user registration email</p>'
    })
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
