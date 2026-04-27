
---

## 3. `PRODUCT_SPEC.md`

```md
# PRODUCT_SPEC.md

## Product

Engineer Radar

## One-Line Description

Engineer Radar is a personalized tech intelligence dashboard that helps engineers quickly understand important new updates across AI, hardware, software, startups, developer tools, and engineering careers.

---

## Problem

Engineers need to keep up with a fast-moving industry, but important updates are scattered across:

- company blogs
- research papers
- GitHub releases
- newsletters
- X/Twitter
- Hacker News
- startup databases
- tech publications
- job market news
- product release notes

Most engineers do not have time to manually check all of these sources.

Generic tech news apps are too broad and often focus on consumer news, hype, or business drama instead of what engineers actually need to know.

---

## Target Users

### Primary

- Computer engineering students
- Software engineering students
- Software engineers
- Hardware engineers
- AI engineers
- Technical founders
- Hackathon builders
- People preparing for technical internships or jobs

### Secondary

- Product managers in technical teams
- Engineering managers
- Startup investors interested in technical trends
- Researchers tracking commercialization

---

## Core User Need

The user wants to know:

- What changed?
- Why does it matter?
- Should I learn something because of this?
- Is this a real trend or just hype?
- Which companies/tools/startups should I watch?
- What engineering skills are becoming more valuable?

---

## MVP Features

### 1. Refresh Button

The user clicks a refresh button to fetch new updates.

The app should not require automatic background refresh for MVP.

---

### 2. Category Dashboard

Display updates grouped by category:

- AI Models
- AI Coding Tools
- Hardware
- Semiconductors
- Startups
- Big Tech
- Career Skills
- Open Source / Dev Infrastructure

---

### 3. Update Cards

Each update card should show:

- title
- short summary
- why it matters
- category
- source
- publish date
- score
- link to source

---

### 4. Duplicate Avoidance

The app should not show updates that have already been viewed or processed.

---

### 5. Source Registry

Sources should be stored in a clear registry.

Each source should include:

- name
- URL
- category
- source type
- trust score
- fetch method
- enabled status

---

### 6. Scoring

Every update should receive an importance score.

Scoring should be explainable.

---

### 7. Viewed History

When an update is displayed or marked viewed, store it.

The refresh button should prefer new items not already shown.

---

## Non-MVP Features

Do not build these first unless requested:

- complex personalization
- paid API integrations
- browser extension
- mobile app
- email digest
- Slack bot
- vector search
- multi-user teams
- recommendation model
- full web crawler
- AI chat interface

---

## User Experience

The dashboard should feel like:

> “Here are the 10 things engineers should know today.”

Not:

> “Here are 500 tech articles.”

The UI should prioritize:

- clarity
- short summaries
- source credibility
- category separation
- fast scanning
- no clutter

---

## Update Card Example

```txt
Title:
Claude Code adds better project memory support

Summary:
Anthropic updated Claude Code so it can better understand and reuse project-level instructions across coding sessions.

Why it matters:
This could make AI coding agents more reliable on larger projects because they can follow repo-specific rules instead of treating every task as isolated.

Who should care:
Students building projects, software engineers, AI tool users, and teams experimenting with coding agents.

Category:
AI Coding Tools

Source:
Official Anthropic release notes

Score:
4.3 / 5