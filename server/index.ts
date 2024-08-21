import { application } from './src/application/index.ts'
import type { Prettify } from '~/application/Application.ts'
import Router from '~/http/router'

export const elysia = application.start(void 0)
  .then(_app => _app.service.elysia.use(Router))

export type ElysiaServer = Prettify<Awaited<typeof elysia>>
