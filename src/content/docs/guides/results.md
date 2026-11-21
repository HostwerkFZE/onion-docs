---
title: Results and formats
description: What a result tells you, how to download the data, and how to get it in the format and shape you need.
---

When a request is `ready`, `GET /parse-requests/{id}/result` returns the result: facts about the crawl, and a link to the data.

```json title="GET /api/v1/parse-requests/{id}/result"
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
  "final-url": "https://onion4.ai/products",
  "page": { "title": "Products", "language": "en" }
} } }
```

Until the request settles, the same read answers `{"data": null, "meta": {"status": "processing"}}` — and for a failed one, `meta.status` is `failed` with `meta.error`.

## The data itself

The data is not inline: it is behind `download-url`, a presigned link that expires at `url-expires-at`. Fetch it right away, **without** your `Authorization` header — the signature is the permission. Do not store the link; when you need the data again, read the result again for a fresh one. `content-type` and `size-bytes` describe what you will get.

## Formats

The format follows your instruction. Ask for it in plain words — "return the result in json", "as a CSV table", "as Markdown" — and `content-type` tells you what came back. A URL with no instruction returns the page's raw HTML.

## Structured extraction

When the shape has to be exact — the same keys, the same types, every time — pass a JSON Schema as `result-schema`. The answer is JSON that follows it:

```json
{ "data": { "type": "parse-requests", "attributes": {
  "input": "https://example.com/product/42 extract the price and its currency",
  "result-schema": {
    "type": "object",
    "required": ["price"],
    "properties": {
      "price":    { "type": "number" },
      "currency": { "type": "string" }
    }
  }
} } }
```

`result-schema` is available on every plan: it decides the shape of the answer, not how much work it is.

## What the other fields mean

| Field | Meaning |
|---|---|
| `data-found` | Whether the page held what you asked for. `false` is a finished crawl of a page that did not — see `reason`. |
| `reason` | Why nothing was found, when `data-found` is `false`. |
| `http-status` | The status of the final page the crawl captured. A captured 403 or 404 page is still a successful capture. |
| `block-class` | Set when the site answered with a challenge or a block page (for example `cf_challenge`). A hint, not a verdict: read it with `http-status`. |
| `rendered`, `transport` | Whether the page went through a browser (`render`) or a plain fetch (`fetch`). |
| `escalated` | The crawl was re-planned along the way — for example, a fetch turned into a render. |
| `truncated-input` | The page was too large and was cut; the extraction ran on part of it. |
| `final-url` | Where the crawl ended up after redirects. |
| `suggested-url` | A page on the same site where the data more likely is — when a consent overlay, a regional version or the wrong section hid it. |
| `page` | Facts about the page when it carries trustworthy ones: `title`, `description`, `canonical-url`, `language`, `published-date`, `author`. |

## Everything the crawl kept

`GET /parse-requests/{id}/artifacts` lists every capture a finished request has — the result first, then whatever else the crawl stored — each with its `type`, `content-type`, `size-bytes` and its own short-lived `download-url`.
