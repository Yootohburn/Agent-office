# Agent Office — AI Affiliate Office for Thai Content-to-Commerce

An AI-assisted affiliate commerce operating system for Thai short-form content, visualized as an 8-bit pixel dashboard.

Agent Office simulates a team of 6 specialized AI agents that work together to research products, analyze profit potential, build content strategy, write scripts, produce creative assets, and measure social performance — from product discovery to published post and learning loop.

## What it is

A Phase 1 prototype dashboard showing how a semi-automated affiliate content workflow would operate. All data is mock. No real APIs are connected.

## What it is not

Not an AI spam factory. Not a fully automated system. Human approval is required before any content is published.

## The 6 agents

| ID | Thai name | Role |
|---|---|---|
| `product-research` | ฝ่ายวิจัยสินค้า | Product discovery and data verification |
| `offer-analyst` | ฝ่ายวิเคราะห์กำไรและข้อเสนอ | Profit scoring and offer analysis |
| `content-strategy` | ฝ่ายกลยุทธ์คอนเทนต์ | Hook framework and platform strategy |
| `script-writer` | ฝ่ายสคริปต์และสตอรี่บอร์ด | 20–30 second Thai video scripts |
| `creative-production` | ฝ่ายผลิตชิ้นงาน | Canva/CapCut-ready creative briefs |
| `social-performance` | ฝ่ายโซเชียลและวิเคราะห์ผล | Social posting, tracking, and learning loop |

## Tech stack

- React + TypeScript + Vite (frontend only)
- Pure CSS, 8-bit pixel aesthetic
- No external UI libraries, no backend, no real API connections

## Phase 1

All agent actions, pipeline transitions, and outputs are simulated with static mock data. See `CLAUDE.md` and `docs/agent-office.md` for architecture details.
