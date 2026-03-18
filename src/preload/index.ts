import { contextBridge, ipcRenderer } from 'electron'
import { MainToRendererChannel, RendererToMainChannel } from '@shared/types'

// Renderer에서 사용할 안전한 API만 노출
contextBridge.exposeInMainWorld('haetae', {
  // Main → Renderer 이벤트 수신
  on: (channel: MainToRendererChannel, callback: (...args: unknown[]) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, ...args: unknown[]): void => callback(...args)
    ipcRenderer.on(channel, listener)
    return () => ipcRenderer.removeListener(channel, listener)
  },

  // Renderer → Main 이벤트 전송
  send: (channel: RendererToMainChannel, ...args: unknown[]) => {
    ipcRenderer.send(channel, ...args)
  },
})

// TypeScript용 타입 선언 (renderer에서 window.haetae 타입 인식)
declare global {
  interface Window {
    haetae: {
      on: (channel: MainToRendererChannel, callback: (...args: unknown[]) => void) => () => void
      send: (channel: RendererToMainChannel, ...args: unknown[]) => void
    }
  }
}
