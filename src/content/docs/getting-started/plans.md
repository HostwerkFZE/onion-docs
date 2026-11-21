---
title: Plans and limits
description: Limits of each plan and where to read the account's current state.
---

Values from the plan catalogue, [`GET /api/v1/plans`](https://user.onion4.ai/api/v1/plans) (public). The dashboard shows them under **Plan & billing**.

| | Free | Basic | Pro | Ultimate |
|---|---|---|---|---|
| Price per month | $0 | $10 | $50 | $100 |
| Submissions per minute | 1 | 20 | 60 | 120 |
| Requests at once | 1 | 5 | 60 | 120 |
| Prompt size, characters | 256 | 1,024 | 4,096 | 8,192 |
| History retention | 14 days | unlimited | unlimited | unlimited |
| WebSocket (live updates) | — | ✓ | ✓ | ✓ |
| `device` / `os` | — | ✓ | ✓ | ✓ |
| `location` | — | — | chosen for the site | ✓ |
| Webhooks | — | ✓ | ✓ | ✓ |

Enterprise is negotiated individually.

Every plan: `result-schema`, `mode: full`.

## Limits

- **Submissions per minute** — only submissions are counted; reads are not. [Rate limits](/guides/rate-limits/)
- **Requests at once** — requests in `processing`. Extra submissions wait as `queued`. [Concurrency](/guides/rate-limits/#requests-at-once)
- **Prompt size** — length of the instruction without the URL. [Instructions](/guides/instructions/#size-limit)
- **History retention** — how far back history and activity are shown.

## Current state

`GET /api/v1/me`, in `data.meta`:

```json
{
  "entitlements": { "rate-per-minute": 60, "concurrent-requests": 60, "prompt-budget": 4096, … },
  "rate-limit":   { "metered": true, "limit-minute": 60, "remaining-minute": 41, "reset-minute-sec": 0 },
  "concurrency":  { "metered": true, "limit": 60, "in-flight": 4, "waiting": 0, "available": 56 }
}
```

See [Account](/api/account/#me).
