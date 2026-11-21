---
title: Account
description: GET /me, GET /activity, GET /plans.
---

## Me

<span class="method get">GET</span> <span class="endpoint">/me</span>

The account, its plan and current limits. Not counted against the rate limit.

```json
{ "data": { "type": "users", "id": "0f2c…",
  "attributes": { "email": "you@example.com", "display-name": "…", "avatar-url": null, "created-at": "…" },
  "relationships": { "settings": { … }, "subscription": { … }, "api-key": { … } },
  "meta": {
    "plan": "pro",
    "entitlements": { "rate-per-minute": 60, "concurrent-requests": 60, "prompt-budget": 4096,
                      "history-retention": 0, "platform-selection": true, "geo-routing": "auto", … },
    "rate-limit":  { "metered": true, "limit-minute": 60, "remaining-minute": 41, "reset-minute-sec": 0 },
    "concurrency": { "metered": true, "limit": 60, "in-flight": 4, "waiting": 12, "available": 56 },
    "offer": { … }, "settings": { … }
  } } }
```

- `plan` — the plan slug; empty without a subscription.
- `entitlements` — the plan's services: quotas as numbers, flags as booleans, levels as strings; services not in the plan are `false`.
- `rate-limit` — the [submission bucket](/guides/rate-limits/). Hour and day windows (`limit-hour`, `limit-day`, …) appear only if the deployment meters them. `metered: false` — nothing is counted.
- `concurrency` — `in-flight` running, `waiting` queued, `available` free slots. Without a cap: `metered: false` and no `limit`/`available`.

## Activity

<span class="method get">GET</span> <span class="endpoint">/activity</span>

Request counts per day and source, and the ten busiest sites.

| Query | |
|---|---|
| `period` | `7d`, `30d` (default), `90d`, `all`. Starts at midnight in `tz`, `period − 1` days ago; ends now. |
| `tz` | IANA time zone. Default: the account setting, otherwise UTC. |
| `filter[source]` | `api`, `mcp` or `web`. |

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

- `days` — only days and sources with requests, oldest first.
- `domains` — counted in whole UTC days from `domains-since`, the UTC midnight nearest `since`.
- The plan's history retention narrows the window; `meta.hidden-by-plan` counts requests outside it.
- `since` and `domains-since` are `null` for `period=all` with unlimited retention.
- `first-request-at` — the account's first request, regardless of `filter[source]`; `null` if none.

An invalid `period` or `tz`: `422`.

## Plans

<span class="method get">GET</span> <span class="endpoint">/plans</span>

The plan catalogue: name, price and the services of each plan with their values. No key required. [Plans and limits](/getting-started/plans/)
