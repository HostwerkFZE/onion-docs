---
title: Errors
description: Error object and codes.
---

```json
{ "errors": [ {
  "status": "403",
  "code": "forbidden_entitlement",
  "title": "Your plan does not include this",
  "detail": "choosing the device and OS is not included in your plan",
  "meta": { "required-service": "platform_selection" }
} ] }
```

| Member | |
|---|---|
| `status`, `code`, `title` | Always present. Branch on `code`. |
| `detail` | Present when there is one. |
| `source.pointer` | On most `422`s: the attribute (`/data/attributes/input`) or query parameter (`/filter[since]`). |
| `meta.required-service` | On `403 forbidden_entitlement`: the plan service required. |

WebSocket handshake refusals are plain text, not this object ([Live status](/api/websocket/#refusals)).

## Codes

| Status | Code | |
|---|---|---|
| `400` | `malformed` | The body is not valid JSON (`/feedback`). |
| `401` | `unauthenticated` | The key is unknown, revoked or expired; or no key on a route that requires one (`/me`, `/activity`, history). |
| `403` | `forbidden_entitlement` | Not included in the plan. |
| `403` | `session_required` | Account management; dashboard only. |
| `403` | `recaptcha_failed` | A submission without a key. |
| `404` | `not_found` | No such resource, or not yours. |
| `409` | `idempotency_key_conflict` | The `Idempotency-Key` was used with a different URL or instruction. |
| `422` | `validation_error` | Invalid request; see `detail` and `source.pointer`. |
| `422` | `not_available` | Reserved feature: `fresh-data: true`, an array in `data`. |
| `429` | `rate_limited` | Submission limit reached; `Retry-After` in seconds. |
| `500` | `internal_error` | Server error. |
| `503` | `upstream_unavailable` | The key could not be verified at the moment. |
| `503` | `recaptcha_unconfigured` | A submission without a key while anonymous submission is unavailable. |

Handling: [Handling errors](/guides/errors/).
