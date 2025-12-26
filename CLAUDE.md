# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Steve AI Dashboard는 마인크래프트 교육용 에디션과 Google Gemini AI를 연결하는 3-tier 애플리케이션입니다:
1. **Frontend**: React 대시보드 (포트 3000)
2. **Bridge**: Node.js WebSocket 서버 (포트 8080, 19131)
3. **Minecraft**: 교육용 에디션 클라이언트

## Development Commands

### Frontend (React + Vite)
```bash
cd frontend
npm install              # 의존성 설치
npm run dev             # 개발 서버 (http://localhost:3000)
npm run build           # 프로덕션 빌드
npm run lint            # ESLint 실행
```

### Bridge Server (Node.js)
```bash
cd bridge
npm install              # 의존성 설치
npm run dev             # nodemon으로 개발 서버 (자동 재시작)
npm start               # 프로덕션 서버
npm run build:exe       # Windows EXE 빌드 (dist/steve-ai-bridge.exe)
```

### 동시 실행
두 개의 터미널 필요:
- Terminal 1: `cd frontend && npm run dev`
- Terminal 2: `cd bridge && npm run dev`

## Architecture

### Communication Flow

**React ↔ Bridge**
- HTTP REST API (axios): 설정 저장, 이미지 업로드
- Socket.IO: 실시간 상태 업데이트, 메시지 로그
- Base URL: `http://localhost:8080`

**Bridge ↔ Minecraft**
- WebSocket (ws 라이브러리): JSON-RPC 2.0 프로토콜
- Port: 19131 (마인크래프트 `/connect localhost:19131`)
- Event subscription 방식으로 플레이어 메시지 수신

**Bridge ↔ Gemini AI**
- `@google/generative-ai` SDK 사용
- 모델: `gemini-1.5-flash`
- 두 가지 모드:
  1. **NPC 모드**: 지식 베이스 기반 대화 (system instruction 활용)
  2. **Builder 모드**: 이미지 분석 → 건축 JSON 생성

### Data Flow: NPC 대화

```
플레이어: "!AI 안녕" 입력
  → Minecraft WebSocket → Bridge (wsHandler.js)
  → Gemini API 호출 (npcMode.js)
  → AI 응답 생성
  → Minecraft say 명령어 전송 (commandBuilder.js)
  → React 대시보드 로그 업데이트 (Socket.IO)
```

### Data Flow: AI 빌더

```
사용자: 이미지 업로드 (ImageUpload.jsx)
  → HTTP POST /api/build (bridgeAPI.js)
  → Gemini 이미지 분석 (builderMode.js)
  → 건축 블록 JSON 생성
  → Minecraft setblock 명령어 연속 실행
  → 진행률을 WebSocket으로 스트리밍
```

### Global State Management

**Bridge Server**
- `global.geminiApiKey`: 메모리에만 저장된 API 키
- `global.npcConfig`: NPC 설정 (name, personality, knowledgeBase)
- `global.minecraftConnected`: 마인크래프트 연결 상태

**Frontend**
- localStorage: API 키, NPC 설정 저장
- useWebSocket hook: Socket.IO 연결 및 이벤트 관리

## Key Configuration

### Ports
- Frontend: `3000` (Vite)
- Bridge HTTP: `8080` (Express)
- Bridge Minecraft: `19131` (WebSocket)

환경변수로 변경 가능:
```bash
HTTP_PORT=8081 MINECRAFT_PORT=19132 npm run dev
```

### Constants

`bridge/src/config/constants.js`:
- `AI_COMMAND_PREFIX`: `!AI` (마인크래프트 명령어 접두어)
- `MAX_RESPONSE_LENGTH`: `200` (채팅창 길이 제한)
- `MINECRAFT_EVENTS`: PlayerMessage, BlockPlaced 등
- `MINECRAFT_COMMANDS`: say, setblock, fill 등

`shared/constants.js`:
- `API_ENDPOINTS`: REST API 경로
- `SOCKET_EVENTS`: Socket.IO 이벤트 이름
- `MINECRAFT_BLOCKS`: 사용 가능한 블록 타입

## Critical Implementation Details

### Minecraft WebSocket Protocol

모든 메시지는 JSON 형식:
```javascript
{
  header: {
    requestId: "uuid-v4",
    messagePurpose: "commandRequest" | "subscribe" | "event",
    version: 1,
    messageType: "commandRequest"
  },
  body: { /* 명령어별 데이터 */ }
}
```

이벤트 구독은 서버 시작 시 자동으로 수행 (`wsHandler.js`의 `subscribeToEvent`).

### Message Splitting

마인크래프트 채팅창 제한으로 긴 메시지는 자동 분할 (`wsHandler.js`의 `splitMessage`):
- 200자 단위로 문장 경계에서 분할
- 1초 간격으로 순차 전송

### Gemini System Instruction

NPC 모드에서 동적으로 생성 (`ai/npcMode.js`):
- 사용자가 입력한 NPC 이름, 성격, 지식 베이스를 system instruction으로 변환
- 200자 제한, 한국어 응답 강제

Builder 모드에서는 고정 instruction:
- JSON 배열만 출력하도록 제한
- 마인크래프트 블록 이름만 사용

## Version Control

코드 변경 시 `.commit_message.txt`에 한 줄 설명 기록 (한국어, 이모지 포함):
1. `.commit_message.txt` 읽기
2. Edit Tool로 내용 덮어쓰기
3. git revert 관련 작업 시 파일 비우기

## API Documentation

상세 API 문서: `docs/API.md`

주요 엔드포인트:
- `POST /api/config/api-key`: Gemini API 키 저장
- `POST /api/config/npc`: NPC 설정 저장
- `POST /api/build`: 이미지 빌드 시작
- `GET /api/status`: 연결 상태 조회
- `GET /health`: 서버 헬스 체크

WebSocket 이벤트:
- `minecraft:status`: 연결 상태 변경
- `minecraft:message`: 플레이어 메시지 수신
- `ai:response`: AI 응답 생성 완료
- `build:progress`: 건축 진행률
- `build:complete`: 건축 완료

## Troubleshooting

### 마인크래프트 연결 오류: "암호화된 세션이 필요합니다"

**증상:**
- Bridge 로그에 다음과 같은 오류 표시:
  ```json
  {
    "body": {
      "statusCode": -2147418107,
      "statusMessage": "암호화된 세션이 필요합니다"
    },
    "header": {
      "messagePurpose": "error"
    }
  }
  ```
- 마인크래프트에서 `/connect localhost:19131` 실행 시 "서버에 연결되었습니다" 표시되지만 바로 오류 발생
- 플레이어 메시지가 Bridge로 전달되지 않음

**원인:**
마인크래프트 교육용 에디션의 "Require Encrypted Websockets" 설정이 활성화되어 있음. 이 설정이 켜져 있으면 암호화되지 않은 일반 WebSocket 연결을 거부합니다.

**해결 방법:**
1. 마인크래프트 교육용 에디션 실행
2. **설정(Settings) → 일반(General) → 프로필(Profile)** 이동
3. **"Require Encrypted Websockets"** 옵션을 **끄기(OFF)**
4. 설정 저장 후 `/connect localhost:19131` 재실행

**참고:**
- 암호화된 WebSocket(WSS) 지원은 `com.microsoft.minecraft.wsencrypt` 프로토콜 구현이 필요하며 매우 복잡함
- 로컬 개발 환경에서는 암호화 없는 WS 연결로 충분
- 프로덕션 배포 시에도 localhost 연결이므로 암호화 불필요

### UWP 루프백 허용

마인크래프트가 localhost에 연결되지 않는 경우:
```cmd
CheckNetIsolation LoopbackExempt -a -n="Microsoft.MinecraftUWP_8wekyb3d8bbwe"
```
또는 교육용 에디션:
```cmd
CheckNetIsolation LoopbackExempt -a -n="Microsoft.MinecraftEducationEdition_8wekyb3d8bbwe"
```

관리자 권한 필요. 웹 UI의 "환경 설정" 페이지에서 자동 설정 가능.

## Deployment

EXE 빌드는 `pkg` 라이브러리 사용:
```bash
cd bridge
npm run build:exe
```

출력: `dist/steve-ai-bridge.exe` (Windows x64)

배포 시 주의사항:
- API 키는 사용자가 직접 입력 (하드코딩 금지)
- Windows 방화벽 설정 필요 (포트 19131, 8080)
- **UWP 루프백 허용 필수**: `CheckNetIsolation LoopbackExempt -a -n="Microsoft.MinecraftUWP_8wekyb3d8bbwe"`
- **암호화된 웹소켓 설정 해제**: 마인크래프트 설정에서 "Require Encrypted Websockets" 끄기
- 상세 가이드: `docs/DEPLOYMENT.md`
