import { app, BrowserWindow, ipcMain, screen, clipboard } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { WINDOW_WIDTH, WINDOW_HEIGHT, WINDOW_MARGIN } from '@shared/constants'
import { CharacterConfig, RendererToMainChannel } from '@shared/types'
import { loadCharacterConfig } from './characterLoader'
import { setupIpcHandlers } from './ipc'

let mainWindow: BrowserWindow | null = null
let selectedCharacter: CharacterConfig | null = null

function createWindow(): void {
  const { width: screenW, height: screenH } = screen.getPrimaryDisplay().workAreaSize

  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    x: screenW - WINDOW_WIDTH - WINDOW_MARGIN,
    y: screenH - WINDOW_HEIGHT - WINDOW_MARGIN,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    focusable: false,          // idle 상태에서 포커스 받지 않음
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: join(__dirname, '../preload/index.js'),
    },
  })

  // macOS: 모든 Spaces(가상 데스크톱)에 표시
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false })

  // 최상위 레벨 설정 (macOS: floating 레벨)
  mainWindow.setAlwaysOnTop(true, 'floating')

  // idle 상태: 마우스 클릭 통과
  mainWindow.setIgnoreMouseEvents(true, { forward: true })

  // 렌더러 로드
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // 로드 완료 후 캐릭터 config 전달
  mainWindow.webContents.on('did-finish-load', () => {
    if (selectedCharacter) {
      mainWindow!.webContents.send('haetae:init', selectedCharacter)
    }
  })
}

app.whenReady().then(() => {
  // 앱 시작 시 캐릭터 랜덤 선택
  selectedCharacter = loadCharacterConfig()

  createWindow()

  // IPC 핸들러 등록
  setupIpcHandlers(mainWindow!, selectedCharacter)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// 말풍선 표시/숨김 시 ignoreMouseEvents 토글
ipcMain.on('haetae:set-interactive' as RendererToMainChannel, (_, interactive: boolean) => {
  if (!mainWindow) return
  if (interactive) {
    mainWindow.setFocusable(true)
    mainWindow.setIgnoreMouseEvents(false)
  } else {
    mainWindow.setFocusable(false)
    mainWindow.setIgnoreMouseEvents(true, { forward: true })
  }
})

// 드래그로 창 이동
ipcMain.on('haetae:move-window' as RendererToMainChannel, (_, { x, y }: { x: number; y: number }) => {
  mainWindow?.setPosition(x, y)
})
