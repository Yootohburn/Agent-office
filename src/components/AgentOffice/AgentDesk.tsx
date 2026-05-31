// Legacy component — kept for reference. Replaced by AgentDetailPanel in the main layout.
import type { Agent } from '../../agents/agentRegistry'
import styles from './AgentDesk.module.css'

interface Props {
  agent: Agent
}

export default function AgentDesk({ agent }: Props) {
  return (
    <div style={{ fontFamily: 'Share Tech Mono, monospace' }}>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 22, color: '#00ff9f', borderBottom: '1px solid #1a2540', paddingBottom: 8, marginBottom: 14, letterSpacing: 1 }}>
        ▶ {agent.name.toUpperCase()}
      </div>

      <div style={{ fontSize: 11, color: '#8892b0', marginBottom: 12 }}>{agent.role}</div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: '#4a5680', letterSpacing: 1, marginBottom: 4 }}>CURRENT TASK</div>
        <p style={{ margin: 0, fontSize: 11, color: '#8892b0', lineHeight: 1.5 }}>{agent.currentTask}</p>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: '#4a5680', letterSpacing: 1, marginBottom: 4 }}>RECENT OUTPUT</div>
        <p style={{ margin: 0, fontSize: 11, color: '#00ff9f', background: '#00ff9f08', padding: 8, borderLeft: '2px solid #00ff9f', lineHeight: 1.5 }}>
          {agent.recentOutput}
        </p>
      </div>

      {agent.detailHtml && (
        <div>
          <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: '#4a5680', letterSpacing: 2, marginBottom: 6, borderBottom: '1px solid #1a2540', paddingBottom: 3 }}>
            AGENT DETAIL
          </div>
          <div className={styles.detail} dangerouslySetInnerHTML={{ __html: agent.detailHtml }} />
        </div>
      )}
    </div>
  )
}
