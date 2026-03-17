import { join } from 'path'
import { readFileSync } from 'fs'
import { CharacterConfig, CharacterId } from '@shared/types'

const CHARACTER_IDS: CharacterId[] = ['calm', 'playful', 'smart']

export function loadCharacterConfig(): CharacterConfig {
  // 랜덤 캐릭터 선택
  const id = CHARACTER_IDS[Math.floor(Math.random() * CHARACTER_IDS.length)]

  const configPath = join(__dirname, `../../assets/characters/${id}/config.json`)
  const raw = readFileSync(configPath, 'utf-8')
  return JSON.parse(raw) as CharacterConfig
}
