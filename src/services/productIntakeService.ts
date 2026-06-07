// Orchestrates product submission: Product → Campaign → AgentTask → Log → Chat.
// All data stays local (Phase 1). Phase 2: replace repository calls with API calls.

import type { ProductIntakeFormData, Product, AgentTaskRecord, SyncStatus } from '../data/types'
import type { Campaign, CampaignFinance, ProductScores }        from '../agents/campaignRegistry'
import type { ActivityLogEntry, TeamChatMessage }               from '../agents/agentSessionStore'
import { productRepository }  from '../data/productRepository'
import { campaignRepository } from '../data/campaignRepository'
import { taskRepository }     from '../data/taskRepository'

const CONTENT_COST_ESTIMATE = 500  // THB fixed estimate per campaign

// ── Scoring heuristics ────────────────────────────────────────────────────────

function calcSuitabilityScore(form: ProductIntakeFormData): number {
  const ratingPts  = form.rating     >= 4.5 ? 9 : form.rating  >= 4.0 ? 7 : form.rating  >= 3.5 ? 5 : 3
  const soldPts    = form.sold_count >= 1000 ? 9 : form.sold_count  >= 500 ? 7 : form.sold_count  >= 100 ? 5 : 3
  const reviewPts  = form.review_count >= 200 ? 9 : form.review_count >= 100 ? 7 : form.review_count >= 50 ? 5 : 3
  const commPts    = form.commission_rate >= 10 ? 9 : form.commission_rate >= 5 ? 7 : form.commission_rate >= 2 ? 5 : 3
  const discPts    = form.price_normal > form.price_now
    ? ((form.price_normal - form.price_now) / form.price_normal >= 0.3 ? 9 : 7)
    : 5
  return Math.min(100, Math.round((ratingPts + soldPts + reviewPts + commPts + discPts) / 5 * 10))
}

function calcDiscountPct(priceNow: number, priceNormal: number): number {
  if (priceNormal <= 0 || priceNormal <= priceNow) return 0
  return Math.round((priceNormal - priceNow) / priceNormal * 100)
}

// ── Timestamp helpers ─────────────────────────────────────────────────────────

function nowHMS(): string {
  const n = new Date()
  return [n.getHours(), n.getMinutes(), n.getSeconds()]
    .map(v => String(v).padStart(2, '0'))
    .join(':')
}

function nowHM(): string {
  const n = new Date()
  return [n.getHours(), n.getMinutes()]
    .map(v => String(v).padStart(2, '0'))
    .join(':')
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface ProductIntakeResult {
  product:     Product
  campaign:    Campaign
  firstTask:   AgentTaskRecord
  logEntry:    ActivityLogEntry
  chatMessage: TeamChatMessage
}

export function submitProduct(
  form:        ProductIntakeFormData,
  nextLogId:   number,
  syncStatus:  SyncStatus = 'local_only',
): ProductIntakeResult {
  const now        = new Date().toISOString()
  const productId  = `prod-${Date.now()}`
  const campaignId = `camp-${Date.now()}`

  // ── 1. Build Product ───────────────────────────────────────────────────────
  const discountPct        = calcDiscountPct(form.price_now, form.price_normal)
  const estCommissionBaht  = Math.round(form.price_now * form.commission_rate / 100)
  const suitabilityScore   = calcSuitabilityScore(form)

  const product: Product = {
    product_id:          productId,
    product_url:         form.product_url,
    marketplace:         form.marketplace,
    shop_name:           form.shop_name,
    title_th:            form.title_th,
    title_raw:           form.title_raw || form.title_th,
    category:            form.category,
    subcategory:         form.subcategory,
    price_now:           form.price_now,
    price_normal:        form.price_normal,
    discount_pct:        discountPct,
    rating:              form.rating,
    review_count:        form.review_count,
    sold_count:          form.sold_count,
    commission_rate:     form.commission_rate,
    est_commission_baht: estCommissionBaht,
    product_image_url:   form.product_image_url,
    claim_risk:          'medium',    // refined by Product Research agent
    return_risk:         'medium',
    suitability_score:   suitabilityScore,
    notes:               form.notes,
    target_platform:     form.target_platform || form.marketplace,
    campaign_goal:       form.campaign_goal,
    sync_status:         syncStatus,
    created_at:          now,
    updated_at:          now,
  }

  // ── 2. Build Campaign ──────────────────────────────────────────────────────
  const estBreakEvenRoas = estCommissionBaht > 0
    ? parseFloat(((CONTENT_COST_ESTIMATE + estCommissionBaht) / estCommissionBaht).toFixed(1))
    : 0

  const finance: CampaignFinance = {
    revenue:        0,
    commission:     0,
    adSpend:        0,
    contentCost:    CONTENT_COST_ESTIMATE,
    netProfit:      0,
    roas:           0,
    conversionRate: 0,
    costPerOrder:   0,
    pendingPayout:  0,
  }

  const scores: ProductScores = {
    demo_score:          0,
    price_score:         discountPct >= 30 ? 8 : discountPct >= 15 ? 6 : 4,
    commission_score:    form.commission_rate >= 10 ? 8 : form.commission_rate >= 5 ? 6 : 4,
    impulse_score:       0,
    risk_score:          0,
    content_angle_score: 0,
    platform_fit_score:  0,
    final_score:         0,
  }

  const campaign: Campaign = {
    id:               campaignId,
    name:             form.title_th,
    channel:          form.marketplace,
    marketplace:      form.marketplace,
    category:         form.category,
    subcategory:      form.subcategory,
    targetPrice:      `฿${form.price_now.toLocaleString()}`,
    stage:            'new_product',
    progress:         5,
    assignedAgentId:  'product-research',
    brief:            `สินค้าใหม่ป้อนด้วยตนเอง — ${form.title_th} | ${form.marketplace.toUpperCase()} | ฿${form.price_now.toLocaleString()} | commission ${form.commission_rate}%`,
    finance,
    notes:            form.notes || `เป้าหมาย: ${form.campaign_goal || 'ทั่วไป'}`,
    financeWarnings:  estBreakEvenRoas > 3
      ? [`Break-even ROAS ~${estBreakEvenRoas}x — ทดสอบก่อนสเกล`]
      : [],
    riskLevel:        'medium',
    riskMessage:      'รอ Product Research ยืนยันข้อมูลและความเสี่ยง',
    outputs:          [],
    commission_rate:  form.commission_rate / 100,   // Campaign stores as decimal
    est_commission_baht: estCommissionBaht,
    claim_risk:       'medium',
    return_risk:      'medium',
    suitability_score: suitabilityScore,
    scores,
    // v2.5 extended fields
    product_id:       productId,
    next_action:      'รัน Product Research Agent',
    created_at:       now,
    updated_at:       now,
  }

  // ── 3. First AgentTask ─────────────────────────────────────────────────────
  const firstTask: AgentTaskRecord = {
    task_id:               `task-${campaignId}-new_product`,
    campaign_id:           campaignId,
    product_id:            productId,
    agent_id:              'product-research',
    stage:                 'new_product',
    status:                'pending',
    input_json:            {
      product_id:  productId,
      title_th:    form.title_th,
      marketplace: form.marketplace,
      price_now:   form.price_now,
    },
    output_json:           {},
    risk_flags:            [],
    human_review_required: false,
    created_at:            now,
    updated_at:            now,
  }

  // ── 4. Activity log entry ──────────────────────────────────────────────────
  const logEntry: ActivityLogEntry = {
    id:         String(nextLogId),
    timestamp:  nowHMS(),
    agentId:    'system',
    agentName:  'SYSTEM',
    message:    `[${campaignId}] สินค้าใหม่เข้าระบบ: "${form.title_th}" (${form.marketplace.toUpperCase()}) ฿${form.price_now.toLocaleString()} commission ${form.commission_rate}% — ส่ง Product Research แล้ว`,
    type:       'system',
    campaignId,
  }

  // ── 5. Team chat message ───────────────────────────────────────────────────
  const chatMessage: TeamChatMessage = {
    id:            `chat-intake-${Date.now()}`,
    timestamp:     nowHM(),
    senderAgentId: 'product-research',
    senderName:    'Research',
    accent:        '#00e5ff',
    message:       `รับสินค้าใหม่ "${form.title_th}" จาก ${form.marketplace.toUpperCase()} ฿${form.price_now.toLocaleString()} commission ${form.commission_rate}% — เริ่มตรวจสอบข้อมูลแล้วครับ`,
    campaignId,
  }

  // ── 6. Persist to localStorage ────────────────────────────────────────────
  productRepository.insert(product)
  campaignRepository.insert(campaign)
  taskRepository.insert(firstTask)

  return { product, campaign, firstTask, logEntry, chatMessage }
}
