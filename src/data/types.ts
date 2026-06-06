// Canonical domain types for v2.5 Manual Product Intake.
// Phase 1: localStorage. Phase 2: replace repositories with Supabase client.

export type Marketplace    = 'shopee' | 'lazada' | 'tiktok'
export type RiskLevel      = 'low' | 'medium' | 'high'
export type TaskStatus     = 'pending' | 'in_progress' | 'done' | 'failed' | 'needs_review'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'needs_revision'

/** Full product record. commission_rate stored as percentage (e.g. 10 = 10%). */
export interface Product {
  product_id:          string
  product_url:         string
  marketplace:         Marketplace
  shop_name:           string
  title_th:            string
  title_raw:           string
  category:            string
  subcategory:         string
  price_now:           number
  price_normal:        number
  discount_pct:        number
  rating:              number
  review_count:        number
  sold_count:          number
  commission_rate:     number   // percent, e.g. 10 = 10%
  est_commission_baht: number   // per-unit: price_now * commission_rate / 100
  product_image_url:   string
  claim_risk:          RiskLevel
  return_risk:         RiskLevel
  suitability_score:   number   // 0–100
  notes:               string
  target_platform:     string
  campaign_goal:       string
  created_at:          string   // ISO string
  updated_at:          string
}

/** Persistent task record — one row per pipeline stage per campaign. */
export interface AgentTaskRecord {
  task_id:               string
  campaign_id:           string
  product_id:            string
  agent_id:              string
  stage:                 string
  status:                TaskStatus
  input_json:            Record<string, unknown>
  output_json:           Record<string, unknown>
  risk_flags:            string[]
  human_review_required: boolean
  created_at:            string
  updated_at:            string
}

/** Human approval gate record. One per campaign per review cycle. */
export interface HumanApproval {
  approval_id:   string
  campaign_id:   string
  stage:         string
  status:        ApprovalStatus
  reviewer_note: string
  created_at:    string
  updated_at:    string
}

/** Form data submitted from ProductIntakeForm. */
export interface ProductIntakeFormData {
  title_th:          string
  title_raw:         string
  product_url:       string
  marketplace:       Marketplace
  shop_name:         string
  category:          string
  subcategory:       string
  price_now:         number
  price_normal:      number
  commission_rate:   number   // percent, e.g. 10 = 10%
  rating:            number
  review_count:      number
  sold_count:        number
  product_image_url: string
  notes:             string
  target_platform:   string
  campaign_goal:     string
}
