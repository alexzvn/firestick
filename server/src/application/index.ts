import Application from './Application.ts'
import Elysia from 'elysia'
import ConfigProvider from '~/providers/ConfigProvider.ts'
import ElysiaProvider from '~/providers/ElysiaProvider.ts'
import HttpProvider from '~/providers/HttpProvider.ts'
import LoggerProvider from '~/providers/LoggerProvider.ts'
import MongoProvider from '~/providers/MongoProvider.ts'
import SocketProvider from '~/providers/SocketProvider.ts'
import StaticFileProvider from '~/providers/StaticFileProvider.ts'

export const application = new Application()
  .use(ConfigProvider)
  .use(LoggerProvider)
  .use(MongoProvider)
  .use(SocketProvider)
  .use(HttpProvider)
  .use(ElysiaProvider)
  .use(StaticFileProvider)

export default new Elysia({ name: 'Application.Core' })
  .decorate('service', application.service)
  .decorate('app', application)
