---
title: Account
description: Your plan and live limits, your history counted by day and site, and the plan catalogue.
---

## Me

<span class="method get">GET</span> <span class="endpoint">/me</span>

Who the key belongs to, what the plan allows and where you stand right now. Not metered — read it as often as you like.

```json
{ "data": { "type": "users", "id": "0f2c…",
  "attributes": { "email": "you@example.com", "display-name": "…", "created-at": "…" },
  "meta": {
    "plan": "pro",
    "entitlements": { "rate-per-minute": 60, "concurrent-requests": 60, "prompt-budget": 4096,
                      "history-retention": 0, … },
    "rate-limit":  { "metered": true, "limit-minute": 60, "remaining-minute": 41, "reset-minute-sec": 0 },
    "concurrency": { "metered": true, "limit": 60, "in-flight": 4, "waiting": 12, "available": 56 }
  } } }
```

- `entitlements` — the plan, computed: quotas as numbers, features as flags.
- `rate-limit` — the bucket behind [requests per minute](/guides/rate-limits/#requests-per-minute). `metered: false` alone means nothing is counted.
- `concurrency` — [requests at once](/guides/rate-limits/#requests-at-once): `in-flight` running, `waiting` queued, `available` free.

## Activity

<span class="method get">GET</span> <span class="endpoint">/activity</span>

Your history, counted — requests per day and door, split by outcome, and your ten busiest sites. It costs the same whether you have a hundred requests or a hundred million.

| Query | |
|---|---|
| `period` | `7d`, `30d` (default), `90d` or `all`. The window starts at midnight in `tz`, `period − 1` days ago, and ends now. |
| `tz` | An IANA time zone, `Europe/Berlin`. Defaults to your account's setting, or UTC. |
| `filter[source]` | `api`, `mcp` or `web` — every figure for one door. |

```json
{ "data": { "type": "activity", "id": "0f2c…", "attributes": {
  "period": "30d", "timezone": "Europe/Berlin",
  "since": "2026-10-22T22:00:00Z", "until": "2026-11-21T10:00:00Z",
  "first-request-at": "2026-09-02T08:14:03Z",
  "days": [ { "date": "2026-11-20", "source": "api",
              "ok": 148, "no-data": 6, "failed": 9, "in-progress": 0 } ],
  "domains": [ { "host": "example.com", "requests": 5820, "ready": 5611, "failed": 209,
                 "sources": ["api", "mcp"], "last-request-at": "2026-11-21T09:58:00Z" } ],
  "domains-since": "2026-10-23T00:00:00Z" } },
  "meta": { "retention-days": 0, "hidden-by-plan": 0 } }
```

- `days` lists only days and doors that saw a request, oldest first; draw the empty ones yourself. Days are exact in any time zone.
- `domains` are counted in whole UTC days, so their window starts at the UTC midnight nearest `since` — that is `domains-since`.
- `first-request-at` is your first request ever, `null` if there is none: a new account and a quiet month look different.

## Plans

<span class="method get">GET</span> <span class="endpoint">/plans</span>

The plan catalogue: names, prices and every service each plan includes, with its value. No key needed — [try it](https://user.onion4.ai/api/v1/plans). Summarised in [Plans and limits](/getting-started/plans/).
