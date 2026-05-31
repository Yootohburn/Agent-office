export interface ActivityLogEntry {
  id: string
  timestamp: string
  agentId: string
  agentName: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success' | 'system'
}

export interface WorkflowStep {
  agentId: string
  agentName: string
  status: 'pending' | 'active' | 'done' | 'blocked'
  output?: string
}

export interface ActiveWorkflow {
  id: string
  name: string
  platform: string
  startedAt: string
  steps: WorkflowStep[]
  currentStepIndex: number
}

export const mockActivityLog: ActivityLogEntry[] = [
  {
    id: '1',
    timestamp: '10:42:03',
    agentId: 'system',
    agentName: 'SYSTEM',
    message: 'Agent Office v1.0 initialized. All agents online.',
    type: 'system',
  },
  {
    id: '2',
    timestamp: '10:42:08',
    agentId: 'product-scout',
    agentName: 'Product Scout',
    message: 'Started scan — Shopee Electronics category. Target: 5 products.',
    type: 'info',
  },
  {
    id: '3',
    timestamp: '10:43:15',
    agentId: 'compliance-checker',
    agentName: 'Compliance Checker',
    message: 'FLAGGED: "clinically proven" in Lazada Skincare script line 4. Routing back to Script Writer.',
    type: 'warning',
  },
  {
    id: '4',
    timestamp: '10:44:02',
    agentId: 'trend-scout',
    agentName: 'Trend Scout',
    message: 'Trend report complete. Electronics FYP trend: RISING. Recommended window: 48h.',
    type: 'success',
  },
  {
    id: '5',
    timestamp: '10:44:30',
    agentId: 'tiktok-offer-analyst',
    agentName: 'TikTok Offer Analyst',
    message: 'Offer rated STRONG. Commission 8.5%, impulse score 78/100. Brief sent to Strategist.',
    type: 'success',
  },
  {
    id: '6',
    timestamp: '10:45:11',
    agentId: 'ugc-manager',
    agentName: 'UGC Manager',
    message: 'BLOCKED: Creator budget approval required. Est. budget: $300 for 3 micro-creators.',
    type: 'error',
  },
  {
    id: '7',
    timestamp: '10:46:00',
    agentId: 'publisher',
    agentName: 'Publisher',
    message: 'Post package ready for Shopee Electronics campaign. Needs human review before publish.',
    type: 'warning',
  },
  {
    id: '8',
    timestamp: '10:46:45',
    agentId: 'housekeeper',
    agentName: 'Housekeeper',
    message: 'Weekly cleanup done. Archived 12 files. Workspace health: GOOD.',
    type: 'info',
  },
]

export const mockWorkflows: ActiveWorkflow[] = [
  {
    id: 'wf-shopee-001',
    name: 'Shopee Electronics Campaign',
    platform: 'shopee',
    startedAt: '10:42:08',
    currentStepIndex: 3,
    steps: [
      { agentId: 'product-scout', agentName: 'Product Scout', status: 'done', output: 'Top pick: Wireless Earbuds X9, score 84/100' },
      { agentId: 'offer-analyst', agentName: 'Offer Analyst', status: 'done', output: 'Offer: STRONG — bundle angle' },
      { agentId: 'script-writer', agentName: 'Script Writer', status: 'done', output: '28s script + hook ready' },
      { agentId: 'visual-designer', agentName: 'Visual Designer', status: 'active', output: 'Unboxing style brief in progress...' },
      { agentId: 'clip-builder', agentName: 'Clip Builder', status: 'pending' },
      { agentId: 'compliance-checker', agentName: 'Compliance Checker', status: 'pending' },
      { agentId: 'publisher', agentName: 'Publisher', status: 'pending' },
    ],
  },
  {
    id: 'wf-tiktok-001',
    name: 'TikTok Earbuds Campaign',
    platform: 'tiktok',
    startedAt: '10:44:00',
    currentStepIndex: 2,
    steps: [
      { agentId: 'tiktok-strategist', agentName: 'TikTok Strategist', status: 'active', output: 'Strategy: curiosity hook, POV format' },
      { agentId: 'trend-scout', agentName: 'Trend Scout', status: 'done', output: 'RISING trend — 48h window' },
      { agentId: 'tiktok-offer-analyst', agentName: 'TikTok Offer Analyst', status: 'done', output: 'STRONG — 8.5% commission' },
      { agentId: 'tiktok-script-writer', agentName: 'TikTok Script Writer', status: 'active', output: 'Script 70% complete...' },
      { agentId: 'visual-designer', agentName: 'Visual Designer', status: 'pending' },
      { agentId: 'compliance-checker', agentName: 'Compliance Checker', status: 'pending' },
      { agentId: 'tiktok-analytics-ai', agentName: 'TikTok Analytics AI', status: 'pending' },
    ],
  },
]
