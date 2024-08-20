import { defineProvider } from '~/application/Application'
import ElysiaProvider from './ElysiaProvider'
import { stat } from 'fs/promises'
import { createReadStream } from 'fs'
import mime from 'mime-types'
import { resolve, join } from 'path'

const getFileContent = async (uri: string, code: string) => {
  if (code !== 'NOT_FOUND') {
    return 'NOT_FOUND'
  }

  const path = join('public', resolve(uri))
  const stats = await stat(path).catch(() => undefined)

  if (!stats || !stats.isFile()) {
    return 'NOT_FOUND'
  }

  const readable = new ReadableStream({
    start(controller) {
      const stream = createReadStream(path)

      stream.on('data', controller.enqueue.bind(controller))
      stream.on('end', controller.close.bind(controller))
      stream.on('error', controller.error.bind(controller))
    }
  })

  return new Response(readable, {
    status: 200,
    headers: {
      'Content-Type': mime.lookup(path) || 'application/octet-stream'
    }
  })
}

export default defineProvider(({ service: { elysia } }) => {
  elysia.onError(async ({ code, path, set }) => {
    return await getFileContent(path, code)
  })

}, ElysiaProvider)
