import { join } from 'path'
import { readFileSync } from 'fs'
import { CharacterConfig, CharacterId } from '@shared/types'

const CHARACTER_IDS: CharacterId[] = ['calm', 'playful', 'smart']

const FALLBACK_CONFIG: CharacterConfig = {
  id: 'calm',
  name: '차분한 해태',
  idleAsset: '',
  reactionAsset: '',
  triggerMessage: '잠깐 막힌 것 같아. 도와줄까?',
  yesLabel: '도와줘',
  noLabel: '괜찮아',
  bubbleStyle: {
    backgroundColor: '#F0F4FF',
    borderColor: '#A0B4E8',
    borderRadius: '16px',
    fontFamily: 'sans-serif',
  },
  aiTone: '차분하고 친절하게 답변하세요.',
}

export function loadCharacterConfig(): CharacterConfig {
  const id = CHARACTER_IDS[Math.floor(Math.random() * CHARACTER_IDS.length)]
  const configPath = join(__dirname, `../../assets/characters/${id}/config.json`)

  try {
    const raw = readFileSync(configPath, 'utf-8')
    return JSON.parse(raw) as CharacterConfig
  } catch (err) {
    console.error(`[characterLoader] config 로드 실패 (${configPath}):`, err)
    return { ...FALLBACK_CONFIG, id }
  }
}
