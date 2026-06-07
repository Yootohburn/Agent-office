export type SheetApiMode = 'local' | 'manual_import' | 'future_api'

export interface SheetConfig {
  sheetId: string
  apiMode: SheetApiMode
}

const rawMode = import.meta.env.VITE_GOOGLE_SHEET_API_MODE

function parseMode(m: string | undefined): SheetApiMode {
  if (m === 'local' || m === 'future_api') return m
  return 'manual_import'
}

export const SHEET_CONFIG: SheetConfig = {
  sheetId: import.meta.env.VITE_GOOGLE_SHEET_ID ?? '',
  apiMode: parseMode(rawMode),
}
