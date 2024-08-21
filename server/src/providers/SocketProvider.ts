import { Server } from 'socket.io'
import { defineProvider } from '~/application/Application.ts'
import HttpProvider from './HttpProvider.ts'
import { createAdapter } from '@socket.io/redis-streams-adapter'
import RedisProvider from './RedisProvider.ts'

export default defineProvider(({ service, on }) => {
  const io = new Server(service.http, {
    adapter: createAdapter(service.redis),
  })

  on('stop', () => {
    io.disconnectSockets(true)
  })

  return { io }
}, HttpProvider, RedisProvider)
