---
title: Results and formats
description: The result resource, downloading the data, result-schema and artifacts.
---

`GET /parse-requests/{id}/result` returns the result once the request is `ready`:

```json
{ "data": { "type": "parse-results", "id": "…", "attributes": {
  "data-found": true,
  "reason": null,
  "content-type": "application/json",
  "size-bytes": 1874,
  "download-url": "https://…",
  "url-expires-at": "2026-11-21T12:34:56Z",
  "http-status": 200,
  "block-class": null,
  "rendered": false,
  "transport": "fetch",
  "final-url": "https://example.com/",
  "page": { "title": "Example Domain" }
} } }
```

Before that it returns `200` with `{"data": null, "meta": {"request-id": "…", "status": "queued" | "processing" | "failed"}}`, plus `meta.error` for a failed request.

## Data

The data is downloaded from `download-url`, a presigned link valid until `url-expires-at`. Request it without the `Authorization` header. For a new link, read the result again.

The format follows the instruction ("return the result in json", "as CSV"); `content-type` gives the format returned.

`output-format` adds that sentence to the instruction the crawler receives, unless the instruction already has it:

| `output-format` | Sentence added |
|---|---|
| `json` | Return the results in JSON format. |
| `csv` | Return the results in CSV format. |
| `table` | Return the results as a Markdown table. |
| `markdown` | Return the results as Markdown. |
| `text` | Return the results as plain text. |
| `schema` | none — the shape comes from `result-schema` |

The request's `prompt` stays your text, and the [size limit](/guides/instructions/#size-limit) counts only it. An instruction that the sentence would take past 8,192 characters is refused with `422`.

## Structured extraction

`result-schema` — a JSON Schema object; the result is JSON following it. Available on every plan.

```json
{ "data": { "type": "parse-requests", "attributes": {
  "input": "https://example.com/product/42 extract the price and its currency",
  "result-schema": {
    "type": "object",
    "required": ["price"],
    "properties": { "price": { "type": "number" }, "currency": { "type": "string" } }
  }
} } }
```

A schema the crawler rejects (invalid, or larger than 32 KB) is not refused on submission: the request becomes `failed`.

## Fields

| Field | Meaning |
|---|---|
| `data-found` | Whether the requested data was extracted. |
| `reason` | Why not, when `data-found` is `false`. |
| `content-type`, `size-bytes`, `sha256` | The downloadable data. |
| `http-status` | HTTP status of the final captured page. A captured 403 or 404 page is still a capture. |
| `block-class` | Heuristic classification of a blocked final page: `cf_challenge`, `captcha`, `forbidden`, `not_found`, `rate_limited`, `upstream_error`, `timeout`, `network`, `ssrf_blocked`, `unsupported_content_type`. Cleared by a successful extraction. |
| `rendered`, `transport` | `render` — the page went through a browser; `fetch` — a plain HTTP fetch. |
| `escalated` | The task was re-planned at least once. |
| `truncated-input` | The page exceeded the fetch size limit; extraction ran on part of it. |
| `final-url` | The URL after redirects. |
| `suggested-url` | A page on the same domain where the data is more likely (for example behind a consent overlay or a regional version). |
| `page` | Page metadata when present: `title`, `description`, `canonical-url`, `language`, `published-date`, `author`. |

## Artifacts

`GET /parse-requests/{id}/artifacts` lists the stored captures of a `ready` request: `result` first, then the others by `type` (`html`, `json`, `markdown`, `screenshot`, `structured_json`). Each has `content-type`, `size-bytes`, `url-expires-at` and a `download-url` (a screenshot has a `view-url`). Links are valid for 5 minutes. For other statuses the list is empty and `meta.status` gives the status.
