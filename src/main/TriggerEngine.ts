import { BrowserWindow } from 'electron'
import { COOLDOWN_MS } from '@shared/constants'
import { AppWatcher } from './AppWatcher'
import { InputWatcher } from './InputWatcher'

/**
 * InputWatcher + AppWatcher 결과를 조합하여 말풍선 트리거를 관리한다.
 *
 * 트리거 조건: 무입력 N분 + 개발 도구 활성 + cooldown 아님 + 미트리거 상태
 * dismiss()  : [아니오] 클릭 → cooldown 시작
 * resolve()  : [예] → AI 응답 완료 → cooldown 시작
 */
export class TriggerEngine {
  private cooldownUntil = 0
  private isTriggered   = false

  private readonly win:          BrowserWindow
  private readonly appWatcher:   AppWatcher
  private readonly inputWatcher: InputWatcher

  constructor(
    win:          BrowserWindow,
    appWatcher:   AppWatcher,
    inputWatcher: InputWatcher,
  ) {
    this.win          = win
    this.appWatcher   = appWatcher
    this.inputWatcher = inputWatcher
  }

  /**
   * InputWatcher의 onIdle 콜백에서 호출된다.
   * 모든 조건을 확인한 뒤 말풍선 트리거 IPC를 발송한다.
   */
  checkAndTrigger(): void {
    if (this.isInCooldown()) {
      console.log('[TriggerEngine] cooldown 중 — 스킵')
      return
    }
    if (this.isTriggered) {
      console.log('[TriggerEngine] 이미 말풍선 표시 중 — 스킵')
      return
    }
    if (!this.appWatcher.isDevToolActive()) {
      console.log(`[TriggerEngine] 개발 도구 미감지 (${this.appWatcher.getCurrentAppName()}) — 스킵`)
      return
    }

    console.log(`[TriggerEngine] 🐾 트리거! 앱: ${this.appWatcher.getCurrentAppName()}`)
    this.isTriggered = true
    this.win.webContents.send('haetae:trigger')
  }

  /** [아니오] 클릭 시 호출 */
  dismiss(): void {
    this.isTriggered = false
    this.cooldownUntil = Date.now() + COOLDOWN_MS
    this.inputWatcher.reset()
    console.log(`[TriggerEngine] dismiss — cooldown ${COOLDOWN_MS / 60_000}분 시작`)
  }

  /** AI 응답 완료 후 호출 */
  resolve(): void {
    this.isTriggered = false
    this.cooldownUntil = Date.now() + COOLDOWN_MS
    this.inputWatcher.reset()
    console.log(`[TriggerEngine] resolve — cooldown ${COOLDOWN_MS / 60_000}분 시작`)
  }

  isInCooldown(): boolean {
    return Date.now() < this.cooldownUntil
  }
}
