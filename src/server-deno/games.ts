import { BadRequestError } from './errorHandler.ts'
import { decode, encode } from './utils.ts'
import { existsSync } from 'https://deno.land/std@0.105.0/fs/mod.ts'
import type { Logger } from 'https://deno.land/std@0.105.0/log/logger.ts'

interface Game {
  name: string
  contestants: string[]
  result?: {
    [key: string]: {
      person: string
      lastSeenIp?: string
    }
  }
  lastCalculated?: Date
}

type SanitizedGame = Pick<Game, 'name' | 'contestants' | 'lastCalculated'> & {
  seen?: {
    [key: string]: boolean
  }
}

const sanitize = (game?: Game): SanitizedGame | undefined => {
  if (!game) return game

  const { name, contestants, result = {}, lastCalculated } = game

  return {
    name,
    contestants: contestants.map(decode),
    lastCalculated: lastCalculated,
    seen: Object.fromEntries(
      contestants.map(x => [decode(x), !!(result[x] || {}).lastSeenIp || false])
    ),
  }
}

const shuffle = <T>(arr: T[]) => {
  const newArr = []

  while (arr.length > 0) {
    const index = Math.floor(Math.random() * arr.length)
    newArr.push(arr[index])
    arr = arr.filter((_, i) => i !== index)
  }

  return newArr
}

let games: Game[]
let saveDb: () => void
let loadDb: () => void

class Games {
  constructor(file: string, private logger: Logger) {
    loadDb = () => {
      games = existsSync(file) ? JSON.parse(Deno.readTextFileSync(file) || '[]') || [] : []
    }

    saveDb = () => {
      Deno.writeTextFileSync(file, JSON.stringify(games, null, 2))
    }

    loadDb()
    saveDb()
  }

  getAll() {
    loadDb()
    return games.map(sanitize)
  }

  async create({ name, contestants }: Game) {
    loadDb()

    if (await this.get(name)) {
      throw new BadRequestError('ALREADY_EXISTS')
    }

    this.logger.info(`Creating game with ${contestants.join(', ')}`)

    const game = {
      contestants: shuffle(contestants).map(encode),
      name,
    }

    games.push(game)

    saveDb()

    return sanitize(game)
  }

  get(name: string) {
    loadDb()
    return sanitize(games.find(g => g.name === name))
  }

  calculate(name: string, ip: string) {
    this.logger.info(`Calculating for ${name} by ${ip}`)

    loadDb()
    const game = games.find(g => g.name === name)

    if (!game) {
      throw new BadRequestError('NOT_FOUND', { id: name })
    }

    let result: Game['result']

    do {
      result = {}
      let drawingPersons = game.contestants.slice(0)
      let personsToDraw = game.contestants.slice(0)

      while (drawingPersons.length > 0) {
        const drawingPerson = drawingPersons[0]
        const candidatesForPerson = personsToDraw.filter(x => x !== drawingPerson)
        const drawnPerson =
          candidatesForPerson[Math.floor(Math.random() * candidatesForPerson.length)]

        result[drawingPerson] = {
          person: drawnPerson,
        }
        if (!drawnPerson) {
          break
        }

        drawingPersons = drawingPersons.filter(x => x !== drawingPerson)
        personsToDraw = personsToDraw.filter(x => x !== drawnPerson)
      }
    } while (
      Object.entries(result).every(([person, { person: drawn }]) => !drawn || person === drawn)
    )

    game.result = result
    game.lastCalculated = new Date()

    saveDb()

    return sanitize(game)
  }

  async getResult(id: string, person: string, ip: string) {
    this.logger.info(`${person} trying to look at ${id} from ${ip}`)

    loadDb()

    const game = games.find(x => x.name === id)

    const personBase64 = encode(person)

    if (!ip) {
      throw new Error('ip address was not passed')
    }

    if (!game) {
      throw new BadRequestError('NOT_FOUND', { id })
    }

    if (!game.result) {
      throw new BadRequestError('GAME_NOT_PLAYED')
    }

    if (
      !game.result[personBase64] ||
      Object.entries(game.result).some(
        ([personKey, result]) => personKey !== personBase64 && result.lastSeenIp === ip
      ) ||
      (game.result[personBase64].lastSeenIp && game.result[personBase64].lastSeenIp !== ip)
    ) {
      throw new BadRequestError('WRONG_PERSON')
    }

    game.result[personBase64].lastSeenIp = ip

    saveDb()

    return { result: game.result[personBase64].person }
  }

  async delete(name: string) {
    const gameIndex = games.findIndex(x => x.name === name)

    if (gameIndex < 0) {
      throw new BadRequestError('BAD_REQUEST')
    }

    const game = games.splice(gameIndex, 1)[0]

    saveDb()

    return game
  }
}

export { Games }
