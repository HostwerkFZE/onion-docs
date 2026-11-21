---
title: Live status
description: WebSocket with the request's state on connect and on every change.
---

<span class="method ws">WS</span> <span class="endpoint">wss://user.onion4.ai/api/v1/ws?request-id={id}</span>

| | |
|---|---|
| Query | `request-id` — the request's UUID. |
| Auth | `Authorization: Bearer onion_sk_…` in the handshake headers. Not accepted in the query string. |
| Plan | Basic and up (`live_updates`). |

## Messages

The first message is the current state, then one message per status change:

```json title="status ready"
{ "meta": { "event": "result", "artifacts": [ … ] },
  "data": { "type": "parse-requests", "id": "6f1c…", "attributes": { "status": "ready", … } },
  "included": [ { "type": "parse-results", "id": "…",
                  "attributes": { "data-found": true, "download-url": "https://…", … } } ] }
```

- `meta.event`: `status` (queued, processing), `result` (ready), `error` (failed).
- `data`: the request resource, as in [`GET /parse-requests/{id}`](/api/parse-requests/#status).
- On `ready`: `included[0]` — the result as in [`/result`](/api/parse-requests/#result); `meta.artifacts` — the list from [`/artifacts`](/api/parse-requests/#artifacts).

After the final state the server closes the socket (code `1000`, reason `terminal`) if the client has not closed it within 10 seconds. Connecting to a finished request returns its final state.

## Refusals

The handshake is answered with a plain-text HTTP error instead of an upgrade:

| Status | Cause |
|---|---|
| `400` | `request-id` is not a UUID. |
| `401` | The key is unknown, revoked or expired. |
| `403` | The request is not yours; the plan has no live updates; the `Origin` is not allowed. |

Only a header with the full `onion_sk_` prefix is checked as a key; anything else is treated as no key, and a request owned by an account then answers `403`. Fallback for every refusal: [polling](/guides/waiting/).
