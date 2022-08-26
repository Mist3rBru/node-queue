import { IMailer } from './protocols/mailer-model'
import { createTransport } from 'nodemailer'

export class MailerAdapter implements IMailer {
  private readonly transporter = createTransport({
    host: process.env.MAILER_HOST,
    port: parseInt(process.env.MAILER_PORT),
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS
    }
  })

  async sendMail (data: IMailer.Params): Promise<void> {
    await this.transporter.sendMail(data)
  }
}
