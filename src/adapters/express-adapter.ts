import { IController } from '../protocols/controller-model'
import { Request, Response } from 'express'

export const adaptController = (controller: IController) => {
  return async (req: Request, res: Response) => {
    const request = {
      ...(req.params || {}),
      ...(req.body || {})
    }
    const httpResponse = await controller.handle(request)
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
  }
}
