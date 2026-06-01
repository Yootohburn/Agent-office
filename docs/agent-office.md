# Agent Office v2.4.2 — Documentation

## Research Alignment — v2.4.2

### Why we moved from the old agent model to 6 agents

The previous system had CEO, product-analyst, content-studio, ops-review, finance-controller, and social-community-manager. This was organized around internal company roles, not around the actual product-to-revenue workflow. The new 6-agent system is organized around pipeline stages — each agent owns a specific set of workflow stages and hands off to the next agent.

### Why CEO is now an approval/dashboard role, not a production agent

The CEO is a human role. Building an AI "CEO agent" that makes final decisions is a category error. In the real system, the CEO or business owner reviews the full package before publishing. This is modeled as the `human_approved` pipeline stage — a mandatory gate, not an agent.

### Why Human Approval is a mandatory gate stage

Semi-automation without a human gate tends toward publishing low-quality or risky content at scale. The `human_approved` stage is not optional. No automation path bypasses it. AI generates — human approves — then publish.

### Why Shopee / TikTok / Lazada are channels, not departments

Organizing the office around platforms (TikTok dept, Shopee dept) creates silos that duplicate work. Instead, platforms are revenue channels — a product campaign is assigned to one primary channel and the same 6-agent pipeline handles it regardless of channel.

### Why early categories are storage, cleaning, and budget electronics accessories

These categories have: (1) high demo-ability for short video, (2) low claim risk, (3) impulse buy price range ฿150–฿600, (4) proven affiliate commission rates 7–10%, (5) no health/medical claims. Categories like health supplements or high-end electronics carry compliance risk that outweighs the commission potential at Phase 1 scale.

### Why semi-automation is better than full automation for Phase 1

Full automation at Phase 1 scale would produce low-quality content faster than any human can review it. The semi-auto model (AI generates, human approves) builds trust, catches errors, and produces content the business owner actually believes in. Speed is not the bottleneck — quality and trust are.

### What orchestration will look like in Phase 2

Phase 2 orchestration will use n8n, Make, or Pipedream to connect:
- Real Shopee Affiliate API (product data + commission)
- Real Lazada Affiliate API
- Real TikTok Shop API
- Claude API for script generation and scoring
- Canva API for asset generation
- Human approval via Line Notify or Telegram bot

The React dashboard will become a monitoring interface, not the execution engine.

### What is still mock in Phase 1

Everything. All product data, scores, ROAS figures, pipeline transitions, and agent outputs are static mock data in TypeScript files. No real API calls are made anywhere in the app.

### What becomes real in Phase 2

- Product data: real scraping or API integration
- Scoring: real Claude API calls with structured output
- Script generation: real Claude API with product context
- Human approval: real notification + approval flow
- Performance data: real analytics API integration
- Payout tracking: real affiliate dashboard API

---

## 1. What is Agent Office?

Agent Office is an AI-operated affiliate content creator company, visualized as an 8-bit pixel dashboard.

This is **not** a platform integration tool and **not** organized by platform. The platforms (Shopee, Lazada, TikTok) are **revenue channels** — places where campaigns are run and money is earned. The company itself is organized into five departments that handle every campaign from brief to financial analysis.

Phase 1 is mock data only. No real APIs are connected.

---

## 2. The Five Core Departments

| Code ID | Thai display name | Title |
|---|---|---|
| `ceo-director` (ceo_agent) | CEO / ผู้อำนวยการแคมเปญ | Chief Executive Officer |
| `product-analyst` (product_trend_analyst) | นักวิเคราะห์สินค้าและเทรนด์ | Head of Product Research |
| `content-studio` (content_studio_agent) | ทีมผลิตคอนเทนต์ | Creative Director & Content Producer |
| `ops-review` (ops_review_agent) | ทีมตรวจสอบและปฏิบัติการ | Operations Manager & Compliance Officer |
| `finance-controller` (finance_ads_controller) | ฝ่ายการเงินและงบโฆษณา | Finance & Ads Controller |

### CEO / ผู้อำนวยการแคมเปญ
Final decision-maker. Sets weekly campaign priorities, approves or rejects every campaign, monitors company KPIs.

### นักวิเคราะห์สินค้าและเทรนด์
Intelligence department. Scores products across commission rate, rating, reviews, price, and trend strength. Delivers research brief with recommended angle.

### ทีมผลิตคอนเทนต์
Creative engine. Takes research brief and produces full content package: 3-second hook, script, caption, hashtags, thumbnail brief, UGC brief.

### ทีมตรวจสอบและปฏิบัติการ
Operational backbone. Compliance scanning (auto-blocks health claims, missing disclosures, price mismatches), queue management, export packaging, performance tracking.

### ฝ่ายการเงินและงบโฆษณา
Finance department. Tracks revenue, commission, ad spend, content cost, net profit, and ROAS per campaign and per revenue channel. Flags losing campaigns and recommends budget adjustments to the CEO.

---

## 3. Revenue Channels (not departments)

Shopee, Lazada, and TikTok are **revenue channels** — campaign destinations where the company earns affiliate commission. They are NOT departments or the main organizing principle of the office.

Each channel has its own financial performance tracked separately:

| Channel | What the Finance Controller tracks |
|---|---|
| Shopee | รายได้, ค่าคอมมิชชั่น, ค่าโฆษณา, ต้นทุนคอนเทนต์, กำไรสุทธิ, ROAS, ยอดรอรับเงิน |
| Lazada | รายได้, ค่าคอมมิชชั่น, ค่าโฆษณา, ต้นทุนคอนเทนต์, กำไรสุทธิ, ROAS, ยอดรอรับเงิน |
| TikTok | รายได้, ค่าคอมมิชชั่น, ค่าโฆษณา, ต้นทุนคอนเทนต์, กำไรสุทธิ, ROAS, ยอดรอรับเงิน |

"Multi-channel" is not used as a tab or filter — each campaign is assigned to one primary channel.

---

## 4. Finance Warning System

The Finance & Ads Controller auto-flags campaigns based on these rules:

| Condition | Warning |
|---|---|
| ROAS < 2.0x | ROAS ต่ำกว่าเป้าหมาย |
| Net profit < 0 | ค่าโฆษณาสูงกว่ากำไร / ควรหยุดยิงแอด |
| ROAS > 5.0x | ควรเพิ่มงบ — คุ้มค่าขยายสเกล |
| Pending payout > 0 | ค่าคอมมิชชั่นยังรอรับเงิน |

Scale threshold: ROAS ≥ 5.0x + 3+ days of data
Stop threshold: ROAS < 2.0x or net profit < 0

---

## 5. Campaign Pipeline (Thai labels)

Every campaign follows this 8-stage pipeline:

```
บรีฟแคมเปญ         → CEO sets direction
วิเคราะห์สินค้า    → Product & Trend Analyst
ผลิตคอนเทนต์       → Content Studio Agent
ตรวจสอบความเสี่ยง  → Ops & Review Agent
CEO อนุมัติ         → CEO / Campaign Director
พร้อมส่งออก         → Ops & Review Agent (packaging)
วิเคราะห์ผลลัพธ์   → Ops & Review Agent (tracking)
Finance Review       → Finance & Ads Controller (scale/stop/improve)
```

Campaigns can go backwards (e.g., compliance block → back to content creation).

---

## 6. Campaign Data Model

Each campaign includes finance fields:
- `revenue` — affiliate revenue earned (THB)
- `commission` — commission amount (THB)
- `adSpend` — total ad spend (THB)
- `contentCost` — content production cost (THB)
- `netProfit` — revenue minus all costs (THB)
- `roas` — return on ad spend (revenue ÷ ad spend)
- `conversionRate` — conversion % (mock)
- `costPerOrder` — cost per conversion (THB)
- `pendingPayout` — commission not yet received (THB)

---

## 7. Mock Campaigns (Phase 1)

| Campaign | Channel | Net Profit | ROAS | Finance Status |
|---|---|---|---|---|
| Wireless Earbuds ใต้ 500 บาท | TikTok | +฿1,450 | 4.6x | ปกติ |
| โคมไฟตั้งโต๊ะ Home Office | Shopee | +฿620 | 6.0x | ควรเพิ่มงบ |
| Portable Blender | Lazada | -฿120 | 2.0x | ควรหยุดยิงแอด |
| Skincare Travel Pouch | TikTok | +฿1,200 | 7.2x | ควรเพิ่มงบ |

---

## 8. What is Mock vs Real

| Thing | Phase 1 Status |
|---|---|
| Agent department cards | Mock data in `agentRegistry.ts` |
| Campaign pipeline | Mock data in `campaignRegistry.ts` |
| Finance figures | Mock data in `campaignRegistry.ts` + calculated in `financeRegistry.ts` |
| Activity log | Static mock entries in `agentSessionStore.ts` |
| Shopee API | NOT connected |
| Lazada API | NOT connected |
| TikTok API | NOT connected |
| Ad account | NOT connected |
| Auto-posting | NOT implemented |
| Real commission tracking | NOT implemented |

---

## 9. How to Add a New Agent (Department)

1. Add to `src/agents/agentRegistry.ts` with `codeName`, `thaiName`, `title`, etc.
2. Create `.claude/agents/<id>.md` with the instruction file.
3. Add routing if it owns a pipeline stage in `src/agents/agentTaskRouter.ts`.
4. The dashboard grid auto-adjusts.

---

## 10. How to Add a New Campaign

1. Add to `src/agents/campaignRegistry.ts` with full finance fields.
2. The pipeline, finance dashboard, and activity log will display it automatically.

---

## 11. Future Integrations (Phase 2+)

| Integration | Notes |
|---|---|
| Shopee Affiliate API | Product data, commission rates, payout tracking |
| Lazada Affiliate API | Product data, commission rates, payout tracking |
| TikTok Shop API | Product catalog, commission, shop stats |
| Ad platform APIs (Meta, TikTok Ads) | Real ad spend tracking → replace mock adSpend field |
| Claude API for content generation | Replace mock scripts with real AI output |
| Auto-publish | Phase 3 — requires OAuth + platform approval |
| Real commission payout tracking | Import from affiliate dashboard CSV or API |

---

## 12. Agent Room System (v2.0)

Each of the 5 departments is visualised as an 8-bit room on the office floor. Rooms replace the flat department cards from v1.2.

### Room layout

Every room card has two zones:

| Zone | Height | Content |
|---|---|---|
| Room scene | 120 px | Pixel-art room interior: wall, floor, desk, department elements, avatar |
| Info strip | auto | Thai name, title, current task, progress bar, risk/decision alerts |

### Department rooms

| Agent | Room name | Accent | Signature elements |
|---|---|---|---|
| CEO / Campaign Director | COMMAND ROOM | `#00ff9f` | Campaign board (wall), KPI monitor (desk), approval stamp stack |
| Product & Trend Analyst | RESEARCH LAB | `#00e5ff` | Trend bar chart, data monitor with live bars, product box stack (wall) |
| Content Studio | CONTENT STUDIO | `#ff9800` | Ring light (left wall), script board (desk), camera with lens + record light |
| Ops & Review | CONTROL ROOM | `#ffb300` | Compliance checklist (wall), warning monitor (blinks red when blocked), queue shelf |
| Finance & Ads Controller | FINANCE ROOM | `#00c8a0` | Revenue bar chart, ROAS dashboard screen, traffic-light budget indicator |

### Pixel avatar (Phase 1 — CSS only)

Each room contains a pixel character made of plain CSS `div` elements:
- **Head** — 14 × 12 px skin-tone rectangle with 2 × 2 eye blocks
- **Body / outfit** — 14 × 16 px rectangle in department accent color
- **Accessory** — a small unicode glyph below the body (▣ CEO, ▦ analyst, ⊙ camera, ☑ ops, ▲ finance)

No image files are used. Phase 2 can replace these with real pixel-art sprite sheets by swapping `PixelAgentAvatar.tsx`.

### Status-linked visuals

Room elements respond to agent status without JavaScript timers — CSS animations only:

| Status | Visual change |
|---|---|
| `working` | Monitor screen border glows accent color; cursor blink in screen; ring light pulses (Content Studio); revenue bar tip blinks (Finance) |
| `needs_review` | Amber status dot blinks (top-right of room); desk LED amber |
| `blocked` | Monitor shows ⚠ symbol with red border and fast blink (Ops); desk LED red and blinking |
| `failed` | Same as blocked; avatar glow turns red via `drop-shadow` filter |
| `idle` | All lights dim; monitor border uses `accent44` (dim accent) |
| `done` | Cyan status dot; avatar glow cyan |

### Files

| File | Role |
|---|---|
| `src/components/AgentOffice/AgentRoom.tsx` | Main room card; contains `ROOM_META`, `RoomScene`, `RoomElements`, and five scene sub-components |
| `src/components/AgentOffice/PixelAgentAvatar.tsx` | CSS pixel character; `scale` prop for larger version in detail panel |
| `src/components/AgentOffice/RoomStatusIndicator.tsx` | Reusable status dot + label; blinks per `AgentStatus` |

---

## 13. Codex Support (Future)

When Codex repository access is working:
1. Create `.codex/agents/` and mirror the 5 department instruction files.
2. Codex can assist with: backend API integration, data pipeline, UI testing, build automation.
3. Claude Code handles: agent logic, content strategy, campaign decisions, creative output.
4. Do not create `.codex/` files until Codex access is confirmed working.

---

## Agent Office v2.4.1 — Finance Goal Board + Agent Visibility Upgrade

### What changed in v2.4.1

#### Part A — Finance Goal Board (การเงิน tab)

`FinanceDashboard.tsx` expanded from 84 lines to ~280 lines. Six sections now fill the page:

1. **Monthly Goal Board** — progress bars for revenue (เป้า ฿50,000) and profit (เป้า ฿15,000), ROAS vs target, campaign count
2. **Channel P&L Cards** — existing channel cards now clickable; click opens ChannelDetailPanel in right panel
3. **Campaign Profit Table** — all 4 campaigns shown in a table: revenue / ad spend / commission / net profit / ROAS / recommendation
4. **Ad Budget Control Panel** — total budget / spent / remaining bar; scale list; pause list; break-even and target ROAS
5. **Finance Alerts** — color-coded rows for loss, low ROAS, pending payout, margin warnings
6. **Next Finance Actions** — 6 prioritized action items in Thai

New mock data constants added to `financeRegistry.ts`:
```ts
export const MONTHLY_GOALS = { revenueTarget: 50_000, profitTarget: 15_000, roasTarget: 5.0, campaignsTarget: 8 }
export const AD_BUDGET = { totalBudget: 5_000, spent: 2_450, remaining: 2_550, breakEvenRoas: 2.5, targetRoas: 5.0, scale: [...], pause: [...] }
```

New file `ChannelDetailPanel.tsx` — right panel shown when a channel card is clicked. Shows: channel P&L, diagnosis, campaign breakdown, next actions.

#### Part B — Agent Visibility Upgrade

`AgentRoom.tsx` changes:
- **Status badge bar** between SVG scene and info section: large `WORKING / NEEDS REVIEW / BLOCKED / DONE / IDLE` label with icon, color-coded
- **Status-driven borders**: `working` = accent top + dim accent sides; `needs_review` = amber; `blocked/failed` = red; `done` = dim green; `idle` = muted dark
- Selected state always overrides to full accent border
- Removed English title subtitle for cleaner hierarchy
- Current campaign name shown in the badge bar when agent is active

#### Part C — Right Panel Improvements

`AgentCommandPanel.tsx` additions (optional props):
- `currentStageLabel?: string` — pipeline stage chip shown in header area
- `latestOutput?: AgentOutput` — one-line output summary shown below stage chip

`AgentOffice.tsx` computes these from live campaign state and passes them when an agent is selected.

`ChannelDetailPanel.tsx` (new) — right panel for finance channel selection with full P&L, diagnosis, campaign breakdown, next actions.

#### Part D — UI/UX Subagent

`.claude/agents/ui-ux-product-reviewer.md` created. Dev-only subagent for reviewing dashboard UI/UX. Includes checklist for readability, hierarchy, layout, 8-bit style, agent status visibility, and finance pages.

#### Files changed in v2.4.1

| File | Change |
|---|---|
| `src/agents/financeRegistry.ts` | Added `MONTHLY_GOALS`, `AD_BUDGET` constants |
| `src/components/AgentOffice/FinanceDashboard.tsx` | Expanded to 6 sections; accepts `onSelectChannel`, `selectedChannelId` props |
| `src/components/AgentOffice/RevenueByChannel.tsx` | Added `onSelect`, `isSelected` props; click-to-select in full mode |
| `src/components/AgentOffice/AgentRoom.tsx` | Status badge bar; status-driven borders; removed title subtitle |
| `src/components/AgentOffice/AgentCommandPanel.tsx` | Added `currentStageLabel`, `latestOutput` optional props |
| `src/components/AgentOffice/AgentOffice.tsx` | Added `selectedChannelId` state; wired all new props; v2.4.1 version tag |
| `src/components/AgentOffice/ChannelDetailPanel.tsx` | New file — right panel for channel finance detail |
| `.claude/agents/ui-ux-product-reviewer.md` | New dev-only subagent instruction file |

---

## Agent Office v2.4 — Mock Run Task System

### What changed in v2.4

Campaigns now move through all 8 pipeline stages interactively. Clicking action buttons in `CampaignDetailPanel` triggers the workflow engine, updating campaign stage, agent status, generating Thai mock output, adding log entries, and adding team chat messages — all in React state.

#### New files
- `src/agents/campaignWorkflow.ts` — stage action definitions, progress map, mock output generator
- `src/agents/mockWorkflowEngine.ts` — pure function `runWorkflowAction()` returns `WorkflowResult`

#### State lifted to AgentOffice.tsx
All mutable data (campaigns, agents, logs, teamChat) is React state. All child components accept live data as props.

#### Extended Campaign model
```ts
riskLevel: 'low' | 'medium' | 'high' | 'critical'
riskMessage: string
outputs: AgentOutput[]
```

---

## Agent Office v2.2 — Executive Office Layout + Agent Chat

### What changed in v2.2

#### Navigation (5 tabs → 4 tabs)
The separate "Agent Office" tab was removed because it duplicated the overview.
Agent rooms now live inside **ภาพรวมบริษัท** alongside campaign focus and revenue channels.

Navigation tabs:
- ภาพรวมบริษัท — 5 agent rooms + campaign focus + revenue channel cards
- แคมเปญ — campaign list + 8-stage pipeline view
- การเงิน — full finance dashboard with channel breakdown
- บันทึกการทำงาน — system activity log

Shopee, Lazada, and TikTok remain revenue channel tags on campaigns, not navigation tabs.

#### Font and readability
- Body/task Thai text now uses **Sarabun** (Google Font, no new library dependency).
- Pixel fonts (VT323, Share Tech Mono) are reserved for headings, badges, borders, numbers, and the 8-bit atmosphere.
- Minimum sizes: body Thai 14px, room titles 20px, KPI numbers 28px, chat text 14px.
- The CSS `image-rendering: pixelated` property was removed from body to allow Sarabun to render correctly.

#### Executive layout (ภาพรวมบริษัท tab)
```
[Header: brand + 6 KPI chips]
[Nav: 4 tabs]
[Main: left scrollable | right panel (when selected)]
  Left:
    - 5 agent room cards (grid 5 columns)
    - Bottom row:
        - CampaignFocusSection (left, larger)
        - Revenue channel compact cards (right)
  Right (when agent selected):
    - AgentCommandPanel with mock chat
  Right (when campaign selected):
    - CampaignDetailPanel
```

#### Agent room cards
Each room card shows:
- Thai display name (VT323 20px)
- English title subtitle
- Channel badge (if active campaign)
- Current task text (Sarabun 14px)
- Progress bar
- Risk / decision badges
- Next action (Sarabun 13px)
- **คุยกับ Agent** button → opens AgentCommandPanel

---

### Agent Command Panel

Located in `src/components/AgentOffice/AgentCommandPanel.tsx`.

Shows when the user selects an agent room (click card or "คุยกับ Agent" button).

Structure:
1. **Header** — agent name, role, current campaign, next action, current task, risk/decision alerts
2. **Quick Prompts** — 6 buttons that pre-fill and send common questions
3. **Chat area** — scrollable conversation bubbles with auto-scroll
4. **Input row** — text field + ส่ง button, Enter key support

Quick prompts:
- สรุปสถานะตอนนี้
- แนะนำขั้นตอนถัดไป
- แก้ปัญหาแคมเปญนี้
- สร้างไอเดียใหม่
- ตรวจความเสี่ยง
- อธิบายตัวเลขการเงิน

Conversation state persists per agent within the session (in-memory, resets on page reload).

---

### Mock Chat System (Phase 1)

**Phase 1: mock responses only. No real LLM API calls.**

Files:
- `src/agents/agentConversationStore.ts` — message data model and in-memory store
- `src/agents/agentChatRouter.ts` — intent detection + mock response routing

Data model (`ChatMessage`):
```ts
interface ChatMessage {
  id: string
  agentId: string
  campaignId?: string
  sender: 'user' | 'agent'
  text: string
  timestamp: string
  intent?: string           // detected intent key
  mockActionResult?: string // reserved for future action results
}
```

Intent detection (`detectIntent`):
Maps Thai keywords to intent keys: `status`, `next_action`, `problem_solve`, `ideas`, `risk`, `finance`, `general`.

Mock responses:
Each of the 5 agents has pre-written Thai responses per intent key, referencing live data from registries (actual ROAS, profit, campaign names).

Initial greeting:
When a conversation starts, `getInitialGreeting(agentId)` generates a context-aware opening message referencing the agent's current campaign and progress.

---

### How to replace mock responses with a real LLM (Phase 2+)

Replace the body of `getMockResponse()` in `agentChatRouter.ts`:

```ts
// Phase 1: mock
export function getMockResponse(agentId, userMessage, campaignId?): MockResponse {
  const intent = detectIntent(userMessage)
  const text = RESPONSES[agentId][intent] ?? RESPONSES[agentId].general
  return { text, intent, mockDelay: 700 + Math.random() * 800 }
}

// Phase 2: real LLM (example structure)
export async function getMockResponse(agentId, userMessage, campaignId?): Promise<MockResponse> {
  const systemPrompt = buildAgentSystemPrompt(agentId, campaignId)
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ agentId, message: userMessage, systemPrompt }),
  })
  const { text } = await response.json()
  return { text, intent: detectIntent(userMessage), mockDelay: 0 }
}
```

No component changes required — only `agentChatRouter.ts` needs updating.

---

### How each agent should answer (role guide for LLM Phase 2)

| Agent | Expertise | Response style |
|---|---|---|
| CEO / ผู้อำนวยการแคมเปญ | Strategy, approvals, KPIs, priorities | Decisive, brief, executive-level |
| นักวิเคราะห์สินค้า | Product scores, trends, competitors, commissions | Data-driven, analytical |
| ทีมผลิตคอนเทนต์ | TikTok hooks, scripts, captions, UGC briefs | Creative, specific hooks and formats |
| ทีมตรวจสอบ | Compliance rules, platform policies, queue | Risk-focused, checklist-style |
| ฝ่ายการเงิน | ROAS, P&L, ad spend, budget reallocation | Numbers-first, actionable recommendations |

