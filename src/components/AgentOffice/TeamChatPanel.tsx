import type { TeamChatMessage } from '../../agents/agentSessionStore'

interface Props {
  messages: TeamChatMessage[]
}

export default function TeamChatPanel({ messages }: Props) {
  const visible = messages.slice(-20)

  return (
    <div style={{ background: '#080c18', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '6px 12px 5px', borderBottom: '1px solid #1a2540', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: '#2a3560', letterSpacing: 2 }}>
          ▶ TEAM CHAT
        </div>
        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#1a2540' }}>
          6 agents online
        </span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {visible.map(msg => (
          <div key={msg.id} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#1a2540', flexShrink: 0, marginTop: 1 }}>
              {msg.timestamp}
            </span>
            <span style={{
              fontFamily: 'VT323, monospace', fontSize: 12, color: msg.accent,
              background: `${msg.accent}12`, padding: '0px 5px',
              flexShrink: 0, letterSpacing: 0.5, whiteSpace: 'nowrap',
            }}>
              {msg.senderName}
            </span>
            <span style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 12, color: '#8892b0', lineHeight: 1.4 }}>
              {msg.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
