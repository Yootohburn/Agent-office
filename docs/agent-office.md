# Agent Office — Documentation

## 1. What is Agent Office?

Agent Office is a mock 8-bit visual dashboard for coordinating AI agents in an affiliate marketing automation workflow.

It supports three affiliate platforms:
- **Shopee Affiliate** — Southeast Asia e-commerce
- **Lazada Affiliate** — Southeast Asia e-commerce
- **TikTok Shop Affiliate** — Short-form video commerce

Phase 1 is mock data only. No real APIs are connected. The dashboard shows how agents will work together once real integrations are built.

---

## 2. What Each Agent Does

### Shared Agents (all platforms)

| Agent | Role |
|---|---|
| Product Scout | Finds and scores affiliate products from a URL or keyword |
| Offer Analyst | Evaluates commission rate, offer strength, and selling angle |
| Script Writer | Writes hooks, video scripts, and captions |
| Visual Designer | Outputs visual concept briefs and thumbnail direction |
| Clip Builder | Assembles video scene manifests and export packages |
| Publisher | Formats posts per platform with caption and hashtags |
| Compliance Checker | Scans for banned claims, missing disclosures, platform rule violations |
| Growth Analyst | Tracks engagement, completion rate, CTR, and ROI across platforms |
| Housekeeper | Cleans up stale files, duplicates, and archives old campaigns |

### TikTok-Specific Agents

| Agent | Role |
|---|---|
| TikTok Strategist | Lead agent — defines campaign angle, briefs the team |
| Trend Scout | Analyzes FYP algorithm signals, trending sounds, and competitor formats |
| TikTok Offer Analyst | Evaluates TikTok Shop commission rates and impulse-buy potential |
| TikTok Script Writer | Writes 3-second hooks and pattern-interrupt scripts for short video |
| TikTok Analytics AI | Tracks TikTok-specific KPIs: engagement >8%, completion >70%, ROI 4:1 |
| UGC Manager | Matches products to nano/micro/macro creators for UGC campaigns |

---

## 3. How TikTok Affiliate Fits In

The TikTok workflow is designed around the 3-second attention rule and the FYP algorithm:

```
Trend/Product Idea
       ↓
TikTok Strategist   ← defines angle, hook style, format
       ↓
Trend Scout         ← trending sounds, hashtags, competitor formats
       ↓
TikTok Offer Analyst ← commission rate, impulse score, visual appeal
       ↓
TikTok Script Writer ← hook + script beats with pattern interrupts
       ↓
Visual Designer     ← thumbnail concept, color palette
       ↓
Compliance Checker  ← platform rules, #ad disclosure, banned claims
       ↓
TikTok Analytics AI ← monitors KPIs after publish
```

---

## 4. How the tiktok_strategist.py Prototype Was Used

The file at `prototypes/tiktok_strategist.py` is a reference recreation of a prototype from another repository.

**It is NOT wired into production.** It was used only to extract these concepts:

| Prototype Concept | Where It Lives Now |
|---|---|
| 3-second hook rule | `tiktok-script-writer.md`, `agentRegistry.ts` mock data |
| 4 sub-agent team structure | `.claude/agents/` — 6 TikTok-specific agents |
| MessageBus with JSONL | `agentTaskRouter.ts` — workflow step routing |
| KPI targets (engagement >8%, completion >70%, ROI 4:1) | `tiktok-analytics-ai.md`, `agentRegistry.ts` |
| Creator tier system (nano → top-tier) | `ugc-manager.md` |
| FYP algorithm optimization | `trend-scout.md` |

---

## 5. What is Mock vs Real

| Thing | Phase 1 Status |
|---|---|
| Agent UI cards and status | Mock data in `agentRegistry.ts` |
| Workflow pipelines | Mock steps in `agentTaskRouter.ts` and `agentSessionStore.ts` |
| Activity log | Static mock entries in `agentSessionStore.ts` |
| Shopee API | NOT connected |
| Lazada API | NOT connected |
| TikTok API | NOT connected |
| Web scraping | NOT implemented |
| Auto-posting | NOT implemented |
| AI model calls inside app | NOT implemented |
| Compliance scanning | Mock flags only |
| Analytics data | Mock numbers only |

---

## 6. How to Add a New Agent

1. Create `.claude/agents/<agent-name>.md` following the existing template (name, description, role, platform, what it does, what it must NOT do, expected output format, risks, when to ask for human review).

2. Add the agent definition to `src/agents/agentRegistry.ts`:
```typescript
{
  id: 'my-new-agent',
  name: 'My New Agent',
  role: 'Does X for Y',
  platform: 'shopee', // or lazada | tiktok | shared
  status: 'idle',
  currentTask: 'No active task',
  progress: 0,
  recentOutput: '',
  risks: [],
  nextAction: 'Waiting for input',
}
```

3. If it's platform-specific, add it to `platformRegistry.ts` if needed.

4. Add it to the relevant workflow template in `agentTaskRouter.ts`:
```typescript
steps: ['product-scout', 'my-new-agent', 'compliance-checker'],
```

5. The dashboard will display it automatically — no UI code changes needed for a basic card.

---

## 7. How Task Routing Works

`agentTaskRouter.ts` defines workflow templates: ordered lists of agent IDs.

In Phase 1, routing is purely descriptive (mock display). In Phase 2, each step would:
1. Check the current agent's status is `done`
2. Call `getNextAgent(workflowId, currentAgentId)` to find the next agent
3. Pass the output JSON from the current agent as input to the next
4. Update the session store

The MessageBus concept (from the prototype) would work like this in future:
- Each agent reads from its own inbox
- Each agent writes its output to the next agent's inbox
- The session store tracks which step is active

---

## 8. Future Integrations Needed

| Integration | Phase | Notes |
|---|---|---|
| Shopee Affiliate API | Phase 2 | Product data, commission rates |
| Lazada Affiliate API | Phase 2 | Product data, commission rates |
| TikTok Shop API | Phase 2 | Product catalog, commission, shop data |
| TikTok Analytics API | Phase 2 | Views, engagement, completion rate, CTR |
| Real AI model calls (Claude API) | Phase 2 | Script generation, compliance checking |
| Auto-publish to platforms | Phase 3 | Requires OAuth and platform approvals |
| Creator outreach (UGC Manager) | Phase 3 | CRM / email integration needed |
| Real-time trend data | Phase 2 | TikTok Creative Center API or third-party |

---

## 9. How to Add Codex Support Later

When Codex repository access is working:

1. Create `.codex/agents/` directory.
2. Mirror the relevant `.claude/agents/` files there, adapting format if Codex requires different headers.
3. Add a note to `CLAUDE.md` explaining which agents are supported in both tools.
4. Do not duplicate backend logic — the `src/agents/` TypeScript files are tool-agnostic.

No `.codex/` files should be created until Codex access is confirmed working.
