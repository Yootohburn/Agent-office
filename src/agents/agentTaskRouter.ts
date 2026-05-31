import type { AgentPlatform } from './agentRegistry'

export interface WorkflowTemplate {
  id: string
  name: string
  platform: AgentPlatform
  description: string
  steps: string[]
}

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'shopee-affiliate',
    name: 'Shopee Affiliate',
    platform: 'shopee',
    description: 'Full pipeline from product URL to exported content package for Shopee',
    steps: [
      'product-scout',
      'offer-analyst',
      'script-writer',
      'visual-designer',
      'clip-builder',
      'compliance-checker',
      'publisher',
    ],
  },
  {
    id: 'lazada-affiliate',
    name: 'Lazada Affiliate',
    platform: 'lazada',
    description: 'Full pipeline from product URL to exported content package for Lazada',
    steps: [
      'product-scout',
      'offer-analyst',
      'script-writer',
      'visual-designer',
      'clip-builder',
      'compliance-checker',
      'publisher',
    ],
  },
  {
    id: 'tiktok-affiliate',
    name: 'TikTok Affiliate',
    platform: 'tiktok',
    description: 'TikTok Shop affiliate pipeline from trend idea to analytics monitoring',
    steps: [
      'tiktok-strategist',
      'trend-scout',
      'tiktok-offer-analyst',
      'tiktok-script-writer',
      'visual-designer',
      'compliance-checker',
      'tiktok-analytics-ai',
    ],
  },
]

export function getWorkflowTemplate(id: string): WorkflowTemplate | undefined {
  return workflowTemplates.find(w => w.id === id)
}

export function getWorkflowsByPlatform(platform: AgentPlatform): WorkflowTemplate[] {
  return workflowTemplates.filter(w => w.platform === platform)
}

export function getNextAgent(workflowId: string, currentAgentId: string): string | null {
  const workflow = getWorkflowTemplate(workflowId)
  if (!workflow) return null
  const index = workflow.steps.indexOf(currentAgentId)
  if (index === -1 || index >= workflow.steps.length - 1) return null
  return workflow.steps[index + 1]
}
