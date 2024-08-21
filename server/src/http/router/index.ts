import Elysia from 'elysia'
import ApiRouter from './api.router'
import WebRouter from './web.router'

export default new Elysia()
  .use(ApiRouter)
  .use(WebRouter)