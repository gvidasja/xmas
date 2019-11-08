import { ErrorRequestHandler } from 'express'
import { log } from './logging'

export class BadRequestError extends Error {
  constructor(message: string, public readonly params = {}) {
    super(message)

    Object.setPrototypeOf(this, BadRequestError.prototype)
  }
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
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
