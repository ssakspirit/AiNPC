import express from 'express'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import cors from 'cors'
import { WebSocketServer } from 'ws'
import { v4 as uuidv4 } from 'uuid'
import { CONFIG } from './config/constants.js'
import { setupMinecraftWebSocket } from './minecraft/wsHandler.js'
import { setupAPIRoutes } from './api/routes.js'

const app = express()
const httpServer = createServer(app)

// Socket.IO for React dashboard
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    connections: {
      minecraft: global.minecraftConnected || false,
      dashboard: io.engine.clientsCount
    }
  })
})

// API routes
setupAPIRoutes(app, io)

// Socket.IO connection handler for dashboard
io.on('connection', (socket) => {
  console.log('Dashboard connected:', socket.id)

  socket.emit('status', {
    minecraft: global.minecraftConnected || false,
    timestamp: new Date().toISOString()
  })

  socket.on('disconnect', () => {
    console.log('Dashboard disconnected:', socket.id)
  })
})

// Minecraft WebSocket Server
const minecraftWss = new WebSocketServer({
  port: CONFIG.MINECRAFT_PORT
})

setupMinecraftWebSocket(minecraftWss, io)

// Start HTTP server
httpServer.listen(CONFIG.HTTP_PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Steve AI Bridge Server Started      ║
╠════════════════════════════════════════╣
║  HTTP API:        http://localhost:${CONFIG.HTTP_PORT}   ║
║  Minecraft Port:  ${CONFIG.MINECRAFT_PORT}                ║
║  Dashboard:       http://localhost:3000║
╠════════════════════════════════════════╣
║  Minecraft 연결 방법:                   ║
║  /connect localhost:${CONFIG.MINECRAFT_PORT}              ║
╚════════════════════════════════════════╝
  `)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing servers...')
  httpServer.close()
  minecraftWss.close()
  process.exit(0)
})
