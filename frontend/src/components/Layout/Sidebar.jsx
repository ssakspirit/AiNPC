import { Home, Bot, Hammer, Settings } from 'lucide-react'

const menuItems = [
  { id: 'dashboard', label: '연결 상태', icon: Home },
  { id: 'npc', label: 'NPC 설정', icon: Bot },
  { id: 'builder', label: 'AI 빌더', icon: Hammer },
  { id: 'settings', label: '환경 설정', icon: Settings },
]

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 bg-dark-card border-r border-dark-border">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-minecraft-grass">
          Steve AI
        </h1>
        <p className="text-sm text-gray-400 mt-1">Education Dashboard</p>
      </div>

      <nav className="px-3">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-dark-bg hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-border">
        <p className="text-xs text-gray-500 text-center">
          v1.0.0 - Minecraft Education Edition
        </p>
      </div>
    </aside>
  )
}
