import Queue from 'bull'
import { RegistrationMail } from './RegistrationMail'
import { redisConfig } from '../config/redis'

const mailQueue = new Queue(RegistrationMail.key, redisConfig)

export default mailQueue
