export interface IMailer {
  sendMail (data: IMailer.Params): Promise<void>
}

export namespace IMailer {
  export interface Params {
    from: string
    to: string
    subject: string
    text?: string
    html?: string
  }
}
