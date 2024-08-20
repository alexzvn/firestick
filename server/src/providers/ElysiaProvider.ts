import Elysia from 'elysia'
import cors from '@elysiajs/cors'
import { defineProvider } from '~/application/Application.ts'
import fs from 'fs/promises'

const home = new Elysia()
  .get('/ping', () => 'pong')
  .get('/', async ({ set }) => {
    const stats = await fs.stat('public/index.html').catch(() => undefined)

    if (! stats || ! stats.isFile()) {
      return 'Please build and copy dist of frontend to public folder'
    }

    set.headers['content-type'] = 'text/html;charset=UTF-8'
    return await fs.readFile('public/index.html', 'utf8')
  })

export default defineProvider(() => {
  const elysia = new Elysia({ name: 'ElysiaProvider' })
    .use(home)

  if (process.env.NODE_ENV !== 'development') {
    elysia.use(cors())
  }

  return { elysia }
})
