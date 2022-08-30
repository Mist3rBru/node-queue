import { Router } from 'express'
import { MailerAdapter } from '../../adapters/mailer-adapter'
import { RegistrationEmailJob } from '../../queue/jobs/RegistrationMail'
import { Queue } from '../../queue/queue'
import { AddUserController } from '../../controllers/add-user-controller'
import { AddUsersController } from '../../controllers/add-users-controller'
import { adaptController } from '../../adapters/express-adapter'

export default (app: Router): void => {
  const mailer = new MailerAdapter()
  const job = new RegistrationEmailJob(mailer)
  const queue = new Queue(job, 1, 3)
  const addUserController = new AddUserController(queue)
  const addUsersController = new AddUsersController(queue)

  app.post('/users', adaptController(addUserController))
  app.post('/users/bulk/:count', adaptController(addUsersController))
}
