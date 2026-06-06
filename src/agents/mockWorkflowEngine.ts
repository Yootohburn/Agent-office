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
  'product-research':   '#00e5ff',
  'offer-analyst':      '#ffb300',
  'content-strategy':   '#ff9800',
  'script-writer':      '#ff4081',
  'creative-production':'#a855f7',
  'social-performance': '#00ff9f',
}

const AGENT_SHORT_NAME: Record<string, string> = {
  'product-research':   'Research',
  'offer-analyst':      'Analyst',
  'content-strategy':   'Strategy',
  'script-writer':      'Script',
  'creative-production':'Creative',
  'social-performance': 'Social',
}

const STAGE_TASK: Record<PipelineStage, string> = {
  new_product:    'รับสินค้าใหม่เข้าระบบ',
  verified:       'ยืนยันข้อมูลสินค้า',
  scored:         'ประเมินคะแนนสินค้า',
  selected:       'เลือกสินค้าโปรโมท',
  brief_ready:    'สร้าง Content Brief',
  script_ready:   'เขียน Script และ Storyboard',
  asset_ready:    'ผลิต Creative Assets',
  human_approved: 'รอผู้บริหารอนุมัติ',
  published:      'โพสต์และติดตามผล',
  analyzed:       'วิเคราะห์ผลลัพธ์',
  learned:        'บันทึกบทเรียน',
}

const CHAT_MESSAGES_BY_STAGE: Record<PipelineStage, (c: Campaign) => string> = {
  new_product:    (c) => `รับสินค้าใหม่ "${c.name}" เข้าระบบแล้วครับ เริ่มตรวจสอบข้อมูล`,
  verified:       (c) => `ตรวจสอบข้อมูล "${c.name}" ครบแล้ว ส่ง Offer Analyst ได้เลย`,
  scored:         (c) => `ให้คะแนน "${c.name}" เสร็จแล้วครับ score ${c.scores.final_score}/100`,
  selected:       (c) => `เลือก "${c.name}" เพื่อโปรโมทแล้ว สร้าง brief ได้เลย`,
  brief_ready:    (c) => `Brief "${c.name}" พร้อมแล้วครับ hook framework เลือกแล้ว ส่ง Script Writer`,
  script_ready:   (c) => `Script "${c.name}" 25 วิ เสร็จแล้ว รอ review ก่อนส่ง Creative`,
  asset_ready:    (c) => `Creative assets "${c.name}" ครบชุดแล้ว รอส่งผู้บริหารอนุมัติ`,
  human_approved: (c) => `"${c.name}" รอผู้บริหารอนุมัติอยู่นะครับ ห้าม publish ก่อนได้รับอนุมัติ`,
  published:      (c) => `โพสต์ "${c.name}" แล้วครับ กำลังติดตามผล 48 ชั่วโมง`,
  analyzed:       (c) => `วิเคราะห์ผล "${c.name}" เสร็จ ROAS ${c.finance.roas}x — บันทึกบทเรียนได้เลย`,
  learned:        (c) => `บันทึกบทเรียน "${c.name}" ครบแล้ว ส่งข้อมูลกลับ Product Research`,
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
  run_next_step:    'ส่งมอบงาน',
  reject:           'ส่งกลับแก้ไข',
  request_approval: 'ส่งอนุมัติ',
  approve:          'อนุมัติ',
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
    case 'request_approval': {
      // asset_ready → human_approved
      const ns = getNextStage(prevStage)
      if (ns) nextStage = ns
      break
    }
    case 'approve': {
      // human_approved → published
      const ns = getNextStage(prevStage)
      if (ns) nextStage = ns
      break
    }
    case 'reject': {
      // scored → stay at scored; human_approved → back to script_ready
      if (prevStage === 'human_approved') {
        nextStage = 'script_ready'
      } else if (prevStage === 'scored') {
        // stays at scored — rejected product
        nextStage = 'scored'
      } else {
        const idx = STAGE_SEQUENCE.indexOf(prevStage)
        if (idx > 0) nextStage = STAGE_SEQUENCE[idx - 1]
      }
      break
    }
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
        decisionNeeded:   nextStage === 'human_approved' ? 'อนุมัติหรือส่งกลับแก้ไข' : null,
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
    type:      action === 'reject' ? 'warning' : 'success',
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
