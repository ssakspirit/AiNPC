# Steve AI Dashboard - 프로젝트 구조

```
AiNPC/
├── frontend/                      # React 프론트엔드
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/           # UI 컴포넌트
│   │   │   ├── Layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Header.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── ConnectionStatus.jsx
│   │   │   │   └── MessageLog.jsx
│   │   │   ├── NPCSettings/
│   │   │   │   ├── NPCConfig.jsx
│   │   │   │   └── KnowledgeBase.jsx
│   │   │   ├── AIBuilder/
│   │   │   │   ├── ImageUpload.jsx
│   │   │   │   └── BuildPreview.jsx
│   │   │   └── Settings/
│   │   │       └── APIKeyManager.jsx
│   │   ├── hooks/                # Custom React Hooks
│   │   │   ├── useWebSocket.js
│   │   │   ├── useLocalStorage.js
│   │   │   └── useMinecraftConnection.js
│   │   ├── services/             # API 통신 로직
│   │   │   ├── bridgeAPI.js
│   │   │   └── geminiAPI.js
│   │   ├── utils/                # 유틸리티 함수
│   │   │   └── validators.js
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js            # Vite 빌드 도구
│
├── bridge/                       # Node.js 브릿지 서버
│   ├── src/
│   │   ├── server.js            # WebSocket 서버 메인
│   │   ├── minecraft/           # 마인크래프트 통신
│   │   │   ├── wsHandler.js     # WebSocket 핸들러
│   │   │   ├── commandBuilder.js # 마인크래프트 명령어 생성
│   │   │   └── eventSubscriber.js # 이벤트 구독
│   │   ├── ai/                  # AI 관련 로직
│   │   │   ├── geminiClient.js  # Gemini API 클라이언트
│   │   │   ├── npcMode.js       # NPC 대화 모드
│   │   │   └── builderMode.js   # 3D 빌더 모드
│   │   ├── api/                 # REST API (React와 통신)
│   │   │   ├── routes.js
│   │   │   └── controllers.js
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   └── reconnection.js
│   │   └── config/
│   │       └── constants.js
│   ├── package.json
│   └── pkg.config.json          # pkg 빌드 설정
│
├── shared/                      # 공통 타입/상수
│   ├── types.js
│   └── constants.js
│
├── docs/                        # 문서
│   ├── SETUP.md                # 설치 가이드
│   ├── API.md                  # API 문서
│   └── DEPLOYMENT.md           # 배포 가이드
│
├── .gitignore
├── CLAUDE.md
├── .commit_message.txt
├── README.md
└── package.json                # 루트 monorepo 설정 (선택)
```

## 통신 방식 설계

### 1. React ↔ Node.js Bridge
- **HTTP API**: 설정 저장, NPC 지식 베이스 업데이트, 이미지 업로드
- **WebSocket**: 실시간 마인크래프트 연결 상태, 채팅 로그 스트리밍

### 2. Bridge ↔ Minecraft
- **WebSocket (Minecraft Education Edition)**
  - Port: 19131 (기본값, 사용자 설정 가능)
  - Protocol: JSON-RPC 2.0 방식

### 3. Bridge ↔ Gemini API
- **HTTPS REST API**
  - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`

## 핵심 데이터 플로우

### NPC 대화 모드
```
1. 플레이어가 마인크래프트에서 "!AI 안녕" 입력
2. Minecraft → Bridge (WebSocket)
3. Bridge가 메시지 파싱 및 Gemini API 호출
4. Gemini → Bridge (응답)
5. Bridge → Minecraft (say 명령어)
6. Bridge → React (로그 업데이트)
```

### AI 빌더 모드
```
1. 사용자가 React에서 이미지 업로드
2. React → Bridge (HTTP POST /api/build)
3. Bridge → Gemini (이미지 분석 요청)
4. Gemini → Bridge (건축 JSON)
5. Bridge → Minecraft (setblock 명령어 연속 실행)
6. Bridge → React (진행률 WebSocket 스트림)
```

## 보안 및 인증

### API 키 관리
- React 프론트엔드에서 API 키 입력
- localStorage에 암호화 저장 (crypto-js)
- Bridge로 HTTPS 통신 시 헤더로 전송
- Bridge는 메모리에만 보관 (파일 저장 안 함)

### 로컬 연결 인증
- 첫 실행 시 Bridge가 랜덤 6자리 연결 키 생성
- React에서 해당 키 입력하여 인증
- 이후 세션 토큰으로 통신

## 기술 스택 상세

### Frontend
- **React 18** + **Vite** (빠른 개발 환경)
- **Tailwind CSS 3** (스타일링)
- **Zustand** (가벼운 상태 관리)
- **React Query** (서버 상태 관리)
- **Socket.io-client** (WebSocket 통신)

### Bridge
- **Node.js 18+**
- **Express.js** (HTTP API)
- **Socket.io** (React와 WebSocket)
- **ws** (Minecraft WebSocket)
- **@google/generative-ai** (Gemini SDK)
- **uuid** (요청 ID 생성)
- **pkg** (EXE 빌드)

### DevOps
- **ESLint** + **Prettier** (코드 품질)
- **nodemon** (개발 중 자동 재시작)
- **concurrently** (동시 실행)
