import type { ProductIntakeFormData, PerformanceDaily, RiskLog, RiskLevel, Marketplace } from '../../data/types'

type Row = Record<string, string>

export function mapRowToProduct(row: Row): ProductIntakeFormData | null {
  const marketplace = row['marketplace'] as Marketplace
  if (!['shopee', 'lazada', 'tiktok'].includes(marketplace)) return null
  return {
    title_th:          row['title_th']          ?? row['title_raw'] ?? '',
    title_raw:         row['title_raw']         ?? row['title_th']  ?? '',
    product_url:       row['product_url']       ?? '',
    marketplace,
    shop_name:         row['shop_name']         ?? '',
    category:          row['category']          ?? '',
    subcategory:       row['subcategory']       ?? '',
    price_now:         parseFloat(row['price_now'])       || 0,
    price_normal:      parseFloat(row['price_normal'])    || parseFloat(row['price_now']) || 0,
    commission_rate:   parseFloat(row['commission_rate']) || 0,
    rating:            parseFloat(row['rating'])          || 0,
    review_count:      parseInt(row['review_count'])      || 0,
    sold_count:        parseInt(row['sold_count'])        || 0,
    product_image_url: row['product_image_url'] ?? '',
    notes:             row['notes']             ?? '',
    target_platform:   row['target_platform']   ?? marketplace,
    campaign_goal:     row['campaign_goal']     ?? '',
  }
}

export function mapRowToPerformanceDaily(row: Row): PerformanceDaily {
  return {
    perf_id:    row['perf_id']    || `perf-${Date.now()}`,
    campaign_id: row['campaign_id'] ?? '',
    product_id:  row['product_id']  ?? '',
    date:        row['date']        ?? '',
    views:       parseInt(row['views'])    || 0,
    clicks:      parseInt(row['clicks'])   || 0,
    orders:      parseInt(row['orders'])   || 0,
    revenue:     parseFloat(row['revenue'])    || 0,
    commission:  parseFloat(row['commission']) || 0,
    ctr:         parseFloat(row['ctr'])        || 0,
    roas:        parseFloat(row['roas'])       || 0,
    created_at:  new Date().toISOString(),
  }
}

export function mapRowToRiskLog(row: Row): RiskLog {
  return {
    risk_id:     row['risk_id']     || `risk-${Date.now()}`,
    campaign_id: row['campaign_id'] ?? '',
    product_id:  row['product_id']  ?? '',
    stage:       row['stage']       ?? '',
    risk_type:   row['risk_type']   ?? '',
    description: row['description'] ?? '',
    severity:    (row['severity'] as RiskLevel) || 'medium',
    resolved:    row['resolved'] === 'true',
    created_at:  row['created_at']  || new Date().toISOString(),
    updated_at:  new Date().toISOString(),
  }
}
