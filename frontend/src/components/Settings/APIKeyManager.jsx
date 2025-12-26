import { useState, useEffect } from 'react'
import { Key, Save, Eye, EyeOff, AlertCircle, Download, Play, CheckCircle } from 'lucide-react'
import { bridgeAPI } from '../../services/bridgeAPI'

export default function APIKeyManager() {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loopbackStatus, setLoopbackStatus] = useState(null)
  const [isSettingUpLoopback, setIsSettingUpLoopback] = useState(false)

  useEffect(() => {
    const savedKey = localStorage.getItem('geminiApiKey')
    if (savedKey) {
      setApiKey(savedKey)
      setIsSaved(true)
      // 페이지 로드 시 서버에도 자동으로 전송
      bridgeAPI.saveApiKey(savedKey).catch(err => {
        console.error('Failed to sync API key to server:', err)
      })
    }

    // Check loopback status
    checkLoopback()
  }, [])

  const checkLoopback = async () => {
    try {
      const status = await bridgeAPI.checkLoopbackStatus()
      setLoopbackStatus(status.enabled)
    } catch (error) {
      console.error('Failed to check loopback status:', error)
    }
  }

  const handleSetupLoopback = async () => {
    setIsSettingUpLoopback(true)
    try {
      const result = await bridgeAPI.setupLoopback()
      alert('✅ ' + result.message)
      setLoopbackStatus(true)
    } catch (error) {
      console.error('Failed to setup loopback:', error)
      alert('❌ 관리자 권한이 필요합니다\n\n브릿지 서버를 관리자 권한으로 실행하거나,\n아래 ".bat 파일 다운로드" 버튼을 클릭하여\n다운로드한 파일을 관리자 권한으로 실행하세요.')
    } finally {
      setIsSettingUpLoopback(false)
    }
  }

  const handleDownloadBat = () => {
    bridgeAPI.downloadLoopbackBat()
    alert('📥 setup-minecraft-loopback.bat 파일이 다운로드됩니다.\n\n다운로드 후 파일을 우클릭하여\n"관리자 권한으로 실행"을 선택하세요.')
  }

  const handleSave = async () => {
    if (!apiKey.trim()) return

    setIsLoading(true)
    try {
      // 1. 서버에 저장 (중요!)
      await bridgeAPI.saveApiKey(apiKey)

      // 2. localStorage에도 저장 (새로고침 시 유지용)
      localStorage.setItem('geminiApiKey', apiKey)

      setIsSaved(true)
      alert('✅ API 키가 저장되었습니다!\n브릿지 서버에 성공적으로 전송되었습니다.')
    } catch (error) {
      console.error('Failed to save API key:', error)
      alert('❌ API 키 저장 실패\n브릿지 서버가 실행 중인지 확인해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    if (confirm('저장된 API 키를 삭제하시겠습니까?')) {
      localStorage.removeItem('geminiApiKey')
      setApiKey('')
      setIsSaved(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">환경 설정</h2>
        <p className="text-gray-400">API 키 및 시스템 설정</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Key className="text-yellow-500" size={24} />
          <h3 className="text-lg font-semibold">Google Gemini API 키</h3>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="text-blue-400 flex-shrink-0" size={20} />
            <div className="text-sm">
              <p className="text-blue-400 font-semibold mb-1">API 키 발급 방법</p>
              <ol className="text-blue-300 space-y-1 list-decimal list-inside">
                <li>
                  <a
                    href="https://makersuite.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-200"
                  >
                    Google AI Studio
                  </a>
                  에 접속하세요
                </li>
                <li>"Get API Key" 버튼을 클릭하세요</li>
                <li>새 프로젝트를 만들거나 기존 프로젝트를 선택하세요</li>
                <li>"Create API Key"를 클릭하여 키를 생성하세요</li>
                <li>생성된 키를 복사하여 아래에 붙여넣으세요</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">API 키</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="input-field pr-12"
                placeholder="AIza..."
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {isSaved && (
              <p className="text-xs text-green-500 mt-1">✓ API 키가 저장되어 있습니다</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {isLoading ? '저장 중...' : 'API 키 저장'}
            </button>
            {isSaved && (
              <button onClick={handleClear} className="btn-secondary">
                삭제
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">마인크래프트 연결 설정 (필수)</h3>

        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
          <div className="flex gap-3">
            <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
            <div className="text-sm">
              <p className="text-red-400 font-semibold mb-2">⚠️ 필수 설정: 암호화된 웹소켓 해제</p>
              <p className="text-red-300 mb-2">
                마인크래프트에서 <strong>설정 → 일반 → 프로필</strong>로 이동하여
                <strong className="block mt-1">"Require Encrypted Websockets"</strong> 옵션을 <strong>끄기(OFF)</strong>로 설정하세요.
              </p>
              <p className="text-red-300 text-xs">
                이 설정을 변경하지 않으면 "암호화된 세션이 필요합니다" 오류가 발생하여 연결할 수 없습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-4">
          <div className="flex gap-3">
            <AlertCircle className="text-orange-400 flex-shrink-0" size={20} />
            <div className="text-sm">
              <p className="text-orange-400 font-semibold mb-1">UWP 루프백 허용 필요</p>
              <p className="text-orange-300">
                마인크래프트 교육용 에디션은 UWP 앱이므로 localhost 연결을 위해
                루프백 허용 설정이 필요합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
            <div className="flex items-center gap-3">
              {loopbackStatus === true && <CheckCircle className="text-green-500" size={20} />}
              {loopbackStatus === false && <AlertCircle className="text-red-500" size={20} />}
              {loopbackStatus === null && <AlertCircle className="text-gray-500" size={20} />}
              <div>
                <p className="text-sm font-medium">루프백 허용 상태</p>
                <p className="text-xs text-gray-400">
                  {loopbackStatus === true && '✓ 설정됨 - 마인크래프트 연결 가능'}
                  {loopbackStatus === false && '✗ 설정 안됨 - 아래 버튼 클릭'}
                  {loopbackStatus === null && '확인 중...'}
                </p>
              </div>
            </div>
            <button
              onClick={checkLoopback}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              새로고침
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSetupLoopback}
              disabled={isSettingUpLoopback || loopbackStatus === true}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
            >
              <Play size={18} />
              {isSettingUpLoopback ? '설정 중...' : '자동 설정 (관리자 권한 필요)'}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownloadBat}
              className="btn-secondary flex items-center gap-2 flex-1"
            >
              <Download size={18} />
              .bat 파일 다운로드 (수동 설정)
            </button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>• <strong className="text-red-400">중요:</strong> 먼저 마인크래프트에서 "Require Encrypted Websockets" 설정을 끄세요</p>
            <p>• "자동 설정"은 브릿지 서버가 관리자 권한으로 실행 중일 때만 작동합니다</p>
            <p>• ".bat 파일 다운로드" 후 우클릭 → "관리자 권한으로 실행"하세요</p>
            <p>• 설정 후 마인크래프트에서 <code className="bg-dark-bg px-1">/connect localhost:19131</code> 입력</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">개인정보 보호</h3>
        <div className="space-y-3">
          <p className="text-sm text-gray-400">
            모든 API 키와 설정은 브라우저의 로컬 스토리지에 저장됩니다.
            서버로 전송되지 않으며, 컴퓨터에만 보관됩니다.
          </p>
          <button className="text-sm text-red-400 hover:text-red-300">
            모든 데이터 삭제
          </button>
        </div>
      </div>
    </div>
  )
}
