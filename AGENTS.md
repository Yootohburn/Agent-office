# AGENTS.md

## Project overview

Agent-office is a workspace for building and coordinating task-specific AI agents.

The goal of this repository is to create an agent office system where different agents handle specific roles such as product research, offer analysis, script writing, visual design, short-video creation, publishing, compliance review, growth analysis, and housekeeping.

This project is intended to support affiliate marketing and short-form content automation workflows.

## Agent roles

The planned agents are:

- product-scout: finds and collects promising products.
- offer-analyst: checks price, offer strength, commission potential, and selling angle.
- script-writer: writes captions, hooks, scripts, and video outlines.
- visual-designer: creates image and design direction.
- clip-builder: assembles short-video assets and output structure.
- publisher: prepares posts for TikTok, Instagram, Facebook, and other channels.
- compliance-checker: reviews claims, platform rules, and risky wording.
- growth-analyst: tracks performance and suggests improvements.
- housekeeper: organizes files, removes duplicates, and keeps the workspace clean.

## Repository structure

Use this structure when adding files:

```text
AGENTS.md

.claude/
  agents/

.codex/
  agents/

src/
  agents/
  components/
