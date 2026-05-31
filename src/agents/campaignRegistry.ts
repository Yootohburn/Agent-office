export type CampaignPlatform = 'shopee' | 'lazada' | 'tiktok' | 'multi'

export type PipelineStage =
  | 'campaign_brief'
  | 'product_research'
  | 'content_creation'
  | 'review_compliance'
  | 'ceo_approval'
  | 'export_publish'
  | 'performance_feedback'

export const PIPELINE_STAGES: { id: PipelineStage; label: string; short: string }[] = [
  { id: 'campaign_brief',       label: 'Campaign Brief',         short: 'Brief'    },
  { id: 'product_research',     label: 'Product Research',       short: 'Research' },
  { id: 'content_creation',     label: 'Content Creation',       short: 'Content'  },
  { id: 'review_compliance',    label: 'Review & Compliance',    short: 'Review'   },
  { id: 'ceo_approval',         label: 'CEO Approval',           short: 'Approval' },
  { id: 'export_publish',       label: 'Export / Publish Ready', short: 'Export'   },
  { id: 'performance_feedback', label: 'Performance Feedback',   short: 'Feedback' },
]

export interface Campaign {
  id: string
  name: string
  platform: CampaignPlatform
  category: string
  targetPrice: string
  stage: PipelineStage
  progress: number
  assignedAgentId: string
  brief: string
  targetMetrics: {
    views: string
    ctr: string
    conversion: string
    mockRevenue: string
  }
  notes: string
  riskFlag: string | null
}

export const campaigns: Campaign[] = [
  {
    id: 'camp-001',
    name: 'Wireless Earbuds under 500 THB',
    platform: 'tiktok',
    category: 'Electronics',
    targetPrice: '< 500 THB (~$14)',
    stage: 'content_creation',
    progress: 70,
    assignedAgentId: 'content-studio',
    brief: 'TikTok impulse buy. Hook: expose overpaying for earbuds. Target: Gen Z 18–25. Format: POV unboxing.',
    targetMetrics: {
      views: '50,000',
      ctr: '2.5%',
      conversion: '1.8%',
      mockRevenue: '$180',
    },
    notes: 'Trend RISING — publish window 48h. Commission 8.5% on TikTok Shop.',
    riskFlag: null,
  },
  {
    id: 'camp-002',
    name: 'Home Office Desk Lamp',
    platform: 'shopee',
    category: 'Home & Office',
    targetPrice: '$15–$35',
    stage: 'product_research',
    progress: 45,
    assignedAgentId: 'product-analyst',
    brief: 'Shopee affiliate. Target: WFH buyers. Angle: eye care + aesthetic desk setup.',
    targetMetrics: {
      views: '30,000',
      ctr: '2.0%',
      conversion: '1.5%',
      mockRevenue: '$120',
    },
    notes: 'Competitive category — needs a unique angle. Analyst flagged 12 active competitors.',
    riskFlag: 'High competitor count — angle differentiation required',
  },
  {
    id: 'camp-003',
    name: 'Portable Blender',
    platform: 'lazada',
    category: 'Kitchen & Health',
    targetPrice: '$20–$45',
    stage: 'review_compliance',
    progress: 75,
    assignedAgentId: 'ops-review',
    brief: 'Lazada affiliate. Target: health-conscious millennials. Angle: on-the-go smoothies.',
    targetMetrics: {
      views: '40,000',
      ctr: '2.2%',
      conversion: '1.6%',
      mockRevenue: '$150',
    },
    notes: 'Commission 6.8%. Script written. Currently in compliance review.',
    riskFlag: 'Unverified health claim "boost your metabolism" — flagged in script line 3',
  },
  {
    id: 'camp-004',
    name: 'Skincare Travel Pouch',
    platform: 'multi',
    category: 'Beauty & Travel',
    targetPrice: '$12–$28',
    stage: 'ceo_approval',
    progress: 90,
    assignedAgentId: 'ceo-director',
    brief: 'Multi-platform push: TikTok + Shopee + Lazada. Angle: travel skincare routine. Target: women 22–35.',
    targetMetrics: {
      views: '80,000',
      ctr: '2.8%',
      conversion: '2.0%',
      mockRevenue: '$280',
    },
    notes: 'Compliance passed on TikTok and Shopee versions. Lazada version has one minor flag.',
    riskFlag: 'Lazada version: missing affiliate disclosure on second caption draft',
  },
]

export const PLATFORM_CONFIG: Record<CampaignPlatform, { label: string; color: string }> = {
  shopee: { label: 'SHOPEE',  color: '#ff5722' },
  lazada: { label: 'LAZADA',  color: '#2979ff' },
  tiktok: { label: 'TIKTOK',  color: '#00e5ff' },
  multi:  { label: 'MULTI',   color: '#c97aff' },
}

export function getCampaignById(id: string): Campaign | undefined {
  return campaigns.find(c => c.id === id)
}

export function getCampaignsByPlatform(platform: CampaignPlatform | 'all'): Campaign[] {
  if (platform === 'all') return campaigns
  return campaigns.filter(c => c.platform === platform)
}

export function getStageIndex(stage: PipelineStage): number {
  return PIPELINE_STAGES.findIndex(s => s.id === stage)
}
