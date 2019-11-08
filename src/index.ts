import express, { static as folder, json } from 'express'
import { join } from 'path'
import Games from './games'
import { configure } from './logging'
import { errorHandler } from './errorHandler'
import auth from './auth'
import webApi from './webApi'

const {
  PORT = 3000,
  FILE = './.db.json',
  LOGFILE = './.xmas.log',
  USERNAME = 'test',
  PASSWORD = 'test',
} = process.env

const games = new Games(FILE)

configure(LOGFILE)

express()
  .use(auth(USERNAME, PASSWORD))
  .use(json())
  .use('/', folder(join(__dirname, './public')))
  .use('/api', webApi(games))
  .use(errorHandler)
  .listen(PORT, () => console.log(`listening on ${PORT}.`))
