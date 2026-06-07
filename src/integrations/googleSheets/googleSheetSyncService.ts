// Mock sync service — Phase 1 writes to local sync_log only.
// Phase 2: replace mockSync() body with n8n webhook POST or Supabase Edge Function call.
// Credentials must NEVER be exposed in frontend code.

import { dbInsert } from '../../data/localStorageDatabase'
import type { Product } from '../../data/types'
import type { Campaign } from '../../agents/campaignRegistry'

export interface SyncResult {
  success:   boolean
  message:   string
  timestamp: string
}

interface SyncLogEntry {
  log_id:     string
  sync_type:  string
  record_id:  string
  status:     'mock_success' | 'mock_failure'
  message:    string
  created_at: string
}

function mockSync(syncType: string, recordId: string): SyncResult {
  const ts = new Date().toISOString()
  const entry: SyncLogEntry = {
    log_id:     `sync-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sync_type:  syncType,
    record_id:  recordId,
    status:     'mock_success',
    message:    `[MOCK] ${syncType} queued for ${recordId} — future_api / n8n webhook ready`,
    created_at: ts,
  }
  dbInsert('sync_log', entry)
  return { success: true, message: entry.message, timestamp: ts }
}

export function syncProductToSheet(product: Product):       SyncResult { return mockSync('product',      product.product_id) }
export function syncCampaignToSheet(campaign: Campaign):    SyncResult { return mockSync('campaign',     campaign.id) }
export function syncAgentOutputToSheet(outputId: string):   SyncResult { return mockSync('agent_output', outputId) }
export function syncPerformanceToSheet(perfId: string):     SyncResult { return mockSync('performance',  perfId) }
export function syncRiskLogToSheet(riskId: string):         SyncResult { return mockSync('risk_log',     riskId) }
