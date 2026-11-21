---
title: Sending feedback
description: Tell Onion when an answer was stale, incomplete or wrong — the one signal only the caller can produce.
---

Onion knows what it fetched and whether the extraction found anything. Whether the answer was **useful** — the price was last month's, "no data" was wrong because the page plainly has it, the instruction was read backwards — only the caller who acted on it finds out. Feedback is where that goes, and it is how extraction gets better.

```sh
curl -sS -X POST https://user.onion4.ai/api/v1/feedback \
  -H "Authorization: Bearer $ONION_API_KEY" \
  -H "Content-Type: application/vnd.api+json" \
  -d '{"data":{"type":"feedback","attributes":{
        "request-id":"<REQUEST_ID>",
        "verdict":"wrong",
        "detail":"the price is last month'"'"'s; the page shows 129.99 today"}}}'
```

The answer is `201` with the feedback's id.

## Verdicts

| Verdict | When |
|---|---|
| `helpful` | The answer was right and usable. |
| `incomplete` | Right as far as it went, but something was missing. |
| `wrong` | The answer was incorrect. |
| `unusable` | It could not be used at all. |

Anything but `helpful` must carry a `detail` (up to 4,096 characters): what was wrong, and what you expected instead. "It was bad" cannot be reproduced; "the page shows 129.99, the answer said 119.99" can.

## Who may judge

Whoever may read a request may judge it: its owner, with a key or in the dashboard. Feedback on a request that is not yours is `404`, exactly like reading it. `request-id` may be left out for feedback about the service in general.

AI agents send the same signal through the MCP [`feedback` tool](/mcp/tools/#feedback).
