import { ErrorRequestHandler } from 'express'
import { log } from './logging'

export class BadRequestError {
  constructor(public readonly message: string, public readonly params = {}) {}
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  log(JSON.stringify(err))

  if (res.headersSent) {
    return next(err)
  }

  if (!err) {
    next(err)
  } else if (err instanceof BadRequestError) {
    res.status(400).send({ message: err.message, params: err.params })
  } else {
    log(err.toString())
    res.status(500).send({ message: 'INTERNAL_SERVER_ERROR' })
  }
}
