---
title: Sending feedback
description: Reporting whether a result was correct.
---

`POST /api/v1/feedback` records a verdict on a result.

```sh
curl -sS -X POST https://user.onion4.ai/api/v1/feedback \
  -H "Authorization: Bearer $ONION_API_KEY" \
  -H "Content-Type: application/vnd.api+json" \
  -d '{"data":{"type":"feedback","attributes":{
        "request-id":"<REQUEST_ID>",
        "verdict":"wrong",
        "detail":"price shown on the page is 129.99, the result says 119.99"}}}'
```

| Attribute | |
|---|---|
| `verdict` | `helpful`, `incomplete`, `wrong` or `unusable`. Required. |
| `request-id` | The request the verdict is about. Optional: without it the feedback is about the service. |
| `detail` | What was wrong. Required for every verdict except `helpful`; up to 4096 bytes. |

The answer is `201` with the feedback `id`. A request that is not yours: `404`. A `request-id` that is not a UUID: `422`.

MCP clients send the same thing with the [`feedback` tool](/mcp/tools/#feedback).
