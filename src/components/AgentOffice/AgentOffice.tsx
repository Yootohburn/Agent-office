import { useState } from 'react'
import { agents } from '../../agents/agentRegistry'
import type { DepartmentId } from '../../agents/agentRegistry'
import { campaigns } from '../../agents/campaignRegistry'
import { companySummary } from '../../agents/financeRegistry'
import { formatTHB } from '../../agents/campaignRegistry'
import AgentRoom from './AgentRoom'
import AgentDetailPanel from './AgentDetailPanel'
import CampaignDetailPanel from './CampaignDetailPanel'
import CampaignFocusSection from './CampaignFocusSection'
import FinanceDashboard from './FinanceDashboard'
import CampaignPipeline from './CampaignPipeline'
import AgentActivityLog from './AgentActivityLog'

type NavView = 'overview' | 'campaigns' | 'finance' | 'agentoffice' | 'log'

const NAV_ITEMS: { id: NavView; label: string }[] = [
  { id: 'overview',    label: 'ภาพรวมบริษัท' },
  { id: 'campaigns',   label: 'แคมเปญ'       },
  { id: 'finance',     label: 'การเงิน'       },
  { id: 'agentoffice', label: 'Agent Office' },
  { id: 'log',         label: 'Log'          },
]

const STATS = {
  active:        campaigns.length,
  pendingReview: campaigns.filter(c => c.stage === 'review_compliance').length,
  ceoApproval:   campaigns.filter(c => c.stage === 'ceo_approval').length,
}

export default function AgentOffice() {
  const [activeView,        setActiveView]        = useState<NavView>('overview')
  const [selectedAgentId,   setSelectedAgentId]   = useState<DepartmentId | null>(null)
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)

  const selectedAgent    = selectedAgentId    ? (agents.find(a => a.id === selectedAgentId) ?? null)     : null
  const selectedCampaign = selectedCampaignId ? (campaigns.find(c => c.id === selectedCampaignId) ?? null) : null
  const hasPanel         = selectedAgent !== null || selectedCampaign !== null

  function handleSelectAgent(id: DepartmentId) {
    setSelectedAgentId(prev => prev === id ? null : id)
    setSelectedCampaignId(null)
  }

  function handleSelectCampaign(id: string) {
    setSelectedCampaignId(prev => prev === id ? null : id)
    setSelectedAgentId(null)
  }

  function closePanel() {
    setSelectedAgentId(null)
    setSelectedCampaignId(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#06090f', color: '#e8eaf6', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <header style={{ background: '#0a0e1a', borderBottom: '1px solid #1a2540', padding: '10px 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontFamily: 'VT323, monospace', fontSize: 22, color: '#00ff9f', letterSpacing: 3, lineHeight: 1 }}>
              ░▒▓ AGENT OFFICE v2.1 ▓▒░
            </div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#00e5ff', background: '#00e5ff11', padding: '2px 8px', border: '1px solid #00e5ff22', letterSpacing: 1 }}>
              AI AFFILIATE CONTENT CO.
            </div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#ffb300', background: '#ffb30011', padding: '2px 8px', borderLeft: '2px solid #ffb300' }}>
              PHASE 1 — MOCK DATA
            </div>
          </div>

          {/* 6 KPI chips — bigger numbers */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end' }}>
            <KpiChip label="แคมเปญที่กำลังทำ"  value={STATS.active}                             color="#e8eaf6" />
            <KpiChip label="รอรีวิว"            value={STATS.pendingReview}                      color="#ffb300" />
            <KpiChip label="รอ CEO อนุมัติ"     value={STATS.ceoApproval}                        color="#ff9800" />
            <KpiChip label="รายได้รวม"          value={formatTHB(companySummary.totalRevenue)}   color="#00e5ff" />
            <KpiChip label="กำไรสุทธิ"          value={formatTHB(companySummary.totalNetProfit)} color="#00ff9f" />
            <KpiChip label="ROAS เฉลี่ย"         value={`${companySummary.avgRoas}x`}             color={companySummary.avgRoas >= 4 ? '#00ff9f' : '#ffb300'} />
          </div>

        </div>
      </header>

      {/* ── Navigation ── */}
      <nav style={{ background: '#080c18', borderBottom: '2px solid #1a2540', padding: '0 20px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            style={{
              fontFamily: 'VT323, monospace',
              fontSize: 16,
              color: activeView === item.id ? '#00ff9f' : '#4a5680',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${activeView === item.id ? '#00ff9f' : 'transparent'}`,
              padding: '9px 18px',
              cursor: 'pointer',
              letterSpacing: 1,
              transition: 'color 0.1s',
              marginBottom: -2,
            }}
          >
            {item.label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#1a2540', letterSpacing: 1 }}>
          Shopee · Lazada · TikTok = revenue channels
        </span>
      </nav>

      {/* ── Main layout ── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: hasPanel ? '1fr 320px' : '1fr', overflow: 'hidden', minHeight: 0 }}>

        {/* Left: scrollable view content */}
        <div style={{ overflowY: 'auto', padding: '14px 16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {activeView === 'overview' && (
            <>
              <AgentRoomsGrid selectedId={selectedAgentId} onSelect={handleSelectAgent} />
              <FinanceDashboard compact />
              <CampaignFocusSection selectedCampaignId={selectedCampaignId} onSelectCampaign={handleSelectCampaign} />
            </>
          )}

          {activeView === 'campaigns' && (
            <>
              <CampaignFocusSection selectedCampaignId={selectedCampaignId} onSelectCampaign={handleSelectCampaign} />
              <CampaignPipeline />
            </>
          )}

          {activeView === 'finance' && (
            <FinanceDashboard />
          )}

          {activeView === 'agentoffice' && (
            <AgentRoomsGrid selectedId={selectedAgentId} onSelect={handleSelectAgent} />
          )}

          {activeView === 'log' && (
            <AgentActivityLog />
          )}

        </div>

        {/* Right: detail panel */}
        {hasPanel && (
          <div style={{ borderLeft: '2px solid #1a2540', background: '#0a0e1a', padding: 16, overflowY: 'auto', flexShrink: 0 }}>
            {selectedAgent    && <AgentDetailPanel    agent={selectedAgent}       onClose={closePanel} />}
            {selectedCampaign && <CampaignDetailPanel campaign={selectedCampaign} onClose={closePanel} />}
          </div>
        )}

      </div>

      {/* ── Footer ── */}
      <footer style={{ background: '#0a0e1a', borderTop: '1px solid #1a2540', padding: '5px 20px', display: 'flex', gap: 16, flexShrink: 0, alignItems: 'center', flexWrap: 'wrap' }}>
        {[
          { label: 'Shopee API', color: '#ff5722' },
          { label: 'Lazada API', color: '#2979ff' },
          { label: 'TikTok API', color: '#00e5ff' },
        ].map(p => (
          <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 5, height: 5, background: p.color }} />
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#2a3560', letterSpacing: 1 }}>
              {p.label}: NOT CONNECTED
            </span>
          </div>
        ))}
        <span style={{ marginLeft: 'auto', fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#1a2540' }}>
          PHASE 1 — MOCK DATA ONLY — Shopee / Lazada / TikTok เป็น revenue channels
        </span>
      </footer>

    </div>
  )
}

// ─────────────────────────────────────────────
// Shared sub-components (local to this file)
// ─────────────────────────────────────────────

function AgentRoomsGrid({ selectedId, onSelect }: { selectedId: DepartmentId | null; onSelect: (id: DepartmentId) => void }) {
  return (
    <div>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: '#2a3560', letterSpacing: 2, marginBottom: 8 }}>
        ▶ 5 ห้องแผนกหลักของบริษัท — คลิกเพื่อดูรายละเอียด
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {agents.map(agent => (
          <AgentRoom
            key={agent.id}
            agent={agent}
            selected={selectedId === agent.id}
            onClick={() => onSelect(agent.id)}
          />
        ))}
      </div>
    </div>
  )
}

function KpiChip({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 24, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#2a3560', letterSpacing: 0.3, marginTop: 2, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  )
}
