import express from 'express'
import setupRoutes from './routes'

const app = express()
const router = express.Router()
app.use(express.json())
app.use(router)
setupRoutes(router)

export { app }
