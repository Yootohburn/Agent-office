import type { PipelineStage } from './campaignRegistry'
import type { DepartmentId } from './agentRegistry'

export const STAGE_OWNER: Record<PipelineStage, DepartmentId> = {
  campaign_brief:       'ceo-director',
  product_research:     'product-analyst',
  content_creation:     'content-studio',
  social_adaptation:    'social-community-manager',
  review_compliance:    'ops-review',
  ceo_approval:         'ceo-director',
  export_publish:       'ops-review',
  performance_feedback: 'ops-review',
  finance_review:       'finance-controller',
}

export const STAGE_SEQUENCE: PipelineStage[] = [
  'campaign_brief',
  'product_research',
  'content_creation',
  'social_adaptation',
  'review_compliance',
  'ceo_approval',
  'export_publish',
  'performance_feedback',
  'finance_review',
]

export function getNextStage(current: PipelineStage): PipelineStage | null {
  const idx = STAGE_SEQUENCE.indexOf(current)
  if (idx === -1 || idx >= STAGE_SEQUENCE.length - 1) return null
  return STAGE_SEQUENCE[idx + 1]
}

export function getStageOwner(stage: PipelineStage): DepartmentId {
  return STAGE_OWNER[stage]
}
