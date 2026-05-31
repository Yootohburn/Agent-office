export type AgentStatus =
  | 'idle'
  | 'working'
  | 'waiting'
  | 'blocked'
  | 'needs_review'
  | 'done'
  | 'failed'

export type AgentPlatform = 'shopee' | 'lazada' | 'tiktok' | 'shared'

export interface Agent {
  id: string
  name: string
  role: string
  platform: AgentPlatform
  status: AgentStatus
  currentTask: string
  progress: number
  recentOutput: string
  risks: string[]
  nextAction: string
}

export const agents: Agent[] = [
  {
    id: 'product-scout',
    name: 'Product Scout',
    role: 'Finds promising affiliate products',
    platform: 'shared',
    status: 'working',
    currentTask: 'Scanning Shopee bestsellers in Electronics category',
    progress: 62,
    recentOutput: 'Found 3 high-viability products. Top pick: Wireless Earbuds X9 — score 84/100',
    risks: ['Review count below 50 on 1 product'],
    nextAction: 'Send product brief to Offer Analyst',
  },
  {
    id: 'offer-analyst',
    name: 'Offer Analyst',
    role: 'Evaluates price, commission, and selling angle',
    platform: 'shared',
    status: 'waiting',
    currentTask: 'Waiting for Product Scout brief',
    progress: 0,
    recentOutput: 'Last analysis: Lazada Skincare Bundle — offer strength: STRONG, angle: bundle deal',
    risks: [],
    nextAction: 'Receive product brief',
  },
  {
    id: 'script-writer',
    name: 'Script Writer',
    role: 'Writes hooks, scripts, and captions',
    platform: 'shared',
    status: 'done',
    currentTask: 'Shopee Electronics campaign scripts complete',
    progress: 100,
    recentOutput: 'Hook: "You\'ve been charging your phone wrong this whole time..." — 28s script ready',
    risks: [],
    nextAction: 'Pass to Visual Designer',
  },
  {
    id: 'visual-designer',
    name: 'Visual Designer',
    role: 'Creates visual direction and thumbnail concepts',
    platform: 'shared',
    status: 'working',
    currentTask: 'Generating visual brief for Wireless Earbuds X9',
    progress: 40,
    recentOutput: 'Style: unboxing. Palette: black + neon blue. Text overlay: price drop callout',
    risks: [],
    nextAction: 'Finalize and send to Clip Builder',
  },
  {
    id: 'clip-builder',
    name: 'Clip Builder',
    role: 'Assembles video asset structure',
    platform: 'shared',
    status: 'idle',
    currentTask: 'No active task',
    progress: 0,
    recentOutput: 'Last build: Lazada Skincare Bundle — 3 scenes, 29s, export ready',
    risks: [],
    nextAction: 'Receive visual brief from Visual Designer',
  },
  {
    id: 'publisher',
    name: 'Publisher',
    role: 'Prepares posts for all platforms',
    platform: 'shared',
    status: 'needs_review',
    currentTask: 'Shopee post package ready — awaiting human approval',
    progress: 95,
    recentOutput: 'TikTok caption: 240 chars ✓ | Shopee Feed: 180 chars ✓ | FB: 310 chars ✓',
    risks: ['Affiliate disclosure missing on Facebook draft'],
    nextAction: 'Human review required before publish',
  },
  {
    id: 'compliance-checker',
    name: 'Compliance Checker',
    role: 'Reviews claims, rules, and risky wording',
    platform: 'shared',
    status: 'working',
    currentTask: 'Running compliance scan on Lazada Skincare scripts',
    progress: 75,
    recentOutput: 'FLAGGED: "clinically proven" claim in script line 4 — needs evidence or removal',
    risks: ['Unverified health claim detected'],
    nextAction: 'Flag to Script Writer for revision',
  },
  {
    id: 'growth-analyst',
    name: 'Growth Analyst',
    role: 'Tracks performance and finds improvements',
    platform: 'shared',
    status: 'idle',
    currentTask: 'No active campaign data',
    progress: 0,
    recentOutput: 'Last report: Week 22 — avg engagement 6.2%, completion 58%, CTR 1.8%',
    risks: ['Completion rate below 60% benchmark'],
    nextAction: 'Waiting for new post data',
  },
  {
    id: 'housekeeper',
    name: 'Housekeeper',
    role: 'Organizes files and cleans the workspace',
    platform: 'shared',
    status: 'done',
    currentTask: 'Weekly cleanup complete',
    progress: 100,
    recentOutput: 'Archived 12 files. Found 3 orphaned packages. Workspace health: GOOD',
    risks: [],
    nextAction: 'Next scan scheduled in 7 days',
  },
  {
    id: 'tiktok-strategist',
    name: 'TikTok Strategist',
    role: 'Lead strategy for TikTok campaigns',
    platform: 'tiktok',
    status: 'working',
    currentTask: 'Building campaign strategy for TikTok Shop Wireless Earbuds X9',
    progress: 55,
    recentOutput: 'Angle: curiosity + shock. Hook style: "Wait for the end..." Format: talking head',
    risks: ['Trend window closing — Rising → Peak transition detected'],
    nextAction: 'Brief Trend Scout and TikTok Offer Analyst',
  },
  {
    id: 'trend-scout',
    name: 'Trend Scout',
    role: 'Analyzes FYP trends and competitor content',
    platform: 'tiktok',
    status: 'done',
    currentTask: 'Trend report for Electronics category complete',
    progress: 100,
    recentOutput: 'Top sound: "Chill Lofi Beat 003". Top format: POV unboxing. Trend: RISING',
    risks: [],
    nextAction: 'Send trend brief to TikTok Script Writer',
  },
  {
    id: 'tiktok-script-writer',
    name: 'TikTok Script Writer',
    role: 'Writes viral TikTok scripts with hooks',
    platform: 'tiktok',
    status: 'working',
    currentTask: 'Writing script for Wireless Earbuds X9 — POV unboxing format',
    progress: 70,
    recentOutput: 'Hook: "POV: you just found out your $200 earbuds were a scam" — 4 beats drafted',
    risks: [],
    nextAction: 'Complete CTA and caption, pass to Visual Designer',
  },
  {
    id: 'tiktok-offer-analyst',
    name: 'TikTok Offer Analyst',
    role: 'Evaluates TikTok Shop commission and virality',
    platform: 'tiktok',
    status: 'done',
    currentTask: 'TikTok Shop offer analysis complete',
    progress: 100,
    recentOutput: 'Commission: 8.5% ✓ | Impulse score: 78/100 | Visual appeal: 82/100 | Rating: STRONG',
    risks: [],
    nextAction: 'Brief passed to TikTok Strategist',
  },
  {
    id: 'tiktok-analytics-ai',
    name: 'TikTok Analytics AI',
    role: 'Tracks TikTok KPIs and recommends optimizations',
    platform: 'tiktok',
    status: 'idle',
    currentTask: 'Waiting for first post data',
    progress: 0,
    recentOutput: 'Last report: 5 posts — engagement 9.1% ✓ | completion 72% ✓ | CTR 2.3% ✓',
    risks: [],
    nextAction: 'Monitor after first post publishes',
  },
  {
    id: 'ugc-manager',
    name: 'UGC Manager',
    role: 'Manages creator collabs and UGC content',
    platform: 'tiktok',
    status: 'blocked',
    currentTask: 'Creator brief ready — blocked on budget approval',
    progress: 30,
    recentOutput: 'Matched 3 micro-creators in Electronics niche. Est. reach: 180K combined',
    risks: ['Budget approval required before briefing creators'],
    nextAction: 'Human review: approve creator budget',
  },
]

export function getAgentById(id: string): Agent | undefined {
  return agents.find(a => a.id === id)
}

export function getAgentsByPlatform(platform: AgentPlatform | 'all'): Agent[] {
  if (platform === 'all') return agents
  return agents.filter(a => a.platform === platform)
}
