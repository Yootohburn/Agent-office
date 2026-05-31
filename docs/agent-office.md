# Agent Office v1.2 — Documentation

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
