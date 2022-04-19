import { Job, User } from '../domain'
import { transporter, env } from '../config'

const job: Job = {
  key: 'RegistrationMail',
  promise: async (user: User): Promise<void> => {
    console.log('Sending email to', user.name)
    const info = await transporter.sendMail({
      from: env.MAIL_HOST,
      to: user.email,
      subject: `Welcome ${user.name}`,
      html: '<p>Test user registration email</p>'
    })
    console.log('Email sent to', user.name, ', info:', info.response)
  }
}

export default job
