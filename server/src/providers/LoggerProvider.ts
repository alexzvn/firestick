import Logger from 'pino'
import { defineProvider } from '~/application/Application.ts'


export default defineProvider(({ on }) => {
  const logger = Logger({
    transport: {
      target: 'pino-pretty',
    }
  })

  logger.info('Logger initialized')

  on('started', () => logger.info('Application started'))
  on('stop', () => logger.info('Stopping application'))

  return { logger }
})
