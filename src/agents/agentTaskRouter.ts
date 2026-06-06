import type { PipelineStage } from './campaignRegistry'
import type { DepartmentId } from './agentRegistry'

export const STAGE_OWNER: Record<PipelineStage, DepartmentId> = {
  new_product:    'product-research',
  verified:       'product-research',
  scored:         'offer-analyst',
  selected:       'offer-analyst',
  brief_ready:    'content-strategy',
  script_ready:   'script-writer',
  asset_ready:    'creative-production',
  human_approved: 'social-performance',
  published:      'social-performance',
  analyzed:       'social-performance',
  learned:        'product-research',
}

export const STAGE_SEQUENCE: PipelineStage[] = [
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

export function getNextStage(current: PipelineStage): PipelineStage | null {
  const idx = STAGE_SEQUENCE.indexOf(current)
  if (idx === -1 || idx >= STAGE_SEQUENCE.length - 1) return null
  return STAGE_SEQUENCE[idx + 1]
}

export function getStageOwner(stage: PipelineStage): DepartmentId {
  return STAGE_OWNER[stage]
}
