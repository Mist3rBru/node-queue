import express from 'express'
import { usersController } from './controllers'
import { env } from './config'

const port = env.APP_PORT
const app = express()

app.use(express.json())

app.post('/users', usersController.save)

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`)
})
