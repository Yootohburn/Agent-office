import { useState, useEffect } from 'react'
import type { Campaign, PipelineStage } from '../../agents/campaignRegistry'
import type { AgentTaskRecord } from '../../data/types'
import type { WorkflowAction } from '../../agents/campaignWorkflow'
import { taskRepository }        from '../../data/taskRepository'
import { productRepository }     from '../../data/productRepository'
import { advanceTaskQueue }      from '../../services/agentTaskQueueService'
import { runMockAgent }          from '../../services/mockAgentRunner'
import { getNextStage }          from '../../agents/agentTaskRouter'
import { PIPELINE_STAGES }       from '../../agents/campaignRegistry'

const STATUS_LABEL: Record<string, string> = {
  pending:     'รอดำเนินการ',
  in_progress: 'กำลังทำงาน',
  done:        'เสร็จแล้ว ✓',
  failed:      'ล้มเหลว ✗',
  needs_review:'รอตรวจสอบ',
}

const STATUS_COLOR: Record<string, string> = {
  pending:     '#4a5680',
  in_progress: '#00e5ff',
  done:        '#00ff9f',
  failed:      '#ff5252',
  needs_review:'#ffb300',
}

const AGENT_LABEL: Record<string, string> = {
  'product-research':   'ฝ่ายวิจัยสินค้า',
  'offer-analyst':      'ฝ่ายวิเคราะห์กำไร',
  'content-strategy':   'ฝ่ายกลยุทธ์คอนเทนต์',
  'script-writer':      'ฝ่ายสคริปต์',
  'creative-production':'ฝ่ายผลิตชิ้นงาน',
  'social-performance': 'ฝ่ายโซเชียล',
}

interface Props {
  campaign: Campaign
  onAction: (campaignId: string, action: WorkflowAction) => void
}

export default function AgentTaskQueue({ campaign, onAction }: Props) {
  const [tasks,    setTasks]    = useState<AgentTaskRecord[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  // Reload tasks from localStorage whenever the campaign stage changes.
  useEffect(() => {
    setTasks(taskRepository.getByCampaign(campaign.id))
  }, [campaign.id, campaign.stage])

  // Campaigns created before v2.5 (mock data) have no task records.
  if (tasks.length === 0) {
    return (
      <div style={{
        fontFamily:  'Share Tech Mono, monospace',
        fontSize:    10,
        color:       '#2a3560',
        letterSpacing: 1,
        padding:     '8px 0',
        lineHeight:  1.6,
      }}>
        ── ไม่มี Task Queue ──<br />
        แคมเปญนี้สร้างจาก mock data<br />
        Task Queue จะปรากฏเมื่อสร้างแคมเปญผ่านแบบฟอร์ม "เพิ่มสินค้าใหม่"
      </div>
    )
  }

  function handleRunNext() {
    const nextStage = getNextStage(campaign.stage as PipelineStage)
    if (!nextStage) return

    const product = campaign.product_id
      ? productRepository.getById(campaign.product_id)
      : undefined

    // Generate mock output for the stage just completed, persist task records.
    const outputJson: Record<string, unknown> = product
      ? (runMockAgent(campaign.stage as PipelineStage, product) as unknown as Record<string, unknown>)
      : { note: 'no product record' }

    advanceTaskQueue(
      campaign.id,
      campaign.product_id ?? '',
      campaign.stage as PipelineStage,
      nextStage,
      outputJson,
    )

    // Drive the existing workflow (updates campaign + agents + log + chat in React state).
    onAction(campaign.id, campaign.stage === 'asset_ready' ? 'request_approval' : 'run_next_step')

    // Re-read tasks after state update.
    setTimeout(() => setTasks(taskRepository.getByCampaign(campaign.id)), 50)
  }

  function handleApprove() {
    onAction(campaign.id, 'approve')
    setTimeout(() => setTasks(taskRepository.getByCampaign(campaign.id)), 50)
  }

  function handleReject() {
    onAction(campaign.id, 'reject')
    setTimeout(() => setTasks(taskRepository.getByCampaign(campaign.id)), 50)
  }

  const isAtApprovalGate = campaign.stage === 'human_approved'
  const isComplete        = campaign.stage === 'learned'
  const stageLabel = (stage: string) =>
    PIPELINE_STAGES.find(s => s.id === stage)?.label ?? stage

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>

      {/* ── Task list ── */}
      {tasks.map(task => {
        const isOpen  = expanded === task.task_id
        const sColor  = STATUS_COLOR[task.status] ?? '#4a5680'
        const hasOut  = Object.keys(task.output_json).length > 0

        return (
          <div
            key={task.task_id}
            style={{
              background:  '#06090f',
              border:      `1px solid ${task.status === 'done' ? '#00ff9f22' : '#1a2540'}`,
              borderLeft:  `3px solid ${sColor}`,
            }}
          >
            {/* Row */}
            <div
              onClick={() => setExpanded(isOpen ? null : task.task_id)}
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        8,
                padding:    '5px 8px',
                cursor:     'pointer',
              }}
            >
              <span style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: sColor, flexShrink: 0 }}>
                {task.status === 'done' ? '✓' : task.status === 'needs_review' ? '⚠' : '○'}
              </span>
              <span style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 11, color: '#8892b0', flex: 1, lineHeight: 1.3 }}>
                {stageLabel(task.stage)}
                <span style={{ color: '#2a3560', marginLeft: 4, fontSize: 10 }}>
                  · {AGENT_LABEL[task.agent_id] ?? task.agent_id}
                </span>
              </span>
              <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: sColor, flexShrink: 0 }}>
                {STATUS_LABEL[task.status] ?? task.status}
              </span>
              {hasOut && (
                <span style={{ fontFamily: 'VT323, monospace', fontSize: 10, color: '#2a3560' }}>
                  {isOpen ? '▲' : '▼'}
                </span>
              )}
            </div>

            {/* Expanded output */}
            {isOpen && hasOut && (
              <div style={{
                padding:    '6px 10px 8px',
                borderTop:  '1px solid #1a2540',
                fontFamily: 'Sarabun, sans-serif',
                fontSize:   11,
                color:      '#6878a0',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                maxHeight:  160,
                overflowY:  'auto',
              }}>
                {typeof task.output_json.summary === 'string' && (
                  <div style={{ color: '#8892b0', marginBottom: 4 }}>{task.output_json.summary as string}</div>
                )}
                {typeof task.output_json.content === 'string' && (
                  <div>{task.output_json.content as string}</div>
                )}
                {Array.isArray(task.output_json.risks) && (task.output_json.risks as string[]).length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    {(task.output_json.risks as string[]).map((r, i) => (
                      <div key={i} style={{ color: '#ffb300', fontSize: 10 }}>⚠ {r}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* ── Human Approval Gate ── */}
      {isAtApprovalGate && (
        <div style={{
          background:  '#ffb30011',
          border:      '1px solid #ffb30044',
          borderLeft:  '3px solid #ffb300',
          padding:     '10px 10px',
          display:     'flex',
          flexDirection: 'column',
          gap:         6,
        }}>
          <div style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: '#ffb300', letterSpacing: 1 }}>
            ⚠ HUMAN APPROVAL GATE — ต้องได้รับการอนุมัติก่อน publish
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={handleApprove}
              style={{
                flex: 1, fontFamily: 'VT323, monospace', fontSize: 14,
                color: '#00ff9f', background: '#00ff9f14', border: '1px solid #00ff9f44',
                padding: '6px 8px', cursor: 'pointer', letterSpacing: 1,
              }}
            >
              ✓ อนุมัติ — Publish
            </button>
            <button
              onClick={handleReject}
              style={{
                flex: 1, fontFamily: 'VT323, monospace', fontSize: 14,
                color: '#ff5252', background: '#ff525214', border: '1px solid #ff525244',
                padding: '6px 8px', cursor: 'pointer', letterSpacing: 1,
              }}
            >
              ✕ ส่งกลับแก้ไข
            </button>
          </div>
        </div>
      )}

      {/* ── Run Next Step ── */}
      {!isAtApprovalGate && !isComplete && (
        <button
          onClick={handleRunNext}
          style={{
            fontFamily:    'VT323, monospace',
            fontSize:      15,
            color:         '#00e5ff',
            background:    '#00e5ff0d',
            border:        '1px solid #00e5ff44',
            padding:       '8px 10px',
            cursor:        'pointer',
            letterSpacing: 1,
            textAlign:     'left',
            width:         '100%',
            marginTop:     2,
          }}
        >
          ▶ Run Next Step — ส่งมอบงานขั้นถัดไป
        </button>
      )}

      {isComplete && (
        <div style={{
          fontFamily: 'VT323, monospace', fontSize: 12,
          color: '#00ff9f', letterSpacing: 1, padding: '6px 0',
        }}>
          ✓ PIPELINE COMPLETE — บันทึกบทเรียนแล้ว
        </div>
      )}
    </div>
  )
}
