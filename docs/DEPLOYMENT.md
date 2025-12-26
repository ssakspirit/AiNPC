# 배포 가이드 - EXE 패키징

이 가이드는 Bridge 서버를 독립 실행 가능한 EXE 파일로 패키징하는 방법을 설명합니다.

## EXE 빌드 도구: pkg

[pkg](https://github.com/vercel/pkg)는 Node.js 프로젝트를 실행 파일로 변환하는 도구입니다.

### 장점
- Node.js 설치 없이 실행 가능
- 단일 EXE 파일로 배포
- Windows, macOS, Linux 지원

## 빌드 방법

### 1. Bridge 디렉토리로 이동

```bash
cd bridge
```

### 2. pkg 설치 확인

package.json에 이미 pkg가 devDependencies로 추가되어 있습니다.
```bash
npm install
```

### 3. EXE 빌드

```bash
npm run build:exe
```

이 명령어는 `steve-ai-bridge.exe` 파일을 `dist/` 폴더에 생성합니다.

### 4. 빌드 결과 확인

```bash
ls ../dist/
```

출력 예시:
```
steve-ai-bridge.exe  (약 50-80MB)
```

## 배포 패키지 구성

사용자에게 배포할 때는 다음 파일들을 포함하세요:

```
SteveAI-v1.0/
├── steve-ai-bridge.exe      # 브릿지 서버 실행 파일
├── frontend/                 # 웹 대시보드 (선택사항)
│   └── dist/                 # 빌드된 프론트엔드
├── README.txt                # 사용 설명서
└── LICENSE.txt               # 라이센스
```

### Frontend 빌드 (함께 배포하는 경우)

```bash
cd frontend
npm run build
```

빌드된 파일은 `frontend/dist/` 에 생성됩니다.

## 사용자 실행 가이드

### 방법 1: 간단한 실행

1. `steve-ai-bridge.exe` 더블클릭
2. 명령 프롬프트 창이 열리며 서버 시작
3. 브라우저에서 http://localhost:3000 접속 (Frontend 함께 제공시)
4. 마인크래프트에서 `/connect localhost:19131` 입력

### 방법 2: 관리자 권한으로 실행 (권장)

방화벽 설정을 위해 처음 실행 시 관리자 권한 필요:

1. `steve-ai-bridge.exe` 우클릭
2. "관리자 권한으로 실행" 선택
3. Windows Defender 방화벽 경고 시 "액세스 허용" 클릭

## Windows 방화벽 자동 설정

### PowerShell 스크립트 생성

배포 패키지에 `setup-firewall.ps1` 포함:

```powershell
# setup-firewall.ps1
# 관리자 권한 필요

Write-Host "마인크래프트 브릿지 방화벽 설정 중..." -ForegroundColor Green

netsh advfirewall firewall add rule name="Steve AI Bridge TCP" dir=in action=allow protocol=TCP localport=19131
netsh advfirewall firewall add rule name="Steve AI Bridge UDP" dir=in action=allow protocol=UDP localport=19131
netsh advfirewall firewall add rule name="Steve AI HTTP" dir=in action=allow protocol=TCP localport=8080

Write-Host "방화벽 설정 완료!" -ForegroundColor Green
Write-Host "steve-ai-bridge.exe를 실행하세요." -ForegroundColor Yellow

Pause
```

실행 방법:
```powershell
PowerShell -ExecutionPolicy Bypass -File setup-firewall.ps1
```

## 고급 설정

### 1. 포트 변경

환경 변수로 포트 설정 가능:

```cmd
set HTTP_PORT=8081
set MINECRAFT_PORT=19132
steve-ai-bridge.exe
```

### 2. 배치 파일로 자동 실행

`start-server.bat` 생성:

```batch
@echo off
echo Steve AI Bridge 서버 시작 중...
echo.

REM 포트 설정 (선택사항)
REM set HTTP_PORT=8080
REM set MINECRAFT_PORT=19131

REM 서버 실행
steve-ai-bridge.exe

pause
```

### 3. 서비스로 등록 (고급 사용자)

NSSM (Non-Sucking Service Manager) 사용:

1. [NSSM 다운로드](https://nssm.cc/download)
2. 설치:
```cmd
nssm install SteveAIBridge "C:\path\to\steve-ai-bridge.exe"
nssm start SteveAIBridge
```

## pkg 설정 커스터마이징

`bridge/package.json`의 pkg 설정:

```json
{
  "pkg": {
    "targets": [
      "node18-win-x64"    // Windows 64비트
    ],
    "outputPath": "../dist",
    "assets": [
      "src/**/*"          // 추가 파일 포함 필요시
    ]
  }
}
```

### 멀티 플랫폼 빌드

```json
{
  "pkg": {
    "targets": [
      "node18-win-x64",     // Windows
      "node18-macos-x64",   // macOS Intel
      "node18-macos-arm64", // macOS Apple Silicon
      "node18-linux-x64"    // Linux
    ]
  }
}
```

빌드:
```bash
npm run build:exe
```

## 배포 체크리스트

- [ ] Bridge 서버 EXE 빌드
- [ ] Frontend 빌드 (필요시)
- [ ] README.txt 작성
- [ ] 방화벽 설정 스크립트 포함
- [ ] 실행 가이드 문서 포함
- [ ] 테스트 환경에서 EXE 실행 테스트
- [ ] 마인크래프트 연결 테스트
- [ ] API 키 설정 가이드 포함
- [ ] 라이센스 파일 포함

## 배포 파일 최적화

### EXE 크기 줄이기

1. **불필요한 dependencies 제거**
```bash
npm prune --production
```

2. **UPX로 압축** (선택사항)
```bash
upx --best steve-ai-bridge.exe
```

### 빠른 시작 가이드 (README.txt)

```
===============================================
     Steve AI Dashboard - 빠른 시작
===============================================

1. steve-ai-bridge.exe 실행 (처음엔 관리자 권한)

2. 브라우저에서 http://localhost:3000 접속

3. API 키 설정:
   - 환경 설정 메뉴
   - Google Gemini API 키 입력
   - 저장

4. 마인크래프트에서 연결:
   /connect localhost:19131

5. NPC와 대화:
   !AI 안녕하세요

문제 해결:
- 방화벽 차단 시: setup-firewall.ps1 실행
- 포트 충돌 시: 포트 번호 변경 (문서 참조)

API 키 발급: https://makersuite.google.com/app/apikey
===============================================
```

## 주의사항

1. **보안**: EXE에 API 키를 하드코딩하지 마세요
2. **업데이트**: 버전 관리 체계 수립
3. **라이센스**: 오픈소스 라이브러리 라이센스 고지
4. **테스트**: 깨끗한 Windows 환경에서 테스트

## 자동 업데이트 (선택사항)

향후 구현할 수 있는 기능:
- GitHub Releases를 통한 자동 업데이트 체크
- 버전 비교 및 다운로드 기능
- 사용자 알림

## 문의

배포 관련 문제는 GitHub Issues에 등록해주세요.
