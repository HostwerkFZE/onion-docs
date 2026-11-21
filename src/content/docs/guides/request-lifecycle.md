---
title: How a request works
description: The four statuses, the three ways a request can turn out, and the stages in between.
---

A parse request is one URL plus one instruction. From the moment you submit it, it has an `id` and a `status`, and it moves forward only:

```
queued ──► processing ──► ready
                     └──► failed
```

| Status | Means |
|---|---|
| `queued` | Accepted and waiting for a free slot of your plan's [requests at once](/guides/rate-limits/#requests-at-once). It starts on its own; nothing needs re-sending. |
| `processing` | The page is being fetched or rendered, and your instruction applied to it. |
| `ready` | Finished. The [result](/guides/results/) is there to read. |
| `failed` | Finished without a result. `error` says why. |

A request that has started and stops making progress is failed by Onion after a timeout, so a slot is never held for good. One that is still `queued` is left alone, however long it waits — it has not had its chance yet.

## Three outcomes, only one of them an error

`ready` does not by itself mean "here is your data". The result says which of these happened:

- **Data found.** `data-found: true` — the page held what you asked for, and the download is it.
- **Nothing to find.** `data-found: false` with a `reason`. The page was read and does not contain what you asked for. Retrying will give the same answer; change the URL or the instruction instead.
- **The site refused.** `block-class` is set (for example `cf_challenge`): the site answered with a challenge or a block page. It is a heuristic and a hint — read it together with `http-status`, because it can be set on a page that was served in full.

`failed` is the remaining case: the crawl or the extraction did not complete. That is the one worth retrying later.

:::tip
Keep these apart in your client. Treating "nothing found" as an error teaches it to retry something that will never succeed.
:::

## Watching the stages

While a request runs, `GET /parse-requests/{id}/events` lists what the pipeline has done so far, in order — planning, the crawl with its HTTP status, the turns of the extraction, the end:

```json
{ "data": [
  { "seq": 2, "event": "task.planned", "type": "phase", "at": "…",
    "detail": { "state": "running", "phase": "crawling" } },
  { "seq": 3, "event": "crawl_job.succeeded", "type": "event", "at": "…",
    "detail": { "crawl_seq": 1, "http_status": 200 } }
] }
```

That is how you tell "slow" from "stuck". `seq` is dense and grows by one, so a gap is visible. The list is commentary, though: an empty one is not a stall, and the request's own `status` is always the authority on where it stands.

## Where requests come from

Every request records its `source` — `api`, `mcp` or `web` — from the credential it was made with, so your history and activity show which door each one came through.
