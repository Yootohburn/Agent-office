import { useState } from 'react'
import { agents } from '../../agents/agentRegistry'
import type { DepartmentId } from '../../agents/agentRegistry'
import { campaigns, CHANNEL_CONFIG, formatTHB } from '../../agents/campaignRegistry'
import { companySummary, channelSummaries } from '../../agents/financeRegistry'
import AgentRoom from './AgentRoom'
import AgentCommandPanel from './AgentCommandPanel'
import CampaignDetailPanel from './CampaignDetailPanel'
import CampaignFocusSection from './CampaignFocusSection'
import FinanceDashboard from './FinanceDashboard'
import CampaignPipeline from './CampaignPipeline'
import AgentActivityLog from './AgentActivityLog'

type NavView = 'overview' | 'campaigns' | 'finance' | 'log'

const NAV_ITEMS: { id: NavView; label: string }[] = [
  { id: 'overview',  label: 'ภาพรวมบริษัท' },
  { id: 'campaigns', label: 'แคมเปญ'       },
  { id: 'finance',   label: 'การเงิน'       },
  { id: 'log',       label: 'บันทึกการทำงาน' },
]

const STATS = {
  active:        campaigns.length,
  pendingReview: campaigns.filter(c => c.stage === 'review_compliance').length,
  ceoApproval:   campaigns.filter(c => c.stage === 'ceo_approval').length,
}

const COMPACT_BADGE_LABEL: Record<string, string> = {
  scale:    'ดี ↑',
  maintain: 'ปกติ',
  stop:     'ขาดทุน',
  review:   'ระวัง',
}
const COMPACT_BADGE_COLOR: Record<string, string> = {
  scale:    '#00ff9f',
  maintain: '#00e5ff',
  stop:     '#ff5252',
  review:   '#ffb300',
}

export default function AgentOffice() {
  const [activeView,         setActiveView]         = useState<NavView>('overview')
  const [selectedAgentId,    setSelectedAgentId]    = useState<DepartmentId | null>(null)
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
      <header style={{ background: '#0a0e1a', borderBottom: '1px solid #1a2540', padding: '10px 24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontFamily: 'VT323, monospace', fontSize: 24, color: '#00ff9f', letterSpacing: 3, lineHeight: 1 }}>
              ░▒▓ AGENT OFFICE v2.2 ▓▒░
            </div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#00e5ff', background: '#00e5ff11', padding: '2px 10px', border: '1px solid #00e5ff22', letterSpacing: 1 }}>
              AI AFFILIATE CONTENT CO.
            </div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#ffb300', background: '#ffb30011', padding: '2px 10px', borderLeft: '2px solid #ffb300' }}>
              PHASE 1 — MOCK DATA
            </div>
          </div>

          {/* 6 KPI chips */}
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
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
      <nav style={{ background: '#080c18', borderBottom: '2px solid #1a2540', padding: '0 24px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            style={{
              fontFamily: 'VT323, monospace', fontSize: 17,
              color: activeView === item.id ? '#00ff9f' : '#4a5680',
              background: 'none', border: 'none',
              borderBottom: `2px solid ${activeView === item.id ? '#00ff9f' : 'transparent'}`,
              padding: '10px 20px', cursor: 'pointer', letterSpacing: 1,
              transition: 'color 0.1s', marginBottom: -2,
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
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: hasPanel ? '1fr 340px' : '1fr', overflow: 'hidden', minHeight: 0 }}>

        {/* Left: scrollable view */}
        <div style={{ overflowY: 'auto', padding: '16px 18px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {activeView === 'overview' && (
            <>
              {/* Agent rooms */}
              <div>
                <div style={{ fontFamily: 'VT323, monospace', fontSize: 16, color: '#2a3560', letterSpacing: 2, marginBottom: 10 }}>
                  ▶ 5 แผนกหลักของบริษัท — คลิกที่ห้องหรือกด "คุยกับ Agent"
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                  {agents.map(agent => (
                    <AgentRoom
                      key={agent.id}
                      agent={agent}
                      selected={selectedAgentId === agent.id}
                      onClick={() => handleSelectAgent(agent.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom: campaign focus + revenue channels */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
                <CampaignFocusSection
                  selectedCampaignId={selectedCampaignId}
                  onSelectCampaign={handleSelectCampaign}
                />
                <RevenueChannelsCompact />
              </div>
            </>
          )}

          {activeView === 'campaigns' && (
            <>
              <CampaignFocusSection
                selectedCampaignId={selectedCampaignId}
                onSelectCampaign={handleSelectCampaign}
              />
              <CampaignPipeline />
            </>
          )}

          {activeView === 'finance' && <FinanceDashboard />}

          {activeView === 'log' && <AgentActivityLog />}

        </div>

        {/* Right: detail/command panel */}
        {hasPanel && (
          <div style={{
            borderLeft: '2px solid #1a2540', background: '#0a0e1a',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0,
          }}>
            {selectedAgent && (
              <AgentCommandPanel agent={selectedAgent} onClose={closePanel} />
            )}
            {selectedCampaign && (
              <div style={{ padding: 16, overflowY: 'auto', flex: 1 }}>
                <CampaignDetailPanel campaign={selectedCampaign} onClose={closePanel} />
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── Footer ── */}
      <footer style={{ background: '#0a0e1a', borderTop: '1px solid #1a2540', padding: '5px 24px', display: 'flex', gap: 20, flexShrink: 0, alignItems: 'center', flexWrap: 'wrap' }}>
        {[
          { label: 'Shopee API', color: '#ff5722' },
          { label: 'Lazada API', color: '#2979ff' },
          { label: 'TikTok API', color: '#00e5ff' },
        ].map(p => (
          <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 5, height: 5, background: p.color }} />
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#2a3560', letterSpacing: 1 }}>
              {p.label}: NOT CONNECTED
            </span>
          </div>
        ))}
        <span style={{ marginLeft: 'auto', fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#1a2540' }}>
          PHASE 1 — MOCK DATA ONLY
        </span>
      </footer>

    </div>
  )
}

// ─────────────────────────────────────────────
// Sub-components (local)
// ─────────────────────────────────────────────

function KpiChip({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 28, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#2a3560', letterSpacing: 0.3, marginTop: 2, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  )
}

function RevenueChannelsCompact() {
  return (
    <div>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 17, color: '#00ff9f', letterSpacing: 2, marginBottom: 10 }}>
        ▶ รายได้ตามช่องทาง
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {channelSummaries.map(s => {
          const cfg      = CHANNEL_CONFIG[s.channel]
          const isLoss   = s.netProfit < 0
          const roasColor = s.roas >= 4 ? '#00ff9f' : s.roas >= 2 ? '#ffb300' : '#ff5252'
          const badgeLabel = COMPACT_BADGE_LABEL[s.recommendation]
          const badgeColor = COMPACT_BADGE_COLOR[s.recommendation]
          return (
            <div key={s.channel} style={{
              background: '#0c1425',
              border: `1px solid ${isLoss ? '#ff525244' : '#1a2540'}`,
              borderTop: `3px solid ${cfg.color}`,
              padding: '10px 12px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontFamily: 'VT323, monospace', fontSize: 19, color: cfg.color, letterSpacing: 1 }}>
                  {cfg.label.toUpperCase()}
                </span>
                <span style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: badgeColor, background: `${badgeColor}18`, padding: '1px 8px', border: `1px solid ${badgeColor}44`, letterSpacing: 1 }}>
                  {badgeLabel}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 4 }}>
                <ChannelMetric label="รายได้"    value={formatTHB(s.revenue)}   color="#e8eaf6" />
                <ChannelMetric label="ค่าโฆษณา" value={formatTHB(s.adSpend)}   color="#ffb300" />
                <ChannelMetric label="กำไร"      value={formatTHB(s.netProfit)} color={isLoss ? '#ff5252' : '#00ff9f'} />
                <ChannelMetric label="ROAS"       value={`${s.roas}x`}           color={roasColor} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChannelMetric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#2a3560', marginBottom: 1 }}>{label}</div>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 15, color }}>{value}</div>
    </div>
  )
}
