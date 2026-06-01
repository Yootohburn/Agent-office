import type { Campaign, AgentOutput, PipelineStage } from './campaignRegistry'
import type { Agent } from './agentRegistry'
import type { ActivityLogEntry, TeamChatMessage } from './agentSessionStore'
import type { WorkflowAction } from './campaignWorkflow'
import { generateMockOutput, STAGE_PROGRESS } from './campaignWorkflow'
import { getNextStage, STAGE_OWNER, STAGE_SEQUENCE } from './agentTaskRouter'

export interface WorkflowResult {
  updatedCampaign: Campaign
  updatedAgents: Agent[]
  newLogEntry: ActivityLogEntry
  newChatMessage: TeamChatMessage
  newOutput: AgentOutput
}

const AGENT_ACCENT: Record<string, string> = {
  'ceo-director':             '#00ff9f',
  'product-analyst':          '#00e5ff',
  'content-studio':           '#ff9800',
  'social-community-manager': '#ff4081',
  'ops-review':               '#ffb300',
  'finance-controller':       '#00c8a0',
}

const AGENT_SHORT_NAME: Record<string, string> = {
  'ceo-director':             'CEO',
  'product-analyst':          'Product',
  'content-studio':           'Content',
  'social-community-manager': 'Social',
  'ops-review':               'Ops',
  'finance-controller':       'Finance',
}

const STAGE_TASK: Record<PipelineStage, string> = {
  campaign_brief:       'ตั้ง brief แคมเปญใหม่',
  product_research:     'วิเคราะห์สินค้าและเทรนด์',
  content_creation:     'ผลิต script และ content package',
  social_adaptation:    'ปรับ content สำหรับ Facebook/IG/LINE',
  review_compliance:    'ตรวจสอบ compliance และ packaging',
  ceo_approval:         'รีวิวและอนุมัติแคมเปญ',
  export_publish:       'เตรียม export package และโพสต์',
  performance_feedback: 'ติดตามและวิเคราะห์ผลลัพธ์',
  finance_review:       'วิเคราะห์ผลการเงินและ ROAS',
}

const CHAT_MESSAGES_BY_STAGE: Record<PipelineStage, (c: Campaign) => string> = {
  campaign_brief:       (c) => `เริ่ม brief แคมเปญ "${c.name}" แล้วนะครับ ทีมพร้อมรับงาน`,
  product_research:     (c) => `เริ่มวิเคราะห์ "${c.name}" แล้วครับ จะส่งผลใน 15 นาที`,
  content_creation:     (c) => `ได้รับ brief "${c.name}" แล้วครับ เริ่มเขียน hook ทันที`,
  social_adaptation:    (c) => `รับ script "${c.name}" มาแล้ว จะปรับสำหรับ Facebook/IG เลยนะครับ`,
  review_compliance:    (c) => `เริ่มตรวจ compliance "${c.name}" ใช้เวลาประมาณ 10 นาที`,
  ceo_approval:         (c) => `"${c.name}" ผ่าน compliance ครบ รอ CEO อนุมัตินะครับ`,
  export_publish:       (c) => `เตรียม export package "${c.name}" อยู่ครับ จะแจ้งเมื่อพร้อมโพสต์`,
  performance_feedback: (c) => `ติดตามผล "${c.name}" หลังโพสต์แล้วนะครับ จะรายงาน Finance`,
  finance_review:       (c) => `ได้รับ performance data "${c.name}" แล้ว กำลังวิเคราะห์ ROAS`,
}

function makeTimestamp(): string {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
}

function makeChatTimestamp(): string {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

const ACTION_LABEL: Record<WorkflowAction, string> = {
  run_next_step:   'ส่งมอบงาน',
  send_to_ceo:     'ส่ง CEO อนุมัติ',
  send_back:       'ส่งกลับแก้ไข',
  approve:         'อนุมัติ',
  reject:          'ปฏิเสธ',
  mark_ready:      'Mark Ready',
  generate_export: 'Export Package',
}

export function runWorkflowAction(
  action: WorkflowAction,
  campaign: Campaign,
  agents: Agent[],
  nextLogId: number,
): WorkflowResult {
  const prevStage    = campaign.stage
  const prevOwnerId  = STAGE_OWNER[prevStage]
  let   nextStage: PipelineStage = prevStage

  switch (action) {
    case 'run_next_step': {
      const ns = getNextStage(prevStage)
      if (ns) nextStage = ns
      break
    }
    case 'send_to_ceo':
      nextStage = 'ceo_approval'
      break
    case 'send_back': {
      const idx = STAGE_SEQUENCE.indexOf(prevStage)
      if (idx > 0) nextStage = STAGE_SEQUENCE[idx - 1]
      break
    }
    case 'approve':
    case 'mark_ready':
    case 'generate_export': {
      const ns = getNextStage(prevStage)
      if (ns) nextStage = ns
      break
    }
    case 'reject':
      nextStage = 'campaign_brief'
      break
  }

  const newOwnerId    = STAGE_OWNER[nextStage]
  const outputContent = generateMockOutput(nextStage, campaign)
  const ts            = makeTimestamp()

  const newOutput: AgentOutput = {
    id:             `out-${campaign.id}-${nextStage}-${Date.now()}`,
    campaignId:     campaign.id,
    agentId:        newOwnerId,
    stage:          nextStage,
    title:          outputContent.title,
    summary:        outputContent.summary,
    content:        outputContent.content,
    risks:          outputContent.risks,
    recommendation: outputContent.recommendation,
    createdAt:      ts,
  }

  const newProgress = STAGE_PROGRESS[nextStage]
  const riskLevel = outputContent.risks.length === 0
    ? 'low'
    : campaign.finance.netProfit < 0
    ? 'critical'
    : outputContent.risks.length >= 2
    ? 'high'
    : 'medium'

  const updatedCampaign: Campaign = {
    ...campaign,
    stage:       nextStage,
    progress:    newProgress,
    riskLevel,
    riskMessage: outputContent.risks[0] ?? '',
    outputs:     [...campaign.outputs, newOutput],
    notes:       `ผ่าน ${STAGE_TASK[prevStage]} แล้ว — ขั้นตอนปัจจุบัน: ${STAGE_TASK[nextStage]}`,
  }

  const updatedAgents: Agent[] = agents.map(agent => {
    if (agent.id === prevOwnerId && prevOwnerId !== newOwnerId) {
      return { ...agent, status: 'done' as const, currentTask: `เสร็จสิ้น: ${STAGE_TASK[prevStage]} — ${campaign.name}`, progress: 100, currentCampaignId: null }
    }
    if (agent.id === newOwnerId) {
      return {
        ...agent,
        status:           'working' as const,
        currentTask:      `${STAGE_TASK[nextStage]} — ${campaign.name}`,
        progress:         newProgress,
        currentCampaignId: campaign.id,
        decisionNeeded:   nextStage === 'ceo_approval' ? 'อนุมัติหรือส่งกลับแก้ไข' : null,
      }
    }
    return agent
  })

  const newLogEntry: ActivityLogEntry = {
    id:        String(nextLogId),
    timestamp: ts,
    agentId:   newOwnerId,
    agentName: AGENT_SHORT_NAME[newOwnerId] ?? newOwnerId,
    message:   `[${campaign.id}] ${ACTION_LABEL[action]}: "${campaign.name}" → ${STAGE_TASK[nextStage]}`,
    type:      action === 'reject' || action === 'send_back' ? 'warning' : 'success',
    campaignId: campaign.id,
  }

  const newChatMessage: TeamChatMessage = {
    id:            `chat-${Date.now()}`,
    timestamp:     makeChatTimestamp(),
    senderAgentId: newOwnerId,
    senderName:    AGENT_SHORT_NAME[newOwnerId] ?? newOwnerId,
    accent:        AGENT_ACCENT[newOwnerId] ?? '#4a5680',
    message:       CHAT_MESSAGES_BY_STAGE[nextStage](campaign),
    campaignId:    campaign.id,
  }

  return { updatedCampaign, updatedAgents, newLogEntry, newChatMessage, newOutput }
}
