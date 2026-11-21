---
title: Handling errors
description: Which errors to fix, which to wait out and which to retry — and how to tell a failed request from an empty answer.
---

Errors come back as [JSON:API error objects](/api/errors/) with an HTTP status, a stable `code` and a human `detail`. Branch on `code`, show `detail`.

```json
{ "errors": [ {
  "status": "422",
  "code": "validation_error",
  "title": "Invalid attribute",
  "detail": "input must contain exactly one http or https URL",
  "source": { "pointer": "/data/attributes/input" }
} ] }
```

`source.pointer` names the part of your request that was wrong.

## What to do with each

| Status | Code | What to do |
|---|---|---|
| `401` | `unauthenticated` | Check the key: it is missing, mistyped, cut short or deleted. Do not retry as is. |
| `403` | `forbidden_entitlement` | Your plan does not include this; `meta.required-service` names what would. Drop the option or upgrade. |
| `403` | `session_required` | Account management — do it in the dashboard. |
| `404` | `not_found` | No such request — or not yours. The two read the same on purpose. |
| `409` | `idempotency_key_conflict` | The `Idempotency-Key` was used for a different body. Use a new key for new work. |
| `422` | `validation_error` | Fix the request: see `detail` and `source.pointer`. Retrying unchanged will fail the same way. |
| `429` | `rate_limited` | Wait `Retry-After` seconds and send the same request again. |
| `502` | `upstream_unavailable` | Something behind Onion is down. Retry with backoff. |
| `500` | `internal_error` | Our fault. Retry with backoff; if it persists, [tell us](https://onion4.ai/support). |

Retry only `429`, `5xx` and network errors — with the same [`Idempotency-Key`](/guides/retries/) each time.

## A finished request is not an error

Errors above are about **the call**. What happened to **the work** is in the request's status and result, and it has three honest outcomes:

- `ready` with `data-found: true` — the data.
- `ready` with `data-found: false` and a `reason` — the page holds nothing matching. Change the instruction or the URL; retrying will not help.
- `failed` with `error` — the crawl did not complete. Worth trying again later.

A result with `block-class` set means the site answered with a challenge or a block page. Trying a different [crawl option](/guides/crawl-options/) — `full` mode, another device — may get further than resending the same request.
