import { ipcMain, clipboard, BrowserWindow } from 'electron'
import { TriggerEngine } from './TriggerEngine'
// Day 5에서 ClaudeService import 추가 예정

export function setupIpcHandlers(win: BrowserWindow, engine: TriggerEngine): void {
  // [예] 버튼 클릭 → AI 요청 (Day 5에서 ClaudeService로 교체)
  ipcMain.on('haetae:yes', async () => {
    win.webContents.send('haetae:loading')

    // 클립보드 텍스트 미리 읽기 (Day 5에서 ClaudeService에 전달)
    const clipText = clipboard.readText().slice(0, 500)
    console.log(`[ipc] haetae:yes — 클립보드(${clipText.length}자) 수집 완료`)

    // TODO(Day 5): ClaudeService 연동
    // 임시: 2초 후 더미 응답
    setTimeout(() => {
      win.webContents.send('haetae:ai-result', {
        text: '잠깐 쉬어가자. 문제를 다른 각도로 생각해봐. 🐾',
      })
      engine.resolve() // cooldown 시작
    }, 2_000)
  })

  // [아니오] 버튼 클릭 → cooldown 시작
  ipcMain.on('haetae:no', () => {
    engine.dismiss()
  })
}
