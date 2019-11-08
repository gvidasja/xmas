import express, { static as folder, Router, json, Request, Response, RequestHandler } from 'express'
import { join } from 'path'
import Games from './games'
import { configure } from './logging'
import { errorHandler, BadRequestError } from './errorHandler'
import { q } from './promise'
import { getIp } from './utils'
import auth from './auth'

const { PORT = 3000, FILE = './.db.json', LOGFILE = './.xmas.log' } = process.env

const games = new Games(FILE)

configure(LOGFILE)

express()
  .use(auth('lel', 'lel'))
  .use(json())
  .use('/', folder(join(__dirname, './public')))
  .use(
    '/api',
    Router()
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
  )
  .use(errorHandler)
  .listen(PORT, () => console.log(`listening on ${PORT}.`))
