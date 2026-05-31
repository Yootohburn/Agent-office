import { campaigns, getCampaignsByChannel, formatTHB } from './campaignRegistry'
import type { CampaignChannel } from './campaignRegistry'

export interface ChannelFinanceSummary {
  channel: CampaignChannel
  revenue: number
  commission: number
  adSpend: number
  contentCost: number
  netProfit: number
  roas: number
  pendingPayout: number
  warnings: string[]
  recommendation: 'scale' | 'maintain' | 'stop' | 'review'
}

export interface CompanyFinanceSummary {
  totalRevenue: number
  totalCommission: number
  totalAdSpend: number
  totalContentCost: number
  totalNetProfit: number
  avgRoas: number
  totalPendingPayout: number
  bestChannel: CampaignChannel
  worstChannel: CampaignChannel | null
  activeWarnings: string[]
}

function sumCampaigns(channel: CampaignChannel): ChannelFinanceSummary {
  const cs = getCampaignsByChannel(channel)
  const revenue      = cs.reduce((s, c) => s + c.finance.revenue, 0)
  const commission   = cs.reduce((s, c) => s + c.finance.commission, 0)
  const adSpend      = cs.reduce((s, c) => s + c.finance.adSpend, 0)
  const contentCost  = cs.reduce((s, c) => s + c.finance.contentCost, 0)
  const netProfit    = cs.reduce((s, c) => s + c.finance.netProfit, 0)
  const pendingPayout = cs.reduce((s, c) => s + c.finance.pendingPayout, 0)
  const roas = adSpend > 0 ? parseFloat((revenue / adSpend).toFixed(1)) : 0

  const warnings: string[] = []
  if (netProfit < 0)     warnings.push(`ค่าโฆษณาสูงกว่ากำไร — ขาดทุน ${formatTHB(netProfit)}`)
  if (roas < 2.0)        warnings.push(`ROAS ต่ำกว่าเป้าหมาย (${roas}x vs เป้า 4.0x)`)
  if (pendingPayout > 0) warnings.push(`ค่าคอมมิชชั่นยังรอรับเงิน ${formatTHB(pendingPayout)}`)

  let recommendation: ChannelFinanceSummary['recommendation'] = 'maintain'
  if (roas >= 5.0)  recommendation = 'scale'
  if (roas < 2.0)   recommendation = 'stop'
  if (netProfit < 0) recommendation = 'stop'

  return { channel, revenue, commission, adSpend, contentCost, netProfit, roas, pendingPayout, warnings, recommendation }
}

export const channelSummaries: ChannelFinanceSummary[] = [
  sumCampaigns('tiktok'),
  sumCampaigns('shopee'),
  sumCampaigns('lazada'),
]

function buildCompanySummary(): CompanyFinanceSummary {
  const totalRevenue      = channelSummaries.reduce((s, c) => s + c.revenue, 0)
  const totalCommission   = channelSummaries.reduce((s, c) => s + c.commission, 0)
  const totalAdSpend      = channelSummaries.reduce((s, c) => s + c.adSpend, 0)
  const totalContentCost  = channelSummaries.reduce((s, c) => s + c.contentCost, 0)
  const totalNetProfit    = channelSummaries.reduce((s, c) => s + c.netProfit, 0)
  const totalPendingPayout = channelSummaries.reduce((s, c) => s + c.pendingPayout, 0)
  const avgRoas = totalAdSpend > 0 ? parseFloat((totalRevenue / totalAdSpend).toFixed(1)) : 0

  const sorted = [...channelSummaries].sort((a, b) => b.netProfit - a.netProfit)
  const bestChannel = sorted[0].channel
  const worstChannel = sorted[sorted.length - 1].netProfit < 0 ? sorted[sorted.length - 1].channel : null

  const activeWarnings: string[] = []
  campaigns.forEach(c => {
    c.financeWarnings.forEach(w => {
      if (!activeWarnings.includes(w)) activeWarnings.push(w)
    })
  })

  return { totalRevenue, totalCommission, totalAdSpend, totalContentCost, totalNetProfit, avgRoas, totalPendingPayout, bestChannel, worstChannel, activeWarnings }
}

export const companySummary = buildCompanySummary()

export const RECOMMENDATION_CONFIG = {
  scale:    { label: 'ควรเพิ่มงบ',   color: '#00ff9f' },
  maintain: { label: 'คงงบไว้',      color: '#00e5ff' },
  stop:     { label: 'ควรหยุดยิงแอด', color: '#ff5252' },
  review:   { label: 'รอรีวิว',      color: '#ffb300' },
} as const
