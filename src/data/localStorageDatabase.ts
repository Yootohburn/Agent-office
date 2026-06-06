// Generic localStorage CRUD wrapper.
// Phase 1: reads/writes JSON to localStorage under 'agent_office_*' keys.
// Phase 2: replace each function body with the equivalent Supabase client call.

const PREFIX = 'agent_office_'

export function dbGetAll<T>(collection: string): T[] {
  try {
    const raw = localStorage.getItem(PREFIX + collection)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

export function dbSave<T>(collection: string, records: T[]): void {
  try {
    localStorage.setItem(PREFIX + collection, JSON.stringify(records))
  } catch {
    // localStorage quota exceeded — fail silently in Phase 1
  }
}

export function dbInsert<T>(collection: string, record: T): void {
  const all = dbGetAll<T>(collection)
  dbSave(collection, [...all, record])
}

export function dbUpdate<T extends Record<string, unknown>>(
  collection: string,
  idField:    keyof T,
  id:         unknown,
  patch:      Partial<T>,
): void {
  const all = dbGetAll<T>(collection)
  dbSave(collection, all.map(r => (r[idField] === id ? { ...r, ...patch } : r)))
}

export function dbDelete<T extends Record<string, unknown>>(
  collection: string,
  idField:    keyof T,
  id:         unknown,
): void {
  const all = dbGetAll<T>(collection)
  dbSave(collection, all.filter(r => r[idField] !== id))
}

export function dbClear(collection: string): void {
  localStorage.removeItem(PREFIX + collection)
}
