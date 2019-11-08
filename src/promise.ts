import { Request, RequestHandler } from 'express'

type RequestHandlerWithPromise = (req: Request) => Promise<any>

export const q: (h: RequestHandlerWithPromise) => RequestHandler = handler => (req, res, next) =>
  handler(req).then(r => res.send(r), err => next(err))
