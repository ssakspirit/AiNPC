import { Activity, Server, Cpu } from 'lucide-react'

export default function ConnectionStatus() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">대시보드</h2>
        <p className="text-gray-400">마인크래프트 연결 상태 및 시스템 정보</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-blue-500" size={24} />
            <h3 className="text-lg font-semibold">연결 상태</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Minecraft</span>
              <span className="text-red-500">연결 안됨</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Bridge Server</span>
              <span className="text-green-500">활성</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Server className="text-purple-500" size={24} />
            <h3 className="text-lg font-semibold">서버 정보</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">포트</span>
              <span>19131</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">프로토콜</span>
              <span>WebSocket</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="text-green-500" size={24} />
            <h3 className="text-lg font-semibold">AI 상태</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">모델</span>
              <span>Gemini 1.5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">모드</span>
              <span>대기 중</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">연결 가이드</h3>
        <div className="space-y-4">
          <div>
            <p className="text-gray-400 mb-2">1. 마인크래프트 교육용 에디션을 실행하세요</p>
            <p className="text-gray-400 mb-2">2. 채팅창을 열고 다음 명령어를 입력하세요:</p>
            <code className="block bg-dark-bg px-4 py-2 rounded font-mono text-sm text-green-400">
              /connect localhost:19131
            </code>
          </div>
          <div>
            <p className="text-gray-400 mb-2">3. NPC와 대화하려면 채팅창에 입력하세요:</p>
            <code className="block bg-dark-bg px-4 py-2 rounded font-mono text-sm text-blue-400">
              !AI 안녕하세요
            </code>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">최근 메시지</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <div className="text-gray-500 text-center py-8">
            아직 메시지가 없습니다
          </div>
        </div>
      </div>
    </div>
  )
}
