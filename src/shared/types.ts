export type CharacterId = 'calm' | 'playful' | 'smart'

export interface BubbleStyle {
  backgroundColor: string
  borderColor: string
  borderRadius: string
  fontFamily: 'sans-serif' | 'monospace'
}

export interface CharacterConfig {
  id: CharacterId
  name: string
  idleAsset: string       // 예: 'characters/calm/idle.webp'
  reactionAsset: string   // 예: 'characters/calm/reaction.webp'
  triggerMessage: string
  yesLabel: string
  noLabel: string
  bubbleStyle: BubbleStyle
}

// IPC 채널 이름 타입
export type MainToRendererChannel =
  | 'haetae:init'       // 앱 시작 시 캐릭터 config 전달
  | 'haetae:trigger'    // 말풍선 표시 요청
  | 'haetae:loading'    // AI 로딩 중
  | 'haetae:ai-result'  // AI 응답 전달
  | 'haetae:ai-error'   // AI 오류

export type RendererToMainChannel =
  | 'haetae:yes'        // 사용자 [예] 클릭
  | 'haetae:no'         // 사용자 [아니오] 클릭
  | 'haetae:drag-start' // 드래그 시작
  | 'haetae:drag'       // 드래그 중 (x, y)
  | 'haetae:drag-end'   // 드래그 종료

export type AppState = 'idle' | 'alert' | 'loading' | 'response' | 'cooldown'
