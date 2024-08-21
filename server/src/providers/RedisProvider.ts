import Redis from 'ioredis'
import { defineProvider } from '~/application/Application'
import ConfigProvider from './ConfigProvider'
import LoggerProvider from './LoggerProvider'

export default defineProvider(async ({ service, on }) => {
  const redis = new Redis({
    ... service.config.redis
  })

  service.logger.info('Connecting to Redis...')

  await new Promise((resolve, reject) => {
    redis.once('ready', resolve)
    redis.once('error', reject)
  })

  service.logger.info('Connected to Redis')

  on('stopped', async () => {
    await redis.quit()
    service.logger.info('Disconnected from Redis')
  })

  return { redis }
}, ConfigProvider, LoggerProvider)