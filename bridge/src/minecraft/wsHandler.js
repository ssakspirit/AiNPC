import { v4 as uuidv4 } from 'uuid'
import { CONFIG, MINECRAFT_EVENTS, MINECRAFT_COMMANDS } from '../config/constants.js'
import { handleAIMessage } from '../ai/npcMode.js'

let minecraftClient = null
let messageQueue = []

export function setupMinecraftWebSocket(wss, io) {
  wss.on('connection', (ws) => {
    console.log('Minecraft client connected')
    minecraftClient = ws
    global.minecraftConnected = true

    // Notify dashboard
    io.emit('minecraft:status', { connected: true })

    // Subscribe to player messages
    subscribeToEvent(ws, MINECRAFT_EVENTS.PLAYER_MESSAGE)

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString())
        console.log('Received from Minecraft:', message)

        // Handle player message events
        if (message.header?.eventName === MINECRAFT_EVENTS.PLAYER_MESSAGE) {
          await handlePlayerMessage(message.body, ws, io)
        }
      } catch (error) {
        console.error('Error processing Minecraft message:', error)
      }
    })

    ws.on('close', () => {
      console.log('Minecraft client disconnected')
      minecraftClient = null
      global.minecraftConnected = false
      io.emit('minecraft:status', { connected: false })
    })

    ws.on('error', (error) => {
      console.error('Minecraft WebSocket error:', error)
    })
  })
}

function subscribeToEvent(ws, eventName) {
  const subscribeMessage = {
    header: {
      requestId: uuidv4(),
      messagePurpose: 'subscribe',
      version: 1,
      messageType: 'commandRequest'
    },
    body: {
      eventName: eventName
    }
  }

  ws.send(JSON.stringify(subscribeMessage))
  console.log(`Subscribed to event: ${eventName}`)
}

async function handlePlayerMessage(messageBody, ws, io) {
  const { message, sender } = messageBody

  // Log to dashboard
  io.emit('minecraft:message', {
    sender,
    message,
    timestamp: new Date().toISOString()
  })

  // Check if message starts with AI command prefix
  if (message.startsWith(CONFIG.AI_COMMAND_PREFIX)) {
    const userMessage = message.substring(CONFIG.AI_COMMAND_PREFIX.length).trim()

    if (userMessage) {
      // Get API key from global config (set via API)
      const apiKey = global.geminiApiKey
      const npcConfig = global.npcConfig || {}

      if (!apiKey) {
        sendMinecraftMessage(ws, '⚠ API 키가 설정되지 않았습니다. 대시보드에서 API 키를 설정해주세요.')
        return
      }

      try {
        // Show typing indicator
        io.emit('ai:processing', { message: userMessage })

        // Get AI response
        const response = await handleAIMessage(userMessage, npcConfig, apiKey)

        // Send response to Minecraft
        sendMinecraftMessage(ws, response)

        // Log to dashboard
        io.emit('ai:response', {
          userMessage,
          aiResponse: response,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('AI processing error:', error)
        sendMinecraftMessage(ws, '⚠ AI 응답 생성 중 오류가 발생했습니다.')
      }
    }
  }
}

export function sendMinecraftMessage(ws, message) {
  if (!ws || ws.readyState !== 1) {
    console.log('Minecraft not connected, message queued')
    messageQueue.push(message)
    return
  }

  // Split long messages for Minecraft chat
  const chunks = splitMessage(message, CONFIG.MAX_RESPONSE_LENGTH)

  chunks.forEach((chunk, index) => {
    setTimeout(() => {
      const commandMessage = {
        header: {
          requestId: uuidv4(),
          messagePurpose: 'commandRequest',
          version: 1,
          messageType: 'commandRequest'
        },
        body: {
          version: 1,
          commandLine: `${MINECRAFT_COMMANDS.SAY} ${chunk}`,
          origin: {
            type: 'player'
          }
        }
      }

      ws.send(JSON.stringify(commandMessage))
    }, index * 1000) // 1초 간격으로 메시지 전송
  })
}

function splitMessage(message, maxLength) {
  if (message.length <= maxLength) {
    return [message]
  }

  const chunks = []
  let currentChunk = ''

  const sentences = message.split(/([.!?。！？]\s*)/)

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLength) {
      currentChunk += sentence
    } else {
      if (currentChunk) chunks.push(currentChunk.trim())
      currentChunk = sentence
    }
  }

  if (currentChunk) chunks.push(currentChunk.trim())

  return chunks
}

export function getMinecraftClient() {
  return minecraftClient
}
