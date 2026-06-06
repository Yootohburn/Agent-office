// Task queue management — creates, reads, and advances AgentTaskRecords.
// Phase 2: replace taskRepository calls with Supabase client calls.

import type { AgentTaskRecord } from '../data/types'
import type { PipelineStage }   from '../agents/campaignRegistry'
import { taskRepository }       from '../data/taskRepository'
import { STAGE_OWNER }          from '../agents/agentTaskRouter'

export function getQueueForCampaign(campaignId: string): AgentTaskRecord[] {
  return taskRepository.getByCampaign(campaignId)
}

/** Mark the current pending task as done and record its output. */
export function completeCurrentTask(
  campaignId:  string,
  stage:       string,
  outputJson:  Record<string, unknown>,
): void {
  const tasks = taskRepository.getByCampaign(campaignId)
  const current = tasks.find(t => t.stage === stage && t.status !== 'done')
  if (!current) return
  taskRepository.update(current.task_id, {
    status:      'done',
    output_json: outputJson,
    updated_at:  new Date().toISOString(),
  })
}

/** Create a new task record for the next pipeline stage. Returns the new task. */
export function createNextTask(
  campaignId: string,
  productId:  string,
  nextStage:  PipelineStage,
): AgentTaskRecord {
  const agentId = STAGE_OWNER[nextStage]
  const task: AgentTaskRecord = {
    task_id:               `task-${campaignId}-${nextStage}-${Date.now()}`,
    campaign_id:           campaignId,
    product_id:            productId,
    agent_id:              agentId,
    stage:                 nextStage,
    status:                nextStage === 'human_approved' ? 'needs_review' : 'pending',
    input_json:            {},
    output_json:           {},
    risk_flags:            [],
    human_review_required: nextStage === 'human_approved',
    created_at:            new Date().toISOString(),
    updated_at:            new Date().toISOString(),
  }
  taskRepository.insert(task)
  return task
}

/** Advance the queue: mark current stage done → create task for next stage. */
export function advanceTaskQueue(
  campaignId:  string,
  productId:   string,
  currentStage: PipelineStage,
  nextStage:   PipelineStage,
  outputJson:  Record<string, unknown>,
): AgentTaskRecord {
  completeCurrentTask(campaignId, currentStage, outputJson)
  return createNextTask(campaignId, productId, nextStage)
}
