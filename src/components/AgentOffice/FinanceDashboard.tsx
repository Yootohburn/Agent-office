import { channelSummaries, companySummary, RECOMMENDATION_CONFIG } from '../../agents/financeRegistry'
import { CHANNEL_CONFIG, formatTHB } from '../../agents/campaignRegistry'
import RevenueByChannel from './RevenueByChannel'

export default function FinanceDashboard() {
  const best = CHANNEL_CONFIG[companySummary.bestChannel]
  const worst = companySummary.worstChannel ? CHANNEL_CONFIG[companySummary.worstChannel] : null

  return (
    <div style={{ background: '#0a0e1a', border: '1px solid #1a2540', padding: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid #1a2540', paddingBottom: 8 }}>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: '#00ff9f', letterSpacing: 2 }}>
          ▶ รายได้แยกตาม CHANNEL — ข้อมูลจำลอง
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {best && (
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#00ff9f' }}>
              ช่องทางดีที่สุด: <span style={{ color: best.color }}>{best.label}</span>
            </div>
          )}
          {worst && (
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#ff5252' }}>
              ช่องทางขาดทุน: <span style={{ color: worst.color }}>{worst.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3-column channel cards */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        {channelSummaries.map(s => (
          <RevenueByChannel key={s.channel} summary={s} />
        ))}
      </div>

      {/* Company total strip */}
      <div
        style={{
          background: '#060d1a',
          border: '1px solid #1a2540',
          padding: '8px 12px',
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <TotalChip label="รายได้รวมบริษัท"   value={formatTHB(companySummary.totalRevenue)}    color="#e8eaf6" />
        <TotalChip label="กำไรสุทธิรวม"      value={formatTHB(companySummary.totalNetProfit)}  color="#00ff9f" />
        <TotalChip label="ค่าโฆษณารวม"       value={formatTHB(companySummary.totalAdSpend)}    color="#ffb300" />
        <TotalChip label="ROAS เฉลี่ย"        value={`${companySummary.avgRoas}x`}              color={companySummary.avgRoas >= 4 ? '#00ff9f' : '#ffb300'} />
        <TotalChip label="ยอดรอรับเงินรวม"   value={formatTHB(companySummary.totalPendingPayout)} color="#8892b0" />

        {/* Finance warnings strip */}
        {companySummary.activeWarnings.slice(0, 2).map((w, i) => (
          <div
            key={i}
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: 9,
              color: '#ff5252',
              background: '#ff525211',
              padding: '2px 8px',
              borderLeft: '2px solid #ff5252',
            }}
          >
            ⚠ {w}
          </div>
        ))}
      </div>

      {/* Recommendation summary */}
      <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
        {channelSummaries.map(s => {
          const recCfg = RECOMMENDATION_CONFIG[s.recommendation]
          const chCfg = CHANNEL_CONFIG[s.channel]
          return (
            <div
              key={s.channel}
              style={{
                fontFamily: 'VT323, monospace',
                fontSize: 12,
                color: recCfg.color,
                background: `${recCfg.color}11`,
                padding: '3px 10px',
                border: `1px solid ${recCfg.color}44`,
                letterSpacing: 1,
              }}
            >
              <span style={{ color: chCfg.color }}>{chCfg.label}</span>
              {' → '}
              {recCfg.label}
            </div>
          )
        })}
      </div>
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
