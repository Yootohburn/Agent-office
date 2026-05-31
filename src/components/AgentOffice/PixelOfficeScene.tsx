import type { DepartmentId } from '../../agents/agentRegistry'
import { agents } from '../../agents/agentRegistry'
import AgentRoom from './AgentRoom'

interface Props {
  selectedAgentId: DepartmentId | null
  onSelectAgent: (id: DepartmentId) => void
}

export default function PixelOfficeScene({ selectedAgentId, onSelectAgent }: Props) {
  return (
    <div style={{ padding: '14px 16px' }}>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 16, color: '#2a3560', letterSpacing: 2, marginBottom: 10 }}>
        ▶ PIXEL OFFICE — {agents.length} AGENTS — คลิกที่ห้องหรือกด "คุยกับ Agent"
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {agents.map(agent => (
          <AgentRoom
            key={agent.id}
            agent={agent}
            selected={selectedAgentId === agent.id}
            onClick={() => onSelectAgent(agent.id)}
          />
        ))}
      </div>
    </div>
  )
}
