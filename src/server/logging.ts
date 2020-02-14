import { appendFileSync } from 'fs'

let logFile: string

const format = ({ time, message }: { time: Date; message: string }) =>
  `[${time.toISOString()}] ${message}\n`

export const log = (message: string) => {
  if (!logFile) {
    console.warn('Log file has not been configured!')
  } else {
    const formattedMessage = format({ time: new Date(), message })
    console.log(formattedMessage)
    appendFileSync(logFile, formattedMessage)
  }
}

export const configure = (file: string) => {
  logFile = file

  log('Logging configured')
}
