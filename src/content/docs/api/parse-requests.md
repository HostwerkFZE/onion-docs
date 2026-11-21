---
title: Parse requests
description: Submit a URL and an instruction, list your history, and read a request's status, result, events and artifacts.
---

A parse request is one URL plus one instruction, and everything Onion found out doing it.

## Submit

<span class="method post">POST</span> <span class="endpoint">/parse-requests</span>

```json
{ "data": { "type": "parse-requests", "attributes": {
  "input": "https://onion4.ai/products extract product names, prices and availability, return the result in json",
  "mode": "fast"
} } }
```

| Attribute | Type | |
|---|---|---|
| `input` | string, required | Exactly one http(s) URL and the instruction for it. The instruction counts against your plan's prompt size. [More](/guides/instructions/) |
| `mode` | `fast` \| `full` | `fast` by default. `full` also scrolls and runs scripts. [More](/guides/crawl-options/#fast-or-full) |
| `result-schema` | object | A JSON Schema the answer must follow. Every plan. [More](/guides/results/#structured-extraction) |
| `output-format` | `markdown` \| `text` \| `json` \| `table` \| `csv` \| `schema` | Your preferred format, kept on the request. Say the format in the instruction as well. |
| `device`, `os` | see [Crawl options](/guides/crawl-options/#device-and-os) | Both or neither. Basic and up. |
| `location` | two-letter country code | Ultimate. [More](/guides/crawl-options/#location) |
| `idempotency-key` | string, 8–128 | The same as the `Idempotency-Key` header, in the body. |

| Header | |
|---|---|
| `Idempotency-Key` | Optional, 8–128 characters. Same key and body replays the original request (`200`); same key, different body is `409`. [More](/guides/retries/) |

**Answers**

- `201 Created` — the new request, status `queued`, with a `Location` header and the [rate-limit headers](/guides/rate-limits/#where-you-stand).
- `200 OK` — a replay of an earlier request with the same `Idempotency-Key`. Not counted.
- `403 forbidden_entitlement` — an option your plan does not include; `meta.required-service` names it.
- `409 idempotency_key_conflict` · `422 validation_error` · `429 rate_limited`.

```json title="201 Created"
{ "data": { "type": "parse-requests", "id": "6f1c…", "attributes": {
    "url": "https://onion4.ai/products",
    "prompt": "extract product names, prices and availability, return the result in json",
    "mode": "fast", "source": "api", "status": "queued",
    "error": null, "error-code": null,
    "created-at": "2026-11-21T10:00:00Z", "updated-at": "2026-11-21T10:00:00Z" },
  "links": { "self": "/api/v1/parse-requests/6f1c…" } } }
```

`data` must be a single object: one request per call.

## List

<span class="method get">GET</span> <span class="endpoint">/parse-requests</span>

Your request history, newest first — from every door: API, MCP and the dashboard.

| Query | |
|---|---|
| `page[size]` | 1–100, default 20. |
| `page[after]` | The id the previous page ended on. Easier: follow `links.next`. |
| `filter[status]` | `queued`, `processing`, `ready` or `failed`. |
| `filter[q]` | A substring of the URL or the instruction. |
| `filter[since]` | Inclusive lower bound on `created-at`: RFC 3339 (`2026-10-01T09:30:00Z`, encode `+` as `%2B`) or a date `YYYY-MM-DD`, which means the start of that UTC day. |
| `filter[until]` | Exclusive upper bound, same forms. A plain date means the **end** of that day, so `since=2026-10-01&until=2026-10-07` is seven whole days. |

Filters combine with each other and with the cursor. The plan's history retention bounds the list: `meta.hidden-by-plan` counts what it kept out, and `meta.retention-days` says the limit (`0` is unlimited).

## Status

<span class="method get">GET</span> <span class="endpoint">/parse-requests/{id}</span>

The request, as in the submit answer. It carries an `ETag`: send it back as `If-None-Match` and an unchanged state answers `304` with no body — the cheap way to [poll](/guides/waiting/#poll-with-etag). `404` when the id is not yours.

## Result

<span class="method get">GET</span> <span class="endpoint">/parse-requests/{id}/result</span>

Until the request is `ready`: `{"data": null, "meta": {"request-id": "…", "status": "processing"}}`, with `meta.error` once it has failed. When it is ready: a `parse-results` resource with `data-found`, `reason`, `http-status`, `block-class`, `final-url`, the presigned `download-url` and the rest — every field is explained in [Results and formats](/guides/results/). Do not cache it: the link expires at `url-expires-at`.

## Events

<span class="method get">GET</span> <span class="endpoint">/parse-requests/{id}/events</span>

What the pipeline has done so far, in order: `task.planned`, `crawl_job.succeeded` with its `http_status`, the turns of the extraction, the end. Each event has a `seq` (dense, growing by one), `event`, `type`, `at` and `detail`. An empty list is not a stall — the request's `status` is the authority. [More](/guides/request-lifecycle/#watching-the-stages)

## Artifacts

<span class="method get">GET</span> <span class="endpoint">/parse-requests/{id}/artifacts</span>

Every capture a finished request has: the result first, then whatever else the crawl stored. Each item has its `type`, `content-type`, `size-bytes`, `url-expires-at` and a presigned `download-url`.
