import { useState } from 'react'
import { agents } from '../../agents/agentRegistry'
import type { DepartmentId } from '../../agents/agentRegistry'
import { campaigns } from '../../agents/campaignRegistry'
import { companySummary } from '../../agents/financeRegistry'
import { formatTHB } from '../../agents/campaignRegistry'
import AgentDepartmentCard from './AgentDepartmentCard'
import AgentDetailPanel from './AgentDetailPanel'
import CampaignPipeline from './CampaignPipeline'
import FinanceDashboard from './FinanceDashboard'
import AgentActivityLog from './AgentActivityLog'

const STATS = {
  active:        campaigns.length,
  pendingReview: campaigns.filter(c => c.stage === 'review_compliance').length,
  ceoApproval:   campaigns.filter(c => c.stage === 'ceo_approval').length,
  readyPublish:  campaigns.filter(c => c.stage === 'export_publish').length,
}

export default function AgentOffice() {
  const [selectedAgentId, setSelectedAgentId] = useState<DepartmentId | null>('ceo-director')
  const selectedAgent = agents.find(a => a.id === selectedAgentId) ?? null

  return (
    <div style={{ minHeight: '100vh', background: '#06090f', color: '#e8eaf6', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top Bar ── */}
      <header style={{ background: '#0a0e1a', borderBottom: '2px solid #1a2540', padding: '10px 20px', flexShrink: 0 }}>
        {/* Row 1: brand + company KPIs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontFamily: 'VT323, monospace', fontSize: 24, color: '#00ff9f', letterSpacing: 3, lineHeight: 1 }}>
              ░▒▓ AGENT OFFICE v1.2 ▓▒░
            </div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#00e5ff', background: '#00e5ff11', padding: '2px 10px', border: '1px solid #00e5ff33', letterSpacing: 1 }}>
              AI AFFILIATE CONTENT COMPANY
            </div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#ffb300', background: '#ffb30011', padding: '2px 8px', borderLeft: '2px solid #ffb300' }}>
              PHASE 1 — MOCK DATA
            </div>
          </div>

          {/* 8 KPI chips */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <KpiChip label="แคมเปญที่กำลังทำ"   value={STATS.active}                               color="#e8eaf6" />
            <KpiChip label="รอรีวิว"             value={STATS.pendingReview}                        color="#ffb300" />
            <KpiChip label="รอ CEO อนุมัติ"      value={STATS.ceoApproval}                          color="#ff9800" />
            <KpiChip label="พร้อมโพสต์"          value={STATS.readyPublish}                         color="#00ff9f" />
            <KpiChip label="รายได้รวมจำลอง"      value={formatTHB(companySummary.totalRevenue)}     color="#00e5ff" />
            <KpiChip label="กำไรสุทธิจำลอง"      value={formatTHB(companySummary.totalNetProfit)}   color="#00ff9f" />
            <KpiChip label="ค่าโฆษณารวม"         value={formatTHB(companySummary.totalAdSpend)}     color="#ffb300" />
            <KpiChip label="ROAS เฉลี่ย"          value={`${companySummary.avgRoas}x`}               color={companySummary.avgRoas >= 4 ? '#00ff9f' : '#ffb300'} />
          </div>
        </div>

        {/* Row 2: dept label */}
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 10, color: '#2a3560', letterSpacing: 2 }}>
          แผนกหลัก — คลิกที่โต๊ะเพื่อดูรายละเอียด &nbsp;|&nbsp; Shopee · Lazada · TikTok คือ revenue channels ไม่ใช่แผนก
        </div>
      </header>

      {/* ── Main layout ── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: selectedAgent ? '1fr 320px' : '1fr', overflow: 'hidden' }}>

        {/* Left: scrollable office floor */}
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 16px 16px' }}>

          {/* 5 department cards */}
          <div>
            <div style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: '#2a3560', letterSpacing: 2, marginBottom: 8 }}>
              ▶ 5 แผนกหลักของบริษัท
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
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

          {/* Finance dashboard — revenue by channel */}
          <FinanceDashboard />

          {/* Campaign pipeline */}
          <CampaignPipeline />

          {/* Activity log */}
          <div style={{ minHeight: 200 }}>
            <AgentActivityLog />
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

      {/* ── Footer ── */}
      <footer style={{ background: '#0a0e1a', borderTop: '1px solid #1a2540', padding: '5px 20px', display: 'flex', gap: 16, flexShrink: 0, alignItems: 'center', flexWrap: 'wrap' }}>
        {[
          { label: 'Shopee API', color: '#ff5722' },
          { label: 'Lazada API', color: '#2979ff' },
          { label: 'TikTok API', color: '#00e5ff' },
        ].map(p => (
          <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 5, height: 5, background: p.color }} />
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#2a3560', letterSpacing: 1 }}>
              {p.label}: NOT CONNECTED
            </span>
          </div>
        ))}
        <span style={{ marginLeft: 'auto', fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#1a2540' }}>
          PHASE 1 — MOCK DATA ONLY — Shopee / Lazada / TikTok เป็น revenue channels
        </span>
      </footer>
    </div>
  )
}

function KpiChip({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 60 }}>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 18, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 7, color: '#2a3560', letterSpacing: 0.3, marginTop: 1, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  )
}
