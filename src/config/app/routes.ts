import { Express } from 'express'
import { usersController } from '../../controllers'

export default (app: Express): void => {
  app.post('/users', usersController.save)
  app.post('/users/bulk/:count', usersController.saveBulk)
}
