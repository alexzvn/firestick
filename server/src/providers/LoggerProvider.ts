import Logger from 'pino'
import { defineProvider } from '~/application/Application.ts'


export default defineProvider(({ on }) => {
  const logger = Logger({
    transport: {
      target: 'pino-pretty',
    }
  })

  logger.info('Logger initialized')

  return { logger }
})
