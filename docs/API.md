# API 문서

Bridge 서버의 HTTP API 및 WebSocket 이벤트 문서입니다.

## Base URL

```
http://localhost:8080
```

## HTTP Endpoints

### 1. Health Check

서버 상태 확인

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "connections": {
    "minecraft": true,
    "dashboard": 1
  }
}
```

### 2. API 키 저장

Google Gemini API 키 설정

**Endpoint**: `POST /api/config/api-key`

**Request**:
```json
{
  "apiKey": "AIza..."
}
```

**Response**:
```json
{
  "success": true,
  "message": "API key saved"
}
```

### 3. NPC 설정 저장

NPC 캐릭터 설정

**Endpoint**: `POST /api/config/npc`

**Request**:
```json
{
  "name": "Steve",
  "personality": "친절하고 도움을 주는 가이드",
  "knowledgeBase": "이 세계는 마법과 기술이 공존하는..."
}
```

**Response**:
```json
{
  "success": true,
  "message": "NPC configuration saved",
  "config": {
    "name": "Steve",
    "personality": "친절하고 도움을 주는 가이드",
    "knowledgeBase": "이 세계는..."
  }
}
```

### 4. 설정 조회

현재 저장된 설정 조회

**Endpoint**: `GET /api/config`

**Response**:
```json
{
  "hasApiKey": true,
  "npcConfig": {
    "name": "Steve",
    "personality": "친절하고 도움을 주는 가이드",
    "knowledgeBase": "..."
  },
  "minecraftConnected": true
}
```

### 5. 이미지 빌드

이미지를 분석하여 마인크래프트 건축 시작

**Endpoint**: `POST /api/build`

**Request**:
```json
{
  "imageData": {
    "mimeType": "image/png",
    "base64": "iVBORw0KGgo..."
  },
  "buildConfig": {
    "size": "medium",
    "height": "medium",
    "style": "auto",
    "startPosition": { "x": 0, "y": 4, "z": 0 }
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Building started",
  "totalBlocks": 523
}
```

### 6. 상태 조회

연결 상태 확인

**Endpoint**: `GET /api/status`

**Response**:
```json
{
  "minecraft": true,
  "hasApiKey": true,
  "hasNPCConfig": true,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## WebSocket Events

Socket.IO를 통한 실시간 양방향 통신

### Client → Server Events

현재 클라이언트에서 서버로 보내는 이벤트 없음 (향후 확장 가능)

### Server → Client Events

#### 1. minecraft:status

마인크래프트 연결 상태 변경

```javascript
socket.on('minecraft:status', (data) => {
  console.log(data)
  // { connected: true }
})
```

#### 2. minecraft:message

플레이어 메시지 수신

```javascript
socket.on('minecraft:message', (data) => {
  console.log(data)
  // {
  //   sender: "Player1",
  //   message: "!AI 안녕하세요",
  //   timestamp: "2024-01-01T00:00:00.000Z"
  // }
})
```

#### 3. ai:processing

AI 응답 생성 중

```javascript
socket.on('ai:processing', (data) => {
  console.log(data)
  // { message: "안녕하세요" }
})
```

#### 4. ai:response

AI 응답 생성 완료

```javascript
socket.on('ai:response', (data) => {
  console.log(data)
  // {
  //   userMessage: "안녕하세요",
  //   aiResponse: "안녕하세요! 무엇을 도와드릴까요?",
  //   timestamp: "2024-01-01T00:00:00.000Z"
  // }
})
```

#### 5. build:progress

건축 진행 상황

```javascript
socket.on('build:progress', (data) => {
  console.log(data)
  // {
  //   placed: 100,
  //   total: 500,
  //   percentage: 20
  // }
})
```

#### 6. build:complete

건축 완료

```javascript
socket.on('build:complete', (data) => {
  console.log(data)
  // { success: true }
})
```

#### 7. build:error

건축 오류

```javascript
socket.on('build:error', (data) => {
  console.log(data)
  // { error: "Minecraft not connected" }
})
```

## 마인크래프트 WebSocket 프로토콜

### 연결

```
ws://localhost:19131
```

### 메시지 형식

모든 메시지는 JSON 형식

#### Subscribe to Events

```json
{
  "header": {
    "requestId": "uuid-v4",
    "messagePurpose": "subscribe",
    "version": 1,
    "messageType": "commandRequest"
  },
  "body": {
    "eventName": "PlayerMessage"
  }
}
```

#### Send Command

```json
{
  "header": {
    "requestId": "uuid-v4",
    "messagePurpose": "commandRequest",
    "version": 1,
    "messageType": "commandRequest"
  },
  "body": {
    "version": 1,
    "commandLine": "say Hello World",
    "origin": {
      "type": "player"
    }
  }
}
```

#### Receive Event

```json
{
  "header": {
    "eventName": "PlayerMessage",
    "messagePurpose": "event",
    "version": 1
  },
  "body": {
    "sender": "Player1",
    "message": "!AI 안녕하세요",
    "receiver": "",
    "type": "chat"
  }
}
```

## 오류 코드

### HTTP 오류

- `400 Bad Request`: 잘못된 요청 (필수 필드 누락)
- `500 Internal Server Error`: 서버 내부 오류

### 오류 응답 형식

```json
{
  "error": "Error message",
  "details": "Additional information"
}
```

## 사용 예시

### JavaScript (Frontend)

```javascript
import axios from 'axios'
import io from 'socket.io-client'

// API 호출
const saveApiKey = async (apiKey) => {
  const response = await axios.post('http://localhost:8080/api/config/api-key', {
    apiKey
  })
  return response.data
}

// WebSocket 연결
const socket = io('http://localhost:8080')

socket.on('minecraft:status', (data) => {
  console.log('Minecraft status:', data.connected)
})

socket.on('ai:response', (data) => {
  console.log('AI response:', data.aiResponse)
})
```

### cURL

```bash
# Health check
curl http://localhost:8080/health

# Save API key
curl -X POST http://localhost:8080/api/config/api-key \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "AIza..."}'

# Get status
curl http://localhost:8080/api/status
```

## 보안 고려사항

1. **API 키**: 로컬 스토리지에만 저장, 서버 메모리에만 보관
2. **CORS**: 개발 환경에서만 모든 origin 허용
3. **프로덕션**: 배포 시 CORS 설정 강화 필요
4. **인증**: 현재 미구현, 향후 연결 키 기반 인증 추가 예정

## 향후 확장 계획

- [ ] WebSocket 인증 토큰
- [ ] 사용자별 세션 관리
- [ ] 건축 히스토리 저장
- [ ] 다중 마인크래프트 클라이언트 지원
- [ ] REST API rate limiting
