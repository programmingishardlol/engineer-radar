
---

## 7. `PROMPTS.md`

```md
# PROMPTS.md

## Purpose

This file stores prompts for extraction, summarization, classification, and ranking.

Use these only if an LLM extraction layer is added.

The MVP can work without LLM extraction by using title, description, and rule-based scoring.

---

## Update Extraction Prompt

```txt
You are analyzing a technology update for engineers.

Extract structured information from the source text.

Return JSON only.

Fields:
- title
- company
- product
- category
- summary
- whyItMatters
- whoShouldCare
- technicalKeywords
- publishDate
- sourceName
- sourceUrl
- confidence

Rules:
- Use simple language.
- Do not invent facts.
- If information is missing, use null.
- Do not use hype.
- Focus on why engineers should care.
- Keep summary under 40 words.
- Keep whyItMatters under 60 words.