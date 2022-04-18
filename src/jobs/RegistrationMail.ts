import { User } from '../domain'
import { transporter, env } from '../config'

export const RegistrationMail = {
  key: 'RegistrationMail',
  handle: async ({ data }): Promise<void> => {
    const user: User = data.user
    console.log('Sending email to', user.name)
    const info = await transporter.sendMail({
      from: env.MAIL_HOST,
      to: user.email,
      subject: `Welcome ${user.name}`,
      html: '<p>Test new user email</p>'
    })
    console.log('Email sent to', user.name, 'info: ', info.response)
  }
}
