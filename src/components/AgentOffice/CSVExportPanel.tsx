import type { Campaign } from '../../agents/campaignRegistry'
import { productRepository } from '../../data/productRepository'
import { taskRepository }    from '../../data/taskRepository'
import { dbGetAll }          from '../../data/localStorageDatabase'
import type { RiskLog }      from '../../data/types'
import {
  exportProductsCSV,
  exportCampaignsCSV,
  exportTasksCSV,
  exportRiskLogCSV,
  downloadCSV,
} from '../../services/csvExportService'

interface Props {
  campaigns: Campaign[]
}

export default function CSVExportPanel({ campaigns }: Props) {
  function handleExportProducts() {
    const products = productRepository.getAll()
    if (products.length === 0) { alert('ไม่มีสินค้าใน localStorage — ลองเพิ่มสินค้าก่อน'); return }
    downloadCSV(`products_${dateSuffix()}.csv`, exportProductsCSV(products))
  }

  function handleExportCampaigns() {
    downloadCSV(`campaigns_${dateSuffix()}.csv`, exportCampaignsCSV(campaigns))
  }

  function handleExportRiskLog() {
    const riskLog = dbGetAll<RiskLog>('risk_log')
    downloadCSV(`risk_log_${dateSuffix()}.csv`, exportRiskLogCSV(riskLog))
  }

  function handleExportTasks() {
    const tasks = taskRepository.getAll()
    if (tasks.length === 0) { alert('ไม่มี Task Queue ใน localStorage'); return }
    downloadCSV(`tasks_${dateSuffix()}.csv`, exportTasksCSV(tasks))
  }

  return (
    <div style={{
      border: '1px solid #1a2540', background: '#06090f',
      padding: '10px 14px', fontFamily: 'Share Tech Mono, monospace',
    }}>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: '#2a3560', letterSpacing: 2, marginBottom: 8 }}>
        ส่งออก CSV
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <ExportBtn label="ส่งออก Products CSV"  color="#00e5ff" onClick={handleExportProducts}  />
        <ExportBtn label="ส่งออก Campaigns CSV" color="#00ff9f" onClick={handleExportCampaigns} />
        <ExportBtn label="ส่งออก Tasks CSV"     color="#8892b0" onClick={handleExportTasks}     />
        <ExportBtn label="ส่งออก Risk Log CSV"  color="#ffb300" onClick={handleExportRiskLog}   />
      </div>
    </div>
  )
}

function ExportBtn({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'VT323, monospace', fontSize: 13,
        color, background: `${color}0d`, border: `1px solid ${color}44`,
        padding: '5px 14px', cursor: 'pointer', letterSpacing: 1,
      }}
    >
      {label}
    </button>
  )
}

function dateSuffix(): string {
  const d = new Date()
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}
