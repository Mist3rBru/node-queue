import { IController } from '../protocols/controller-model'
import { RequestHandler } from 'express'

export const adaptController = (controller: IController): RequestHandler => {
  return (req, res) => {
    const request = {
      ...(req.params || {}),
      ...(req.body || {})
    }
    void controller.handle(request).then(httpResponse => {
      const status = httpResponse.statusCode
      if (status >= 200 && status < 300) {
        res.status(httpResponse.statusCode).json(httpResponse.body)
      } else if (status >= 300 && status < 400) {
        res.status(status).json(httpResponse.body)
      } else {
        res.status(httpResponse.statusCode).json({
          error: httpResponse.body.message
        })
      }
    })
  }
}
