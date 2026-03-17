import { DEV_APP_BUNDLE_IDS, ACTIVE_WIN_POLL_MS } from '@shared/constants'

// active-win v8+ is ESM-only → dynamic import 필요
type ActiveWinFn = () => Promise<{ owner: { bundleId?: string; name?: string } } | undefined>
let _activeWin: ActiveWinFn | null = null

async function getActiveWin(): Promise<ActiveWinFn> {
  if (!_activeWin) {
    const mod = await import('active-win')
    _activeWin = (mod.default ?? mod) as unknown as ActiveWinFn
  }
  return _activeWin
}

/**
 * 현재 포커스된 앱의 bundleId를 주기적으로 확인한다.
 * isDevToolActive()로 개발 도구 여부를 동기적으로 조회할 수 있다.
 */
export class AppWatcher {
  private currentBundleId: string | null = null
  private currentAppName: string | null = null
  private pollInterval: NodeJS.Timeout | null = null

  start(): void {
    this.poll() // 즉시 첫 폴링
    this.pollInterval = setInterval(() => this.poll(), ACTIVE_WIN_POLL_MS)
  }

  stop(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }
  }

  /** 현재 활성 앱이 개발 도구인지 여부 */
  isDevToolActive(): boolean {
    if (!this.currentBundleId) return false
    return DEV_APP_BUNDLE_IDS.some((id) => this.currentBundleId!.startsWith(id))
  }

  /** AI 프롬프트에 포함할 앱 이름 반환 */
  getCurrentAppName(): string {
    return this.currentAppName ?? '알 수 없는 앱'
  }

  getCurrentBundleId(): string | null {
    return this.currentBundleId
  }

  // ── private ────────────────────────────────────────────────────

  private async poll(): Promise<void> {
    try {
      const fn = await getActiveWin()
      const win = await fn()
      this.currentBundleId = win?.owner?.bundleId ?? null
      this.currentAppName  = win?.owner?.name      ?? null
    } catch {
      // 권한 부족 또는 폴링 실패 시 현재 값 유지
    }
  }
}
