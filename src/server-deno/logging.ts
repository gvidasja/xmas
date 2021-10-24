import { getLogger, handlers, LogConfig, setup } from 'https://deno.land/std@0.105.0/log/mod.ts'

const fileHandler = new handlers.FileHandler('NOTSET', {
  formatter: `| {datetime} | {levelName} | {msg}`,
  filename: `./audit.log`,
})

const config: LogConfig = {
  handlers: {
    console: new handlers.ConsoleHandler('NOTSET', {
      formatter: `{levelName} [{loggerName}] {msg}`,
    }),
    file: fileHandler,
  },

  loggers: {
    default: {
      level: 'DEBUG',
      handlers: ['console'],
    },
    audit: {
      level: 'INFO',
      handlers: ['file', 'console'],
    },
  },
}

await setup(config)

let fileFlushingInterval: number

function startFlushingLogsToFile() {
  stopFlushingLogsToFile()
  fileFlushingInterval = setInterval(() => fileHandler.flush(), 5 * 1000)
}

export function stopFlushingLogsToFile() {
  if (fileFlushingInterval) {
    clearInterval(fileFlushingInterval)
  }
}

const getConfiguredLogger = (loggerName: 'default' | 'audit' = 'default') => {
  if (
    (config.loggers || {})[loggerName].handlers?.some(
      x => (config.handlers || {})[x] instanceof handlers.FileHandler
    )
  ) {
    startFlushingLogsToFile()
  }

  return getLogger(loggerName)
}

export { getConfiguredLogger as getLogger }
