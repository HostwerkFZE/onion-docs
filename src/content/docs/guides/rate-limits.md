---
title: Rate limits and concurrency
description: Submissions per minute, requests running at once, and the headers that report them.
---

| | Free | Basic | Pro | Ultimate |
|---|---|---|---|---|
| Submissions per minute | 1 | 20 | 60 | 120 |
| Requests at once | 1 | 5 | 60 | 120 |

Both limits apply to the account: all its keys, the dashboard and MCP share them.

## Submissions per minute

Only submissions are counted. Reads of statuses, results, events and history are not.

The limit is a token bucket: it refills continuously at the plan's rate and holds at most one minute's worth, so after an idle period a full minute's allowance can be submitted at once.

Over the limit, the submission is refused:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 3
```

`Retry-After` is the number of seconds until the bucket has a token again.

## Requests at once

A request occupies a slot from the moment it starts until it is `ready` or `failed`. A submission made while all slots are busy is accepted (`201`) with status `queued` and starts automatically when a slot frees.

## Headers

Submissions from an account on a metered plan carry the bucket state, on success and on `429`:

```http
RateLimit-Policy: 60;w=60
RateLimit: limit=60, remaining=41, reset=0
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 41
X-RateLimit-Reset: 0
```

`remaining` — submissions available now; `reset` — seconds until the next token (`0` while tokens remain).

## Current state

`GET /api/v1/me` (not counted):

```json title="data.meta"
{
  "rate-limit":  { "metered": true, "limit-minute": 60, "remaining-minute": 41, "reset-minute-sec": 0 },
  "concurrency": { "metered": true, "limit": 60, "in-flight": 4, "waiting": 12, "available": 56 }
}
```

`in-flight` — running, `waiting` — queued, `available` — free slots.
