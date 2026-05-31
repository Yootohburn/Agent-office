import { useState } from 'react'
import { agents } from '../../agents/agentRegistry'
import type { DepartmentId } from '../../agents/agentRegistry'
import { campaigns, PLATFORM_CONFIG } from '../../agents/campaignRegistry'
import type { CampaignPlatform } from '../../agents/campaignRegistry'
import AgentDepartmentCard from './AgentDepartmentCard'
import AgentDetailPanel from './AgentDetailPanel'
import CampaignPipeline from './CampaignPipeline'
import AgentActivityLog from './AgentActivityLog'

type FilterOption = 'all' | CampaignPlatform

const FILTER_TABS: { id: FilterOption; label: string }[] = [
  { id: 'all',    label: 'ALL PLATFORMS' },
  { id: 'shopee', label: 'SHOPEE' },
  { id: 'lazada', label: 'LAZADA' },
  { id: 'tiktok', label: 'TIKTOK' },
  { id: 'multi',  label: 'MULTI' },
]

// Company-level stats derived from mock data
const STATS = {
  active:        campaigns.length,
  pendingReview: campaigns.filter(c => c.stage === 'review_compliance').length,
  ceoApproval:   campaigns.filter(c => c.stage === 'ceo_approval').length,
  readyPublish:  campaigns.filter(c => c.stage === 'export_publish').length,
  mockRevenue:   campaigns.reduce((sum, c) => {
    const n = parseFloat(c.targetMetrics.mockRevenue.replace('$', ''))
    return sum + (isNaN(n) ? 0 : n)
  }, 0),
}

export default function AgentOffice() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all')
  const [selectedAgentId, setSelectedAgentId] = useState<DepartmentId | null>('ceo-director')

  const selectedAgent = agents.find(a => a.id === selectedAgentId) ?? null

  return (
    <div style={{ minHeight: '100vh', background: '#06090f', color: '#e8eaf6', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top Bar ── */}
      <header style={{ background: '#0a0e1a', borderBottom: '2px solid #1a2540', padding: '10px 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontFamily: 'VT323, monospace', fontSize: 24, color: '#00ff9f', letterSpacing: 3, lineHeight: 1 }}>
              ░▒▓ AGENT OFFICE v1.1 ▓▒░
            </div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#00e5ff', background: '#00e5ff11', padding: '2px 10px', border: '1px solid #00e5ff33', letterSpacing: 1 }}>
              AI AFFILIATE CONTENT COMPANY
            </div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#ffb300', background: '#ffb30011', padding: '2px 8px', borderLeft: '2px solid #ffb300' }}>
              PHASE 1 — MOCK DATA
            </div>
          </div>

          {/* Company KPI strip */}
          <div style={{ display: 'flex', gap: 16 }}>
            <KpiChip label="ACTIVE CAMPAIGNS"  value={STATS.active}        color="#e8eaf6" />
            <KpiChip label="PENDING REVIEW"    value={STATS.pendingReview} color="#ffb300" />
            <KpiChip label="CEO APPROVAL"      value={STATS.ceoApproval}   color="#ff9800" />
            <KpiChip label="READY TO PUBLISH"  value={STATS.readyPublish}  color="#00ff9f" />
            <KpiChip label="MOCK REVENUE"      value={`$${STATS.mockRevenue}`} color="#00e5ff" />
          </div>
        </div>

        {/* Platform filter tabs */}
        <div style={{ display: 'flex', gap: 0, borderTop: '1px solid #1a2540', paddingTop: 0 }}>
          {FILTER_TABS.map(tab => {
            const platformCfg = tab.id !== 'all' ? PLATFORM_CONFIG[tab.id] : null
            const isActive = activeFilter === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  fontFamily: 'VT323, monospace',
                  fontSize: 13,
                  letterSpacing: 2,
                  padding: '7px 18px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive
                    ? `2px solid ${platformCfg?.color ?? '#00ff9f'}`
                    : '2px solid transparent',
                  color: isActive
                    ? (platformCfg?.color ?? '#00ff9f')
                    : '#2a3560',
                  cursor: 'pointer',
                  transition: 'color 0.1s',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </header>

      {/* ── Main layout ── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: selectedAgent ? '1fr 320px' : '1fr', overflow: 'hidden' }}>

        {/* Left: office floor */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Department cards — 4 equal columns */}
          <div style={{ padding: '14px 16px 10px', flexShrink: 0 }}>
            <div style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: '#2a3560', letterSpacing: 3, marginBottom: 8 }}>
              DEPARTMENTS — CLICK A DESK TO OPEN DETAIL
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {agents.map(agent => (
                <AgentDepartmentCard
                  key={agent.id}
                  agent={agent}
                  selected={selectedAgentId === agent.id}
                  onClick={() => setSelectedAgentId(selectedAgentId === agent.id ? null : agent.id)}
                />
              ))}
            </div>
          </div>

          {/* Campaign pipeline */}
          <div style={{ padding: '0 16px 10px', flexShrink: 0 }}>
            <CampaignPipeline platformFilter={activeFilter} />
          </div>

          {/* Activity log + console */}
          <div style={{ flex: 1, padding: '0 16px 12px', minHeight: 0 }}>
            <div style={{ height: '100%', minHeight: 180 }}>
              <AgentActivityLog />
            </div>
          </div>
        </div>

        {/* Right: agent detail panel */}
        {selectedAgent && (
          <div style={{ borderLeft: '2px solid #1a2540', background: '#0a0e1a', padding: 16, overflowY: 'auto', flexShrink: 0 }}>
            <AgentDetailPanel
              agent={selectedAgent}
              onClose={() => setSelectedAgentId(null)}
            />
          </div>
        )}
      </div>

      {/* ── Footer status bar ── */}
      <footer style={{ background: '#0a0e1a', borderTop: '1px solid #1a2540', padding: '5px 20px', display: 'flex', gap: 20, flexShrink: 0, alignItems: 'center' }}>
        {Object.entries(PLATFORM_CONFIG).map(([id, cfg]) => (
          <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 5, height: 5, background: cfg.color }} />
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#2a3560', letterSpacing: 1 }}>
              {cfg.label} API: NOT CONNECTED
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

function KpiChip({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 70 }}>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 22, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 8, color: '#2a3560', letterSpacing: 0.5, marginTop: 1 }}>{label}</div>
    </div>
  )
}
