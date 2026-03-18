import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CharacterConfig, AppState } from '@shared/types'
import Character from './components/Character'
import SpeechBubble from './components/SpeechBubble'

export default function App(): React.JSX.Element {
  const [character, setCharacter] = useState<CharacterConfig | null>(null)
  const [appState, setAppState] = useState<AppState>('idle')
  const [aiText, setAiText] = useState<string>('')
  const [isClosing, setIsClosing] = useState(false)

  // ref로 최신 isClosing 값 추적 → stale closure 방지
  const isClosingRef = useRef(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 드래그 핸들러 — 렌더 간 동일 함수 참조 유지
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null)
  const handleMouseMoveRef = useRef<(e: MouseEvent) => void>()
  const handleMouseUpRef   = useRef<() => void>()

  // ── IPC 수신 ──────────────────────────────────────────────────

  useEffect(() => {
    const unsub = window.haetae.on('haetae:init', (config) => {
      setCharacter(config as CharacterConfig)
    })
    return unsub
  }, [])

  useEffect(() => {
    const unsub = window.haetae.on('haetae:trigger', () => {
      setAppState('alert')
      window.haetae.send('haetae:set-interactive', true)
    })
    return unsub
  }, [])

  useEffect(() => {
    const unsub = window.haetae.on('haetae:loading', () => {
      setAppState('loading')
    })
    return unsub
  }, [])

  useEffect(() => {
    const unsub = window.haetae.on('haetae:ai-result', (data) => {
      const { text } = data as { text: string }
      setAiText(text)
      setAppState('response')
      // ref를 통해 항상 최신 handleClose 호출
      closeTimerRef.current = setTimeout(() => handleCloseRef.current?.(), 10_000)
    })
    return unsub
  }, [])

  useEffect(() => {
    const unsub = window.haetae.on('haetae:ai-error', () => {
      setAiText('지금은 도움을 드리기 어려워요. 잠시 후 다시 시도해보세요.')
      setAppState('response')
      closeTimerRef.current = setTimeout(() => handleCloseRef.current?.(), 5_000)
    })
    return unsub
  }, [])

  // ── 핸들러 ────────────────────────────────────────────────────

  const handleClose = useCallback((): void => {
    if (isClosingRef.current) return
    isClosingRef.current = true
    setIsClosing(true)
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => {
      setAppState('idle')
      setAiText('')
      isClosingRef.current = false
      setIsClosing(false)
      window.haetae.send('haetae:set-interactive', false)
    }, 220)
  }, [])

  // handleClose의 최신 참조를 ref에 저장
  const handleCloseRef = useRef(handleClose)
  useEffect(() => { handleCloseRef.current = handleClose }, [handleClose])

  function handleYes(): void {
    window.haetae.send('haetae:yes')
  }

  function handleNo(): void {
    window.haetae.send('haetae:no')
    handleClose()
  }

  // ── 드래그 (ref 기반으로 stale 참조 방지) ─────────────────────

  handleMouseMoveRef.current = (e: MouseEvent): void => {
    if (!dragRef.current) return
    const dx = e.screenX - dragRef.current.startX
    const dy = e.screenY - dragRef.current.startY
    window.haetae.send('haetae:move-window', {
      x: dragRef.current.winX + dx,
      y: dragRef.current.winY + dy,
    })
  }

  handleMouseUpRef.current = (): void => {
    dragRef.current = null
    if (handleMouseMoveRef.current) window.removeEventListener('mousemove', handleMouseMoveRef.current)
    if (handleMouseUpRef.current)   window.removeEventListener('mouseup',   handleMouseUpRef.current)
  }

  function handleMouseDown(e: React.MouseEvent): void {
    // 말풍선 버튼 영역에서 드래그 시작 방지
    if ((e.target as HTMLElement).closest('.speech-bubble')) return
    dragRef.current = {
      startX: e.screenX,
      startY: e.screenY,
      winX: window.screenX,
      winY: window.screenY,
    }
    if (handleMouseMoveRef.current) window.addEventListener('mousemove', handleMouseMoveRef.current)
    if (handleMouseUpRef.current)   window.addEventListener('mouseup',   handleMouseUpRef.current)
  }

  const showBubble = appState === 'alert' || appState === 'loading' || appState === 'response' || isClosing

  return (
    <div className="app-container" onMouseDown={handleMouseDown}>
      {showBubble && character && (
        <SpeechBubble
          appState={appState}
          character={character}
          aiText={aiText}
          exiting={isClosing}
          onYes={handleYes}
          onNo={handleNo}
          onClose={handleClose}
        />
      )}
      <div className="character-wrapper">
        <Character character={character} appState={appState} />
      </div>
    </div>
  )
}
