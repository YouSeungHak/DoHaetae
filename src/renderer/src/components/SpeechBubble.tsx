import React from 'react'
import { CharacterConfig, AppState } from '@shared/types'

interface Props {
  appState: AppState
  character: CharacterConfig
  aiText: string
  exiting: boolean
  onYes: () => void
  onNo: () => void
  onClose: () => void
}

export default function SpeechBubble({
  appState,
  character,
  aiText,
  exiting,
  onYes,
  onNo,
  onClose,
}: Props): React.JSX.Element {
  const { bubbleStyle } = character

  const bubbleCss: React.CSSProperties = {
    backgroundColor: bubbleStyle.backgroundColor,
    borderColor: bubbleStyle.borderColor,
    borderRadius: bubbleStyle.borderRadius,
    fontFamily: bubbleStyle.fontFamily,
  }

  // 말풍선 꼬리 색상 (after 가상 요소는 inline style로 못하므로 CSS 변수 활용)
  const tailStyle = {
    '--tail-color': bubbleStyle.backgroundColor,
    '--tail-border-color': bubbleStyle.borderColor,
  } as React.CSSProperties

  return (
    <div
      className={`speech-bubble${exiting ? ' bubble-exit' : ''}`}
      style={{ ...bubbleCss, ...tailStyle }}
    >
      {/* alert 상태: "도와줄까?" + 버튼 */}
      {appState === 'alert' && (
        <>
          <div className="bubble-message">{character.triggerMessage}</div>
          <div className="bubble-buttons">
            <button
              className="btn btn-yes"
              style={{ backgroundColor: bubbleStyle.borderColor }}
              onClick={onYes}
            >
              {character.yesLabel}
            </button>
            <button className="btn btn-no" onClick={onNo}>
              {character.noLabel}
            </button>
          </div>
        </>
      )}

      {/* loading 상태: 로딩 점 */}
      {appState === 'loading' && (
        <>
          <div className="bubble-message" style={{ fontSize: 12, color: '#888' }}>
            생각 중이야...
          </div>
          <div className="bubble-loading">
            <span />
            <span />
            <span />
          </div>
        </>
      )}

      {/* response 상태: AI 응답 */}
      {(appState === 'response' || exiting) && aiText && (
        <>
          <div className="bubble-message bubble-response-text">{aiText}</div>
          <button className="btn-close" onClick={onClose}>
            닫기
          </button>
        </>
      )}
    </div>
  )
}
