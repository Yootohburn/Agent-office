# Agent Office — Documentation

## 1. What is Agent Office?

Agent Office is an AI-operated affiliate content creator company, visualized as an 8-bit pixel dashboard.

It is **not** a platform integration tool. The platforms (Shopee, Lazada, TikTok) are campaign destinations — the company itself is organized into four departments that handle every campaign from product research to publish.

Phase 1 is mock data only. No real APIs are connected. The dashboard shows how the company will work once real integrations are built in later phases.

---

## 2. The Four Core Departments

The office is structured as a company with four departments. Every campaign flows through all of them.

| Department | Agent | Title |
|---|---|---|
| Executive | CEO / Campaign Director | Chief Executive Officer |
| Research | Product & Trend Analyst | Head of Product Research |
| Creative | Content Studio Agent | Creative Director & Content Producer |
| Operations | Ops & Review Agent | Operations Manager & Compliance Officer |

### CEO / Campaign Director

The final decision-maker. Sets weekly priorities, approves or rejects every campaign before it goes to publish, and monitors company-level KPIs (views, CTR, conversion, mock affiliate revenue).

Does NOT write content. Does NOT research products. Delegates everything except final approval.

### Product & Trend Analyst

The intelligence department. Finds affiliate products worth promoting, scores them across five criteria (commission rate, rating, review count, price point, trend strength), maps competitor angles, and delivers a research brief to the Content Studio.

Works across all platforms. Platform is just a tag on each product — the analyst evaluates platform fit as part of the brief.

### Content Studio Agent

The creative engine. Takes a research brief and produces a complete content package: 3-second hook, full video script with pattern interrupts, caption, hashtags, thumbnail brief, and optionally a UGC creator brief.

Adapts tone per platform: TikTok (authentic, fast, Gen Z), Shopee/Lazada (deal-focused, trust-building).

The 3-second hook is the most critical output. Everything else depends on it.

### Ops & Review Agent

The operational backbone. Every content package passes through Ops & Review before the CEO sees it. Runs a full compliance scan, manages the content queue, prepares export packages, and tracks post-publish performance.

Has auto-block authority for health claims, missing disclosures, and price mismatches. Everything else goes to the CEO.

---

## 3. Campaign Pipeline

Every campaign follows the same seven-stage pipeline:

```
Campaign Brief
      ↓
Product Research       ← Product & Trend Analyst
      ↓
Content Creation       ← Content Studio Agent
      ↓
Review & Compliance    ← Ops & Review Agent
      ↓
CEO Approval           ← CEO / Campaign Director
      ↓
Export / Publish Ready ← Ops & Review Agent
      ↓
Performance Feedback   ← Ops & Review Agent → CEO
```

Campaigns can move backwards (e.g., compliance flag → back to Content Studio) but never skip stages.

### Stage ownership

| Stage | Owner |
|---|---|
| Campaign Brief | CEO / Campaign Director |
| Product Research | Product & Trend Analyst |
| Content Creation | Content Studio Agent |
| Review & Compliance | Ops & Review Agent |
| CEO Approval | CEO / Campaign Director |
| Export / Publish Ready | Ops & Review Agent |
| Performance Feedback | Ops & Review Agent |

---

## 4. Platforms — Tags, Not Departments

Shopee, Lazada, TikTok, and Multi-platform are **campaign tags**, not departments.

The platform filter in the dashboard filters the campaign pipeline view to show only campaigns targeting a specific platform. It does not change which agents are shown — all four departments work on every platform.

Each platform has its own content requirements:

| Platform | Content format | Key rule |
|---|---|---|
| TikTok | Short video 15–60s | 3-second hook mandatory |
| Shopee | Feed post + video | Deal angle, trust-building |
| Lazada | Feed post + video | Bundle and discount focus |
| Multi | Adapted per platform | Each version must be platform-native |

---

## 5. Mock Campaigns (Phase 1)

| Campaign | Platform | Stage |
|---|---|---|
| Wireless Earbuds under 500 THB | TikTok | Content Creation |
| Home Office Desk Lamp | Shopee | Product Research |
| Portable Blender | Lazada | Review & Compliance |
| Skincare Travel Pouch | Multi-platform | CEO Approval |

All mock data. No real products, no real affiliate links, no real API calls.

---

## 6. What is Mock vs Real

| Thing | Phase 1 Status |
|---|---|
| Agent department cards and status | Mock data in `agentRegistry.ts` |
| Campaign pipeline | Mock campaigns in `campaignRegistry.ts` |
| Activity log | Static mock entries in `agentSessionStore.ts` |
| Pipeline routing logic | Defined in `agentTaskRouter.ts` — mock only |
| Shopee API | NOT connected |
| Lazada API | NOT connected |
| TikTok API | NOT connected |
| Web scraping | NOT implemented |
| Auto-posting | NOT implemented |
| AI model calls inside app | NOT implemented |
| Compliance scanning | Mock flags only |
| Performance data | Mock numbers only |

---

## 7. How to Add a New Campaign

1. Add a campaign object to `src/agents/campaignRegistry.ts`:
```typescript
{
  id: 'camp-005',
  name: 'Your Campaign Name',
  platform: 'shopee',        // or lazada | tiktok | multi
  category: 'Category',
  targetPrice: '$X–$Y',
  stage: 'product_research', // starting stage
  progress: 0,
  assignedAgentId: 'product-analyst',
  brief: 'Your campaign brief here.',
  targetMetrics: { views: '30,000', ctr: '2%', conversion: '1.5%', mockRevenue: '$100' },
  notes: 'Any notes.',
  riskFlag: null,
}
```

2. The pipeline and dashboard will display it automatically.

---

## 8. How to Add a New Department Agent

This is only needed if the company grows beyond 4 departments.

1. Create `.claude/agents/<agent-name>.md` following the existing template.
2. Add the agent to `src/agents/agentRegistry.ts` following the existing schema.
3. Add routing logic to `src/agents/agentTaskRouter.ts` if the new agent owns a pipeline stage.
4. Add a new card to `AgentOffice.tsx` — the grid auto-adjusts.

---

## 9. How Claude Code Handles Agent Logic

The `.claude/agents/` directory contains instruction files for each department:
- `ceo-director.md` — executive decision authority
- `product-analyst.md` — research and scoring logic
- `content-studio.md` — creative rules and hook formula
- `ops-review.md` — compliance checklist and queue management

These are the primary agent instruction files Claude Code uses when operating the office. The older files (product-scout, offer-analyst, etc.) remain as sub-tools that the main departments can reference.

---

## 10. The tiktok_strategist.py Prototype

The file at `prototypes/tiktok_strategist.py` is a reference recreation of an earlier prototype. It is not wired into production.

Concepts extracted and integrated into the current system:
- 3-second attention rule → Content Studio Agent hook formula
- KPI targets (engagement >8%, completion >70%, ROI 4:1) → Ops & Review performance tracking
- Creator tier system → Content Studio UGC briefs
- MessageBus concept → `agentTaskRouter.ts` pipeline routing

---

## 11. Future Integrations (Phase 2+)

| Integration | Priority | Notes |
|---|---|---|
| Shopee Affiliate API | Phase 2 | Product data, commission rates |
| Lazada Affiliate API | Phase 2 | Product data, commission rates |
| TikTok Shop API | Phase 2 | Product catalog, commission, shop data |
| TikTok Analytics API | Phase 2 | Views, engagement, completion rate, CTR |
| Claude API for content generation | Phase 2 | Replace mock scripts with real AI generation |
| Auto-publish | Phase 3 | Requires OAuth + platform approvals |
| Real creator outreach | Phase 3 | CRM / email integration |

---

## 12. How to Add Codex Support Later

When Codex repository access is working:

1. Create `.codex/agents/` directory.
2. Mirror the four department files there: `ceo-director.md`, `product-analyst.md`, `content-studio.md`, `ops-review.md`.
3. Codex can assist with: backend API integration, UI testing, data pipeline automation, and build tooling.
4. Claude Code handles: agent logic, content strategy, campaign decisions, and creative output.
5. Do not create `.codex/` files until Codex access is confirmed working.
