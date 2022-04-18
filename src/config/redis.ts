import { env } from '../config'

export const redisConfig = {
  redis: {
    host: env.REDIS_HOST,
    port: Number(env.REDIS_PORT)
  }
}
