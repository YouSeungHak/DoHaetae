export const WINDOW_WIDTH = 220
export const WINDOW_HEIGHT = 300
export const WINDOW_MARGIN = 20         // 화면 가장자리 여백

export const CHARACTER_SIZE = 128       // 캐릭터 이미지 크기 (px)

export const IDLE_THRESHOLD_MS = Number(process.env.IDLE_THRESHOLD_MS) || 180_000   // 3분
export const COOLDOWN_MS       = Number(process.env.COOLDOWN_MS)       || 1_800_000  // 30분
export const AI_TIMEOUT_MS     = 10_000  // AI 응답 타임아웃
export const AUTO_CLOSE_MS     = 10_000  // AI 응답 후 자동 닫힘
export const ACTIVE_WIN_POLL_MS = 5_000  // 활성 앱 폴링 주기

export const DEV_APP_BUNDLE_IDS = [
  'com.google.android.studio',
  'com.microsoft.VSCode',
  'com.apple.dt.Xcode',
  'com.jetbrains.intellij',
  'com.jetbrains.WebStorm',
  'com.sublimetext.4',
  'io.cursor.Cursor',
  'com.todesktop.230313mzl4w4u92',
  'com.jetbrains.goland',
  'com.jetbrains.pycharm',
]
