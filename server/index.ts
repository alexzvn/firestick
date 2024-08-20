import { application } from './src/application/index.ts'

application.start()

export type ElysiaServer = typeof application.service.elysia
