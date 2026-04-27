
---

## 5. `DATA_SCHEMA.md`

```md
# DATA_SCHEMA.md

## Purpose

This file defines the data model for Engineer Radar.

Use this before changing the database schema.

---

## Main Entities

### Source

Represents a place where updates come from.

Fields:

```ts
type Source = {
  id: string
  name: string
  url: string
  category: string
  type: string
  trustScore: number
  enabled: boolean
  createdAt: Date
  updatedAt: Date
}