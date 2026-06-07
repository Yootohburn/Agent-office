import { describe, it, expect, beforeEach } from 'vitest'
import { submitProduct } from '../productIntakeService'
import type { ProductIntakeFormData } from '../../data/types'

const BASE_FORM: ProductIntakeFormData = {
  title_th:          'ครีมบำรุงผิวหน้า',
  title_raw:         'Face Moisturizer',
  product_url:       'https://shopee.co.th/item/12345',
  marketplace:       'shopee',
  shop_name:         'Beauty Shop',
  category:          'ความงาม',
  subcategory:       'ครีมบำรุงผิว',
  price_now:         299,
  price_normal:      499,
  commission_rate:   10,
  rating:            4.8,
  review_count:      500,
  sold_count:        2000,
  product_image_url: '',
  notes:             '',
  target_platform:   'shopee',
  campaign_goal:     'ทดสอบ',
}

beforeEach(() => {
  localStorage.clear()
})

describe('submitProduct', () => {
  it('returns a product with correct price fields', () => {
    const { product } = submitProduct(BASE_FORM, 1)
    expect(product.price_now).toBe(299)
    expect(product.price_normal).toBe(499)
  })

  it('calculates discount_pct correctly', () => {
    const { product } = submitProduct(BASE_FORM, 1)
    // (499 - 299) / 499 * 100 = ~40%
    expect(product.discount_pct).toBe(40)
  })

  it('discount_pct is 0 when price_now >= price_normal', () => {
    const form = { ...BASE_FORM, price_normal: 200, price_now: 299 }
    const { product } = submitProduct(form, 1)
    expect(product.discount_pct).toBe(0)
  })

  it('calculates est_commission_baht correctly', () => {
    const { product } = submitProduct(BASE_FORM, 1)
    // 299 * 10 / 100 = 29.9 → rounded = 30
    expect(product.est_commission_baht).toBe(30)
  })

  it('assigns a product_id with prod- prefix', () => {
    const { product } = submitProduct(BASE_FORM, 1)
    expect(product.product_id).toMatch(/^prod-\d+$/)
  })

  it('suitability_score is between 0 and 100', () => {
    const { product } = submitProduct(BASE_FORM, 1)
    expect(product.suitability_score).toBeGreaterThanOrEqual(0)
    expect(product.suitability_score).toBeLessThanOrEqual(100)
  })

  it('high-quality product scores >= 70', () => {
    const { product } = submitProduct(BASE_FORM, 1)
    expect(product.suitability_score).toBeGreaterThanOrEqual(70)
  })

  it('low-quality product scores < 70', () => {
    const form: ProductIntakeFormData = {
      ...BASE_FORM,
      rating:          2.5,
      review_count:    10,
      sold_count:      20,
      commission_rate: 1,
      price_normal:    300,
      price_now:       295,
    }
    const { product } = submitProduct(form, 1)
    expect(product.suitability_score).toBeLessThan(70)
  })

  it('campaign starts at new_product stage', () => {
    const { campaign } = submitProduct(BASE_FORM, 1)
    expect(campaign.stage).toBe('new_product')
  })

  it('campaign commission_rate stored as decimal', () => {
    const { campaign } = submitProduct(BASE_FORM, 1)
    // form has 10%, campaign stores 0.10
    expect(campaign.commission_rate).toBeCloseTo(0.10)
  })

  it('first task is for product-research agent at new_product stage', () => {
    const { firstTask } = submitProduct(BASE_FORM, 1)
    expect(firstTask.agent_id).toBe('product-research')
    expect(firstTask.stage).toBe('new_product')
    expect(firstTask.status).toBe('pending')
  })

  it('first task campaign_id matches campaign id', () => {
    const { campaign, firstTask } = submitProduct(BASE_FORM, 1)
    expect(firstTask.campaign_id).toBe(campaign.id)
  })

  it('log entry message contains product title', () => {
    const { logEntry } = submitProduct(BASE_FORM, 1)
    expect(logEntry.message).toContain('ครีมบำรุงผิวหน้า')
  })

  it('chat message references product-research sender', () => {
    const { chatMessage } = submitProduct(BASE_FORM, 1)
    expect(chatMessage.senderAgentId).toBe('product-research')
  })

  it('persists product to localStorage', () => {
    submitProduct(BASE_FORM, 1)
    const stored = localStorage.getItem('agent_office_products')
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(1)
  })

  it('persists campaign to localStorage', () => {
    submitProduct(BASE_FORM, 1)
    const stored = localStorage.getItem('agent_office_campaigns')
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(1)
  })

  it('persists task to localStorage', () => {
    submitProduct(BASE_FORM, 1)
    const stored = localStorage.getItem('agent_office_tasks')
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(1)
  })
})
