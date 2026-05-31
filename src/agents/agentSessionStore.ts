export interface ActivityLogEntry {
  id: string
  timestamp: string
  agentId: string
  agentName: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success' | 'system'
  campaignId?: string
}

export const mockActivityLog: ActivityLogEntry[] = [
  {
    id: '1',
    timestamp: '09:00:01',
    agentId: 'system',
    agentName: 'SYSTEM',
    message: 'Agent Office v1.1 initialized. AI Affiliate Content Company online. 4 agents ready.',
    type: 'system',
  },
  {
    id: '2',
    timestamp: '09:01:14',
    agentId: 'ceo-director',
    agentName: 'CEO / Campaign Director',
    message: 'Weekly priority set: TikTok Electronics → Shopee Home Office → Lazada Kitchen → Multi Skincare.',
    type: 'info',
  },
  {
    id: '3',
    timestamp: '09:02:30',
    agentId: 'product-analyst',
    agentName: 'Product & Trend Analyst',
    message: '[camp-001] TikTok Earbuds research complete. Score 84/100, commission 8.5%, trend RISING. Brief sent to Content Studio.',
    type: 'success',
    campaignId: 'camp-001',
  },
  {
    id: '4',
    timestamp: '09:04:00',
    agentId: 'content-studio',
    agentName: 'Content Studio Agent',
    message: '[camp-001] TikTok Earbuds script started. Hook: "POV: you just found out your $200 earbuds were a scam". Format: POV unboxing.',
    type: 'info',
    campaignId: 'camp-001',
  },
  {
    id: '5',
    timestamp: '09:05:22',
    agentId: 'product-analyst',
    agentName: 'Product & Trend Analyst',
    message: '[camp-003] Lazada Blender research complete. Score 71/100. Brief passed. Started Shopee Desk Lamp research.',
    type: 'success',
    campaignId: 'camp-003',
  },
  {
    id: '6',
    timestamp: '09:08:45',
    agentId: 'ops-review',
    agentName: 'Ops & Review Agent',
    message: '[camp-003] FLAGGED: "boost your metabolism" — unverified health claim in Lazada Blender script line 3. Returned to Content Studio.',
    type: 'warning',
    campaignId: 'camp-003',
  },
  {
    id: '7',
    timestamp: '09:12:10',
    agentId: 'ops-review',
    agentName: 'Ops & Review Agent',
    message: '[camp-001] TikTok Earbuds compliance: PASSED. All checks clear. Package queued for CEO approval.',
    type: 'success',
    campaignId: 'camp-001',
  },
  {
    id: '8',
    timestamp: '09:14:00',
    agentId: 'ceo-director',
    agentName: 'CEO / Campaign Director',
    message: '[camp-004] Skincare Travel Pouch campaign package received. Under review — Lazada version has minor disclosure issue.',
    type: 'info',
    campaignId: 'camp-004',
  },
  {
    id: '9',
    timestamp: '09:15:33',
    agentId: 'product-analyst',
    agentName: 'Product & Trend Analyst',
    message: '[camp-002] Desk Lamp category: 12 active affiliate competitors detected. Researching differentiation angle — eye care + aesthetic.',
    type: 'warning',
    campaignId: 'camp-002',
  },
]
