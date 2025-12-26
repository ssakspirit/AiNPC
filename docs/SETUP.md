# Steve AI Dashboard - 설치 가이드

## 사전 요구사항

### 필수 소프트웨어
- Node.js 18 이상
- npm 또는 yarn
- 마인크래프트 교육용 에디션
- Google Gemini API 키

### API 키 발급

1. [Google AI Studio](https://makersuite.google.com/app/apikey) 접속
2. Google 계정으로 로그인
3. "Get API Key" 클릭
4. 프로젝트 선택 또는 생성
5. "Create API Key" 클릭
6. 생성된 키 복사 및 안전하게 보관

## 설치 방법

### 1. 프로젝트 클론 또는 다운로드

```bash
git clone <repository-url>
cd AiNPC
```

### 2. Frontend 설치

```bash
cd frontend
npm install
```

### 3. Bridge 서버 설치

```bash
cd ../bridge
npm install
```

## 실행 방법

### 개발 모드

**Terminal 1 - Frontend**
```bash
cd frontend
npm run dev
```
Frontend가 http://localhost:3000 에서 실행됩니다.

**Terminal 2 - Bridge Server**
```bash
cd bridge
npm run dev
```
Bridge 서버가 포트 8080 (HTTP), 19131 (Minecraft)에서 실행됩니다.

### 프로덕션 모드

**Frontend 빌드**
```bash
cd frontend
npm run build
```

**Bridge 서버 실행**
```bash
cd bridge
npm start
```

## 마인크래프트 연결

### ⚠️ 중요: UWP 루프백 허용 (필수)

마인크래프트 교육용 에디션은 UWP 앱이므로, localhost 연결을 위해 **관리자 권한**으로 다음 명령어를 실행해야 합니다:

**PowerShell 또는 명령 프롬프트 (관리자 권한)**
```cmd
CheckNetIsolation LoopbackExempt -a -n="Microsoft.MinecraftUWP_8wekyb3d8bbwe"
```

또는 교육용 에디션 패키지명:
```cmd
CheckNetIsolation LoopbackExempt -a -n="Microsoft.MinecraftEducationEdition_8wekyb3d8bbwe"
```

**확인 방법:**
```cmd
CheckNetIsolation LoopbackExempt -s
```
목록에 Minecraft가 있으면 성공입니다.

### ⚠️ 중요: 암호화된 웹소켓 설정 해제 (필수)

마인크래프트 교육용 에디션은 기본적으로 암호화된 WebSocket 연결만 허용합니다. 일반 WebSocket 연결을 허용하려면 다음 설정을 변경해야 합니다:

1. 마인크래프트 교육용 에디션 실행
2. **설정(Settings) → 일반(General) → 프로필(Profile)** 이동
3. **"Require Encrypted Websockets"** 옵션을 **끄기(OFF)**
4. 설정 저장

이 설정을 변경하지 않으면 연결 시 "암호화된 세션이 필요합니다" 오류가 발생합니다.

### 연결 단계

1. 마인크래프트 교육용 에디션 실행
2. 월드 생성 또는 기존 월드 로드
3. 채팅창 열기 (T 키)
4. 다음 명령어 입력:
```
/connect localhost:19131
```

5. 연결 성공 메시지 확인
6. 대시보드에서 연결 상태 "연결됨"으로 변경 확인

## 초기 설정

### 1. API 키 설정

1. 대시보드 접속 (http://localhost:3000)
2. 좌측 사이드바에서 "환경 설정" 클릭
3. Google Gemini API 키 입력
4. "API 키 저장" 클릭

### 2. NPC 설정

1. 좌측 사이드바에서 "NPC 설정" 클릭
2. NPC 이름 입력 (예: Steve, Alex, 마을 주민)
3. 성격 설정 입력 (예: 친절하고 도움을 주는 가이드)
4. 지식 베이스에 월드 정보 입력
5. "설정 저장" 클릭

### 3. NPC와 대화 테스트

마인크래프트 채팅창에서:
```
!AI 안녕하세요
```

NPC가 응답하면 설정이 성공적으로 완료된 것입니다!

## 문제 해결

### 마인크래프트 연결 안됨

**가장 흔한 원인 1: 암호화된 웹소켓 설정**
- 오류 메시지: "암호화된 세션이 필요합니다" (statusCode: -2147418107)
- 해결 방법:
  1. 마인크래프트 설정(Settings) → 일반(General) → 프로필(Profile)
  2. "Require Encrypted Websockets" 옵션을 **끄기(OFF)**
  3. 설정 저장 후 재연결

**가장 흔한 원인 2: UWP 루프백 허용 안됨**
- 관리자 권한으로 다음 명령어 실행:
  ```cmd
  CheckNetIsolation LoopbackExempt -a -n="Microsoft.MinecraftUWP_8wekyb3d8bbwe"
  ```

**기타 확인 사항:**
1. Bridge 서버가 실행 중인지 확인
2. 포트 19131이 다른 프로그램에서 사용 중이 아닌지 확인:
   ```bash
   netstat -ano | findstr 19131
   ```
3. 방화벽 설정 확인:
   - Windows Defender 방화벽에서 Node.js 허용
   - 포트 19131 인바운드 규칙 추가

### API 키 오류

1. API 키가 올바르게 입력되었는지 확인
2. Google AI Studio에서 API 키가 활성화되었는지 확인
3. API 사용량 한도를 확인

### Frontend 연결 안됨

1. Bridge 서버가 포트 8080에서 실행 중인지 확인
2. CORS 설정 확인
3. 브라우저 콘솔에서 오류 메시지 확인

### 빌드 실패

1. Node.js 버전 확인 (18 이상 필요)
2. node_modules 삭제 후 재설치:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Windows 방화벽 설정 (필요시)

### 명령 프롬프트 (관리자 권한)로 실행:

```cmd
netsh advfirewall firewall add rule name="Minecraft Bridge" dir=in action=allow protocol=TCP localport=19131
netsh advfirewall firewall add rule name="Minecraft Bridge" dir=in action=allow protocol=UDP localport=19131
```

## 다음 단계

설치가 완료되었다면:
1. [API 문서](./API.md) 참고하여 추가 기능 탐색
2. [배포 가이드](./DEPLOYMENT.md) 참고하여 EXE 빌드
3. NPC 지식 베이스를 풍부하게 작성하여 더 똑똑한 NPC 만들기
4. AI 빌더로 이미지를 3D 건축물로 변환해보기

## 지원

문제가 발생하면 GitHub Issues에 문의해주세요.
