---
title: Errors
description: The error object, and every code the API answers with.
---

Errors are [JSON:API error objects](https://jsonapi.org/format/#error-objects): an `errors` array with one object, carrying the HTTP `status`, a stable `code`, a short `title` and a human `detail`.

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
| `code` | What to branch on. Stable. |
| `detail` | What to show a person. Wording may change. |
| `source.pointer` | For a `422`: which part of your request was wrong, `/data/attributes/input`. |
| `meta.required-service` | For a `403 forbidden_entitlement`: the plan service that would allow it. |

## Codes

| Status | Code | Meaning |
|---|---|---|
| `401` | `unauthenticated` | No key where one is needed, or a key that does not resolve. |
| `403` | `forbidden_entitlement` | The plan does not include this. |
| `403` | `session_required` | Account management; dashboard only. |
| `404` | `not_found` | No such resource — or not yours. |
| `409` | `idempotency_key_conflict` | The `Idempotency-Key` was used with a different body. |
| `409` | `key_limit_reached` | The account already has 100 keys. |
| `422` | `validation_error` | The request is malformed: see `detail` and `source.pointer`. |
| `422` | `not_available` | A reserved option that is not available yet. |
| `429` | `rate_limited` | The rate is spent. Wait `Retry-After` seconds. |
| `500` | `internal_error` | Our fault. |
| `502` | `upstream_unavailable` | A service behind the API is down. |

What to do about each: [Handling errors](/guides/errors/).
