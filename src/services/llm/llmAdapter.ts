/**
 * LLM Adapter Interface — Phase 1 mock only.
 *
 * IMPORTANT: Real LLM calls must go through a backend / n8n webhook /
 * serverless function. NEVER put API keys in the frontend bundle.
 *
 * Phase 2 integration path:
 *   AgentCommandPanel → agentContextBuilder → agentBrainService
 *   → backend/serverless endpoint (OpenAI / Claude / Gemini)
 *   → human approval gate → sheet/workflow sync
 *
 * Claude Code and Codex are development tools, NOT runtime business agents.
 * The 6 production agents (product-research, offer-analyst, etc.) run through
 * this adapter — not through Claude Code sessions.
 */

import type { DepartmentId } from '../../agents/agentRegistry'
import type { AgentContext } from '../agentContextBuilder'
import { getMockResponse } from '../../agents/agentChatRouter'

export interface AgentBrainInput {
  agentId:     DepartmentId
  userMessage: string
  context:     AgentContext
}

export interface AgentBrainOutput {
  text:       string
  intent:     string
  confidence: number
}

export interface LLMAdapter {
  generateAgentResponse(input: AgentBrainInput): Promise<AgentBrainOutput>
}

/** Phase 1: delegates to the rule-based mock response engine. */
export class MockLLMAdapter implements LLMAdapter {
  async generateAgentResponse(input: AgentBrainInput): Promise<AgentBrainOutput> {
    const { text, intent } = getMockResponse(
      input.agentId,
      input.userMessage,
      input.context.campaign?.id,
    )
    return { text, intent, confidence: 1.0 }
  }
}

/** Phase 2 placeholder — backend call required, never call from browser. */
export class OpenAIAdapter implements LLMAdapter {
  async generateAgentResponse(_input: AgentBrainInput): Promise<AgentBrainOutput> {
    throw new Error('OpenAIAdapter: not yet implemented. Route through backend/serverless only.')
  }
}

/** Phase 2 placeholder — backend call required, never call from browser. */
export class ClaudeAdapter implements LLMAdapter {
  async generateAgentResponse(_input: AgentBrainInput): Promise<AgentBrainOutput> {
    throw new Error('ClaudeAdapter: not yet implemented. Route through backend/serverless only.')
  }
}

/** Phase 2 placeholder — backend call required, never call from browser. */
export class GeminiAdapter implements LLMAdapter {
  async generateAgentResponse(_input: AgentBrainInput): Promise<AgentBrainOutput> {
    throw new Error('GeminiAdapter: not yet implemented. Route through backend/serverless only.')
  }
}
