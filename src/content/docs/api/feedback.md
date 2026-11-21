---
title: Feedback
description: Judge an answer — the one signal only the caller can produce.
---

<span class="method post">POST</span> <span class="endpoint">/feedback</span>

```json
{ "data": { "type": "feedback", "attributes": {
  "request-id": "6f1c…",
  "verdict": "wrong",
  "detail": "the price is last month's; the page shows 129.99 today"
} } }
```

| Attribute | Type | |
|---|---|---|
| `verdict` | `helpful` \| `incomplete` \| `wrong` \| `unusable`, required | How the answer turned out. |
| `request-id` | uuid | The request this is about. Leave it out for feedback about the service in general. |
| `detail` | string, up to 4,096 | What was wrong, and what you expected. Required unless the verdict is `helpful`. |

**Answers**

- `201 Created` — the feedback, with its `id`, `verdict` and `source` (`api`, taken from your credential).
- `404 not_found` — the request is not yours. Whoever may read a request may judge it, and nobody else.
- `422 validation_error` — an unknown verdict, or a verdict other than `helpful` without `detail`.

Why it matters and how to write a useful `detail`: [Sending feedback](/guides/feedback/).
