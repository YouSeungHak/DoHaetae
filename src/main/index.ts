import { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage } from 'electron'
import { join } from 'path'
import { readFileSync } from 'fs'

// .env 파일 수동 로드 (dotenv 없이) — ANTHROPIC_API_KEY 등
try {
  const envContent = readFileSync(join(process.cwd(), '.env'), 'utf-8')
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^#\s][^=]*)=(.*)$/)
    if (match) process.env[match[1].trim()] ??= match[2].trim()
  }
} catch { /* .env 없으면 무시 */ }

import { is } from '@electron-toolkit/utils'
import { WINDOW_WIDTH, WINDOW_HEIGHT, WINDOW_MARGIN } from '@shared/constants'
import { CharacterConfig, RendererToMainChannel } from '@shared/types'
import { loadCharacterConfig } from './characterLoader'
import { setupIpcHandlers } from './ipc'
import { InputWatcher } from './InputWatcher'
import { AppWatcher } from './AppWatcher'
import { TriggerEngine } from './TriggerEngine'

let mainWindow:    BrowserWindow   | null = null
let tray:          Tray            | null = null
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

// 16×16 흰색 발바닥 모양 트레이 아이콘 (base64 PNG, macOS Template 대응)
const TRAY_ICON_B64 =
  'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAL' +
  'EwAACxMBAJqcGAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABVSURBVDiNY2Ag' +
  'GvxHJf6PQpwCAABjGAAGAAB//wEAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABK8gX5AAAAAElFTkSuQmCC'

// ── 트레이 아이콘 ────────────────────────────────────────────────

function createTray(): void {
  // assets/tray-icon.png 있으면 사용, 없으면 내장 아이콘 사용
  const trayIconPath = join(__dirname, '../../assets/tray-icon.png')
  let icon = nativeImage.createFromPath(trayIconPath)
  if (icon.isEmpty()) {
    icon = nativeImage.createFromDataURL(`data:image/png;base64,${TRAY_ICON_B64}`)
  }

  tray = new Tray(icon)
  tray.setToolTip(`도해태 — ${selectedChar?.name ?? '해태'}`)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: `오늘의 해태: ${selectedChar?.name ?? '해태'}`,
      enabled: false,
    },
    { type: 'separator' },
    {
      label: '도해태 보이기',
      click: () => mainWindow?.show(),
    },
    {
      label: '종료',
      click: () => app.quit(),
    },
  ])
  tray.setContextMenu(contextMenu)
}

// ── 감지 시스템 초기화 ────────────────────────────────────────────

function startWatchers(): void {
  if (!mainWindow) return

  appWatcher    = new AppWatcher()
  inputWatcher  = new InputWatcher(() => triggerEngine?.checkAndTrigger())
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
  console.log(`[Haetae] 오늘의 해태: ${selectedChar.name} (${selectedChar.id})`)

  createWindow()
  createTray()
  setupIpcHandlers(mainWindow!, () => triggerEngine, () => selectedChar)
  startWatchers()

})

app.on('window-all-closed', () => {
  stopWatchers()
  tray?.destroy()
  if (process.platform !== 'darwin') app.quit()
})

// macOS: Dock 아이콘 클릭 시 창 복구 (창이 없으면 새로 생성)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  } else {
    mainWindow?.show()
  }
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
