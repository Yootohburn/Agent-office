"""
TikTok Strategist Agent — PROTOTYPE / REFERENCE ONLY

This file is a recreation of the prototype from:
https://github.com/Yootohburn/Claude-code/blob/claude/peaceful-cray-X3iLu/agents/tiktok_strategist.py

It is NOT wired into the production app.
It is NOT used directly by any component.
It exists to document the original concepts so they can be adapted into the
Agent Office structure.

Concepts extracted and adapted into the new system:
- 3-second attention rule → tiktok-script-writer.md hook formula
- FYP algorithm optimization → trend-scout.md trend scoring
- Engagement KPI targets (>8%) → tiktok-analytics-ai.md benchmarks
- Completion rate target (>70%) → tiktok-analytics-ai.md benchmarks
- ROI target (4:1) → tiktok-analytics-ai.md KPIs
- Creator tier system → ugc-manager.md creator roster
- MessageBus concept → agentTaskRouter.ts workflow routing
- Sub-agent team structure → .claude/agents/ subagent files

DO NOT use this file in production without:
1. Replacing mock data with real API integrations
2. Security review of bash tool access
3. Rate limiting and error handling
4. Human-in-the-loop review gates
"""

# ─── Core Concepts (pseudocode reference) ────────────────────────────────────

TIKTOK_STRATEGY_PRINCIPLES = {
    "attention_window_seconds": 3,
    "pattern_interrupt_every_seconds": 3,
    "target_completion_rate": 0.70,
    "target_engagement_rate": 0.08,
    "target_roi": 4.0,
    "impulse_price_range": (5, 50),
    "audience_primary": "Gen Z",
    "audience_secondary": "Gen Alpha",
}

AGENT_TEAM = {
    "lead": "tiktok-strategist",
    "teammates": [
        "trend-scout",
        "tiktok-script-writer",
        "tiktok-offer-analyst",
        "tiktok-analytics-ai",
        "ugc-manager",
    ],
}

CREATOR_TIERS = {
    "nano": (1_000, 10_000),
    "micro": (10_000, 100_000),
    "macro": (100_000, 1_000_000),
    "top_tier": (1_000_000, None),
}

KPI_BENCHMARKS = {
    "engagement_rate_target": 0.08,
    "completion_rate_target": 0.70,
    "ctr_target": 0.02,
    "roi_target": 4.0,
}

HOOK_STYLES = [
    "problem",    # "Are you still doing X the hard way?"
    "emotion",    # "This made me cry when I found it"
    "curiosity",  # "Wait for the end..."
    "shock",      # "I can't believe this only costs $X"
    "humor",      # POV: you just discovered you've been wrong this whole time
]

# ─── Message Bus Concept ──────────────────────────────────────────────────────
# The original prototype used JSONL inbox files for async agent communication.
# In the new Agent Office, this concept is implemented in:
#   src/agents/agentTaskRouter.ts  — routes tasks between agents
#   src/agents/agentSessionStore.ts — stores session state and logs

# Original message bus pattern (simplified):
#
# class MessageBus:
#     def send(self, to_agent: str, message: dict):
#         with open(f".inbox/{to_agent}.jsonl", "a") as f:
#             f.write(json.dumps(message) + "\n")
#
#     def read(self, agent_name: str) -> list[dict]:
#         path = f".inbox/{agent_name}.jsonl"
#         if not os.path.exists(path):
#             return []
#         with open(path) as f:
#             return [json.loads(line) for line in f]

# ─── Workflow Reference ───────────────────────────────────────────────────────
# TikTok Affiliate Workflow (adapted into agentTaskRouter.ts):
#
# 1. Input: product or trend idea
# 2. TikTok Strategist: defines campaign angle, briefs team
# 3. Trend Scout: returns trending sounds, formats, hashtags
# 4. TikTok Offer Analyst: evaluates commission, impulse score
# 5. TikTok Script Writer: writes hook + script beats
# 6. Visual Designer: outputs visual concept brief
# 7. Compliance Checker: reviews all content
# 8. TikTok Analytics AI: sets KPI targets, monitors after publish
