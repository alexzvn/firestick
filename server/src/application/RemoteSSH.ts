import { Client, type ClientChannel, type ExecOptions, type PseudoTtyOptions } from 'ssh2'
import { invoke } from '~/misc'

type SSH = InstanceType<typeof Client>

class CommandError extends Error {
  constructor (message: string, public code: number, public output: string) {
    super(message)
  }
}

export class RemoteSSH {
  readonly client = new Client()

  constructor () {}

  async connect(...args: Parameters<SSH['connect']>) {
    return new Promise<void>((resolve, reject) => {
      this.client.once('ready', resolve)
      this.client.once('error', reject)
      this.client.once('timeout', reject)
      this.client.connect(...args)
    })
  }

  async disconnect() {
    return new Promise<void>((resolve) => {
      this.client.once('end', resolve)
      this.client.once('close', resolve)
      this.client.end()
    })
  }

  /**
   * Run one shot command
   * 
   * @param [timeout=60_000] - Timeout in milliseconds, default 60 seconds
   */
  async run(command: string, timeout: number = 60_000) {

    return new Promise<string|CommandError>((resolve, reject) => {
      const chunk = new Array<Uint8Array>()

      this.client.exec(command, async (error, channel) => {
        let status = 0

        if (error) {
          return reject(error)
        }

        const timer = timeout && setTimeout(() => {
          channel.end()
          const output = Buffer.concat(chunk).toString()

          reject(new CommandError('Timeout while running command', -1, output))
        }, timeout)

        channel.on('exit', code => status = code)

        for await (const data of channel) {
          chunk.push(data)
        }

        timer && clearTimeout(timer)
        const output = Buffer.concat(chunk).toString()

        if (status !== 0) {
          return reject(new CommandError(`Command failed with code: ${status}`, status, output))
        }

        resolve(output)
      })
    })
  }

  async shell(win: PseudoTtyOptions|false = false) {
    return new Promise<ClientChannel>((resolve, reject) => {
      this.client.shell(win, (error, channel) => {
        error ? reject(error) : resolve(channel)
      })
    })
  }

  /**
   * Spawn command and return channel
   */
  async spawn(command: string, options: ExecOptions) {
    return new Promise<ClientChannel>((resolve, reject) => {
      this.client.exec(command, options, (error, channel) => {
        error ? reject(error) : resolve(channel)
      })
    })
  }

  /**
   * Execute list of commands
   */
  async execute(commands: string[]) {
    const self = this

    return invoke(async function * () {
      for (const cmd of commands) {
        const stream = await self.spawn(cmd, {}).catch(() => undefined)

        if (! stream) {
          continue
        }

        const status = new Promise<number>((resolve) => {
          stream.on('exit', code => resolve(code))
        })

        yield { command: cmd, stream, status }
      }
    })
  }
}