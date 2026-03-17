import { app, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { WINDOW_WIDTH, WINDOW_HEIGHT, WINDOW_MARGIN } from '@shared/constants'
import { CharacterConfig, RendererToMainChannel } from '@shared/types'
import { loadCharacterConfig } from './characterLoader'
import { setupIpcHandlers } from './ipc'
import { InputWatcher } from './InputWatcher'
import { AppWatcher } from './AppWatcher'
import { TriggerEngine } from './TriggerEngine'

let mainWindow:    BrowserWindow   | null = null
let selectedChar:  CharacterConfig | null = null
let inputWatcher:  InputWatcher    | null = null
let appWatcher:    AppWatcher      | null = null
let triggerEngine: TriggerEngine   | null = null

// ── 창 생성 ──────────────────────────────────────────────────────

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
    focusable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: join(__dirname, '../preload/index.js'),
    },
  })

  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false })
  mainWindow.setAlwaysOnTop(true, 'floating')
  mainWindow.setIgnoreMouseEvents(true, { forward: true })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.webContents.on('did-finish-load', () => {
    if (selectedChar) mainWindow!.webContents.send('haetae:init', selectedChar)
  })
}

// ── 감지 시스템 초기화 ────────────────────────────────────────────

function startWatchers(): void {
  if (!mainWindow) return

  appWatcher   = new AppWatcher()
  inputWatcher = new InputWatcher(() => triggerEngine?.checkAndTrigger())
  triggerEngine = new TriggerEngine(mainWindow, appWatcher, inputWatcher)

  appWatcher.start()
  inputWatcher.start()

  console.log('[Haetae] 감지 시스템 시작 — 무입력 감지 + 활성 앱 폴링 중')
}

function stopWatchers(): void {
  inputWatcher?.stop()
  appWatcher?.stop()
}

// ── Electron 앱 생명주기 ──────────────────────────────────────────

app.whenReady().then(() => {
  selectedChar = loadCharacterConfig()
  console.log(`[Haetae] 오늘의 해태: ${selectedChar.name}`)

  createWindow()
  setupIpcHandlers(mainWindow!, triggerEngine!)
  startWatchers()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  stopWatchers()
  if (process.platform !== 'darwin') app.quit()
})

// ── IPC: 창 제어 ──────────────────────────────────────────────────

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

ipcMain.on('haetae:move-window' as RendererToMainChannel, (_, { x, y }: { x: number; y: number }) => {
  mainWindow?.setPosition(x, y)
})
