import express, { static as loadFromFolder, json } from 'express'
import { join } from 'path'
import Games from './games'
import { configure, log } from './logging'
import { errorHandler } from './errorHandler'
import auth from './auth'
import webApi from './webApi'
import proxy from 'http-proxy-middleware'

const {
  PORT = 3000,
  FILE = './.db.json',
  LOGFILE = './.xmas.log',
  USERNAME = 'test',
  PASSWORD = 'test',
  UI_PORT = 3001,
  NODE_ENV = 'production',
} = process.env

const games = new Games(FILE)

configure(LOGFILE)

log(`Environment: ${NODE_ENV}`)

express()
  .use(auth(USERNAME, PASSWORD))
  .use(json())
  .use('/api', webApi(games))
  .use(
    '/',
    NODE_ENV === 'development'
      ? proxy(`http://localhost:${UI_PORT}`)
      : loadFromFolder(join(__dirname, './public'))
  )
  .use(errorHandler)
  .listen(PORT, () => log(`listening on ${PORT}.`))
