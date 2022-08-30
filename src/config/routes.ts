import { Router } from 'express'
import { MailerAdapter } from '../adapters/mailer-adapter'
import { RegistrationEmailJob } from '../queue/jobs/RegistrationMail'
import { Queue } from '../queue/queue'
import { UsersController } from '../controllers/users-controller'

export default (app: Router): void => {
  const mailer = new MailerAdapter()
  const job = new RegistrationEmailJob(mailer)
  const queue = new Queue(job, 1, 3)
  const usersController = new UsersController(queue)

  console.log('pegou', { queue, usersController })
  app.post('/users', usersController.save)
  app.post('/users/bulk/:count', usersController.saveBulk)
}
