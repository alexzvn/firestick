import { createServer } from 'node:http'
import { defineProvider } from '~/application/Application'
import ElysiaProvider from './ElysiaProvider'
import ConfigProvider from './ConfigProvider'
import LoggerProvider from './LoggerProvider'

export default defineProvider(({ service, on }) => {

  const http = createServer(async (req, res) => {
    const url = `http://${req.headers.host}${req.url || '/'}`

    const body = new ReadableStream({
      start(controller) {
        req.on('error', err => controller.error(err))
        req.on('data', chunk => controller.enqueue(chunk))
        req.on('end', () => controller.close())
      }
    })

    const request = new Request(url, {
      method: req.method,
      headers: new Headers(req.headers as any),
      body: req.method?.match(/GET|HEAD/) ? null : body,
    })

    const response = await service.elysia.handle(request)

    response.headers.forEach((value, key) => res.setHeader(key, value))

    res.writeHead(response.status, response.statusText)

    response.body?.pipeTo(new WritableStream({
      abort: reason => { res.destroy(reason) },
      write: chunk => { res.write(chunk) },
      close: () => { res.end() },
    }))
  })

  on('start', async () => {
    http.listen(service.config.app.port, () => {
      service.logger.info(`Listening on port ${service.config.app.port}`)
    })
  })

  on('stop', async () => {
    await new Promise((resolve, reject) => {
      http.close(e => e ? reject(e) : resolve(0))
    })

    service.logger.info('Http server is stopped')
  })

  return { http }
}, ElysiaProvider, ConfigProvider, LoggerProvider)
