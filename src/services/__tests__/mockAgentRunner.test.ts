import { describe, it, expect } from 'vitest'
import { runMockAgent } from '../mockAgentRunner'
import type { Product } from '../../data/types'
import type { PipelineStage } from '../../agents/campaignRegistry'

const MOCK_PRODUCT: Product = {
  product_id:          'prod-test-001',
  product_url:         'https://shopee.co.th/test',
  marketplace:         'shopee',
  shop_name:           'Test Shop',
  title_th:            'สินค้าทดสอบ',
  title_raw:           'Test Product',
  category:            'ความงาม',
  subcategory:         'ครีมบำรุงผิว',
  price_now:           299,
  price_normal:        499,
  discount_pct:        40,
  rating:              4.8,
  review_count:        500,
  sold_count:          2000,
  commission_rate:     10,
  est_commission_baht: 30,
  product_image_url:   '',
  claim_risk:          'low',
  return_risk:         'low',
  suitability_score:   82,
  notes:               '',
  target_platform:     'shopee',
  campaign_goal:       'ทดสอบ',
  created_at:          '2026-01-01T00:00:00.000Z',
  updated_at:          '2026-01-01T00:00:00.000Z',
}

const ALL_STAGES: PipelineStage[] = [
  'new_product',
  'verified',
  'scored',
  'selected',
  'brief_ready',
  'script_ready',
  'asset_ready',
  'human_approved',
  'published',
  'analyzed',
  'learned',
]

describe('runMockAgent', () => {
  it('returns an output for every pipeline stage', () => {
    for (const stage of ALL_STAGES) {
      const out = runMockAgent(stage, MOCK_PRODUCT)
      expect(out.title,   `stage ${stage} missing title`).toBeTruthy()
      expect(out.summary, `stage ${stage} missing summary`).toBeTruthy()
      expect(out.content, `stage ${stage} missing content`).toBeTruthy()
      expect(Array.isArray(out.risks),          `stage ${stage} risks not array`).toBe(true)
      expect(typeof out.recommendation === 'string', `stage ${stage} recommendation not string`).toBe(true)
    }
  })

  it('new_product title contains the product name', () => {
    const out = runMockAgent('new_product', MOCK_PRODUCT)
    expect(out.title).toContain('สินค้าทดสอบ')
  })

  it('new_product content includes product fields', () => {
    const out = runMockAgent('new_product', MOCK_PRODUCT)
    expect(out.content).toContain('prod-test-001')
    expect(out.content).toContain('299')
    expect(out.content).toContain('10')
  })

  it('verified raises rating risk flag when rating < 4.0', () => {
    const lowRating = { ...MOCK_PRODUCT, rating: 3.5 }
    const out = runMockAgent('verified', lowRating)
    expect(out.risks.some(r => r.includes('Rating'))).toBe(true)
  })

  it('verified raises review risk flag when review_count < 100', () => {
    const fewReviews = { ...MOCK_PRODUCT, review_count: 50 }
    const out = runMockAgent('verified', fewReviews)
    expect(out.risks.some(r => r.includes('Review'))).toBe(true)
  })

  it('verified has no risks for a good product', () => {
    const out = runMockAgent('verified', MOCK_PRODUCT)
    expect(out.risks).toHaveLength(0)
  })

  it('scored flags low commission', () => {
    const lowComm = { ...MOCK_PRODUCT, est_commission_baht: 10 }
    const out = runMockAgent('scored', lowComm)
    expect(out.risks.some(r => r.includes('Commission'))).toBe(true)
  })

  it('scored flags high claim_risk', () => {
    const highRisk = { ...MOCK_PRODUCT, claim_risk: 'high' as const }
    const out = runMockAgent('scored', highRisk)
    expect(out.risks.some(r => r.includes('claim_risk'))).toBe(true)
  })

  it('scored recommendation: promote when suitability_score >= 70', () => {
    const out = runMockAgent('scored', MOCK_PRODUCT)
    expect(out.recommendation).toContain('แนะนำเลือกโปรโมท')
  })

  it('scored recommendation: caution when suitability_score < 70', () => {
    const low = { ...MOCK_PRODUCT, suitability_score: 60 }
    const out = runMockAgent('scored', low)
    expect(out.recommendation).toContain('ต่ำกว่าเกณฑ์')
  })

  it('human_approved adds claim_risk risk when not low', () => {
    const med = { ...MOCK_PRODUCT, claim_risk: 'medium' as const }
    const out = runMockAgent('human_approved', med)
    expect(out.risks.length).toBeGreaterThan(0)
  })

  it('human_approved has no risks when claim_risk is low', () => {
    const out = runMockAgent('human_approved', MOCK_PRODUCT)
    expect(out.risks).toHaveLength(0)
  })

  it('published content includes the product URL', () => {
    const out = runMockAgent('published', MOCK_PRODUCT)
    expect(out.content).toContain(MOCK_PRODUCT.product_url)
  })

  it('analyzed content shows mock disclaimer', () => {
    const out = runMockAgent('analyzed', MOCK_PRODUCT)
    expect(out.content).toContain('mock')
  })
})
