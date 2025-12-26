import { useState } from 'react'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import ConnectionStatus from './components/Dashboard/ConnectionStatus'
import NPCConfig from './components/NPCSettings/NPCConfig'
import ImageUpload from './components/AIBuilder/ImageUpload'
import APIKeyManager from './components/Settings/APIKeyManager'
import { WebSocketProvider } from './contexts/WebSocketContext'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ConnectionStatus />
      case 'npc':
        return <NPCConfig />
      case 'builder':
        return <ImageUpload />
      case 'settings':
        return <APIKeyManager />
      default:
        return <ConnectionStatus />
    }
  }

  return (
    <WebSocketProvider>
      <div className="flex h-screen bg-dark-bg">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </WebSocketProvider>
  )
}

export default App
