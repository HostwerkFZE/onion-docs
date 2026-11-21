---
title: Safe retries
description: Idempotency-Key — retrying a submission without creating a second request.
---

Send an `Idempotency-Key` header with a submission. Resending with the same key returns the request created the first time instead of creating a new one.

```sh
curl -sS -X POST https://user.onion4.ai/api/v1/parse-requests \
  -H "Authorization: Bearer $ONION_API_KEY" \
  -H "Content-Type: application/vnd.api+json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{"data":{"type":"parse-requests","attributes":{"input":"https://example.com the page title"}}}'
```

| Request | Answer |
|---|---|
| New key | `201 Created`, a new request |
| Known key, same URL and instruction | `200 OK`, the original request; other attributes of the resend are ignored |
| Known key, different URL or instruction | `409 idempotency_key_conflict` |

- Length: 8–128 bytes.
- Keys are scoped to your account.
- A replay is answered before the rate limit is checked and is not counted.
- The key can also be sent as the `idempotency-key` attribute. Header and attribute with different values: `422`.

## Example

```python
import time, uuid, requests

API = "https://user.onion4.ai/api/v1"

def submit(payload, headers, attempts=5):
    key = str(uuid.uuid4())  # the same key for every attempt
    for n in range(attempts):
        try:
            r = requests.post(f"{API}/parse-requests", json=payload, timeout=30,
                              headers={**headers, "Idempotency-Key": key})
        except (requests.ConnectionError, requests.Timeout):
            time.sleep(2 ** n)
            continue
        if r.status_code == 429:
            time.sleep(int(r.headers.get("Retry-After", "1")))
            continue
        if r.status_code >= 500:
            time.sleep(2 ** n)
            continue
        r.raise_for_status()
        return r.json()["data"]["id"]  # 201, or 200 for a replay
    raise RuntimeError("could not submit")
```
