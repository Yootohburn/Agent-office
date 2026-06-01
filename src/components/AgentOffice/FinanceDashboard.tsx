import { channelSummaries, companySummary, RECOMMENDATION_CONFIG, MONTHLY_GOALS, AD_BUDGET } from '../../agents/financeRegistry'
import { campaigns, CHANNEL_CONFIG, formatTHB } from '../../agents/campaignRegistry'
import type { CampaignChannel } from '../../agents/campaignRegistry'
import RevenueByChannel from './RevenueByChannel'

interface Props {
  compact?: boolean
  onSelectChannel?: (channel: CampaignChannel) => void
  selectedChannelId?: CampaignChannel | null
}

export default function FinanceDashboard({ compact = false, onSelectChannel, selectedChannelId }: Props) {
  const revenueProgress = Math.min(100, Math.round((companySummary.totalRevenue / MONTHLY_GOALS.revenueTarget) * 100))
  const profitProgress  = Math.min(100, Math.round((companySummary.totalNetProfit / MONTHLY_GOALS.profitTarget) * 100))
  const budgetProgress  = Math.min(100, Math.round((AD_BUDGET.spent / AD_BUDGET.totalBudget) * 100))

  return (
    <div style={{ background: '#0a0e1a', border: '1px solid #1a2540', padding: compact ? 10 : 12 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: compact ? 8 : 12, borderBottom: '1px solid #1a2540', paddingBottom: compact ? 6 : 8 }}>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 16, color: '#00ff9f', letterSpacing: 2 }}>
          ▶ การเงินและงบโฆษณา — ข้อมูลจำลอง
        </div>
        {!compact && (
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#00ff9f' }}>
              ช่องทางดีที่สุด: <span style={{ color: CHANNEL_CONFIG[companySummary.bestChannel].color }}>{CHANNEL_CONFIG[companySummary.bestChannel].label}</span>
            </div>
            {companySummary.worstChannel && (
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#ff5252' }}>
                ขาดทุน: <span style={{ color: CHANNEL_CONFIG[companySummary.worstChannel].color }}>{CHANNEL_CONFIG[companySummary.worstChannel].label}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Section 1: Monthly Goal Board (full mode only) ── */}
      {!compact && (
        <div style={{ background: '#060d1a', border: '1px solid #1a2540', padding: '12px 14px', marginBottom: 12 }}>
          <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: '#00ff9f', letterSpacing: 2, marginBottom: 10 }}>
            ▶ เป้าหมายรายเดือน
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <GoalBar
              label="เป้ารายได้"
              current={companySummary.totalRevenue}
              target={MONTHLY_GOALS.revenueTarget}
              progress={revenueProgress}
              color="#00e5ff"
            />
            <GoalBar
              label="เป้ากำไร"
              current={companySummary.totalNetProfit}
              target={MONTHLY_GOALS.profitTarget}
              progress={profitProgress}
              color="#00ff9f"
            />
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 10 }}>
            <RoasGoalChip
              label="ROAS เป้า"
              current={companySummary.avgRoas}
              target={MONTHLY_GOALS.roasTarget}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#2a3560', letterSpacing: 1 }}>แคมเปญที่ทำ</span>
              <span style={{ fontFamily: 'VT323, monospace', fontSize: 18, color: '#e8eaf6' }}>
                {campaigns.length}
                <span style={{ fontSize: 13, color: '#2a3560' }}> / {MONTHLY_GOALS.campaignsTarget}</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Section 2: Channel P&L Cards ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: compact ? 0 : 12 }}>
        {channelSummaries.map(s => (
          <RevenueByChannel
            key={s.channel}
            summary={s}
            compact={compact}
            onSelect={!compact && onSelectChannel ? () => onSelectChannel(s.channel) : undefined}
            isSelected={!compact && selectedChannelId === s.channel}
          />
        ))}
      </div>

      {/* Full mode sections */}
      {!compact && (
        <>
          {/* ── Section 3: Campaign Profit Table ── */}
          <div style={{ background: '#060d1a', border: '1px solid #1a2540', marginBottom: 12 }}>
            <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: '#00e5ff', letterSpacing: 2, padding: '8px 12px', borderBottom: '1px solid #1a2540' }}>
              ▶ กำไร-ขาดทุน ต่อแคมเปญ
            </div>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr', gap: 0, padding: '5px 12px', background: '#0a0e1a' }}>
              {['แคมเปญ', 'ช่องทาง', 'รายได้', 'ค่าแอด', 'คอมมิชชั่น', 'กำไรสุทธิ', 'ROAS'].map(h => (
                <span key={h} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#2a3560', letterSpacing: 0.5 }}>{h}</span>
              ))}
            </div>
            {campaigns.map(c => {
              const chCfg  = CHANNEL_CONFIG[c.channel]
              const isLoss = c.finance.netProfit < 0
              const roasClr = c.finance.roas >= 4 ? '#00ff9f' : c.finance.roas >= 2 ? '#ffb300' : '#ff5252'
              const rec = c.finance.roas >= 5.0 ? 'scale' : c.finance.netProfit < 0 ? 'stop' : c.finance.roas < 2.0 ? 'stop' : 'maintain'
              const recCfg = RECOMMENDATION_CONFIG[rec]
              return (
                <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr', gap: 0, padding: '6px 12px', borderTop: '1px solid #1a2540', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 12, color: '#e8eaf6', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                    <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: recCfg.color, marginTop: 1, letterSpacing: 0.5 }}>{recCfg.label}</div>
                  </div>
                  <span style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: chCfg.color, background: `${chCfg.color}18`, padding: '1px 5px', letterSpacing: 1, alignSelf: 'start' }}>{chCfg.label}</span>
                  <CellVal value={formatTHB(c.finance.revenue)}    color="#e8eaf6" />
                  <CellVal value={formatTHB(c.finance.adSpend)}    color="#ffb300" />
                  <CellVal value={formatTHB(c.finance.commission)} color="#00e5ff" />
                  <CellVal value={formatTHB(c.finance.netProfit)}  color={isLoss ? '#ff5252' : '#00ff9f'} />
                  <CellVal value={`${c.finance.roas}x`}            color={roasClr} />
                </div>
              )
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>

            {/* ── Section 4: Ad Budget Control Panel ── */}
            <div style={{ background: '#060d1a', border: '1px solid #1a2540', padding: '10px 12px' }}>
              <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: '#ffb300', letterSpacing: 2, marginBottom: 10 }}>
                ▶ งบโฆษณาเดือนนี้
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#4a5680' }}>ใช้ไปแล้ว</span>
                <span style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: '#ffb300' }}>{formatTHB(AD_BUDGET.spent)} / {formatTHB(AD_BUDGET.totalBudget)}</span>
              </div>
              <div style={{ background: '#1a2540', height: 6, marginBottom: 8, position: 'relative' }}>
                <div style={{ background: budgetProgress > 80 ? '#ff5252' : '#ffb300', height: '100%', width: `${budgetProgress}%` }} />
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#2a3560', marginBottom: 1 }}>คงเหลือ</div>
                  <div style={{ fontFamily: 'VT323, monospace', fontSize: 16, color: '#00ff9f' }}>{formatTHB(AD_BUDGET.remaining)}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#2a3560', marginBottom: 1 }}>Break-even ROAS</div>
                  <div style={{ fontFamily: 'VT323, monospace', fontSize: 16, color: '#ffb300' }}>{AD_BUDGET.breakEvenRoas}x</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#2a3560', marginBottom: 1 }}>Target ROAS</div>
                  <div style={{ fontFamily: 'VT323, monospace', fontSize: 16, color: '#00e5ff' }}>{AD_BUDGET.targetRoas}x</div>
                </div>
              </div>
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#00ff9f', letterSpacing: 1, marginBottom: 4 }}>ควรเพิ่มงบ ↑</div>
                {AD_BUDGET.scale.map(id => {
                  const c = campaigns.find(x => x.id === id)
                  return c ? (
                    <div key={id} style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 11, color: '#00ff9f', padding: '2px 0', borderBottom: '1px solid #1a2540' }}>
                      ▲ {c.name} ({c.finance.roas}x)
                    </div>
                  ) : null
                })}
              </div>
              <div>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#ff5252', letterSpacing: 1, marginBottom: 4 }}>ควรหยุด ↓</div>
                {AD_BUDGET.pause.map(id => {
                  const c = campaigns.find(x => x.id === id)
                  return c ? (
                    <div key={id} style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 11, color: '#ff5252', padding: '2px 0', borderBottom: '1px solid #1a2540' }}>
                      ▼ {c.name} ({c.finance.roas}x)
                    </div>
                  ) : null
                })}
              </div>
            </div>

            {/* ── Section 5: Finance Alerts ── */}
            <div style={{ background: '#060d1a', border: '1px solid #1a2540', padding: '10px 12px' }}>
              <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: '#ff5252', letterSpacing: 2, marginBottom: 10 }}>
                ▶ Finance Alerts
              </div>
              {companySummary.activeWarnings.map((w, i) => (
                <AlertRow key={i} text={w} level="error" />
              ))}
              {companySummary.totalNetProfit < companySummary.totalRevenue * 0.3 && (
                <AlertRow text={`อัตรากำไรต่ำกว่า 30% — ควรลดต้นทุน content`} level="warning" />
              )}
              {companySummary.avgRoas < MONTHLY_GOALS.roasTarget && (
                <AlertRow text={`ROAS เฉลี่ย ${companySummary.avgRoas}x ยังไม่ถึงเป้า ${MONTHLY_GOALS.roasTarget}x`} level="warning" />
              )}
              {companySummary.totalPendingPayout > 0 && (
                <AlertRow text={`ยอดรอรับเงินรวม ${formatTHB(companySummary.totalPendingPayout)} — ติดตาม affiliate`} level="info" />
              )}
              {companySummary.activeWarnings.length === 0 && companySummary.avgRoas >= MONTHLY_GOALS.roasTarget && (
                <AlertRow text="ทุกตัวชี้วัดผ่านเป้า — ดีมาก" level="success" />
              )}
            </div>

          </div>

          {/* ── Section 6: Next Finance Actions ── */}
          <div style={{ background: '#060d1a', border: '1px solid #1a2540', padding: '10px 14px' }}>
            <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: '#00e5ff', letterSpacing: 2, marginBottom: 10 }}>
              ▶ Next Finance Actions
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[
                { priority: 'high',   text: 'หยุดยิงแอด Portable Blender — ROAS 2.0x ขาดทุน', color: '#ff5252' },
                { priority: 'high',   text: 'เพิ่มงบ Skincare Travel Pouch — ROAS 7.2x คุ้มมาก', color: '#00ff9f' },
                { priority: 'medium', text: 'รวบรวมตัวเลข commission รายเดือนส่ง CEO', color: '#ffb300' },
                { priority: 'medium', text: 'ทำ P&L report สรุปสัปดาห์นี้', color: '#ffb300' },
                { priority: 'low',    text: 'ตรวจสอบ affiliate link ที่ยังรอ payout', color: '#00e5ff' },
                { priority: 'low',    text: 'เตรียม forecast เป้าหมายเดือนหน้า', color: '#00e5ff' },
              ].map((item, i) => (
                <div key={i} style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 12, color: item.color, background: `${item.color}0a`, padding: '6px 8px', borderLeft: `2px solid ${item.color}`, lineHeight: 1.5 }}>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Company total strip */}
          <div style={{ background: '#060d1a', border: '1px solid #1a2540', padding: '8px 12px', display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', marginTop: 12 }}>
            <TotalChip label="รายได้รวมบริษัท"  value={formatTHB(companySummary.totalRevenue)}    color="#e8eaf6" />
            <TotalChip label="กำไรสุทธิรวม"     value={formatTHB(companySummary.totalNetProfit)}  color="#00ff9f" />
            <TotalChip label="ค่าโฆษณารวม"      value={formatTHB(companySummary.totalAdSpend)}    color="#ffb300" />
            <TotalChip label="ROAS เฉลี่ย"       value={`${companySummary.avgRoas}x`}              color={companySummary.avgRoas >= 4 ? '#00ff9f' : '#ffb300'} />
            <TotalChip label="ยอดรอรับเงินรวม"  value={formatTHB(companySummary.totalPendingPayout)} color="#8892b0" />
          </div>

          {/* Recommendation strip */}
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {channelSummaries.map(s => {
              const recCfg = RECOMMENDATION_CONFIG[s.recommendation]
              const chCfg  = CHANNEL_CONFIG[s.channel]
              return (
                <div key={s.channel} style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: recCfg.color, background: `${recCfg.color}11`, padding: '3px 10px', border: `1px solid ${recCfg.color}44`, letterSpacing: 1 }}>
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

// ── Sub-components ────────────────────────────────────────

function GoalBar({ label, current, target, progress, color }: { label: string; current: number; target: number; progress: number; color: string }) {
  const overGoal = progress >= 100
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#4a5680', letterSpacing: 0.5 }}>{label}</span>
        <span style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: overGoal ? '#00ff9f' : color }}>
          {formatTHB(current)} <span style={{ color: '#2a3560' }}>/ {formatTHB(target)}</span>
        </span>
      </div>
      <div style={{ background: '#1a2540', height: 8, position: 'relative' }}>
        <div style={{ background: overGoal ? '#00ff9f' : color, height: '100%', width: `${progress}%`, transition: 'width 0.3s' }} />
      </div>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: overGoal ? '#00ff9f' : color, marginTop: 2 }}>
        {overGoal ? '✓ ผ่านเป้าแล้ว' : `${progress}%`}
      </div>
    </div>
  )
}

function RoasGoalChip({ label, current, target }: { label: string; current: number; target: number }) {
  const met = current >= target
  const color = met ? '#00ff9f' : current >= target * 0.7 ? '#ffb300' : '#ff5252'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#2a3560', letterSpacing: 1 }}>{label}</span>
      <span style={{ fontFamily: 'VT323, monospace', fontSize: 18, color }}>
        {current}x <span style={{ fontSize: 13, color: '#2a3560' }}>/ {target}x</span>
      </span>
    </div>
  )
}

function CellVal({ value, color }: { value: string; color: string }) {
  return <span style={{ fontFamily: 'VT323, monospace', fontSize: 13, color, letterSpacing: 0.3 }}>{value}</span>
}

function AlertRow({ text, level }: { text: string; level: 'error' | 'warning' | 'info' | 'success' }) {
  const colors = { error: '#ff5252', warning: '#ffb300', info: '#00e5ff', success: '#00ff9f' }
  const icons  = { error: '⛔', warning: '⚠', info: 'ℹ', success: '✓' }
  const color  = colors[level]
  return (
    <div style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 12, color, background: `${color}0d`, padding: '5px 8px', borderLeft: `2px solid ${color}`, marginBottom: 4, lineHeight: 1.5 }}>
      {icons[level]} {text}
    </div>
  )
}

function TotalChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 18, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#2a3560', letterSpacing: 0.5, marginTop: 1 }}>{label}</div>
    </div>
  )
}
