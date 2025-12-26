# Steve AI Dashboard

마인크래프트 교육용 에디션과 연동되는 AI 교육용 대시보드 프로젝트

## 프로젝트 개요

이 프로젝트는 마인크래프트 교육용 에디션에서 작동하는 지능형 NPC와 AI 기반 건축 시스템을 제공합니다.

### 주요 기능

- **지능형 NPC 대화**: Google Gemini API를 활용한 자연스러운 대화
- **AI 건축 시스템**: 이미지를 3D 복셀 데이터로 변환하여 자동 건축
- **실시간 연결 모니터링**: 마인크래프트와의 WebSocket 연결 상태 표시
- **사용자 친화적 대시보드**: React + Tailwind CSS 기반 웹 인터페이스

## 기술 스택

### Frontend
- React 18
- Vite
- Tailwind CSS
- Zustand (상태 관리)
- Socket.io-client

### Bridge Server
- Node.js 18+
- Express.js
- Socket.io
- ws (WebSocket)
- @google/generative-ai

## 프로젝트 구조

```
AiNPC/
├── frontend/          # React 프론트엔드
├── bridge/            # Node.js 브릿지 서버
├── shared/            # 공통 타입 및 상수
├── docs/              # 문서
└── PROJECT_STRUCTURE.md
```

## 빠른 시작

### 1. 의존성 설치

```bash
# Frontend 의존성 설치
cd frontend
npm install

# Bridge 의존성 설치
cd ../bridge
npm install
```

### 2. 개발 서버 실행

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Bridge
cd bridge
npm run dev
```

### 3. UWP 루프백 허용 (필수)

**관리자 권한**으로 명령 프롬프트 또는 PowerShell 실행:
```cmd
CheckNetIsolation LoopbackExempt -a -n="Microsoft.MinecraftUWP_8wekyb3d8bbwe"
```

### 4. 마인크래프트 연결

마인크래프트 교육용 에디션에서:
```
/connect localhost:19131
```

## 사용 방법

1. **API 키 설정**: 대시보드에서 Google Gemini API 키 입력
2. **NPC 설정**: NPC의 이름, 성격, 지식 베이스 입력
3. **마인크래프트 연결**: `/connect` 명령어로 브릿지 서버 연결
4. **NPC와 대화**: 채팅창에 `!AI [메시지]` 입력
5. **AI 건축**: 대시보드에서 이미지 업로드 후 건축 시작

## 배포

EXE 파일로 패키징하여 설치 없이 실행 가능합니다.

```bash
cd bridge
npm run build:exe
```

## 문서

- [프로젝트 구조](./PROJECT_STRUCTURE.md)
- [설치 가이드](./docs/SETUP.md) (예정)
- [API 문서](./docs/API.md) (예정)
- [배포 가이드](./docs/DEPLOYMENT.md) (예정)

## 라이센스

MIT

## 기여

교육용 프로젝트로 자유롭게 수정하여 사용하실 수 있습니다.
