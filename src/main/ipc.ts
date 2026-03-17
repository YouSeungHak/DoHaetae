import { ipcMain, clipboard, BrowserWindow } from 'electron'
import { CharacterConfig } from '@shared/types'
// Day 5에서 ClaudeService import 추가 예정

export function setupIpcHandlers(win: BrowserWindow, character: CharacterConfig): void {
  // [예] 버튼 클릭 → AI 요청 (Day 5에서 구현)
  ipcMain.on('haetae:yes', async () => {
    win.webContents.send('haetae:loading')

    // TODO(Day 5): ClaudeService 연동
    // 임시: 3초 후 더미 응답
    setTimeout(() => {
      win.webContents.send('haetae:ai-result', {
        text: '잠깐 쉬어가자. 문제를 다른 각도로 생각해봐. 🐾',
      })
    }, 2000)
  })

  // [아니오] 버튼 클릭
  ipcMain.on('haetae:no', () => {
    // cooldown은 renderer 측 TriggerEngine이 관리 (Day 3에서 구현)
    console.log('[Haetae] 사용자가 도움을 거절했습니다. 30분 cooldown 시작')
  })
}
