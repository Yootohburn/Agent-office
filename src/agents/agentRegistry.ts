export type AgentStatus =
  | 'idle'
  | 'working'
  | 'waiting'
  | 'blocked'
  | 'needs_review'
  | 'done'
  | 'failed'

export type AgentPlatform = 'shopee' | 'lazada' | 'tiktok' | 'shared'

export interface Agent {
  id: string
  name: string
  role: string
  platform: AgentPlatform
  status: AgentStatus
  currentTask: string
  progress: number
  recentOutput: string
  risks: string[]
  nextAction: string
  detailHtml: string
}

export const agents: Agent[] = [
  {
    id: 'product-scout',
    name: 'Product Scout',
    role: 'Finds promising affiliate products',
    platform: 'shared',
    status: 'working',
    currentTask: 'Scanning Shopee bestsellers in Electronics category',
    progress: 62,
    recentOutput: 'Found 3 high-viability products. Top pick: Wireless Earbuds X9 — score 84/100',
    risks: ['Review count below 50 on 1 product'],
    nextAction: 'Send product brief to Offer Analyst',
    detailHtml: `
      <h3>What this agent does</h3>
      <p>Accepts a product URL, keyword, or category and scores every product it finds for affiliate viability.</p>
      <h3>Scoring criteria</h3>
      <ul>
        <li><span class="tag green">Price range</span> Sweet spot: $10–$80</li>
        <li><span class="tag green">Rating</span> Minimum 4.0 stars required</li>
        <li><span class="tag green">Reviews</span> Minimum 50 reviews required</li>
        <li><span class="tag amber">Commission</span> Minimum 3% to proceed</li>
      </ul>
      <h3>Current scan — mock data</h3>
      <table>
        <tr><th>Product</th><th>Score</th><th>Commission</th><th>Status</th></tr>
        <tr><td>Wireless Earbuds X9</td><td class="green">84/100</td><td>7.5%</td><td class="green">✓ Pass</td></tr>
        <tr><td>USB-C Hub Pro</td><td class="green">71/100</td><td>5.2%</td><td class="green">✓ Pass</td></tr>
        <tr><td>Phone Stand Lite</td><td class="amber">38/100</td><td>3.1%</td><td class="amber">⚠ Review</td></tr>
      </table>
      <h3>Does NOT do</h3>
      <ul>
        <li>No live API calls in Phase 1</li>
        <li>No web scraping</li>
        <li>No personal data storage</li>
      </ul>`,
  },
  {
    id: 'offer-analyst',
    name: 'Offer Analyst',
    role: 'Evaluates price, commission, and selling angle',
    platform: 'shared',
    status: 'waiting',
    currentTask: 'Waiting for Product Scout brief',
    progress: 0,
    recentOutput: 'Last analysis: Lazada Skincare Bundle — offer strength: STRONG, angle: bundle deal',
    risks: [],
    nextAction: 'Receive product brief',
    detailHtml: `
      <h3>What this agent does</h3>
      <p>Receives the product brief from Product Scout and evaluates the full commercial opportunity before any content is created.</p>
      <h3>Offer strength ratings</h3>
      <ul>
        <li><span class="tag red">Weak</span> Low commission, poor angle, skip</li>
        <li><span class="tag amber">Fair</span> Viable but needs a strong hook</li>
        <li><span class="tag green">Strong</span> Good commission + clear angle</li>
        <li><span class="tag cyan">Hot</span> High commission + viral potential</li>
      </ul>
      <h3>Last completed analysis — mock data</h3>
      <table>
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>Product</td><td>Lazada Skincare Bundle</td></tr>
        <tr><td>Offer strength</td><td class="green">STRONG</td></tr>
        <tr><td>Selling angle</td><td>Bundle deal — save 40%</td></tr>
        <tr><td>Est. earnings/sale</td><td>$3.20</td></tr>
        <tr><td>Est. earnings/1K views</td><td>$12.80</td></tr>
      </table>
      <h3>Does NOT do</h3>
      <ul>
        <li>No live price comparisons in Phase 1</li>
        <li>No misleading pricing analysis</li>
      </ul>`,
  },
  {
    id: 'script-writer',
    name: 'Script Writer',
    role: 'Writes hooks, scripts, and captions',
    platform: 'shared',
    status: 'done',
    currentTask: 'Shopee Electronics campaign scripts complete',
    progress: 100,
    recentOutput: 'Hook: "You\'ve been charging your phone wrong this whole time..." — 28s script ready',
    risks: [],
    nextAction: 'Pass to Visual Designer',
    detailHtml: `
      <h3>What this agent does</h3>
      <p>Converts offer briefs into ready-to-record scripts. Every script starts with a 3-second hook and includes pattern interrupts to maximize completion rate.</p>
      <h3>Script structure</h3>
      <ul>
        <li><span class="tag cyan">0–3s</span> Hook — single punchy line</li>
        <li><span class="tag green">3–15s</span> Problem or desire setup</li>
        <li><span class="tag green">15–25s</span> Product reveal + benefit</li>
        <li><span class="tag amber">25–30s</span> Soft CTA</li>
      </ul>
      <h3>Latest script — mock output</h3>
      <table>
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>Hook</td><td class="cyan">"You've been charging your phone wrong…"</td></tr>
        <tr><td>Platform</td><td>Shopee / TikTok</td></tr>
        <tr><td>Duration</td><td>28 seconds</td></tr>
        <tr><td>Tone</td><td>Curious, conversational</td></tr>
        <tr><td>Hashtags</td><td>#techlife #shopee #gadgets</td></tr>
      </table>
      <h3>Does NOT do</h3>
      <ul>
        <li>No false product claims</li>
        <li>No scripts over 60s without approval</li>
      </ul>`,
  },
  {
    id: 'visual-designer',
    name: 'Visual Designer',
    role: 'Creates visual direction and thumbnail concepts',
    platform: 'shared',
    status: 'working',
    currentTask: 'Generating visual brief for Wireless Earbuds X9',
    progress: 40,
    recentOutput: 'Style: unboxing. Palette: black + neon blue. Text overlay: price drop callout',
    risks: [],
    nextAction: 'Finalize and send to Clip Builder',
    detailHtml: `
      <h3>What this agent does</h3>
      <p>Outputs a visual concept brief — not a rendered image. Describes composition, color palette, and text overlay for the Clip Builder and human creator to execute.</p>
      <h3>Visual style options</h3>
      <ul>
        <li><span class="tag green">Lifestyle</span> Product in real-life setting</li>
        <li><span class="tag green">Flat-lay</span> Overhead product arrangement</li>
        <li><span class="tag cyan">Unboxing</span> Opening sequence — high engagement</li>
        <li><span class="tag amber">Demo</span> Product in use</li>
        <li><span class="tag amber">Comparison</span> Before vs after / vs competitor</li>
      </ul>
      <h3>Current brief — mock data</h3>
      <table>
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>Product</td><td>Wireless Earbuds X9</td></tr>
        <tr><td>Style</td><td class="cyan">Unboxing</td></tr>
        <tr><td>Background</td><td>Dark matte surface</td></tr>
        <tr><td>Palette</td><td>Black + neon blue</td></tr>
        <tr><td>Text overlay</td><td>Price drop callout — top-right</td></tr>
      </table>
      <h3>Does NOT do</h3>
      <ul>
        <li>No actual image generation in Phase 1</li>
        <li>No copyrighted brand assets</li>
      </ul>`,
  },
  {
    id: 'clip-builder',
    name: 'Clip Builder',
    role: 'Assembles video asset structure',
    platform: 'shared',
    status: 'idle',
    currentTask: 'No active task',
    progress: 0,
    recentOutput: 'Last build: Lazada Skincare Bundle — 3 scenes, 29s, export ready',
    risks: [],
    nextAction: 'Receive visual brief from Visual Designer',
    detailHtml: `
      <h3>What this agent does</h3>
      <p>Takes the script and visual brief and produces a scene manifest — a structured assembly plan for the video editor or creator tool.</p>
      <h3>Scene types</h3>
      <ul>
        <li><span class="tag cyan">Hook frame</span> 0–3s — pattern interrupt visual</li>
        <li><span class="tag green">Product demo</span> 3–25s — main content</li>
        <li><span class="tag amber">CTA frame</span> Final 3–5s — call to action</li>
      </ul>
      <h3>Last completed build — mock data</h3>
      <table>
        <tr><th>Scene</th><th>Duration</th><th>Description</th></tr>
        <tr><td>1 — Hook</td><td>3s</td><td>Zoom in on product, text flash</td></tr>
        <tr><td>2 — Demo</td><td>21s</td><td>Unboxing + feature walkthrough</td></tr>
        <tr><td>3 — CTA</td><td>5s</td><td>Price reveal + link reminder</td></tr>
        <tr><td class="green">Total</td><td class="green">29s</td><td class="green">Export ready</td></tr>
      </table>
      <h3>Does NOT do</h3>
      <ul>
        <li>No actual video rendering in Phase 1</li>
        <li>Will not publish without Compliance Checker approval</li>
      </ul>`,
  },
  {
    id: 'publisher',
    name: 'Publisher',
    role: 'Prepares posts for all platforms',
    platform: 'shared',
    status: 'needs_review',
    currentTask: 'Shopee post package ready — awaiting human approval',
    progress: 95,
    recentOutput: 'TikTok caption: 240 chars ✓ | Shopee Feed: 180 chars ✓ | FB: 310 chars ✓',
    risks: ['Affiliate disclosure missing on Facebook draft'],
    nextAction: 'Human review required before publish',
    detailHtml: `
      <h3>What this agent does</h3>
      <p>Formats the final content package for each target platform — caption length, hashtag count, optimal post time, and affiliate disclosure are all platform-specific.</p>
      <h3>Platform limits</h3>
      <table>
        <tr><th>Platform</th><th>Caption limit</th><th>Hashtags</th><th>Disclosure</th></tr>
        <tr><td>TikTok</td><td>2,200 chars</td><td>3–5</td><td>#ad required</td></tr>
        <tr><td>Instagram</td><td>2,200 chars</td><td>up to 30</td><td>#ad required</td></tr>
        <tr><td>Facebook</td><td>63,206 chars</td><td>2–3</td><td>#ad required</td></tr>
        <tr><td>Shopee Feed</td><td>500 chars</td><td>5–10</td><td>auto-tagged</td></tr>
      </table>
      <h3>Current package status — mock data</h3>
      <table>
        <tr><th>Platform</th><th>Status</th></tr>
        <tr><td>TikTok</td><td class="green">✓ Ready — 240 chars</td></tr>
        <tr><td>Shopee Feed</td><td class="green">✓ Ready — 180 chars</td></tr>
        <tr><td>Facebook</td><td class="red">⚠ Missing #ad disclosure</td></tr>
      </table>
      <h3>Does NOT do</h3>
      <ul>
        <li>No auto-posting in Phase 1 — manual publish only</li>
        <li>Will not publish without Compliance Checker pass</li>
      </ul>`,
  },
  {
    id: 'compliance-checker',
    name: 'Compliance Checker',
    role: 'Reviews claims, rules, and risky wording',
    platform: 'shared',
    status: 'working',
    currentTask: 'Running compliance scan on Lazada Skincare scripts',
    progress: 75,
    recentOutput: 'FLAGGED: "clinically proven" claim in script line 4 — needs evidence or removal',
    risks: ['Unverified health claim detected'],
    nextAction: 'Flag to Script Writer for revision',
    detailHtml: `
      <h3>What this agent does</h3>
      <p>Scans every script, caption, and visual brief before publish. Checks platform-specific rules for TikTok, Shopee, Lazada, and Meta.</p>
      <h3>Auto-block triggers</h3>
      <ul>
        <li><span class="tag red">BLOCK</span> "Lose weight fast", "cure", "guaranteed results"</li>
        <li><span class="tag red">BLOCK</span> Missing #ad or #sponsored disclosure</li>
        <li><span class="tag red">BLOCK</span> Price differs from actual product page</li>
        <li><span class="tag amber">FLAG</span> Before/after imagery — legal review needed</li>
        <li><span class="tag amber">FLAG</span> Superlatives without evidence ("best", "#1")</li>
      </ul>
      <h3>Current scan — mock data</h3>
      <table>
        <tr><th>Check</th><th>Result</th></tr>
        <tr><td>#ad disclosure</td><td class="green">✓ Present</td></tr>
        <tr><td>Health claims</td><td class="red">⚠ "clinically proven" — line 4</td></tr>
        <tr><td>Pricing accuracy</td><td class="green">✓ Matches product page</td></tr>
        <tr><td>Platform rules</td><td class="green">✓ No banned phrases</td></tr>
      </table>
      <h3>Does NOT do</h3>
      <ul>
        <li>Will never approve unverified health or income claims</li>
        <li>Will never approve content without affiliate disclosure</li>
      </ul>`,
  },
  {
    id: 'growth-analyst',
    name: 'Growth Analyst',
    role: 'Tracks performance and finds improvements',
    platform: 'shared',
    status: 'idle',
    currentTask: 'No active campaign data',
    progress: 0,
    recentOutput: 'Last report: Week 22 — avg engagement 6.2%, completion 58%, CTR 1.8%',
    risks: ['Completion rate below 60% benchmark'],
    nextAction: 'Waiting for new post data',
    detailHtml: `
      <h3>What this agent does</h3>
      <p>Analyzes post performance across all platforms and recommends which content patterns to repeat, scale, or stop.</p>
      <h3>Benchmark targets</h3>
      <table>
        <tr><th>Metric</th><th>Target</th><th>Last Week</th><th>Status</th></tr>
        <tr><td>Engagement rate</td><td>&gt;5%</td><td>6.2%</td><td class="green">✓ Above</td></tr>
        <tr><td>Completion rate</td><td>&gt;60%</td><td>58%</td><td class="red">⚠ Below</td></tr>
        <tr><td>CTR</td><td>&gt;1.5%</td><td>1.8%</td><td class="green">✓ Above</td></tr>
        <tr><td>Conversions</td><td>&gt;0.5%</td><td>0.4%</td><td class="amber">~ Near</td></tr>
      </table>
      <h3>Recommendations — mock data</h3>
      <ul>
        <li>Improve hook in next 3 posts — completion rate is slipping</li>
        <li>Electronics content outperforming beauty — shift focus</li>
        <li>Tuesday 7–9pm slots showing best reach</li>
      </ul>
      <h3>Does NOT do</h3>
      <ul>
        <li>No live analytics API in Phase 1</li>
        <li>No projections on fewer than 3 posts</li>
      </ul>`,
  },
  {
    id: 'housekeeper',
    name: 'Housekeeper',
    role: 'Organizes files and cleans the workspace',
    platform: 'shared',
    status: 'done',
    currentTask: 'Weekly cleanup complete',
    progress: 100,
    recentOutput: 'Archived 12 files. Found 3 orphaned packages. Workspace health: GOOD',
    risks: [],
    nextAction: 'Next scan scheduled in 7 days',
    detailHtml: `
      <h3>What this agent does</h3>
      <p>Keeps the workspace clean. Runs weekly scans to archive old campaigns, remove duplicates, and flag orphaned files without a valid product ID.</p>
      <h3>Workspace health levels</h3>
      <ul>
        <li><span class="tag green">GOOD</span> All files tracked, no duplicates</li>
        <li><span class="tag amber">WARNING</span> Duplicates or orphaned files found</li>
        <li><span class="tag red">CRITICAL</span> Workspace size exceeded or corrupted state</li>
      </ul>
      <h3>Last scan results — mock data</h3>
      <table>
        <tr><th>Check</th><th>Result</th></tr>
        <tr><td>Total files</td><td>147</td></tr>
        <tr><td>Duplicates</td><td class="green">0</td></tr>
        <tr><td>Archived</td><td>12</td></tr>
        <tr><td>Orphaned</td><td class="amber">3 — pending review</td></tr>
        <tr><td>Health</td><td class="green">GOOD</td></tr>
      </table>
      <h3>Does NOT do</h3>
      <ul>
        <li>Will never permanently delete without confirmation</li>
        <li>Will never archive files modified within 7 days</li>
      </ul>`,
  },
  {
    id: 'tiktok-strategist',
    name: 'TikTok Strategist',
    role: 'Lead strategy for TikTok campaigns',
    platform: 'tiktok',
    status: 'working',
    currentTask: 'Building campaign strategy for TikTok Shop Wireless Earbuds X9',
    progress: 55,
    recentOutput: 'Angle: curiosity + shock. Hook style: "Wait for the end..." Format: talking head',
    risks: ['Trend window closing — Rising → Peak transition detected'],
    nextAction: 'Brief Trend Scout and TikTok Offer Analyst',
    detailHtml: `
      <h3>What this agent does</h3>
      <p>The lead agent for all TikTok campaigns. Defines strategy, briefs the full TikTok team, and synthesizes their outputs into one campaign brief.</p>
      <h3>The 3-second rule</h3>
      <p>Every campaign starts with this constraint: <strong>the first 3 seconds determine everything.</strong> If the hook fails, the algorithm stops pushing the video.</p>
      <h3>Hook styles</h3>
      <ul>
        <li><span class="tag cyan">Problem</span> "Are you still doing X the hard way?"</li>
        <li><span class="tag cyan">Emotion</span> "This changed how I think about..."</li>
        <li><span class="tag green">Curiosity</span> "Wait for the end..."</li>
        <li><span class="tag amber">Shock</span> "I can't believe this only costs $X"</li>
        <li><span class="tag green">Humor</span> POV format — relatable situation</li>
      </ul>
      <h3>Current campaign — mock data</h3>
      <table>
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>Product</td><td>Wireless Earbuds X9</td></tr>
        <tr><td>Strategy angle</td><td>Curiosity + shock</td></tr>
        <tr><td>Hook style</td><td class="cyan">Curiosity</td></tr>
        <tr><td>Format</td><td>Talking head</td></tr>
        <tr><td>Completion target</td><td>70%</td></tr>
        <tr><td>Engagement target</td><td>8%</td></tr>
        <tr><td>ROI target</td><td>4:1</td></tr>
      </table>`,
  },
  {
    id: 'trend-scout',
    name: 'Trend Scout',
    role: 'Analyzes FYP trends and competitor content',
    platform: 'tiktok',
    status: 'done',
    currentTask: 'Trend report for Electronics category complete',
    progress: 100,
    recentOutput: 'Top sound: "Chill Lofi Beat 003". Top format: POV unboxing. Trend: RISING',
    risks: [],
    nextAction: 'Send trend brief to TikTok Script Writer',
    detailHtml: `
      <h3>What this agent does</h3>
      <p>Monitors the TikTok FYP algorithm and competitor content to find the best trend window to publish in.</p>
      <h3>Trend lifecycle stages</h3>
      <ul>
        <li><span class="tag cyan">Emerging</span> Early signal — high risk, high reward</li>
        <li><span class="tag green">Rising</span> Best time to publish — grow with the wave</li>
        <li><span class="tag amber">Peak</span> High competition — needs a strong angle</li>
        <li><span class="tag red">Declining</span> Do not publish — too late</li>
      </ul>
      <h3>Electronics category report — mock data</h3>
      <table>
        <tr><th>Signal</th><th>Finding</th></tr>
        <tr><td>Top sound</td><td>Chill Lofi Beat 003</td></tr>
        <tr><td>Top format</td><td class="green">POV unboxing</td></tr>
        <tr><td>Trending hashtag</td><td>#techunboxing (2.1B views)</td></tr>
        <tr><td>Trend strength</td><td class="green">RISING</td></tr>
        <tr><td>Recommended window</td><td>Publish within 48h</td></tr>
        <tr><td>Competitor posting freq</td><td>3–5x/day in this niche</td></tr>
      </table>`,
  },
  {
    id: 'tiktok-script-writer',
    name: 'TikTok Script Writer',
    role: 'Writes viral TikTok scripts with hooks',
    platform: 'tiktok',
    status: 'working',
    currentTask: 'Writing script for Wireless Earbuds X9 — POV unboxing format',
    progress: 70,
    recentOutput: 'Hook: "POV: you just found out your $200 earbuds were a scam" — 4 beats drafted',
    risks: [],
    nextAction: 'Complete CTA and caption, pass to Visual Designer',
    detailHtml: `
      <h3>What this agent does</h3>
      <p>Writes TikTok-native scripts. Every line is built around the 3-second hook formula and pattern interrupts that keep completion rate above 70%.</p>
      <h3>Pattern interrupt rule</h3>
      <p>Something must change every <strong>2–3 seconds</strong> — camera angle, text on screen, voice shift, or new information. This prevents scroll-away.</p>
      <h3>Script in progress — mock data</h3>
      <table>
        <tr><th>Second</th><th>Beat</th><th>Dialogue</th></tr>
        <tr><td class="cyan">0–3s</td><td>Hook</td><td>"POV: you just found out your $200 earbuds were a scam"</td></tr>
        <tr><td>3–8s</td><td>Problem</td><td>"I spent 3 months testing cheap vs expensive earbuds..."</td></tr>
        <tr><td>8–15s</td><td>Reveal</td><td>"And this $28 pair on Shopee beat all of them"</td></tr>
        <tr><td>15–22s</td><td>Demo</td><td>[Show product features — noise cancel, battery, fit]</td></tr>
        <tr><td class="amber">22–28s</td><td>CTA</td><td>"Link in bio — use my code for extra 5% off"</td></tr>
      </table>
      <h3>Does NOT do</h3>
      <ul>
        <li>Never leads with product name in first 3 seconds</li>
        <li>Never uses corporate language</li>
      </ul>`,
  },
  {
    id: 'tiktok-offer-analyst',
    name: 'TikTok Offer Analyst',
    role: 'Evaluates TikTok Shop commission and virality',
    platform: 'tiktok',
    status: 'done',
    currentTask: 'TikTok Shop offer analysis complete',
    progress: 100,
    recentOutput: 'Commission: 8.5% ✓ | Impulse score: 78/100 | Visual appeal: 82/100 | Rating: STRONG',
    risks: [],
    nextAction: 'Brief passed to TikTok Strategist',
    detailHtml: `
      <h3>What this agent does</h3>
      <p>Evaluates TikTok Shop products specifically — different benchmarks from Shopee/Lazada. Focuses on impulse-buy potential and visual demonstrability.</p>
      <h3>TikTok sweet spot</h3>
      <ul>
        <li><span class="tag green">Price</span> $5–$50 — impulse buy range</li>
        <li><span class="tag green">Commission</span> Minimum 5% on TikTok Shop</li>
        <li><span class="tag green">Rating</span> Minimum 4.5 stars on TikTok Shop</li>
        <li><span class="tag amber">Visual</span> Must be demonstrable on camera</li>
      </ul>
      <h3>Completed analysis — mock data</h3>
      <table>
        <tr><th>Metric</th><th>Score</th><th>Status</th></tr>
        <tr><td>TikTok commission</td><td>8.5%</td><td class="green">✓ Above min</td></tr>
        <tr><td>Impulse-buy score</td><td>78/100</td><td class="green">✓ Strong</td></tr>
        <tr><td>Visual appeal</td><td>82/100</td><td class="green">✓ High</td></tr>
        <tr><td>Price point</td><td>$28</td><td class="green">✓ Sweet spot</td></tr>
        <tr><td>Overall rating</td><td colspan="2" class="green">STRONG</td></tr>
      </table>`,
  },
  {
    id: 'tiktok-analytics-ai',
    name: 'TikTok Analytics AI',
    role: 'Tracks TikTok KPIs and recommends optimizations',
    platform: 'tiktok',
    status: 'idle',
    currentTask: 'Waiting for first post data',
    progress: 0,
    recentOutput: 'Last report: 5 posts — engagement 9.1% ✓ | completion 72% ✓ | CTR 2.3% ✓',
    risks: [],
    nextAction: 'Monitor after first post publishes',
    detailHtml: `
      <h3>What this agent does</h3>
      <p>Monitors TikTok KPIs after each post and compares against campaign benchmarks set by TikTok Strategist.</p>
      <h3>KPI targets (from prototype)</h3>
      <table>
        <tr><th>Metric</th><th>Target</th><th>Last report</th><th>Status</th></tr>
        <tr><td>Engagement rate</td><td>&gt;8%</td><td>9.1%</td><td class="green">✓ Above</td></tr>
        <tr><td>Completion rate</td><td>&gt;70%</td><td>72%</td><td class="green">✓ Above</td></tr>
        <tr><td>CTR</td><td>&gt;2%</td><td>2.3%</td><td class="green">✓ Above</td></tr>
        <tr><td>ROI</td><td>4:1</td><td>3.8:1</td><td class="amber">~ Near</td></tr>
      </table>
      <h3>Auto-flags</h3>
      <ul>
        <li><span class="tag red">ALERT</span> Completion &lt; 40% — hook problem</li>
        <li><span class="tag red">ALERT</span> High views + zero conversions — broken link</li>
        <li><span class="tag amber">WARN</span> Engagement spike — possible bot activity</li>
      </ul>
      <h3>Does NOT do</h3>
      <ul>
        <li>No live TikTok Analytics API in Phase 1</li>
        <li>No projections from fewer than 3 posts</li>
      </ul>`,
  },
  {
    id: 'ugc-manager',
    name: 'UGC Manager',
    role: 'Manages creator collabs and UGC content',
    platform: 'tiktok',
    status: 'blocked',
    currentTask: 'Creator brief ready — blocked on budget approval',
    progress: 30,
    recentOutput: 'Matched 3 micro-creators in Electronics niche. Est. reach: 180K combined',
    risks: ['Budget approval required before briefing creators'],
    nextAction: 'Human review: approve creator budget',
    detailHtml: `
      <h3>What this agent does</h3>
      <p>Matches products to creators and manages the UGC collaboration pipeline — from brief to submission to approval.</p>
      <h3>Creator tiers</h3>
      <table>
        <tr><th>Tier</th><th>Followers</th><th>Typical cost</th><th>Best for</th></tr>
        <tr><td>Nano</td><td>1K–10K</td><td>Product only</td><td>Authenticity</td></tr>
        <tr><td>Micro</td><td>10K–100K</td><td>$50–$300</td><td>Niche reach</td></tr>
        <tr><td>Macro</td><td>100K–1M</td><td>$500–$3K</td><td>Scale</td></tr>
        <tr><td>Top-tier</td><td>1M+</td><td>$5K+</td><td>Brand awareness</td></tr>
      </table>
      <h3>Current match — mock data</h3>
      <table>
        <tr><th>Creator</th><th>Tier</th><th>Niche</th><th>Est. reach</th><th>Status</th></tr>
        <tr><td>@techwithjay</td><td>Micro</td><td>Electronics</td><td>62K</td><td class="amber">Briefed</td></tr>
        <tr><td>@gadgetqueen</td><td>Micro</td><td>Electronics</td><td>71K</td><td class="amber">Briefed</td></tr>
        <tr><td>@unboxingsam</td><td>Nano</td><td>Tech</td><td>48K</td><td class="amber">Briefed</td></tr>
      </table>
      <h3>BLOCKED reason</h3>
      <p class="red">Budget approval required before creators are contacted. Est. total: $300.</p>
      <h3>Does NOT do</h3>
      <ul>
        <li>No real creator outreach in Phase 1</li>
        <li>Will not commit payment without human approval</li>
      </ul>`,
  },
]

export function getAgentById(id: string): Agent | undefined {
  return agents.find(a => a.id === id)
}

export function getAgentsByPlatform(platform: AgentPlatform | 'all'): Agent[] {
  if (platform === 'all') return agents
  return agents.filter(a => a.platform === platform)
}
