import React, { useEffect, useRef, useState } from 'react'
import { CharacterConfig, AppState } from '@shared/types'
import Character from './components/Character'
import SpeechBubble from './components/SpeechBubble'

export default function App(): React.JSX.Element {
  const [character, setCharacter] = useState<CharacterConfig | null>(null)
  const [appState, setAppState] = useState<AppState>('idle')
  const [aiText, setAiText] = useState<string>('')
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null)

  // Main process에서 캐릭터 config 수신
  useEffect(() => {
    const unsub = window.haetae.on('haetae:init', (config) => {
      setCharacter(config as CharacterConfig)
    })
    return unsub
  }, [])

  // 말풍선 트리거 수신 (Day 3에서 자동 트리거, 지금은 테스트용)
  useEffect(() => {
    const unsub = window.haetae.on('haetae:trigger', () => {
      setAppState('alert')
      window.haetae.send('haetae:set-interactive', true)
    })
    return unsub
  }, [])

  // AI 로딩 수신
  useEffect(() => {
    const unsub = window.haetae.on('haetae:loading', () => {
      setAppState('loading')
    })
    return unsub
  }, [])

  // AI 응답 수신
  useEffect(() => {
    const unsub = window.haetae.on('haetae:ai-result', (data) => {
      const { text } = data as { text: string }
      setAiText(text)
      setAppState('response')
      // 10초 후 자동 닫힘
      setTimeout(() => handleClose(), 10_000)
    })
    return unsub
  }, [])

  // AI 오류 수신
  useEffect(() => {
    const unsub = window.haetae.on('haetae:ai-error', () => {
      setAiText('지금은 도움을 드리기 어려워요. 잠시 후 다시 시도해보세요.')
      setAppState('response')
      setTimeout(() => handleClose(), 5_000)
    })
    return unsub
  }, [])

  function handleYes(): void {
    window.haetae.send('haetae:yes')
  }

  function handleNo(): void {
    window.haetae.send('haetae:no')
    handleClose()
  }

  function handleClose(): void {
    setAppState('idle')
    setAiText('')
    window.haetae.send('haetae:set-interactive', false)
  }

  // 드래그로 창 이동
  function handleMouseDown(e: React.MouseEvent): void {
    dragRef.current = {
      startX: e.screenX,
      startY: e.screenY,
      winX: window.screenX,
      winY: window.screenY,
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  function handleMouseMove(e: MouseEvent): void {
    if (!dragRef.current) return
    const dx = e.screenX - dragRef.current.startX
    const dy = e.screenY - dragRef.current.startY
    window.haetae.send('haetae:move-window', {
      x: dragRef.current.winX + dx,
      y: dragRef.current.winY + dy,
    })
  }

  function handleMouseUp(): void {
    dragRef.current = null
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }

  const showBubble = appState === 'alert' || appState === 'loading' || appState === 'response'

  return (
    <div className="app-container">
      {showBubble && character && (
        <SpeechBubble
          appState={appState}
          character={character}
          aiText={aiText}
          onYes={handleYes}
          onNo={handleNo}
          onClose={handleClose}
        />
      )}
      <div className="character-wrapper" onMouseDown={handleMouseDown}>
        <Character character={character} appState={appState} />
      </div>
    </div>
  )
}
