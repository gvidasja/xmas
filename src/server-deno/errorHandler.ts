import type { Middleware } from 'https://deno.land/x/oak@v9.0.1/middleware.ts'
import type { Logger } from 'https://deno.land/std@0.105.0/log/logger.ts'
import { json } from './httpResponse.ts'

export class BadRequestError {
  constructor(public readonly message: string, public readonly params = {}) {}
}

export const errorHandler =
  (logger: Logger): Middleware =>
  async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      if (!ctx.response.writable) {
        return
      } else if (error instanceof BadRequestError) {
        json(ctx, { message: error.message, params: error.params }, 400)
      } else if (error.status) {
        logger.error(error)
        ctx.response.status = error.status
      } else {
        logger.error(error)
        json(ctx, { message: 'INTERNAL_SERVER_ERROR' }, 500)
      }
    }
  }
