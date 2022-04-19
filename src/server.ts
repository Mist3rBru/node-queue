import { app, env } from './config'
const port = env.APP_PORT

app.listen(port, () => {
  process.stdout.write(`🚀 Server running on http://localhost:${port} \n`)
})
