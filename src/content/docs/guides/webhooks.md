---
title: Webhooks
description: One signed call to your endpoint when a request finishes.
---

Basic and up. When a request of your account becomes `ready` or `failed`, Onion sends one `POST` to your endpoint. The endpoint is set in the dashboard on the **API keys** page, under **Webhook**; one per account.

## The call

```http
POST /your/endpoint HTTP/1.1
Content-Type: application/json
User-Agent: onion-webhooks/1
X-Onion-Timestamp: 1763719200
X-Onion-Signature: sha256=5d41402abc4b2a76b9719d911017c592…

{"event": "parse-request.ready", "request-id": "6f1c…", "status": "ready",
 "url": "https://example.com", "result-url": "https://user.onion4.ai/api/v1/parse-requests/6f1c…/result"}
```

| Field | |
|---|---|
| `event` | `parse-request.ready` or `parse-request.failed` |
| `request-id` | The request's `id` |
| `status` | `ready` or `failed` |
| `url` | The page the request was for |
| `result-url` | The [result](/guides/results/) endpoint. May come as a path (`/api/v1/parse-requests/…/result`); join it to `https://user.onion4.ai`. Read it with your API key. |

The result itself is not in the call.

- **One attempt**, with a 10-second timeout. A non-`2xx` answer or no answer is not retried; the result stays available on the API.
- Every request of the account is announced: submitted with a key, through MCP with a key, or in the dashboard. Anonymous requests are not.
- The plan is checked at delivery: after a downgrade below Basic the calls stop.

## Endpoint

`https://` only, a public host name or address, no credentials in the URL. The signing secret (`whsec_…`) is shown once, right after the endpoint is saved — copy it then. To change the URL or the secret, delete the endpoint and save a new one.

## Verify the signature

`X-Onion-Signature` is `sha256=` and the hex HMAC-SHA256 of `<X-Onion-Timestamp>.<raw body>`, keyed with the secret. Compute it over the body bytes as received, compare in constant time, and refuse old timestamps to stop replays.

```js title="Node.js"
import crypto from "node:crypto";

function verify(rawBody, headers, secret, maxAgeSeconds = 300) {
  const ts = headers["x-onion-timestamp"];
  const sig = headers["x-onion-signature"] ?? "";
  if (Math.abs(Date.now() / 1000 - Number(ts)) > maxAgeSeconds) return false;
  const want = "sha256=" + crypto.createHmac("sha256", secret)
    .update(`${ts}.`).update(rawBody).digest("hex");
  return sig.length === want.length &&
    crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(want));
}
```

```python title="Python"
import hashlib, hmac, time

def verify(raw_body: bytes, headers, secret: str, max_age_seconds=300) -> bool:
    ts = headers["X-Onion-Timestamp"]
    if abs(time.time() - int(ts)) > max_age_seconds:
        return False
    want = "sha256=" + hmac.new(secret.encode(), ts.encode() + b"." + raw_body,
                                hashlib.sha256).hexdigest()
    return hmac.compare_digest(headers.get("X-Onion-Signature", ""), want)
```
