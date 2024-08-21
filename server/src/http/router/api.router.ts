import Elysia, { t } from 'elysia'
import swagger from '@elysiajs/swagger'

const v1 = new Elysia()
  .get('/ping', () => ({ message: 'pong', time: Date.now() }), {
    tags: ['Misc'],

    response: {
      200: t.Object({
        message: t.String({ default: 'pong' }),
        time: t.Number({ examples: [Date.now()], description: 'Current time in milliseconds' }),
      })
    }
  })

const docs = swagger({
  path: '/docs',
  exclude: /^(?!\/api).+/,
  documentation: {
    info: {
      title: 'Firestick Documentation',
      version: 'v1'
    },
    tags: [
      { name: 'Misc', description: 'Miscellaneous endpoints' }
    ],
  },
})

export default new Elysia()
  .use(docs)
  .group('/api', app => app
    .group('/v1', app => app.use(v1))
  )