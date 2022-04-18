import { createTransport } from 'nodemailer'
import { env } from './env'

export const transporter = createTransport({
  host: env.MAIL_HOST,
  port: Number(env.MAIL_PORT),
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS
  }
})
