import { useState, useEffect } from 'react'
import { Save, User, Book } from 'lucide-react'
import { bridgeAPI } from '../../services/bridgeAPI'

export default function NPCConfig() {
  const [npcName, setNpcName] = useState('Steve')
  const [personality, setPersonality] = useState('친절하고 도움을 주는 가이드')
  const [knowledgeBase, setKnowledgeBase] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // localStorage에서 불러오기
    const savedConfig = localStorage.getItem('npcConfig')
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig)
        setNpcName(config.name || 'Steve')
        setPersonality(config.personality || '친절하고 도움을 주는 가이드')
        setKnowledgeBase(config.knowledgeBase || '')

        // 페이지 로드 시 서버에도 자동으로 전송
        bridgeAPI.saveNPCConfig(config).catch(err => {
          console.error('Failed to sync NPC config to server:', err)
        })
      } catch (error) {
        console.error('Failed to parse NPC config:', error)
      }
    }
  }, [])

  const handleSave = async () => {
    const config = {
      name: npcName,
      personality,
      knowledgeBase,
    }

    setIsLoading(true)
    try {
      // 1. 서버에 저장 (중요!)
      await bridgeAPI.saveNPCConfig(config)

      // 2. localStorage에도 저장 (새로고침 시 유지용)
      localStorage.setItem('npcConfig', JSON.stringify(config))

      alert('✅ NPC 설정이 저장되었습니다!\n브릿지 서버에 성공적으로 전송되었습니다.')
    } catch (error) {
      console.error('Failed to save NPC config:', error)
      alert('❌ NPC 설정 저장 실패\n브릿지 서버가 실행 중인지 확인해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">NPC 설정</h2>
        <p className="text-gray-400">지능형 NPC의 성격과 지식을 설정하세요</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <User className="text-blue-500" size={24} />
          <h3 className="text-lg font-semibold">기본 정보</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">NPC 이름</label>
            <input
              type="text"
              value={npcName}
              onChange={(e) => setNpcName(e.target.value)}
              className="input-field"
              placeholder="예: Steve, Alex, 마을 주민"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">성격 설정</label>
            <input
              type="text"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              className="input-field"
              placeholder="예: 친절하고 재미있는 선생님"
            />
            <p className="text-xs text-gray-500 mt-1">
              NPC가 어떤 성격으로 대화할지 설정하세요
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Book className="text-purple-500" size={24} />
          <h3 className="text-lg font-semibold">지식 베이스</h3>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">월드 배경 및 지식</label>
          <textarea
            value={knowledgeBase}
            onChange={(e) => setKnowledgeBase(e.target.value)}
            className="input-field min-h-[300px] font-mono text-sm"
            placeholder="예시:

이 세계는 마법과 기술이 공존하는 판타지 세계입니다.

주요 지역:
- 시작 마을: 평화로운 농경 마을
- 어두운 숲: 위험한 몬스터가 서식
- 고대 유적: 숨겨진 보물과 비밀

주요 NPC:
- 대장장이 톰: 무기와 도구 제작
- 마법사 엘라: 마법 아이템 판매

퀘스트:
1. 마을을 위협하는 좀비 처치
2. 고대 유적에서 보물 찾기
..."
          />
          <p className="text-xs text-gray-500 mt-1">
            NPC가 알아야 할 월드 정보, 퀘스트, 스토리 등을 자유롭게 입력하세요.
            이 정보를 바탕으로 NPC가 대화합니다.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {isLoading ? '저장 중...' : '설정 저장'}
        </button>
        <button className="btn-secondary">미리보기 테스트</button>
      </div>
    </div>
  )
}
