import { SHEET_CONFIG } from '../../config/googleSheetConfig'

export interface ClientStatus {
  mode:      string
  connected: boolean
  message:   string
}

export function getClientStatus(): ClientStatus {
  return {
    mode:      SHEET_CONFIG.apiMode,
    connected: false,
    message:   SHEET_CONFIG.apiMode === 'future_api'
      ? 'Google Sheets API not yet connected — Phase 2 (n8n / Apps Script / Supabase Edge Function)'
      : `Mode: ${SHEET_CONFIG.apiMode}. Live API read disabled in Phase 1.`,
  }
}

// Phase 2 placeholder — not implemented until n8n webhook or Apps Script is wired.
export async function fetchSheet(_sheetName: string): Promise<Record<string, string>[]> {
  console.warn('[googleSheetClient] fetchSheet() is not implemented. Current mode:', SHEET_CONFIG.apiMode)
  return []
}
