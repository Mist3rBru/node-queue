import Queue from './jobs'
import { RegistrationMail } from './jobs/RegistrationMail'

Queue.process(RegistrationMail.handle)
console.log('✈ Queue is running')
