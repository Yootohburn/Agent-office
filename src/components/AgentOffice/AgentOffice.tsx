import { useState } from 'react'
import { agents, getAgentsByPlatform } from '../../agents/agentRegistry'
import type { AgentPlatform } from '../../agents/agentRegistry'
import { platforms } from '../../agents/platformRegistry'
import { workflowTemplates } from '../../agents/agentTaskRouter'
import AgentStatusCard from './AgentStatusCard'
import AgentDesk from './AgentDesk'
import AgentActivityLog from './AgentActivityLog'

type FilterOption = 'all' | AgentPlatform

const FILTER_TABS: { id: FilterOption; label: string }[] = [
  { id: 'all',     label: 'ALL' },
  { id: 'shopee',  label: 'SHOPEE' },
  { id: 'lazada',  label: 'LAZADA' },
  { id: 'tiktok',  label: 'TIKTOK' },
  { id: 'shared',  label: 'SHARED' },
]

const STATUS_COUNTS = {
  total:   agents.length,
  working: agents.filter(a => a.status === 'working').length,
  blocked: agents.filter(a => a.status === 'blocked' || a.status === 'needs_review').length,
  done:    agents.filter(a => a.status === 'done').length,
}

export default function AgentOffice() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all')
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>('tiktok-strategist')

  const filteredAgents = getAgentsByPlatform(activeFilter)
  const selectedAgent = agents.find(a => a.id === selectedAgentId) ?? null

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#06090f',
        color: '#e8eaf6',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Bar */}
      <header
        style={{
          background: '#0a0e1a',
          borderBottom: '2px solid #1a2540',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              fontFamily: 'VT323, monospace',
              fontSize: 26,
              color: '#00ff9f',
              letterSpacing: 3,
              lineHeight: 1,
            }}
          >
            ░▒▓ AGENT OFFICE v1.0 ▓▒░
          </div>
          <div
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: 10,
              color: '#ffb300',
              background: '#ffb30011',
              padding: '2px 8px',
              borderLeft: '2px solid #ffb300',
            }}
          >
            PHASE 1 — MOCK DATA
          </div>
        </div>

        {/* System stats */}
        <div style={{ display: 'flex', gap: 20 }}>
          <Stat label="AGENTS" value={STATUS_COUNTS.total} color="#e8eaf6" />
          <Stat label="WORKING" value={STATUS_COUNTS.working} color="#00ff9f" />
          <Stat label="ATTENTION" value={STATUS_COUNTS.blocked} color="#ff5252" />
          <Stat label="DONE" value={STATUS_COUNTS.done} color="#00e5ff" />
        </div>
      </header>

      {/* Platform filter tabs */}
      <div
        style={{
          background: '#0a0e1a',
          borderBottom: '1px solid #1a2540',
          padding: '0 20px',
          display: 'flex',
          gap: 0,
          flexShrink: 0,
        }}
      >
        {FILTER_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            style={{
              fontFamily: 'VT323, monospace',
              fontSize: 14,
              letterSpacing: 2,
              padding: '8px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeFilter === tab.id ? '2px solid #00ff9f' : '2px solid transparent',
              color: activeFilter === tab.id ? '#00ff9f' : '#4a5680',
              cursor: 'pointer',
              transition: 'color 0.1s',
            }}
          >
            {tab.label}
          </button>
        ))}

        {/* Workflow templates on the right */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: '#2a3560', letterSpacing: 1 }}>
            WORKFLOWS:
          </span>
          {workflowTemplates.map(wf => (
            <span
              key={wf.id}
              style={{
                fontFamily: 'VT323, monospace',
                fontSize: 12,
                color: '#2a3560',
                background: '#0c1425',
                padding: '2px 8px',
                border: '1px solid #1a2540',
                letterSpacing: 1,
              }}
              title={wf.description}
            >
              {wf.name.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: selectedAgent ? '1fr 300px' : '1fr',
          gap: 0,
          overflow: 'hidden',
        }}
      >
        {/* Left: agent grid + activity log */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Agent grid */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 16,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 10,
              alignContent: 'start',
            }}
          >
            {filteredAgents.length === 0 ? (
              <div style={{ fontFamily: 'VT323, monospace', color: '#2a3560', fontSize: 16, gridColumn: '1/-1', padding: 20 }}>
                NO AGENTS FOR THIS FILTER
              </div>
            ) : (
              filteredAgents.map(agent => (
                <AgentStatusCard
                  key={agent.id}
                  agent={agent}
                  selected={selectedAgentId === agent.id}
                  onClick={() => setSelectedAgentId(selectedAgentId === agent.id ? null : agent.id)}
                />
              ))
            )}
          </div>

          {/* Activity log panel */}
          <div
            style={{
              height: 220,
              borderTop: '2px solid #1a2540',
              padding: 12,
              flexShrink: 0,
            }}
          >
            <AgentActivityLog />
          </div>
        </div>

        {/* Right: selected agent detail panel */}
        {selectedAgent && (
          <div
            style={{
              borderLeft: '2px solid #1a2540',
              background: '#0a0e1a',
              padding: 16,
              overflowY: 'auto',
              flexShrink: 0,
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedAgentId(null)}
              style={{
                fontFamily: 'VT323, monospace',
                fontSize: 12,
                color: '#4a5680',
                background: 'none',
                border: '1px solid #1a2540',
                padding: '2px 8px',
                cursor: 'pointer',
                marginBottom: 12,
                letterSpacing: 1,
              }}
            >
              ✕ CLOSE
            </button>

            <AgentDesk agent={selectedAgent} />
          </div>
        )}
      </div>

      {/* Platform status bar */}
      <footer
        style={{
          background: '#0a0e1a',
          borderTop: '1px solid #1a2540',
          padding: '6px 20px',
          display: 'flex',
          gap: 20,
          flexShrink: 0,
        }}
      >
        {platforms.map(p => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, background: p.color }} />
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#2a3560', letterSpacing: 1 }}>
              {p.label.toUpperCase()} API: NOT CONNECTED
            </span>
          </div>
        ))}
        <span style={{ marginLeft: 'auto', fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#1a2540' }}>
          PHASE 1 — MOCK DATA ONLY — NO REAL APIS
        </span>
      </footer>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 22, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#2a3560', letterSpacing: 1 }}>{label}</div>
    </div>
  )
}
