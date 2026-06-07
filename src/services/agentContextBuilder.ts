import type { Campaign, AgentOutput } from '../agents/campaignRegistry'
import { PIPELINE_STAGES } from '../agents/campaignRegistry'
import type { Agent } from '../agents/agentRegistry'
import type { Product } from '../data/types'
import { productRepository } from '../data/productRepository'
import { STAGE_OWNER } from '../agents/agentTaskRouter'
import { STAGE_ACTIONS } from '../agents/campaignWorkflow'
import type { WorkflowAction } from '../agents/campaignWorkflow'

export type QueueStatus =
  | 'urgent'
  | 'needs_review'
  | 'working'
  | 'blocked'
  | 'ready_next_step'
  | 'profitable'
  | 'losing_money'
  | 'idle'

export interface AgentContext {
  campaign:         Campaign | null
  product:          Product | null
  agent:            Agent | null
  ownerAgentId:     string | null
  currentStage:     string
  currentStageLabel:string
  latestOutput:     AgentOutput | null
  finance:          Campaign['finance'] | null
  riskFlags:        string[]
  availableActions: WorkflowAction[]
  syncStatus:       string | null
  queueStatus:      QueueStatus
}

const STAGE_LABEL: Record<string, string> = Object.fromEntries(
  PIPELINE_STAGES.map(s => [s.id, s.label])
)

export function computeQueueStatus(campaign: Campaign): QueueStatus {
  if (campaign.finance.netProfit < 0) return 'losing_money'
  if (campaign.stage === 'human_approved') return 'needs_review'
  if (campaign.riskLevel === 'critical' || campaign.riskLevel === 'high') return 'urgent'
  if (campaign.financeWarnings.length > 0) return 'blocked'
  if (campaign.stage === 'asset_ready' || campaign.stage === 'script_ready') return 'ready_next_step'
  if (campaign.finance.roas >= 4) return 'profitable'
  return 'working'
}

export function buildAgentContext(
  campaign: Campaign | null,
  agent:    Agent | null,
): AgentContext {
  const product: Product | null = campaign?.product_id
    ? (productRepository.getById(campaign.product_id) ?? null)
    : null

  const latestOutput: AgentOutput | null =
    campaign && campaign.outputs.length > 0
      ? campaign.outputs[campaign.outputs.length - 1]
      : null

  const availableActions: WorkflowAction[] = campaign
    ? (STAGE_ACTIONS[campaign.stage] ?? []).map(b => b.action)
    : []

  const ownerAgentId: string | null = campaign
    ? (STAGE_OWNER[campaign.stage] ?? null)
    : null

  const currentStage      = campaign?.stage ?? ''
  const currentStageLabel = STAGE_LABEL[currentStage] ?? currentStage

  const riskFlags: string[] = campaign
    ? [campaign.riskMessage, ...campaign.financeWarnings].filter(Boolean)
    : []

  return {
    campaign,
    product,
    agent,
    ownerAgentId,
    currentStage,
    currentStageLabel,
    latestOutput,
    finance:         campaign?.finance ?? null,
    riskFlags,
    availableActions,
    syncStatus:      product?.sync_status ?? null,
    queueStatus:     campaign ? computeQueueStatus(campaign) : 'idle',
  }
}
