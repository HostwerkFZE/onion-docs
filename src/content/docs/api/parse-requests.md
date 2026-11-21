---
title: Parse requests
description: Submit, list, and read status, result, events and artifacts.
---

## Submit

<span class="method post">POST</span> <span class="endpoint">/parse-requests</span>

```json
{ "data": { "type": "parse-requests", "attributes": {
  "input": "https://example.com extract the page title, return the result in json",
  "mode": "fast"
} } }
```

| Attribute | Type | |
|---|---|---|
| `input` | string, required | One http(s) URL and the instruction. [Parsing and limits](/guides/instructions/) |
| `mode` | `fast` \| `full` | Default `fast`. [Crawl options](/guides/crawl-options/#mode) |
| `result-schema` | object | JSON Schema for the result. [Structured extraction](/guides/results/#structured-extraction) |
| `device`, `os` | string | Both or neither. Basic and up. [Crawl options](/guides/crawl-options/#device-and-os) |
| `location` | string | Two-letter country code. Ultimate; on Pro and up chosen from the site's domain when omitted. [Crawl options](/guides/crawl-options/#location) |
| `output-format` | `markdown` \| `text` \| `json` \| `table` \| `csv` \| `schema` | Adds a format sentence to the instruction the crawler receives. [Results](/guides/results/#data) |
| `fresh-data` | boolean | Reserved. `true`: `403` below Ultimate, `422 not_available` on Ultimate. |
| `idempotency-key` | string | Same as the `Idempotency-Key` header. |

| Header | |
|---|---|
| `Idempotency-Key` | 8–128 bytes. Same key with the same URL and instruction returns the original request (`200`); with a different URL or instruction, `409`. [Safe retries](/guides/retries/) |

`data` must be one object; an array is answered `422 not_available`.

**Responses:** `201` — created, status `queued`, with `Location` and [rate-limit headers](/guides/rate-limits/#headers). `200` — idempotent replay. `403 forbidden_entitlement` · `409 idempotency_key_conflict` · `422 validation_error` · `429 rate_limited`.

```json title="201 Created"
{ "data": { "type": "parse-requests", "id": "6f1c…", "attributes": {
    "url": "https://example.com",
    "prompt": "extract the page title, return the result in json",
    "mode": "fast", "output-format": null, "source": "api", "status": "queued",
    "error": null, "error-code": null,
    "created-at": "2026-11-21T10:00:00Z", "updated-at": "2026-11-21T10:00:00Z" },
  "links": { "self": "/api/v1/parse-requests/6f1c…" } } }
```

`device` and `os` appear in the resource only when they were sent; `location`, when it was sent or [chosen for the site](/guides/crawl-options/#chosen-for-you).

## List

<span class="method get">GET</span> <span class="endpoint">/parse-requests</span>

The account's requests from every source (`api`, `mcp`, `web`), newest first.

| Query | |
|---|---|
| `page[size]` | 1–100, default 20. |
| `page[after]` | The id the previous page ended on (or follow `links.next`). |
| `filter[status]` | `queued`, `processing`, `ready`, `failed`. |
| `filter[q]` | Substring of the URL or the instruction. |
| `filter[since]` | Inclusive lower bound on `created-at`: RFC 3339 (encode `+` as `%2B`) or `YYYY-MM-DD` (start of that UTC day). |
| `filter[until]` | Exclusive upper bound; `YYYY-MM-DD` means the end of that UTC day. |

`meta`: `has-more`; `retention-days` (`0` — unlimited); `hidden-by-plan` — rows outside the plan's history retention (counted up to 10,000, `hidden-by-plan-capped: true` beyond). An invalid filter or cursor: `422` with `source.pointer` `/filter[since]`, `/filter[until]` or `/page[after]`.

## Status

<span class="method get">GET</span> <span class="endpoint">/parse-requests/{id}</span>

The resource as in the submit response. Carries a weak `ETag`; `If-None-Match` with the same value answers `304` while the status is unchanged. `404` for a request that is not yours.

## Result

<span class="method get">GET</span> <span class="endpoint">/parse-requests/{id}/result</span>

`ready`: a `parse-results` resource ([fields](/guides/results/#fields)). Otherwise: `200` with `{"data": null, "meta": {"request-id": "…", "status": "…"}}` and `meta.error` for `failed`.

## Events

<span class="method get">GET</span> <span class="endpoint">/parse-requests/{id}/events</span>

The crawler's progress events: `seq`, `event`, `type` (`phase` or `event`), `at`, `detail` (the crawler's event object). `seq` is the crawler's counter; a gap means an event was not received. `meta.spans` gives timings. [Example](/guides/request-lifecycle/#events)

## Artifacts

<span class="method get">GET</span> <span class="endpoint">/parse-requests/{id}/artifacts</span>

For a `ready` request: `result` first, then other captures by `type`. Each item: `type`, `content-type`, `size-bytes`, `url-expires-at`, and `download-url` (a `screenshot` has `view-url` instead). Links are valid for 5 minutes. For other statuses: an empty list and `meta.status`.
