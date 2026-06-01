# Pixel Office — Sprite Asset Requirements

This document specifies the exact asset requirements for the Agent Office visual system and provides AI image generation prompts for each sprite.

## Format

| Property | Value |
|---|---|
| Format | PNG or WebP |
| Background | Transparent |
| Style | 8-bit / 16-bit pixel art |
| Palette | Dark office, cozy warm lighting |
| Perspective | 3/4 or straight-on, seated at desk |

## Asset Sizes

| Asset type | Recommended size | Notes |
|---|---|---|
| Character sprite | 96×96 or 128×128 | Must have transparent bg. Shows seated character from behind/3/4 view. |
| Desk sprite | 192×128 or 256×160 | Full desk scene. Optional if CSS/SVG desk is used. |
| Prop sprites | 32×32 or 64×64 | Individual props: calculator, phone, magnifying glass, etc. |
| Shared background | 1600×900 or 1920×1080 | Office floor, walls, ceiling. Optional. |

## File Naming

Place assets in `public/assets/pixel-office/`:

```
public/assets/pixel-office/
  agents/
    product-research.png
    offer-analyst.png
    content-strategy.png
    script-writer.png
    creative-production.png
    social-performance.png
  desks/
    desk-standard.png        (shared desk set, or per-agent)
    desk-product-research.png
    ...
  props/
    magnifying-glass.png
    calculator.png
    phone.png
    storyboard.png
    palette.png
    analytics-chart.png
  backgrounds/
    office-floor.png
```

## Code Integration

Once assets are placed, pass `spritePaths` to `AgentDeskSprite`:

```tsx
<AgentDeskSprite
  agentId="product-research"
  agentDisplayName="ฝ่ายวิจัยสินค้า"
  accent="#00e5ff"
  status="working"
  roomLabel="RESEARCH LAB"
  spritePaths={{
    agent: '/assets/pixel-office/agents/product-research.png',
  }}
/>
```

`PixelSprite` will automatically use the image if `src` is provided, or fall back to CSS blocks if not.

## Style Guide

- **8-bit / 16-bit** pixel art — clean, readable, not blurry
- **Dark cozy workspace** — deep navy/charcoal background tones
- **Thai AI affiliate company** — professional, warm, modern
- **Consistent perspective** — same angle for all 6 characters
- **Consistent scale** — all characters same height at 128×128
- **Readable silhouette** — should be identifiable at 44px render size
- **No text or watermarks** inside sprites
- **No cartoon alien shapes** — humanoid proportions, normal head size
- Not too childish — professional pixel-art office game aesthetic

---

## AI Image Generation Prompts

Base style modifier (add to all prompts):
> "Transparent background, 16-bit pixel art sprite, office management game style, dark cozy workspace, Thai AI affiliate company, consistent 3/4 view, 128x128 pixels, clean readable silhouette, no text, no watermark."

---

### 1. Product Research Agent — ฝ่ายวิจัยสินค้า

**Character sprite:**
> Transparent background pixel art sprite, 16-bit office management game style, Thai researcher character seated at desk, viewed from behind at 3/4 angle, short dark hair, teal/cyan uniform shirt, holding magnifying glass, small product boxes on desk, laptop open with data grid on screen, dark cozy office lighting, 128x128.

**Desk sprite:**
> Transparent background pixel art desk scene, 16-bit office style, researcher workstation, magnifying glass prop, product boxes stacked, laptop with product database visible on screen, sticky notes with product ratings, dark navy desk, cozy office lighting, no character, 256x160.

---

### 2. Offer & Profit Analyst — ฝ่ายวิเคราะห์กำไรและข้อเสนอ

**Character sprite:**
> Transparent background pixel art sprite, 16-bit office management game style, Thai analyst character seated at desk, viewed from behind at 3/4 angle, short dark hair, amber/gold uniform shirt, calculator on desk, profit chart on monitor screen, Thai baht symbol visible, dark cozy office lighting, 128x128.

**Desk sprite:**
> Transparent background pixel art desk scene, 16-bit office style, financial analyst workstation, calculator prop, printed profit sheet, monitor with bar chart and ROAS metric visible, Thai baht coin symbol, dark navy desk, cozy office lighting, no character, 256x160.

---

### 3. Content Strategy Agent — ฝ่ายกลยุทธ์คอนเทนต์

**Character sprite:**
> Transparent background pixel art sprite, 16-bit office management game style, Thai planner character seated at desk, viewed from behind at 3/4 angle, short dark hair, orange uniform shirt, cork board with sticky notes visible, hook strategy board on wall, laptop with platform mix visible, dark cozy office lighting, 128x128.

**Desk sprite:**
> Transparent background pixel art desk scene, 16-bit office style, content strategy workstation, sticky notes pinned above desk, hook framework board, platform icons (TK, SH, LZ) on monitor, planning notepad, dark navy desk, cozy office lighting, no character, 256x160.

---

### 4. Script & Storyboard Agent — ฝ่ายสคริปต์และสตอรี่บอร์ด

**Character sprite:**
> Transparent background pixel art sprite, 16-bit office management game style, Thai writer character seated at desk, viewed from behind at 3/4 angle, short dark hair, pink/rose uniform shirt, 4-frame storyboard on desk, clapperboard visible, script paper on monitor, small microphone, dark cozy office lighting, 128x128.

**Desk sprite:**
> Transparent background pixel art desk scene, 16-bit office style, script writer workstation, clapperboard prop, 4-frame storyboard grid laid out, script pages printed, monitor showing timeline with HOOK/DEMO/PROOF/CTA sections, microphone stand, dark navy desk, cozy office lighting, no character, 256x160.

---

### 5. Creative Production Agent — ฝ่ายผลิตชิ้นงาน

**Character sprite:**
> Transparent background pixel art sprite, 16-bit office management game style, Thai designer character seated at desk, viewed from behind at 3/4 angle, short dark hair, purple uniform shirt, drawing tablet on desk, digital stylus in hand, thumbnail preview on monitor, color swatches visible, dark cozy office lighting, 128x128.

**Desk sprite:**
> Transparent background pixel art desk scene, 16-bit office style, creative production workstation, drawing tablet with stylus, color swatch palette strip, asset folder stack, large monitor with thumbnail layout (main + 2 thumbnails), brand kit colors visible, dark navy desk, cozy office lighting, no character, 256x160.

---

### 6. Social & Performance Manager — ฝ่ายโซเชียลและวิเคราะห์ผล

**Character sprite:**
> Transparent background pixel art sprite, 16-bit office management game style, Thai social media manager character seated at desk, viewed from behind at 3/4 angle, short dark hair, green/teal uniform shirt, smartphone in hand, comment bubbles floating near phone, monitor with analytics line chart going up, dark cozy office lighting, 128x128.

**Desk sprite:**
> Transparent background pixel art desk scene, 16-bit office style, social performance workstation, smartphone prop with rising chart on screen, comment speech bubble decorations, analytics monitor with CTR/CVR/ROAS visible, printed performance report, dark navy desk, cozy office lighting, no character, 256x160.

---

### Shared Office Background

**Background:**
> Pixel art office background, 16-bit style, dark navy blue cozy workspace, two rows of 3 desks each with subtle cubicle dividers, ceiling lights with warm glow, tiled floor with subtle grid, plants in corners, 1920x1080, no characters, no text, professional Thai AI company office atmosphere.

---

## Legal Note

All assets must be:
- Original works created by AI generation tools (Midjourney, DALL-E, Stable Diffusion, etc.)
- OR licensed pixel art packs with commercial use rights
- Do NOT use assets scraped from games, websites, or social media without a license
- Record the source/license of each asset in this file when added
