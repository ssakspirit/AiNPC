import { useEffect, useState } from 'react'
import { Circle } from 'lucide-react'
import { useWebSocketContext } from '../../contexts/WebSocketContext'

export default function Header() {
  const [time, setTime] = useState(new Date())
  const { minecraftConnected, connected: bridgeConnected } = useWebSocketContext()

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="bg-dark-card border-b border-dark-border px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Circle
              size={12}
              className={`${
                minecraftConnected
                  ? 'fill-green-500 text-green-500 animate-pulse'
                  : 'fill-red-500 text-red-500'
              }`}
            />
            <span className="text-sm text-gray-400">
              Minecraft: {minecraftConnected ? '연결됨' : '연결 안됨'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Circle
              size={12}
              className={`${
                bridgeConnected
                  ? 'fill-green-500 text-green-500 animate-pulse'
                  : 'fill-red-500 text-red-500'
              }`}
            />
            <span className="text-sm text-gray-400">
              Bridge Server: {bridgeConnected ? '활성' : '연결 안됨'}
            </span>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          {time.toLocaleTimeString('ko-KR')}
        </div>
      </div>
    </header>
  )
}
