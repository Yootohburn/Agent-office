import type { AgentTaskRecord } from './types'
import { dbGetAll, dbInsert, dbUpdate } from './localStorageDatabase'

const COL = 'tasks'

export const taskRepository = {
  getAll(): AgentTaskRecord[] {
    return dbGetAll<AgentTaskRecord>(COL)
  },

  getByCampaign(campaignId: string): AgentTaskRecord[] {
    return dbGetAll<AgentTaskRecord>(COL)
      .filter(t => t.campaign_id === campaignId)
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
  },

  getById(id: string): AgentTaskRecord | undefined {
    return dbGetAll<AgentTaskRecord>(COL).find(t => t.task_id === id)
  },

  insert(task: AgentTaskRecord): void {
    dbInsert(COL, task)
  },

  update(id: string, patch: Partial<AgentTaskRecord>): void {
    dbUpdate<AgentTaskRecord & Record<string, unknown>>(COL, 'task_id', id, patch)
  },
}
