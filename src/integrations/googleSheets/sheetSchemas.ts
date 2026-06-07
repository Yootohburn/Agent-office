export interface SheetSchema {
  name:            string
  columns:         string[]
  requiredColumns: string[]
}

export const PRODUCT_INTAKE_SCHEMA: SheetSchema = {
  name: 'Product_Intake',
  columns: [
    'product_id', 'marketplace', 'product_url', 'shop_name',
    'title_th', 'title_raw', 'category', 'subcategory',
    'price_now', 'price_normal', 'commission_rate',
    'rating', 'review_count', 'sold_count',
    'product_image_url', 'notes', 'target_platform', 'campaign_goal',
  ],
  requiredColumns: ['marketplace', 'product_url', 'category', 'price_now', 'commission_rate'],
}

export const CAMPAIGNS_SCHEMA: SheetSchema = {
  name: 'Campaigns',
  columns: [
    'id', 'name', 'channel', 'marketplace', 'category', 'subcategory',
    'targetPrice', 'stage', 'progress', 'commission_rate', 'est_commission_baht',
    'claim_risk', 'return_risk', 'suitability_score', 'notes', 'created_at',
  ],
  requiredColumns: ['id', 'name', 'channel', 'stage'],
}

export const PERFORMANCE_DAILY_SCHEMA: SheetSchema = {
  name: 'Performance_Daily',
  columns: [
    'perf_id', 'campaign_id', 'product_id', 'date',
    'views', 'clicks', 'orders', 'revenue', 'commission', 'ctr', 'roas',
  ],
  requiredColumns: ['campaign_id', 'date'],
}

export const RISK_LOG_SCHEMA: SheetSchema = {
  name: 'Risk_Log',
  columns: [
    'risk_id', 'campaign_id', 'product_id', 'stage',
    'risk_type', 'description', 'severity', 'resolved', 'created_at',
  ],
  requiredColumns: ['campaign_id', 'stage', 'risk_type', 'severity'],
}

export const ALL_SCHEMAS: SheetSchema[] = [
  PRODUCT_INTAKE_SCHEMA,
  CAMPAIGNS_SCHEMA,
  PERFORMANCE_DAILY_SCHEMA,
  RISK_LOG_SCHEMA,
]
