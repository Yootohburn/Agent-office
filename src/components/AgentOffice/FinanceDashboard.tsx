import { channelSummaries, companySummary, RECOMMENDATION_CONFIG } from '../../agents/financeRegistry'
import { CHANNEL_CONFIG, formatTHB } from '../../agents/campaignRegistry'
import RevenueByChannel from './RevenueByChannel'

interface Props {
  /** compact — show 3-card summary without company totals or recommendation strip. Used in overview view. */
  compact?: boolean
}

export default function FinanceDashboard({ compact = false }: Props) {
  return (
    <div style={{ background: '#0a0e1a', border: '1px solid #1a2540', padding: compact ? 10 : 12 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: compact ? 8 : 12, borderBottom: '1px solid #1a2540', paddingBottom: compact ? 6 : 8 }}>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: '#00ff9f', letterSpacing: 2 }}>
          ▶ รายได้แยกตาม CHANNEL — ข้อมูลจำลอง
        </div>
        {!compact && (
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#00ff9f' }}>
              ช่องทางดีที่สุด: <span style={{ color: CHANNEL_CONFIG[companySummary.bestChannel].color }}>{CHANNEL_CONFIG[companySummary.bestChannel].label}</span>
            </div>
            {companySummary.worstChannel && (
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#ff5252' }}>
                ช่องทางขาดทุน: <span style={{ color: CHANNEL_CONFIG[companySummary.worstChannel].color }}>{CHANNEL_CONFIG[companySummary.worstChannel].label}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Channel cards */}
      <div style={{ display: 'flex', gap: 10, marginBottom: compact ? 0 : 12 }}>
        {channelSummaries.map(s => (
          <RevenueByChannel key={s.channel} summary={s} compact={compact} />
        ))}
      </div>

      {/* Company total strip — full mode only */}
      {!compact && (
        <>
          <div style={{ background: '#060d1a', border: '1px solid #1a2540', padding: '8px 12px', display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <TotalChip label="รายได้รวมบริษัท"  value={formatTHB(companySummary.totalRevenue)}    color="#e8eaf6" />
            <TotalChip label="กำไรสุทธิรวม"     value={formatTHB(companySummary.totalNetProfit)}  color="#00ff9f" />
            <TotalChip label="ค่าโฆษณารวม"      value={formatTHB(companySummary.totalAdSpend)}    color="#ffb300" />
            <TotalChip label="ROAS เฉลี่ย"       value={`${companySummary.avgRoas}x`}              color={companySummary.avgRoas >= 4 ? '#00ff9f' : '#ffb300'} />
            <TotalChip label="ยอดรอรับเงินรวม"  value={formatTHB(companySummary.totalPendingPayout)} color="#8892b0" />
            {companySummary.activeWarnings.slice(0, 2).map((w, i) => (
              <div key={i} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#ff5252', background: '#ff525211', padding: '2px 8px', borderLeft: '2px solid #ff5252' }}>
                ⚠ {w}
              </div>
            ))}
          </div>

          {/* Recommendation strip */}
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {channelSummaries.map(s => {
              const recCfg = RECOMMENDATION_CONFIG[s.recommendation]
              const chCfg  = CHANNEL_CONFIG[s.channel]
              return (
                <div key={s.channel} style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: recCfg.color, background: `${recCfg.color}11`, padding: '3px 10px', border: `1px solid ${recCfg.color}44`, letterSpacing: 1 }}>
                  <span style={{ color: chCfg.color }}>{chCfg.label}</span>
                  {' → '}
                  {recCfg.label}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function TotalChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 18, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 8, color: '#2a3560', letterSpacing: 0.5, marginTop: 1 }}>{label}</div>
    </div>
  )
}
