// Persists user-submitted campaigns to localStorage.
// Mock campaigns (prod-001…prod-004) live in campaignRegistry.ts and are NOT stored here.
// On app init, AgentOffice merges both sources.

import type { Campaign } from '../agents/campaignRegistry'
import { dbGetAll, dbInsert, dbUpdate } from './localStorageDatabase'

const COL = 'campaigns'

export const campaignRepository = {
  getAll(): Campaign[] {
    return dbGetAll<Campaign>(COL)
  },

  getById(id: string): Campaign | undefined {
    return dbGetAll<Campaign>(COL).find(c => c.id === id)
  },

  insert(campaign: Campaign): void {
    dbInsert(COL, campaign)
  },

  update(id: string, patch: Partial<Campaign>): void {
    dbUpdate<Campaign & Record<string, unknown>>(COL, 'id', id, patch)
  },
}
