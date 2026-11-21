---
title: Feedback
description: POST /feedback — a verdict on a result.
---

<span class="method post">POST</span> <span class="endpoint">/feedback</span>

```json
{ "data": { "type": "feedback", "attributes": {
  "request-id": "6f1c…",
  "verdict": "wrong",
  "detail": "price shown on the page is 129.99, the result says 119.99"
} } }
```

| Attribute | Type | |
|---|---|---|
| `verdict` | `helpful` \| `incomplete` \| `wrong` \| `unusable` | Required. |
| `request-id` | UUID | Optional; without it the feedback is about the service. |
| `detail` | string, up to 4096 bytes | Required unless `verdict` is `helpful`. |

**Responses:**

- `201` — `feedback` resource with `id`, `verdict`, `source`.
- `400 malformed` — the body is not valid JSON.
- `404 not_found` — the request is not yours.
- `422 validation_error` — unknown verdict, missing or too long `detail`, `request-id` not a UUID.
