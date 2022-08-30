export interface HttpResponse {
  statusCode: number
  body?: any
}

export interface IController {
  handle (request: any): Promise<HttpResponse>
}
