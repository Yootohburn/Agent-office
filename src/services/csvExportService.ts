import type { Product, AgentTaskRecord, RiskLog } from '../data/types'
import type { Campaign } from '../agents/campaignRegistry'

function escapeCell(value: unknown): string {
  const s = String(value ?? '')
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"`
    : s
}

function row(values: unknown[]): string {
  return values.map(escapeCell).join(',')
}

export function exportProductsCSV(products: Product[]): string {
  const header = row([
    'product_id', 'marketplace', 'title_th', 'shop_name', 'category', 'subcategory',
    'price_now', 'price_normal', 'discount_pct', 'commission_rate', 'est_commission_baht',
    'rating', 'review_count', 'sold_count', 'claim_risk', 'return_risk',
    'suitability_score', 'sync_status', 'product_url', 'created_at',
  ])
  const rows = products.map(p => row([
    p.product_id, p.marketplace, p.title_th, p.shop_name, p.category, p.subcategory,
    p.price_now, p.price_normal, p.discount_pct, p.commission_rate, p.est_commission_baht,
    p.rating, p.review_count, p.sold_count, p.claim_risk, p.return_risk,
    p.suitability_score, p.sync_status ?? 'local_only', p.product_url, p.created_at,
  ]))
  return [header, ...rows].join('\n')
}

export function exportCampaignsCSV(campaigns: Campaign[]): string {
  const header = row([
    'id', 'name', 'channel', 'marketplace', 'category', 'stage', 'progress',
    'commission_rate', 'est_commission_baht', 'claim_risk', 'return_risk',
    'suitability_score', 'roas', 'revenue', 'net_profit', 'notes', 'created_at',
  ])
  const rows = campaigns.map(c => row([
    c.id, c.name, c.channel, c.marketplace, c.category, c.stage, c.progress,
    c.commission_rate, c.est_commission_baht, c.claim_risk, c.return_risk,
    c.suitability_score, c.finance.roas, c.finance.revenue, c.finance.netProfit,
    c.notes, c.created_at ?? '',
  ]))
  return [header, ...rows].join('\n')
}

export function exportTasksCSV(tasks: AgentTaskRecord[]): string {
  const header = row([
    'task_id', 'campaign_id', 'product_id', 'agent_id', 'stage', 'status',
    'human_review_required', 'risk_flags', 'created_at', 'updated_at',
  ])
  const rows = tasks.map(t => row([
    t.task_id, t.campaign_id, t.product_id, t.agent_id, t.stage, t.status,
    t.human_review_required, t.risk_flags.join(';'), t.created_at, t.updated_at,
  ]))
  return [header, ...rows].join('\n')
}

export function exportRiskLogCSV(riskLog: RiskLog[]): string {
  const header = row([
    'risk_id', 'campaign_id', 'product_id', 'stage',
    'risk_type', 'description', 'severity', 'resolved', 'created_at',
  ])
  const rows = riskLog.map(r => row([
    r.risk_id, r.campaign_id, r.product_id, r.stage,
    r.risk_type, r.description, r.severity, r.resolved, r.created_at,
  ]))
  return [header, ...rows].join('\n')
}

export function downloadCSV(filename: string, csvString: string): void {
  const blob = new Blob(['﻿' + csvString], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
