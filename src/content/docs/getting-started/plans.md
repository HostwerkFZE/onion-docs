---
title: Plans and limits
description: What each plan allows — speed, parallel requests, prompt size, history — and where to read your own limits.
---

Onion does not sell credits or a monthly number of requests. A plan sets **how fast** you may go and **how much may run at once**; within that, use it as much as you like.

## The plans

| | Free | Basic | Pro | Ultimate |
|---|---|---|---|---|
| Price | $0 | $10 / month | $50 / month | $100 / month |
| Requests per minute | 1 | 20 | 60 | 120 |
| Requests at once | 1 | 5 | 60 | 120 |
| Prompt size | 256 characters | 1,024 characters | 4,096 characters | 8,192 characters |
| History | 14 days | unlimited | unlimited | unlimited |
| Live updates (WebSocket) | — | ✓ | ✓ | ✓ |
| Prompt assistance | — | ✓ | ✓ | ✓ |
| Device and OS selection | — | ✓ | ✓ | ✓ |
| Location routing | — | — | automatic | choose the country |

**Enterprise** is negotiated: talk to us through [support](https://onion4.ai/support).

Every output format, and structured extraction with a JSON Schema, are available on every plan.

:::note[The catalogue is live]
This table is a snapshot. The plans the API actually enforces are served at [`GET /api/v1/plans`](https://user.onion4.ai/api/v1/plans), with no key needed, and the [dashboard](https://user.onion4.ai/) shows them under **Billing**.
:::

## What the limits mean

**Requests per minute** counts submissions only. Reading a status, a result, its events or your history is never counted, so polling costs nothing. The minute is a bucket that refills continuously: after a quiet spell you may spend a whole minute's worth at once. → [Rate limits and concurrency](/guides/rate-limits/)

**Requests at once** is how many of your requests may be running at the same time. A request that arrives when every slot is busy is not refused: it is accepted as `queued` and starts on its own as soon as a slot frees.

**Prompt size** is the length of your instruction — `input` without its URL — in characters; a Cyrillic or Chinese character counts as one, like a Latin one. A longer instruction is refused with `422`.

**History** is how far back your request history and activity reach. If a subscription lapses, your data is kept for a month before anything is removed.

**Location routing** — on Pro, Onion picks the country a crawl leaves from to suit the site; on Ultimate you can name it yourself with `location`. → [Crawl options](/guides/crawl-options/)

## Your own limits, from the API

`GET /api/v1/me` returns your plan's entitlements and where you stand right now. The read is not metered:

```json title="GET /api/v1/me → meta"
{
  "entitlements": { "rate-per-minute": 60, "concurrent-requests": 60, "prompt-budget": 4096, … },
  "rate-limit":   { "metered": true, "limit-minute": 60, "remaining-minute": 41, "reset-minute-sec": 37 },
  "concurrency":  { "metered": true, "limit": 60, "in-flight": 4, "waiting": 12, "available": 56 }
}
```
