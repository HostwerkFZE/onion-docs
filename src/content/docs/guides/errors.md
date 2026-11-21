---
title: Handling errors
description: Which errors to fix, which to retry, and how a failed request differs from an empty result.
---

Errors are [JSON:API error objects](/api/errors/): `status`, `code`, `title`, and, when there is one, `detail` and `source.pointer`. Branch on `code`.

```json
{ "errors": [ {
  "status": "422",
  "code": "validation_error",
  "title": "Invalid attribute",
  "detail": "input must contain exactly one http or https URL",
  "source": { "pointer": "/data/attributes/input" }
} ] }
```

| Status | Code | Action |
|---|---|---|
| `401` | `unauthenticated` | The key is unknown, revoked or expired. Fix the key; do not retry. |
| `403` | `forbidden_entitlement` | Not included in the plan; `meta.required-service` names the service. |
| `403` | `session_required` | Account management; only from the dashboard. |
| `404` | `not_found` | No such request, or not yours. |
| `409` | `idempotency_key_conflict` | The `Idempotency-Key` was used with a different URL or instruction. |
| `422` | `validation_error` | Fix the request; see `detail` and `source.pointer`. |
| `422` | `not_available` | The option is reserved and not available yet. |
| `429` | `rate_limited` | Wait `Retry-After` seconds and resend. |
| `500` | `internal_error` | Retry with backoff. |
| `503` | `upstream_unavailable` | The key could not be verified at the moment. Retry with backoff. |

Retry `429`, `5xx` and network errors only, with the same [`Idempotency-Key`](/guides/retries/).

:::caution[No key means anonymous]
A request without an `Authorization` header is anonymous, not `401`. An anonymous submission through the API is refused (`403`); reads of your requests return `404`.
:::

## Request outcomes

The status of a request is not an HTTP error. A finished request is one of:

- `ready`, `data-found: true` — data found.
- `ready`, `data-found: false` — the page was processed and holds nothing matching; `reason` says why.
- `failed` — the request did not complete; `error` says why.

With `data-found: false`, a set `block-class` means the final page was classified as blocked, not empty. See [Results](/guides/results/#fields).
