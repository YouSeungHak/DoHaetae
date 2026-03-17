import React, { useEffect, useState } from 'react'
import { CharacterConfig, AppState, CharacterId } from '@shared/types'
import CalmHaetae from './characters/CalmHaetae'
import PlayfulHaetae from './characters/PlayfulHaetae'
import SmartHaetae from './characters/SmartHaetae'

interface Props {
  character: CharacterConfig | null
  appState: AppState
}

const CHARACTER_COMPONENTS: Record<CharacterId, React.ComponentType> = {
  calm:    CalmHaetae,
  playful: PlayfulHaetae,
  smart:   SmartHaetae,
}

function getIdleClass(id: CharacterId): string {
  return `char-idle-${id}`
}

export default function Character({ character, appState }: Props): React.JSX.Element {
  const [animClass, setAnimClass] = useState<string>('')

  // appState가 바뀔 때 애니메이션 클래스 전환
  useEffect(() => {
    if (!character) return

    if (appState === 'alert') {
      setAnimClass('char-react')
    } else if (appState === 'loading') {
      setAnimClass('char-think')
    } else {
      setAnimClass(getIdleClass(character.id))
    }
  }, [appState, character])

  // character 로드되면 idle 시작
  useEffect(() => {
    if (character) setAnimClass(getIdleClass(character.id))
  }, [character])

  // react 애니메이션 종료 후 idle로 복귀
  function handleAnimationEnd(): void {
    if (animClass === 'char-react' && character) {
      setAnimClass(getIdleClass(character.id))
    }
  }

  if (!character) {
    // 로딩 중 placeholder (캐릭터 config 수신 전)
    return (
      <div className="character-loading">
        <span>🐾</span>
      </div>
    )
  }

  const HaetaeComponent = CHARACTER_COMPONENTS[character.id]

  return (
    <div
      className={`character-svg-wrapper ${animClass}`}
      onAnimationEnd={handleAnimationEnd}
      title={character.name}
    >
      <HaetaeComponent />
    </div>
  )
}
