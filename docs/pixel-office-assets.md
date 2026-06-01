# Pixel Office — Sprite Asset Requirements

This document specifies the exact asset requirements for the Agent Office visual system and provides AI image generation prompts for each sprite.

---

## IMPORTANT: Agent sprites are character-only assets

**Do not ask image generation tools to include desks, chairs, rooms, monitors, furniture, charts, background, or large props inside agent sprites.**

The shared office background and desks/props are separate assets.
Each agent sprite must only be a single transparent human character standing in front of a transparent background.

---

## Format

| Property | Value |
|---|---|
| Format | PNG or WebP |
| Background | **Fully transparent** — no white, no gradient, no shadow |
| Style | 16-bit pixel art |
| Palette | Warm office character tones |
| Perspective | Slight 3/4 front-facing pose |

## Asset Sizes

| Asset type | Recommended size | Notes |
|---|---|---|
| Agent character sprite | 1024×1024 transparent PNG | App renders around 88–160px tall. Generate large, scale in CSS. |
| Shared office background | 1920×1080 or 1600×900 | Full office room. Characters are overlaid as separate layers. |
| Prop sprites | 64×64 or 128×128 | Individual small items (optional). |

## File Naming

Place assets in `public/assets/pixel-office/`:

```
public/assets/pixel-office/
  agents/
    product-research.png
    offer-profit-analyst.png
    content-strategy.png
    script-storyboard.png
    creative-production.png
    social-performance.png
  backgrounds/
    shared-command-room.png
  props/
    (optional individual props)
```

## Code Integration

**SharedCommandRoom** (`src/components/AgentOffice/SharedCommandRoom.tsx`) uses agent sprites via `AGENT_SPRITE_PATHS`.
Just place the file at the correct path — `OfficeAgentSprite` handles `onError` fallback automatically.

**AgentDeskSprite** (`src/components/AgentOffice/AgentRoom.tsx`) uses:
```tsx
spritePaths={{ agent: '/assets/pixel-office/agents/product-research.png' }}
```

In both cases: if the file is missing, a CSS pixel-art avatar renders instead. No broken images shown.

---

## Agent Sprite Style Guide

Each character sprite must follow these rules exactly:

- **Transparent background** — no desk, no chair, no room, no floor, no shadow, no environment
- **Single full-body human character** only
- **Slight 3/4 front-facing pose** — facing slightly toward the viewer, readable from front
- **16-bit pixel art style** — clean, not blurry, not too childish
- **Normal human proportions** — readable head, shoulders, torso, legs
- **Uniform / role clothing** — outfit and accessories communicate the job
- **No text** inside the sprite
- **No UI elements** (no progress bars, labels, badges, icons)
- **No logo or watermark**
- **Consistent scale** — all 6 characters same height at 1024×1024
- **Readable silhouette** at 88px render height

---

## AI Image Generation Prompts

### Base modifier (include in ALL agent prompts)

> "Transparent PNG background, full body, 16-bit pixel art character sprite, slight 3/4 front-facing pose, Thai office worker character, professional cozy office style, readable human proportions, no desk, no chair, no room, no furniture, no background, no text, no watermark, 1024x1024."

---

### 1. Product Research Agent — ฝ่ายวิจัยสินค้า

**Filename:** `product-research.png`

> Full body transparent PNG 16-bit pixel art character, Thai female researcher, slight 3/4 front-facing pose, short brown hair, teal/cyan blazer, holding a magnifying glass in one hand, casual professional posture, no background, no desk, no room, no text, 1024x1024.

---

### 2. Offer & Profit Analyst — ฝ่ายวิเคราะห์กำไรและข้อเสนอ

**Filename:** `offer-profit-analyst.png`

> Full body transparent PNG 16-bit pixel art character, Thai male analyst, slight 3/4 front-facing pose, short dark hair, amber/gold dress shirt, holding a small calculator or pen, focused expression, no background, no desk, no room, no text, 1024x1024.

---

### 3. Content Strategy Agent — ฝ่ายกลยุทธ์คอนเทนต์

**Filename:** `content-strategy.png`

> Full body transparent PNG 16-bit pixel art character, Thai female planner, slight 3/4 front-facing pose, short dark hair, orange blazer, holding a sticky-note clipboard or planning board, casual professional posture, no background, no desk, no room, no text, 1024x1024.

---

### 4. Script & Storyboard Agent — ฝ่ายสคริปต์และสตอรี่บอร์ด

**Filename:** `script-storyboard.png`

> Full body transparent PNG 16-bit pixel art character, Thai male writer, slight 3/4 front-facing pose, short dark hair, pink/rose shirt, holding a small script or storyboard paper, creative casual posture, no background, no desk, no room, no text, 1024x1024.

---

### 5. Creative Production Agent — ฝ่ายผลิตชิ้นงาน

**Filename:** `creative-production.png`

> Full body transparent PNG 16-bit pixel art character, Thai female designer, slight 3/4 front-facing pose, short dark hair, purple hoodie or jacket, holding a digital stylus pen, creative casual posture, no background, no desk, no room, no text, 1024x1024.

---

### 6. Social & Performance Manager — ฝ่ายโซเชียลและวิเคราะห์ผล

**Filename:** `social-performance.png`

> Full body transparent PNG 16-bit pixel art character, Thai male social media manager, slight 3/4 front-facing pose, short dark hair, green/teal shirt, holding a smartphone in one hand, energetic friendly posture, no background, no desk, no room, no text, 1024x1024.

---

### Shared Office Background

**Filename:** `shared-command-room.png`
**Path:** `public/assets/pixel-office/backgrounds/shared-command-room.png`

> Pixel art office background, 16-bit style, dark navy blue cozy workspace interior, two rows of 3 empty desks facing forward, each desk has a monitor, keyboard, small props, subtle desk dividers between workstations, warm ceiling lights, tiled floor with subtle grid, plants in corners and between desk rows, 1920x1080 or 1600x900, NO characters, no text, professional Thai AI company office atmosphere. Desks should be positioned at approximately: top row at y=35–50%, bottom row at y=70–85%, x positions at 17%, 50%, 83%.

---

## Previously generated sprites

| File | Date | Notes |
|---|---|---|
| `product-research.png` | 2026-06-01 | First test sprite. Includes desk scene in image — character-only replacement needed for best results in SharedCommandRoom. Works in AgentDeskSprite (ห้อง Agent tab) at 128px width. |

---

## Legal Note

All assets must be:
- Original works created by AI generation tools (Midjourney, DALL-E, Stable Diffusion, Firefly, etc.)
- OR licensed pixel art packs with commercial use rights
- Do NOT use assets scraped from games, websites, or social media without a license
- Record the source/license of each asset in this file when added
