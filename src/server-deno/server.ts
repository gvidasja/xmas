import { Application } from 'https://deno.land/x/oak@v9.0.1/mod.ts'
import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.105.0/path/mod.ts'
import { singleUserBasicAuth } from './singleUserBasicAuth.ts'
import { requestResponseLogging } from './requestsResponseLogging.ts'
import { getLogger } from './logging.ts'
import { Games } from './games.ts'
import { gameRouter } from './gamesRouter.ts'
import { singlePageAppRouter } from './singlePageAppRouter.ts'
import { errorHandler } from './errorHandler.ts'
import { ensureCorrectEnv } from './utils.ts'

const {
  PORT = '3000',
  AUTH_USERNAME = 'test',
  AUTH_PASSWORD = 'test',
  DB_PATH = './xmas.json',
  ENV = 'dev',
  UI_PATH = join(dirname(fromFileUrl(import.meta.url)), '../client/public'),
} = Deno.env.toObject()

const app = new Application()
  .use(requestResponseLogging(getLogger()))
  .use(errorHandler(getLogger()))
  .use(singleUserBasicAuth(AUTH_USERNAME, AUTH_PASSWORD))
  .use(gameRouter(new Games(DB_PATH, getLogger('audit'))).routes())
  .use((await singlePageAppRouter(UI_PATH, ensureCorrectEnv(ENV) == 'dev')).routes())

getLogger().debug(`Open aap: http://localhost:${PORT}`)

await app.listen({ port: parseInt(PORT) })
