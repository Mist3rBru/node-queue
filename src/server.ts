import 'dotenv/config'
import { app } from './config/app'

const port = process.env.APP_PORT || '4030'

app.listen(port, () => {
  process.stdout.write(`🚀 Server running on http://localhost:${port} \n`)
})
