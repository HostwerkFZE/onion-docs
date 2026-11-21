---
title: Waiting for results
description: Polling the result, conditional polling with ETag, and the WebSocket.
---

A submission returns an `id` immediately; the crawl runs afterwards. Reads (status, result, events) are not counted against the [rate limit](/guides/rate-limits/).

| Way | Plan |
|---|---|
| [Poll the result](#poll-the-result) | every plan |
| [Poll the status with `ETag`](#poll-the-status-with-etag) | every plan |
| [WebSocket](#websocket) | Basic and up |
| [Webhook](/guides/webhooks/) — a call to your endpoint | Basic and up |

## Poll the result

`GET /parse-requests/{id}/result` answers `{"data": null, "meta": {"request-id": "…", "status": "queued"}}` (or `"processing"`) until the request is `ready`; then `data` is the result. For a failed request `meta.status` is `failed` and `meta.error` holds the reason. Test `data`, not `meta.status`. The [quickstart](/getting-started/quickstart/) has the loop in Python and JavaScript.

## Poll the status with ETag

`GET /parse-requests/{id}` returns a weak `ETag` such as `W/"processing-1763719200123"`. Send it back verbatim, including `W/`, as `If-None-Match`; while the status is unchanged the answer is `304 Not Modified` with no body.

```sh
curl -sS -i https://user.onion4.ai/api/v1/parse-requests/$ID \
  -H "Authorization: Bearer $ONION_API_KEY" \
  -H 'If-None-Match: W/"processing-1763719200123"'
```

The result endpoint has no `ETag`: its `download-url` expires.

## WebSocket

`wss://user.onion4.ai/api/v1/ws?request-id={id}`, with the key in the `Authorization` header (the query string is not accepted). The first message is the current state; then one message per status change. When the status is `ready`, the message also carries the result in `included[0]` and the artifact list in `meta.artifacts`. Message format: [Live status](/api/websocket/).

```js title="Node.js (ws package)"
import WebSocket from "ws";

const ws = new WebSocket(`wss://user.onion4.ai/api/v1/ws?request-id=${requestId}`, {
  headers: { Authorization: `Bearer ${process.env.ONION_API_KEY}` },
});

ws.on("unexpected-response", (req, res) => {
  // 403 on a plan without live updates: poll instead.
  console.error("handshake refused:", res.statusCode);
});
ws.on("error", (err) => console.error(err.message));

ws.on("message", (raw) => {
  const msg = JSON.parse(raw);
  const { status, error } = msg.data.attributes;
  if (status === "ready") {
    console.log(msg.included?.[0]?.attributes["download-url"]);
    ws.close();
  } else if (status === "failed") {
    console.error(error);
    ws.close();
  }
});
```

After the final state the server closes the socket itself if the client has not done so within 10 seconds. A handshake refused with `400`, `401` or `403` is described in [Live status](/api/websocket/#refusals).

## Progress

`GET /parse-requests/{id}/events` lists the pipeline stages of a running request. See [How a request works](/guides/request-lifecycle/#events).
