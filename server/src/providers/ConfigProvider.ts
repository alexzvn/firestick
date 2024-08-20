import { defineProvider } from '~/application/Application.ts'

type ReturnValueEnv<F> = F extends undefined ? string|undefined : string|F

const env = <T = undefined>(key: string, fallback?: T): ReturnValueEnv<T> => {
  if (process.env[key] === "") {
    return undefined as any
  }

  // @ts-ignore
  return process.env[key] ?? fallback
}

export const config = {
  app: {
    /**
     * The secret key for the application used for encryption
     */
    key: env('APP_KEY', 'default-secret-key'),
    port: +env('APP_PORT', 3000),
  },

  mongo: {
    dsn: env('MONGO_DSN', 'mongodb://localhost:27017'),
  },

  redis: {
    host: env('REDIS_HOST', 'localhost'),
    port: +env('REDIS_PORT', 6379),
    password: env('REDIS_PASSWORD', undefined),
  },
}

export default defineProvider(() => {
  return { config }
})
