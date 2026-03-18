import { ipcMain, clipboard, BrowserWindow } from 'electron'
import { CharacterConfig } from '@shared/types'
import { TriggerEngine } from './TriggerEngine'
import { ClaudeService } from './ClaudeService'

let claudeService: ClaudeService | null = null

function getClaudeService(): ClaudeService {
  if (!claudeService) claudeService = new ClaudeService()
  return claudeService
}

export function setupIpcHandlers(
  win: BrowserWindow,
  getEngine: () => TriggerEngine | null,
  getCharacter: () => CharacterConfig | null,
): void {
  // [예] 버튼 클릭 → Claude AI에 질문
  ipcMain.on('haetae:yes', async () => {
    win.webContents.send('haetae:loading')

    const clipboardText = clipboard.readText().slice(0, 500)
    const engine = getEngine()
    const character = getCharacter()
    const activeApp = engine?.getActiveAppName() ?? ''
    const aiTone = character?.aiTone ?? ''

    console.log(`[ipc] haetae:yes — 캐릭터: ${character?.name}, 앱: "${activeApp}", 클립보드: ${clipboardText.length}자`)

    try {
      const text = await getClaudeService().ask({ activeApp, clipboardText, aiTone })
      win.webContents.send('haetae:ai-result', { text })
      engine?.resolve()
    } catch (err) {
      console.error('[ipc] Claude API 오류:', err)
      win.webContents.send('haetae:ai-error')
      engine?.dismiss()
    }
  })

  // [아니오] 버튼 클릭 → cooldown 시작
  ipcMain.on('haetae:no', () => {
    getEngine()?.dismiss()
  })
}
