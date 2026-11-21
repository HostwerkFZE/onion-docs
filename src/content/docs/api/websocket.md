---
title: Live status
description: A WebSocket that sends a request's state on connect and every change after it.
---

<span class="method ws">WS</span> <span class="endpoint">wss://user.onion4.ai/api/v1/ws?request-id={id}</span>

Instead of polling, open a socket for a request: it sends the current state as soon as you connect, then every change — `processing`, then `ready` or `failed`.

| | |
|---|---|
| Query | `request-id` — the request's id. |
| Auth | `Authorization: Bearer onion_sk_…` — **header only**. A key in a query string would end up in access logs. |
| Plan | Live updates are included from **Basic** up. |

## Messages

Each message is the document [`GET /parse-requests/{id}`](/api/parse-requests/#status) returns. When the status is `ready`, two things ride along, so no further call is needed:

- `included[0]` — the `parse-results` resource, the same one [`/result`](/api/parse-requests/#result) returns, with its `download-url`;
- `meta.artifacts` — the same list [`/artifacts`](/api/parse-requests/#artifacts) returns.

```json title="The last message"
{ "data": { "type": "parse-requests", "id": "6f1c…", "attributes": { "status": "ready", … } },
  "included": [ { "type": "parse-results", "id": "…",
                  "attributes": { "data-found": true, "download-url": "https://…", … } } ],
  "meta": { "artifacts": [ … ] } }
```

After the final state the server keeps the socket open until you close it. Connecting to a request that has already finished is fine: the first message is its final state.

## Refusals

The handshake answers with a plain HTTP status instead of upgrading:

| Status | Why |
|---|---|
| `400` | `request-id` is not a UUID. |
| `401` | The key was sent and does not resolve. |
| `403` | The request is not yours — or your plan does not include live updates. |

In every case the fallback is the same: [poll](/guides/waiting/) `GET /parse-requests/{id}`.

A Node.js example is in [Waiting for results](/guides/waiting/#websocket).
