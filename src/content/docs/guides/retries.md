---
title: Safe retries
description: Send an Idempotency-Key with every submission, so a retry after a lost connection never starts the same work twice.
---

A submission can time out on your side after Onion has already accepted it. Retrying blindly then runs — and counts — the same work twice. An `Idempotency-Key` makes the retry safe.

## How it works

Generate a unique key per piece of work and send it with the submission:

```sh
curl -sS -X POST https://user.onion4.ai/api/v1/parse-requests \
  -H "Authorization: Bearer $ONION_API_KEY" \
  -H "Content-Type: application/vnd.api+json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{"data":{"type":"parse-requests","attributes":{"input":"https://example.com  the page title"}}}'
```

| You send | Onion answers |
|---|---|
| a new key | `201 Created` — a new request |
| the same key, the same body | `200 OK` — the **original** request, nothing new started |
| the same key, a different body | `409 idempotency_key_conflict` |

A replay is answered before the meter: it costs nothing against your rate limit. Keys are your own — another account using the same string does not collide with you.

## Rules

- 8 to 128 characters. A UUID is a good choice; so is something meaningful to you, like `price-check-2026-11-21-sku-42`.
- Use the key **for one piece of work**, and reuse it only to retry that same work.
- It may also travel as the `idempotency-key` attribute in the body. Sending both with different values is `422`.

## A retry loop that holds up

```python
import uuid, time, requests

def submit(payload, headers, attempts=5):
    key = str(uuid.uuid4())            # one key for every attempt
    for n in range(attempts):
        try:
            r = requests.post(f"{API}/parse-requests", json=payload, timeout=30,
                              headers={**headers, "Idempotency-Key": key})
        except requests.ConnectionError:
            time.sleep(2 ** n)
            continue
        if r.status_code == 429:
            time.sleep(int(r.headers.get("Retry-After", "5")))
            continue
        r.raise_for_status()
        return r.json()["data"]["id"]  # 201, or 200 for a replay
    raise RuntimeError("could not submit")
```
