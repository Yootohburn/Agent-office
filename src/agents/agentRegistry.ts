export type AgentStatus =
  | 'idle'
  | 'working'
  | 'waiting'
  | 'blocked'
  | 'needs_review'
  | 'done'
  | 'failed'

export type DepartmentId =
  | 'ceo-director'
  | 'product-analyst'
  | 'content-studio'
  | 'ops-review'

export interface Agent {
  id: DepartmentId
  name: string
  title: string
  role: string
  status: AgentStatus
  currentTask: string
  currentCampaignId: string | null
  progress: number
  recentOutput: string
  decisionNeeded: string | null
  risks: string[]
  nextAction: string
  detailHtml: string
}

export const agents: Agent[] = [
  {
    id: 'ceo-director',
    name: 'CEO / Campaign Director',
    title: 'Chief Executive Officer',
    role: 'Sets company direction, approves campaigns, tracks KPIs',
    status: 'needs_review',
    currentTask: 'Reviewing Skincare Travel Pouch multi-platform campaign package',
    currentCampaignId: 'camp-004',
    progress: 90,
    recentOutput: 'Approved TikTok Earbuds campaign brief. Set weekly target: 50K views, 2% CTR, 1.5% conversion.',
    decisionNeeded: 'Approve or reject Skincare Travel Pouch campaign — Ops flagged one compliance issue.',
    risks: ['Lazada blender campaign running behind schedule'],
    nextAction: 'Review compliance report then approve or send back to Content Studio',
    detailHtml: `
      <h3>Company role</h3>
      <p>The CEO is the final decision-maker for every campaign. No content package moves to publish without CEO sign-off. Also sets the weekly priority list — which products, which platforms, which angles to pursue.</p>
      <h3>Weekly company targets — mock data</h3>
      <table>
        <tr><th>KPI</th><th>Target</th><th>Current week</th><th>Status</th></tr>
        <tr><td>Total views</td><td>200K</td><td>82K</td><td class="amber">~ In progress</td></tr>
        <tr><td>Avg CTR</td><td>2%</td><td>2.3%</td><td class="green">✓ Above</td></tr>
        <tr><td>Conversions</td><td>1.5%</td><td>0.9%</td><td class="red">⚠ Below</td></tr>
        <tr><td>Mock affiliate rev</td><td>$800</td><td>$310</td><td class="amber">~ In progress</td></tr>
        <tr><td>Campaigns approved</td><td>4</td><td>2</td><td class="amber">~ 2 pending</td></tr>
      </table>
      <h3>Campaign priority list — mock data</h3>
      <ul>
        <li><span class="tag cyan">TikTok</span> Electronics under 500 THB — impulse buy focus</li>
        <li><span class="tag green">Shopee</span> Home office accessories — growing category</li>
        <li><span class="tag amber">Multi</span> Skincare + beauty travel — Q3 push</li>
        <li><span class="tag cyan">Lazada</span> Kitchen gadgets — high commission bracket</li>
      </ul>
      <h3>Decision authority</h3>
      <ul>
        <li>Approve or reject any campaign package</li>
        <li>Pause a campaign at any pipeline stage</li>
        <li>Reassign priority between platforms</li>
        <li>Set and adjust weekly KPI targets</li>
      </ul>
      <h3>Does NOT do</h3>
      <ul>
        <li>Does not write scripts or create content</li>
        <li>Does not research individual products</li>
        <li>Does not handle compliance detail — delegates to Ops & Review</li>
      </ul>`,
  },
  {
    id: 'product-analyst',
    name: 'Product & Trend Analyst',
    title: 'Head of Product Research',
    role: 'Finds affiliate opportunities, scores products, studies trends',
    status: 'working',
    currentTask: 'Researching Home Office Desk Lamp — Shopee category analysis',
    currentCampaignId: 'camp-002',
    progress: 45,
    recentOutput: 'TikTok Earbuds X9: viability score 84/100, commission 7.5%, trend RISING. Passed to Content Studio.',
    decisionNeeded: null,
    risks: ['Desk lamp category has 12 competing affiliates — angle must be unique'],
    nextAction: 'Complete Shopee desk lamp brief, then analyse Lazada blender competitor landscape',
    detailHtml: `
      <h3>Company role</h3>
      <p>The intelligence department. Finds products worth promoting, scores them for affiliate viability, and delivers a research brief that tells the Content Studio exactly what angle to use.</p>
      <h3>Product scoring criteria</h3>
      <table>
        <tr><th>Criterion</th><th>Weight</th><th>Min threshold</th></tr>
        <tr><td>Commission rate</td><td>30%</td><td>3% (Shopee/Lazada) / 5% (TikTok)</td></tr>
        <tr><td>Product rating</td><td>20%</td><td>4.0 stars minimum</td></tr>
        <tr><td>Review volume</td><td>15%</td><td>50+ reviews</td></tr>
        <tr><td>Price sweet spot</td><td>20%</td><td>$5–$80 for impulse</td></tr>
        <tr><td>Trend strength</td><td>15%</td><td>Rising or Emerging</td></tr>
      </table>
      <h3>Current research queue — mock data</h3>
      <table>
        <tr><th>Product</th><th>Platform</th><th>Score</th><th>Stage</th></tr>
        <tr><td>Wireless Earbuds X9</td><td class="cyan">TikTok</td><td class="green">84/100</td><td class="green">✓ Brief sent</td></tr>
        <tr><td>Desk Lamp Pro</td><td class="green">Shopee</td><td class="amber">In progress</td><td class="amber">Researching</td></tr>
        <tr><td>Portable Blender</td><td>Lazada</td><td class="green">71/100</td><td class="green">✓ Brief sent</td></tr>
        <tr><td>Skincare Travel Pouch</td><td class="cyan">Multi</td><td class="green">77/100</td><td class="green">✓ Brief sent</td></tr>
      </table>
      <h3>Trend analysis tools (mock)</h3>
      <ul>
        <li>TikTok FYP trend scoring — sound, format, hashtag strength</li>
        <li>Shopee/Lazada category velocity — rising vs declining</li>
        <li>Competitor affiliate angle mapping</li>
        <li>Buyer pain point identification</li>
        <li>Platform fit analysis — which platform suits this product best</li>
      </ul>
      <h3>Does NOT do</h3>
      <ul>
        <li>No live API calls in Phase 1</li>
        <li>Does not write scripts or create content</li>
        <li>Does not approve campaigns — passes brief to CEO for priority decision</li>
      </ul>`,
  },
  {
    id: 'content-studio',
    name: 'Content Studio Agent',
    title: 'Creative Director & Content Producer',
    role: 'Creates all affiliate content — scripts, hooks, captions, visual briefs',
    status: 'working',
    currentTask: 'Writing TikTok POV script for Wireless Earbuds X9 — beat 4 of 5',
    currentCampaignId: 'camp-001',
    progress: 70,
    recentOutput: 'Hook: "POV: you just found out your $200 earbuds were a scam" — 28s script, 4 beats drafted.',
    decisionNeeded: null,
    risks: [],
    nextAction: 'Complete CTA beat, write caption + hashtags, send full package to Ops & Review',
    detailHtml: `
      <h3>Company role</h3>
      <p>The creative engine of the company. Takes a product research brief and produces a complete, platform-ready content package — scripts, hooks, captions, thumbnail directions, and UGC briefs.</p>
      <h3>The 3-second rule</h3>
      <p>Every piece of content starts with this constraint: <strong>the first 3 seconds determine everything.</strong> The algorithm stops pushing the video if the hook fails.</p>
      <h3>Content types produced</h3>
      <table>
        <tr><th>Format</th><th>Platform</th><th>Length</th></tr>
        <tr><td>POV / Talking head</td><td class="cyan">TikTok</td><td>15–60s</td></tr>
        <tr><td>Product demo</td><td>All</td><td>30–60s</td></tr>
        <tr><td>Unboxing</td><td class="cyan">TikTok / Reels</td><td>30–90s</td></tr>
        <tr><td>Comparison</td><td>All</td><td>30–60s</td></tr>
        <tr><td>Caption + hashtags</td><td>All</td><td>—</td></tr>
        <tr><td>Thumbnail brief</td><td>All</td><td>—</td></tr>
        <tr><td>UGC creator brief</td><td class="cyan">TikTok</td><td>—</td></tr>
      </table>
      <h3>TikTok script in progress — mock data</h3>
      <table>
        <tr><th>Second</th><th>Beat</th><th>Line</th></tr>
        <tr><td class="cyan">0–3s</td><td>Hook</td><td>"POV: you just found out your $200 earbuds were a scam"</td></tr>
        <tr><td>3–8s</td><td>Problem</td><td>"I tested 9 pairs over 3 months and this $28 one..."</td></tr>
        <tr><td>8–18s</td><td>Demo</td><td>[Show noise cancel, battery, fit — visual beats]</td></tr>
        <tr><td>18–25s</td><td>Proof</td><td>"4.9 stars, 2,300 reviews on TikTok Shop"</td></tr>
        <tr><td class="amber">25–28s</td><td>CTA</td><td>"Link in bio — use my code for 5% off"</td></tr>
      </table>
      <h3>Does NOT do</h3>
      <ul>
        <li>Does not research products — uses brief from Product & Trend Analyst</li>
        <li>Does not approve content — passes to Ops & Review then CEO</li>
        <li>Does not make false claims or unverified health assertions</li>
      </ul>`,
  },
  {
    id: 'ops-review',
    name: 'Ops & Review Agent',
    title: 'Operations Manager & Compliance Officer',
    role: 'Review, compliance, packaging, queue management, performance tracking',
    status: 'working',
    currentTask: 'Compliance scan on Lazada Portable Blender content package',
    currentCampaignId: 'camp-003',
    progress: 75,
    recentOutput: 'Shopee Desk Lamp: queue position 2. TikTok Earbuds: compliance passed, package ready for CEO.',
    decisionNeeded: null,
    risks: ['Lazada Blender script contains unverified claim — "boost your metabolism" — flagged for revision'],
    nextAction: 'Send Lazada flag back to Content Studio, then prepare Skincare export package',
    detailHtml: `
      <h3>Company role</h3>
      <p>The operational backbone. Every content package passes through Ops & Review before reaching the CEO. Handles compliance, packaging, queue management, and post-publish performance tracking.</p>
      <h3>Compliance checklist (runs on every package)</h3>
      <table>
        <tr><th>Check</th><th>Auto-action if failed</th></tr>
        <tr><td>Affiliate disclosure (#ad / #sponsored)</td><td class="red">Block — return to Content Studio</td></tr>
        <tr><td>Health / medical claims</td><td class="red">Block — return to Content Studio</td></tr>
        <tr><td>Income / financial guarantees</td><td class="red">Block — return to Content Studio</td></tr>
        <tr><td>Price accuracy vs product page</td><td class="red">Block — return to Content Studio</td></tr>
        <tr><td>Platform-specific banned phrases</td><td class="amber">Flag — send to CEO for decision</td></tr>
        <tr><td>Caption length limits</td><td class="amber">Flag — auto-trim suggestion</td></tr>
      </table>
      <h3>Current queue status — mock data</h3>
      <table>
        <tr><th>Campaign</th><th>Platform</th><th>Status</th></tr>
        <tr><td>TikTok Earbuds</td><td class="cyan">TikTok</td><td class="green">✓ Passed — at CEO</td></tr>
        <tr><td>Lazada Blender</td><td>Lazada</td><td class="red">⚠ Flagged — health claim</td></tr>
        <tr><td>Skincare Pouch</td><td class="cyan">Multi</td><td class="amber">Packaging export</td></tr>
        <tr><td>Desk Lamp</td><td class="green">Shopee</td><td>Queue position 2</td></tr>
      </table>
      <h3>Performance tracking (mock)</h3>
      <ul>
        <li>Views, engagement rate, completion rate per campaign</li>
        <li>CTR and conversion tracking</li>
        <li>Weekly performance report to CEO</li>
        <li>Flags underperforming content for revision</li>
      </ul>
      <h3>Does NOT do</h3>
      <ul>
        <li>Does not write or edit content — returns to Content Studio</li>
        <li>Does not approve campaigns — passes to CEO</li>
        <li>No auto-publishing in Phase 1</li>
      </ul>`,
  },
]

export function getAgentById(id: DepartmentId): Agent | undefined {
  return agents.find(a => a.id === id)
}
