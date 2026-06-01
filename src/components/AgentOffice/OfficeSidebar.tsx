import { CHANNEL_CONFIG, PIPELINE_STAGES, formatTHB } from '../../agents/campaignRegistry'
import type { Campaign } from '../../agents/campaignRegistry'

interface Props {
  campaigns: Campaign[]
  selectedCampaignId: string | null
  onSelectCampaign: (id: string) => void
}

function urgencyScore(c: Campaign): number {
  if (c.financeWarnings.some(w => w.includes('ขาดทุน'))) return 0
  if (c.stage === 'human_approved') return 1
  if (c.stage === 'asset_ready') return 2
  if (c.stage === 'script_ready') return 3
  if (c.stage === 'brief_ready') return 4
  return 5
}

const STAGE_LABEL: Record<string, string> = Object.fromEntries(
  PIPELINE_STAGES.map(s => [s.id, s.label])
)

const STATUS_COLOR: Record<number, string> = {
  0: '#ff5252',
  1: '#ff9800',
  2: '#ffb300',
  3: '#ff4081',
  4: '#ff9800',
  5: '#4a5680',
}

const RISK_COLOR: Record<string, string> = {
  low:      '#2a3560',
  medium:   '#ffb300',
  high:     '#ff9800',
  critical: '#ff5252',
}

export default function OfficeSidebar({ campaigns, selectedCampaignId, onSelectCampaign }: Props) {
  const sorted = [...campaigns].sort((a, b) => urgencyScore(a) - urgencyScore(b))

  return (
    <div style={{ borderRight: '2px solid #1a2540', background: '#080c18', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid #1a2540', flexShrink: 0 }}>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 15, color: '#2a3560', letterSpacing: 2 }}>
          ▶ CAMPAIGN QUEUE
        </div>
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#1a2540', marginTop: 2 }}>
          {campaigns.length} active — sorted by urgency
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
        {sorted.map(c => {
          const cfg        = CHANNEL_CONFIG[c.channel]
          const score      = urgencyScore(c)
          const dotColor   = STATUS_COLOR[score] ?? '#4a5680'
          const isSelected = c.id === selectedCampaignId
          const hasWarning = c.financeWarnings.length > 0
          const riskDot    = RISK_COLOR[c.riskLevel] ?? '#2a3560'

          return (
            <div
              key={c.id}
              onClick={() => onSelectCampaign(c.id)}
              style={{
                padding: '8px 10px',
                marginBottom: 6,
                background: isSelected ? '#0f1a2e' : '#0c1425',
                border: `1px solid ${isSelected ? cfg.color : '#1a2540'}`,
                borderLeft: `3px solid ${dotColor}`,
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4, marginBottom: 4 }}>
                <div style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 13, color: '#e8eaf6', lineHeight: 1.3, flex: 1, minWidth: 0 }}>
                  {c.name.length > 28 ? c.name.slice(0, 28) + '…' : c.name}
                </div>
                <span style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: cfg.color, background: `${cfg.color}18`, padding: '0px 4px', flexShrink: 0, letterSpacing: 1 }}>
                  {cfg.label.slice(0, 2).toUpperCase()}
                </span>
              </div>

              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#2a3560', letterSpacing: 0.5, marginBottom: 4 }}>
                {STAGE_LABEL[c.stage] ?? c.stage}
              </div>

              <div style={{ background: '#1a2540', height: 2, marginBottom: hasWarning ? 5 : 4 }}>
                <div style={{ background: cfg.color, height: '100%', width: `${c.progress}%`, transition: 'width 0.4s ease' }} />
              </div>

              {hasWarning && (
                <div style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: '#ff5252', marginTop: 2, marginBottom: 2 }}>
                  ⚠ {c.financeWarnings[0].length > 26 ? c.financeWarnings[0].slice(0, 26) + '…' : c.financeWarnings[0]}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: '#2a3560' }}>{c.progress}%</span>
                  {c.riskLevel !== 'low' && (
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: riskDot, display: 'inline-block' }} />
                  )}
                </div>
                <span style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: c.finance.netProfit < 0 ? '#ff5252' : '#00ff9f' }}>
                  {formatTHB(c.finance.netProfit)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
