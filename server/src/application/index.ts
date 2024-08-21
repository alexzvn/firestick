import Application from './Application.ts'
import Elysia from 'elysia'
import ConfigProvider from '~/providers/ConfigProvider.ts'
import ElysiaProvider from '~/providers/ElysiaProvider.ts'
import HttpProvider from '~/providers/HttpProvider.ts'
import LoggerProvider from '~/providers/LoggerProvider.ts'
import MongoProvider from '~/providers/MongoProvider.ts'
import RedisProvider from '~/providers/RedisProvider.ts'
import SocketProvider from '~/providers/SocketProvider.ts'
import StaticFileProvider from '~/providers/StaticFileProvider.ts'

export const application = new Application()
  .use(ConfigProvider)
  .use(LoggerProvider)
  .use(RedisProvider)
  .use(MongoProvider)
  .use(SocketProvider)
  .use(ElysiaProvider)
  .use(HttpProvider)
  .use(StaticFileProvider)

const elysia = new Elysia({ name: 'Application.Core' })
  .decorate('service', application.service)
  .decorate('app', application)

  /**
   * Create a new instance of Elysia given core services
   */
const reuse = <const Params extends ConstructorParameters<typeof Elysia>>(...args: Params) => {
  return new Elysia(...args).use(core)
}

Object.assign(elysia, { Elysia: reuse })

export const core = elysia as typeof elysia & { Elysia: typeof reuse }