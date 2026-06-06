/** In-memory per-agent conversation history. Resets on page reload (Phase 1 mock only). */

export interface ChatMessage {
  id: string
  agentId: string
  campaignId?: string
  sender: 'user' | 'agent'
  text: string
  timestamp: string
  intent?: string
  mockActionResult?: string
}

const conversations: Record<string, ChatMessage[]> = {}

export function getConversation(agentId: string): ChatMessage[] {
  return conversations[agentId] ? [...conversations[agentId]] : []
}

export function addMessage(msg: ChatMessage): void {
  if (!conversations[msg.agentId]) conversations[msg.agentId] = []
  conversations[msg.agentId].push(msg)
}

export function clearConversation(agentId: string): void {
  conversations[agentId] = []
}

export function makeTimestamp(): string {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

export function createMessage(
  agentId: string,
  sender: 'user' | 'agent',
  text: string,
  extras?: { campaignId?: string; intent?: string; mockActionResult?: string },
): ChatMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    agentId,
    sender,
    text,
    timestamp: makeTimestamp(),
    ...extras,
  }
}
