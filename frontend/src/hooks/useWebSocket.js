import { useEffect, useState } from 'react'
import io from 'socket.io-client'

export function useWebSocket(url = 'http://localhost:8080') {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [minecraftConnected, setMinecraftConnected] = useState(false)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const newSocket = io(url)

    newSocket.on('connect', () => {
      console.log('Connected to bridge server')
      setConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from bridge server')
      setConnected(false)
    })

    newSocket.on('minecraft:status', (data) => {
      setMinecraftConnected(data.connected)
    })

    newSocket.on('minecraft:message', (data) => {
      setMessages((prev) => [...prev, {
        id: Date.now(),
        type: 'player',
        ...data
      }])
    })

    newSocket.on('ai:response', (data) => {
      setMessages((prev) => [...prev, {
        id: Date.now(),
        type: 'ai',
        sender: 'AI',
        message: data.aiResponse,
        timestamp: data.timestamp
      }])
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [url])

  return {
    socket,
    connected,
    minecraftConnected,
    messages
  }
}
