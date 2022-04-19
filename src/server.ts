import express from 'express'
import { usersController } from './controllers'
import { env } from './config'

const port = env.APP_PORT
const app = express()

app.use(express.json())

app.post('/users', usersController.save)
app.post('/users/bulk/:count', usersController.saveBulk)

app.listen(port, () => {
  process.stdout.write(`🚀 Server running on http://localhost:${port} \n`)
})
