import { ipcMain, clipboard, BrowserWindow } from 'electron'
import { CharacterConfig } from '@shared/types'
import { TriggerEngine } from './TriggerEngine'
import { OpenAIService } from './OpenAIService'

let openAIService: OpenAIService | null = null

function getOpenAIService(): OpenAIService {
  if (!openAIService) openAIService = new OpenAIService()
  return openAIService
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
      const text = await getOpenAIService().ask({ activeApp, clipboardText, aiTone })
      win.webContents.send('haetae:ai-result', { text })
      engine?.resolve()
    } catch (err) {
      console.error('[ipc] OpenAI API 오류:', err)
      win.webContents.send('haetae:ai-error')
      engine?.dismiss()
    }
  })

  // [아니오] 버튼 클릭 → cooldown 시작
  ipcMain.on('haetae:no', () => {
    getEngine()?.dismiss()
  })
}
