import Anthropic from '@anthropic-ai/sdk'
import { AI_TIMEOUT_MS } from '@shared/constants'

interface AskOptions {
  activeApp: string       // 현재 활성 앱 이름 (e.g. "Visual Studio Code")
  clipboardText: string   // 클립보드 텍스트 (최대 500자)
  aiTone: string          // 캐릭터별 AI 말투 지시사항
}

const BASE_SYSTEM_PROMPT = `당신은 개발자의 책상 위에 사는 귀여운 해태 캐릭터입니다.
개발자가 3분 이상 키보드를 누르지 않아 막힌 것 같을 때 나타나 도움을 줍니다.

기본 규칙:
- 3-4문장 이내로 짧게 답변하세요.
- 클립보드 내용이 있으면 그것을 힌트로 구체적인 조언을 해주세요.
- 클립보드 내용이 없으면 잠깐 쉬거나 접근 방식을 바꿔보라고 격려하세요.
- 이모지는 1개 이하로 사용하세요.`

export class ClaudeService {
  private client: Anthropic

  constructor() {
    const apiKey = process.env['ANTHROPIC_API_KEY']
    if (!apiKey) {
      throw new Error('[ClaudeService] ANTHROPIC_API_KEY 환경 변수가 설정되지 않았습니다.')
    }
    this.client = new Anthropic({ apiKey })
  }

  async ask({ activeApp, clipboardText, aiTone }: AskOptions): Promise<string> {
    const systemPrompt = `${BASE_SYSTEM_PROMPT}\n\n말투 지침: ${aiTone}`

    const contextParts: string[] = []
    if (activeApp) contextParts.push(`현재 사용 중인 앱: ${activeApp}`)
    if (clipboardText.trim()) {
      contextParts.push(`클립보드에 복사된 내용:\n"""\n${clipboardText}\n"""`)
    }

    const userMessage = contextParts.length > 0
      ? contextParts.join('\n\n')
      : '개발자가 잠시 멈춰 있어요. 격려의 말을 해주세요.'

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS)

    try {
      const response = await this.client.messages.create(
        {
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 300,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
        },
        { signal: controller.signal }
      )

      const block = response.content[0]
      if (block.type !== 'text') throw new Error('예상하지 못한 응답 형식')
      return block.text
    } finally {
      clearTimeout(timer)
    }
  }
}
