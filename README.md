# 도해태 (DoHaetae)

> macOS 바탕화면 위에 살아있는 AI 해태 캐릭터 — 당신이 막혔을 때 먼저 말을 건다.

AI 수호 생명체 해태가 바탕화면에 상주하며 사용자의 작업을 관찰하고, 막힌 것 같을 때 조용히 도움을 제안합니다.

---

## 시작하기

### 사전 조건

- macOS 13 Ventura 이상 (Apple Silicon / Intel 모두 지원)
- [Node.js](https://nodejs.org) v20 이상
- [Anthropic API 키](https://console.anthropic.com)

### 설치

```bash
git clone https://github.com/YouSeungHak/DoHaetae.git
cd DoHaetae
npm install
```

### API 키 설정

```bash
cp .env.example .env
```

`.env` 파일을 열어 API 키를 입력합니다:

```
ANTHROPIC_API_KEY=sk-ant-여기에_실제_키_입력
```

### Accessibility 권한 허용

최초 실행 전 macOS에서 전역 키보드/마우스 감지 권한이 필요합니다:

**시스템 환경설정 → 개인 정보 보호 및 보안 → 손쉬운 사용 → 터미널 (또는 앱) 허용**

### 실행

```bash
npm run dev
```

바탕화면 우측 하단에 해태 캐릭터가 등장합니다.

---

## 사용 방법

1. VS Code, Android Studio, Xcode 등 개발 도구를 실행합니다
2. 코드 작업 중 **3분간** 키보드/마우스 입력이 없으면 해태가 말풍선을 띄웁니다
3. **[도와줘]** — Claude AI가 현재 클립보드 내용을 분석해 힌트를 제안합니다
4. **[괜찮아]** — 말풍선을 닫고 30분간 방해하지 않습니다

> 빠른 테스트: `src/shared/constants.ts`에서 `IDLE_THRESHOLD_MS` 기본값을 `10_000` (10초)으로 줄이면 바로 동작을 확인할 수 있습니다.

---

## 캐릭터 3종

앱 실행마다 3종 중 하나가 랜덤으로 선택됩니다.

| 캐릭터 | 성격 | 말풍선 색 |
| --- | --- | --- |
| 차분한 해태 | 조용하고 신중한 조언 | 파랑 계열 |
| 장난꾸러기 해태 | 에너지 넘치는 응원 | 노랑 계열 |
| 똑똑한 해태 | 논리적인 분석 힌트 | 청록 계열 |

---

## 빌드 (배포용 DMG)

```bash
# macOS에서 실행 (네이티브 모듈 필요)
npm run dist
# → dist/DoHaetae-0.1.0-arm64.dmg (Apple Silicon)
# → dist/DoHaetae-0.1.0-x64.dmg   (Intel)
```

---

## 기술 스택

| 항목 | 선택 |
| --- | --- |
| 플랫폼 | macOS |
| 프레임워크 | Electron + electron-vite |
| 언어 | TypeScript + React |
| AI | Claude API (Anthropic) |
| 입력 감지 | uiohook-napi |
| 앱 감지 | active-win |

## 프로젝트 구조

```text
DoHaetae/
├── src/
│   ├── main/           Electron 메인 프로세스
│   │   ├── index.ts        앱 진입점, 창 생성
│   │   ├── InputWatcher.ts 전역 키보드/마우스 감지
│   │   ├── AppWatcher.ts   활성 앱 감지
│   │   ├── TriggerEngine.ts 트리거 조건 판단
│   │   ├── ClaudeService.ts Claude API 연동
│   │   └── ipc.ts          IPC 핸들러
│   ├── preload/        컨텍스트 브리지
│   ├── renderer/       React UI (캐릭터, 말풍선)
│   └── shared/         공통 타입, 상수
├── assets/
│   └── characters/     캐릭터별 config.json
└── .env.example        환경 변수 예시
```
