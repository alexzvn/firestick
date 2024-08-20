import { Server } from 'socket.io'
import { defineProvider } from '~/application/Application.ts'
import HttpProvider from './HttpProvider.ts'

export default defineProvider(({ service, on }) => {
  const io = new Server(service.http)

  return { io }
}, HttpProvider)
