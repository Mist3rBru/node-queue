export const env = {
  APP_PORT: process.env.APP_PORT || '3030',

  MAIL_HOST: process.env.MAIL_HOST || 'smtp.mailtrap.io',
  MAIL_PORT: process.env.MAIL_PORT || '587',
  MAIL_USER: process.env.MAIL_USER || '259585e29655a6',
  MAIL_PASS: process.env.MAIL_PASS || 'f96cb85eb041c1',

  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || '6379'
}
