---
title: Waiting for results
description: Three ways to learn that a request has finished — polling, conditional polling with ETag, and a WebSocket that pushes every change.
---

A crawl takes seconds to minutes, so submitting never waits for it: you get an `id` back at once. Then pick how to wait.

| Way | Best for | Plan |
|---|---|---|
| [Poll the result](#poll-the-result) | scripts, the first version of anything | every plan |
| [Poll with `ETag`](#poll-with-etag) | many requests in flight | every plan |
| [WebSocket](#websocket) | reacting the moment a request settles | Basic and up |

Reads are free: no status read, result read or event read counts against your [rate limit](/guides/rate-limits/).

## Poll the result

Read `GET /parse-requests/{id}/result` every couple of seconds. While the request runs the answer is `{"data": null, "meta": {"status": "processing"}}`; when `data` is there, so is the result. A `failed` request shows `meta.status: "failed"` and `meta.error`. The [quickstart](/getting-started/quickstart/) has this loop in Python and JavaScript.

## Poll with ETag

`GET /parse-requests/{id}` — the request's status — carries an `ETag`. Send it back as `If-None-Match`, and while nothing has changed the answer is `304 Not Modified` with no body:

```sh
curl -sS -i https://user.onion4.ai/api/v1/parse-requests/$ID \
  -H "Authorization: Bearer $ONION_API_KEY" \
  -H 'If-None-Match: "…the ETag from the last answer…"'
```

When the status turns `ready`, read the result once. (The result itself is deliberately not conditional: its download link is short-lived, and a `304` would leave you holding an expired one.)

## WebSocket

Open `wss://user.onion4.ai/api/v1/ws?request-id={id}` with your key in the `Authorization` header. On connect you get the request's current state, then every change as it happens. The message is the same document `GET /parse-requests/{id}` returns; when the status is `ready`, the result rides along in `included`.

```js title="Node.js, with the ws package"
import WebSocket from "ws";

const ws = new WebSocket(`wss://user.onion4.ai/api/v1/ws?request-id=${requestId}`, {
  headers: { Authorization: `Bearer ${process.env.ONION_API_KEY}` },
});

ws.on("message", (raw) => {
  const doc = JSON.parse(raw);
  const { status } = doc.data.attributes;
  console.log(status);
  if (status === "ready") {
    console.log(doc.included?.[0]?.attributes["download-url"]);
    ws.close();
  }
  if (status === "failed") {
    console.error(doc.data.attributes.error);
    ws.close();
  }
});
```

Connecting after a request has finished is fine: the first message is already the final state.

:::caution[Keys go in the header]
The socket takes the key in the `Authorization` header only — never in the query string, where it would end up in access logs. Browsers cannot set that header on a WebSocket; a browser app should keep the key on its server and watch from there.
:::

If the socket cannot be opened — a plan without live updates answers the handshake with `403` — fall back to polling. Details: [Live status](/api/websocket/).

## Seeing progress

Whichever way you wait, `GET /parse-requests/{id}/events` shows the stages a running request has been through, so you can tell a slow page from a stuck one. See [How a request works](/guides/request-lifecycle/#watching-the-stages).
