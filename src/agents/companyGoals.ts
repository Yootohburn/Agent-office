export const COMPANY_GOALS = {
  monthly_revenue_target:    50_000,
  monthly_profit_target:     15_000,
  target_roas:               5.0,
  target_content_win_rate:   0.60,
  target_turnaround_days:    5,
  target_skus_per_week:      3,
} as const

export const OPERATING_MODEL = {
  automation_level: 'semi-auto' as const,
  human_approval_required: true,
  ai_generates: ['research', 'scoring', 'brief', 'script', 'asset_brief', 'post_draft'] as const,
  human_approves: ['final_script', 'creative_assets', 'publish_decision'] as const,
  publish_method: 'manual' as const,
  orchestration_phase2: 'n8n / Make / Pipedream' as const,
} as const
