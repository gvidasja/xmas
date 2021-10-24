import { Router } from 'https://deno.land/x/oak@v9.0.1/router.ts'
import { BadRequestError } from './errorHandler.ts'
import type { Games } from './games.ts'
import { json } from './httpResponse.ts'
import { getIp } from './utils.ts'

export const gameRouter = (games: Games) =>
  new Router({ prefix: '/api' })
    .get('/games', async ctx => json(ctx, await games.getAll()))
    .post('/games', async ctx => {
      const body = ctx.request.body()
      const game = JSON.parse(await body.value)

      if (
        !game.name ||
        !Array.isArray(game.contestants) ||
        game.contestants.some((x: unknown) => typeof x !== 'string')
      ) {
        throw new BadRequestError('Provided game is invalid')
      } else {
        json(ctx, await games.create(game))
      }
    })
    .get('/games/:id', ctx => {
      if (!ctx.params.id) {
        throw new BadRequestError('Game ID was not provided')
      } else {
        json(ctx, games.get(ctx.params.id))
      }
    })
    .post('/games/:id', async ctx => {
      const id = ctx.params.id

      if (!id) {
        throw new BadRequestError('Game ID was not provided')
      } else {
        const ip = getIp(ctx)
        json(ctx, await games.calculate(id, ip))
      }
    })
    .delete('/games/:id', async ctx => {
      const id = ctx.params.id

      if (!id) {
        throw new BadRequestError('Game ID was not provided')
      } else {
        json(ctx, await games.delete(id))
      }
    })
    .get('/games/:id/result/:person', async ctx => {
      const { id, person } = ctx.params

      if (!id || !person) {
        throw new BadRequestError('Game ID or person was not provided')
      } else {
        const ip = getIp(ctx)
        json(ctx, await games.getResult(id, person, ip))
      }
    })
