import { v4 as uuidv4 } from 'uuid'

export function sendMinecraftCommand(ws, command, args = '') {
  return new Promise((resolve, reject) => {
    if (!ws || ws.readyState !== 1) {
      reject(new Error('Minecraft not connected'))
      return
    }

    const requestId = uuidv4()
    const commandLine = args ? `${command} ${args}` : command

    const message = {
      header: {
        requestId: requestId,
        messagePurpose: 'commandRequest',
        version: 1,
        messageType: 'commandRequest'
      },
      body: {
        version: 1,
        commandLine: commandLine,
        origin: {
          type: 'player'
        }
      }
    }

    const timeout = setTimeout(() => {
      reject(new Error('Command timeout'))
    }, 5000)

    const messageHandler = (data) => {
      try {
        const response = JSON.parse(data.toString())
        if (response.header?.requestId === requestId) {
          clearTimeout(timeout)
          ws.removeListener('message', messageHandler)
          resolve(response)
        }
      } catch (error) {
        // Ignore parsing errors for other messages
      }
    }

    ws.on('message', messageHandler)
    ws.send(JSON.stringify(message))
  })
}

export function buildSetBlockCommand(x, y, z, blockType) {
  return `setblock ${x} ${y} ${z} ${blockType}`
}

export function buildFillCommand(x1, y1, z1, x2, y2, z2, blockType) {
  return `fill ${x1} ${y1} ${z1} ${x2} ${y2} ${z2} ${blockType}`
}

export function buildSayCommand(message) {
  return `say ${message}`
}

export function buildTellrawCommand(target, message) {
  return `tellraw ${target} {"rawtext":[{"text":"${message}"}]}`
}
