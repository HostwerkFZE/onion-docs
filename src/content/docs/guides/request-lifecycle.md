---
title: How a request works
description: Request statuses, result outcomes and pipeline events.
---

A parse request is one URL and one instruction. It gets an `id` on submission and moves through these statuses:

```
queued ──► processing ──► ready
                     └──► failed
```

| Status | Meaning |
|---|---|
| `queued` | Accepted; waiting for a free slot of the plan's [requests at once](/guides/rate-limits/#requests-at-once). Starts automatically. |
| `processing` | Sent to the crawler: the page is fetched or rendered and the instruction applied. |
| `ready` | Finished with a [result](/guides/results/). |
| `failed` | Finished without a result; `error` holds the reason. |

A `processing` request that has no result within a fixed time after it was sent to the crawler is set to `failed` ("request timed out before the crawler produced a result"). `queued` requests have no time limit.

## Outcomes

| Status | Result | Meaning |
|---|---|---|
| `ready` | `data-found: true` | The page held the requested data. |
| `ready` | `data-found: false` | Nothing matching was extracted; `reason` explains why. `block-class` set — the final page was classified as blocked (`cf_challenge`, `captcha`, `forbidden`, …), not empty. `suggested-url` set — a page on the same site where the data is more likely. |
| `failed` | — | No result. The crawler finished the task without success (`error-code` gives its code), was unreachable, rejected the task (for example an invalid `result-schema`), or the request timed out. `error` holds the message. |

## Events

`GET /parse-requests/{id}/events` returns the crawler's progress events for the request, in order:

```json
{ "data": [
  { "seq": 1, "event": "queued",              "type": "phase", "at": "…", "detail": { … } },
  { "seq": 2, "event": "crawling",            "type": "phase", "at": "…", "detail": { … } },
  { "seq": 3, "event": "crawl_job.created",   "type": "event", "at": "…", "detail": { … } },
  { "seq": 4, "event": "crawl_job.succeeded", "type": "event", "at": "…",
    "detail": { "http_status": 200, "block_class": null, … } },
  { "seq": 5, "event": "extracting",          "type": "phase", "at": "…", "detail": { … } }
] }
```

- `event` — the crawler's name for the phase or event.
- `detail` — the crawler's event object as received.
- `seq` — increases by one per event; a gap means an event was not received.

Events are informational and may be missing; the request's `status` is authoritative.

## Source

Every request records `source`: `api` for a submission with an API key, `mcp` for one made through the MCP server, `web` for the dashboard and the playground.
