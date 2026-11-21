---
title: Rate limits and concurrency
description: How fast you may start requests, how many may run at once, and the headers that tell you where you stand.
---

Two limits come with your plan, and they answer different questions:

- **Requests per minute** — how often work may *start*.
- **Requests at once** — how much may be *running* at the same time.

| | Free | Basic | Pro | Ultimate |
|---|---|---|---|---|
| Requests per minute | 1 | 20 | 60 | 120 |
| Requests at once | 1 | 5 | 60 | 120 |

Both are per account: all your keys, the dashboard and the MCP server share them.

## Requests per minute

Only **submissions** are counted. Reading statuses, results, events and your history is free — poll as much as you need.

The minute is a bucket. It refills continuously at your plan's rate and holds at most one minute's worth, so after a quiet spell you can submit a whole minute's allowance at once — and sustained, you get exactly your rate.

A submission past the limit is refused:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 3
```

`Retry-After` is a forecast computed from the bucket — the seconds until there is room again — not a fixed number. Wait that long and send the same request again. With an [`Idempotency-Key`](/guides/retries/) the retry is safe even if you are unsure whether the first attempt got through.

## Requests at once

A request holds a slot from the moment it starts until it is `ready` or `failed`. When every slot is busy, a new submission is **not refused**: it is accepted with `201`, its status is `queued`, and it starts by itself as soon as a slot frees. Nothing has to be re-sent or paced by hand — you can hand over a minute's worth of work in one go and wait for the answers.

From outside, a request that has not started looks like one running slowly, so the account reports both numbers (see below).

## Where you stand

Every submission — and every refusal — carries the state of the bucket:

```http
RateLimit-Policy: 60;w=60
RateLimit: limit=60, remaining=41, reset=0
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 41
X-RateLimit-Reset: 0
```

`remaining` is how many submissions you could make right now; `reset` is the seconds until the next one is available — `0` while there is room. The `X-RateLimit-*` spellings carry the same numbers for client libraries that read those.

To plan before spending anything, read `GET /api/v1/me` — not metered:

```json title="GET /api/v1/me → data.meta"
{
  "rate-limit":  { "metered": true, "limit-minute": 60, "remaining-minute": 41, "reset-minute-sec": 0 },
  "concurrency": { "metered": true, "limit": 60, "in-flight": 4, "waiting": 12, "available": 56 }
}
```

`in-flight` is what is running, `waiting` what is accepted and queued, `available` the free slots.
