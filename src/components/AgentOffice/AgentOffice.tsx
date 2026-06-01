import { useState } from 'react'
import { agents as initialAgents } from '../../agents/agentRegistry'
import type { Agent, DepartmentId } from '../../agents/agentRegistry'
import { campaigns as initialCampaigns, formatTHB } from '../../agents/campaignRegistry'
import type { Campaign } from '../../agents/campaignRegistry'
import { mockActivityLog, initialTeamChat } from '../../agents/agentSessionStore'
import type { ActivityLogEntry, TeamChatMessage } from '../../agents/agentSessionStore'
import { runWorkflowAction } from '../../agents/mockWorkflowEngine'
import type { WorkflowAction } from '../../agents/campaignWorkflow'
import { companySummary } from '../../agents/financeRegistry'
import AgentCommandPanel from './AgentCommandPanel'
import CampaignDetailPanel from './CampaignDetailPanel'
import CampaignFocusSection from './CampaignFocusSection'
import FinanceDashboard from './FinanceDashboard'
import CampaignPipeline from './CampaignPipeline'
import AgentActivityLog from './AgentActivityLog'
import PixelOfficeScene from './PixelOfficeScene'
import OfficeSidebar from './OfficeSidebar'
import SystemConsole from './SystemConsole'
import TeamChatPanel from './TeamChatPanel'

type NavView = 'overview' | 'campaigns' | 'finance' | 'log'

const NAV_ITEMS: { id: NavView; label: string }[] = [
  { id: 'overview',  label: 'ภาพรวมบริษัท' },
  { id: 'campaigns', label: 'แคมเปญ'       },
  { id: 'finance',   label: 'การเงิน'       },
  { id: 'log',       label: 'บันทึกการทำงาน' },
]

export default function AgentOffice() {
  const [activeView,         setActiveView]         = useState<NavView>('overview')
  const [selectedAgentId,    setSelectedAgentId]    = useState<DepartmentId | null>(null)
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)

  // Live mutable state — forked from static registry data at mount
  const [liveCampaigns, setLiveCampaigns] = useState<Campaign[]>(() => initialCampaigns.map(c => ({ ...c })))
  const [liveAgents,    setLiveAgents]    = useState<Agent[]>(() => initialAgents.map(a => ({ ...a })))
  const [logs,          setLogs]          = useState<ActivityLogEntry[]>(() => [...mockActivityLog])
  const [teamChat,      setTeamChat]      = useState<TeamChatMessage[]>(() => [...initialTeamChat])
  const [logCounter,    setLogCounter]    = useState(mockActivityLog.length + 1)

  const selectedAgent    = selectedAgentId    ? (liveAgents.find(a => a.id === selectedAgentId) ?? null)       : null
  const selectedCampaign = selectedCampaignId ? (liveCampaigns.find(c => c.id === selectedCampaignId) ?? null) : null
  const hasPanel         = selectedAgent !== null || selectedCampaign !== null

  // Dynamic KPI counts
  const activeCount    = liveCampaigns.length
  const pendingReview  = liveCampaigns.filter(c => c.stage === 'review_compliance').length
  const ceoApproval    = liveCampaigns.filter(c => c.stage === 'ceo_approval').length

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

  function handleWorkflowAction(campaignId: string, action: WorkflowAction) {
    const campaign = liveCampaigns.find(c => c.id === campaignId)
    if (!campaign) return

    const result = runWorkflowAction(action, campaign, liveAgents, logCounter)

    setLiveCampaigns(prev =>
      prev.map(c => c.id === result.updatedCampaign.id ? result.updatedCampaign : c)
    )
    setLiveAgents(prev => {
      const updatedMap = new Map(result.updatedAgents.map(a => [a.id, a]))
      return prev.map(a => updatedMap.get(a.id) ?? a)
    })
    setLogs(prev => [result.newLogEntry, ...prev])
    setTeamChat(prev => [...prev, result.newChatMessage])
    setLogCounter(n => n + 1)
  }

  return (
    <div style={{ minHeight: '100vh', height: '100vh', background: '#06090f', color: '#e8eaf6', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Header ── */}
      <header style={{ background: '#0a0e1a', borderBottom: '1px solid #1a2540', padding: '8px 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontFamily: 'VT323, monospace', fontSize: 22, color: '#00ff9f', letterSpacing: 3, lineHeight: 1 }}>
              ░▒▓ AGENT OFFICE v2.4 ▓▒░
            </div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#00e5ff', background: '#00e5ff11', padding: '2px 10px', border: '1px solid #00e5ff22', letterSpacing: 1 }}>
              AI AFFILIATE CONTENT CO.
            </div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#ffb300', background: '#ffb30011', padding: '2px 10px', borderLeft: '2px solid #ffb300' }}>
              PHASE 1 — MOCK DATA
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end' }}>
            <KpiChip label="แคมเปญที่กำลังทำ"  value={activeCount}                              color="#e8eaf6" />
            <KpiChip label="รอรีวิว"            value={pendingReview}                            color="#ffb300" />
            <KpiChip label="รอ CEO อนุมัติ"     value={ceoApproval}                              color="#ff9800" />
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
          {liveAgents.length} agents · Shopee · Lazada · TikTok
        </span>
      </nav>

      {/* ── Main 3-column layout ── */}
      <div style={{
        flex: 1, display: 'grid', overflow: 'hidden', minHeight: 0,
        gridTemplateColumns: hasPanel ? '220px 1fr 340px' : '220px 1fr',
      }}>

        {/* Left: Campaign sidebar — always visible */}
        <OfficeSidebar
          campaigns={liveCampaigns}
          selectedCampaignId={selectedCampaignId}
          onSelectCampaign={handleSelectCampaign}
        />

        {/* Center: tab content */}
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>

          {activeView === 'overview' && (
            <PixelOfficeScene
              agents={liveAgents}
              selectedAgentId={selectedAgentId}
              onSelectAgent={handleSelectAgent}
            />
          )}

          {activeView === 'campaigns' && (
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <CampaignFocusSection
                campaigns={liveCampaigns}
                agents={liveAgents}
                selectedCampaignId={selectedCampaignId}
                onSelectCampaign={handleSelectCampaign}
              />
              <CampaignPipeline campaigns={liveCampaigns} />
            </div>
          )}

          {activeView === 'finance' && (
            <div style={{ padding: '14px 16px' }}>
              <FinanceDashboard />
            </div>
          )}

          {activeView === 'log' && (
            <div style={{ padding: '14px 16px' }}>
              <AgentActivityLog campaigns={liveCampaigns} logs={logs} />
            </div>
          )}

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
                <CampaignDetailPanel
                  campaign={selectedCampaign}
                  onClose={closePanel}
                  onAction={handleWorkflowAction}
                />
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── Bottom bar: System Console + Team Chat ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        height: 160, flexShrink: 0,
        borderTop: '2px solid #1a2540',
      }}>
        <SystemConsole logs={logs} />
        <TeamChatPanel messages={teamChat} />
      </div>

    </div>
  )
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function KpiChip({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 26, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#2a3560', letterSpacing: 0.3, marginTop: 2, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  )
}
