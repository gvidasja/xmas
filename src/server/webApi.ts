import Games from './games'
import { RequestHandler, Router } from 'express'
import { q } from './promise'
import { BadRequestError } from './errorHandler'
import { getIp } from './utils'

const webApi: (game: Games) => RequestHandler = games => {
  const router = Router()
    .get('/games', q(() => games.getAll()))
    .post(
      '/games',
      q(async req => {
        const body = req.body

        if (
          !body.name ||
          !Array.isArray(body.contestants) ||
          body.contestants.some((x: any) => typeof x !== 'string')
        ) {
          throw new BadRequestError('BAD_REQUEST')
        } else {
          return await games.create(body)
        }
      })
    )
    .get(
      '/games/:id',
      q(async req => {
        const id = req.params.id

        return await games.get(id)
      })
    )
    .post(
      '/games/:id',
      q(async req => {
        const id = req.params.id
        const ip = getIp(req)

        return await games.calculate(id, ip)
      })
    )
    .delete(
      '/games/:id',
      q(async req => {
        const id = req.params.id

        return await games.delete(id)
      })
    )
    .get(
      '/games/:id/result/:person',
      q(async req => {
        const { id, person } = req.params
        const ip = getIp(req)

        return await games.getResult(id, person, ip)
      })
    )

  return router
}

export default webApi
