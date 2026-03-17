import { systemPreferences } from 'electron'
import { uIOhook } from 'uiohook-napi'
import { IDLE_THRESHOLD_MS } from '@shared/constants'

/**
 * 전역 키보드/마우스 이벤트를 감지하여 마지막 입력 시각을 추적한다.
 * 무입력이 IDLE_THRESHOLD_MS 이상 지속되면 onIdle 콜백을 실행한다.
 *
 * macOS Accessibility 권한이 필요하다.
 */
export class InputWatcher {
  private lastInputTime = Date.now()
  private pollInterval: NodeJS.Timeout | null = null
  private idleFired = false // 한 번의 idle 구간에서 중복 콜백 방지
  private readonly onIdle: () => void

  constructor(onIdle: () => void) {
    this.onIdle = onIdle
  }

  start(): void {
    this.checkAccessibilityPermission()
    this.registerHooks()
    this.startPolling()
  }

  stop(): void {
    try {
      uIOhook.stop()
    } catch {
      // 이미 중단된 경우 무시
    }
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }
  }

  /** TriggerEngine이 dismiss/resolve 후 타이머 리셋 시 호출 */
  reset(): void {
    this.lastInputTime = Date.now()
    this.idleFired = false
  }

  // ── private ────────────────────────────────────────────────────

  private checkAccessibilityPermission(): void {
    // isTrustedAccessibilityClient(true) → 권한 없으면 macOS 시스템 팝업 표시
    const trusted = systemPreferences.isTrustedAccessibilityClient(false)
    if (!trusted) {
      console.warn('[InputWatcher] Accessibility 권한이 없습니다. 시스템 환경설정에서 허용해주세요.')
      // 권한 요청 팝업 표시
      systemPreferences.isTrustedAccessibilityClient(true)
    }
  }

  private registerHooks(): void {
    const resetFn = (): void => {
      this.lastInputTime = Date.now()
      this.idleFired = false // 입력 재개 → 다음 idle 구간을 위해 플래그 리셋
    }

    uIOhook.on('keydown', resetFn)
    uIOhook.on('mousemove', resetFn)
    uIOhook.on('mousedown', resetFn)
    uIOhook.start()
  }

  private startPolling(): void {
    // 5초마다 무입력 시간을 체크
    this.pollInterval = setInterval(() => {
      const elapsed = Date.now() - this.lastInputTime
      if (elapsed >= IDLE_THRESHOLD_MS && !this.idleFired) {
        this.idleFired = true
        this.onIdle()
      }
    }, 5_000)
  }
}
