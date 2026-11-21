---
title: API keys
description: Creating keys, what they can do, and the errors they produce.
---

A key has the form `onion_sk_…` and is sent in the `Authorization` header to the HTTP API and the MCP server:

```http
Authorization: Bearer onion_sk_...
```

## In the dashboard

**API keys** in the [dashboard](https://user.onion4.ai/):

- create a key with a name;
- copy or show a key (keys created before 2026-11-18 cannot be shown again);
- rename and delete keys;
- see each key's last use and its HTTP API requests per day for the last 14 UTC days (requests made through MCP are not attributed to a key).

An account can have up to 100 keys. All of them share the account's plan and limits. A key created in the dashboard does not expire.

## What a key can do

Submit requests, read statuses, results, events and history, open the WebSocket, send feedback, read `/me` and `/activity`. Managing keys, the plan, settings and the account is dashboard-only; with a key these routes answer `403 session_required`.

## Errors

| Status | Code | Cause |
|---|---|---|
| `401` | `unauthenticated` | The key starts with `onion_sk_` but is unknown, cut short, revoked or expired; or `Bearer` is empty. |
| `403` | `session_required` | Account management route. |

A header value that does not start with `onion_sk_` (and is not empty or a prefix of it) is ignored by the HTTP API and the request is treated as anonymous: submissions are refused (`403 recaptcha_failed`), reads of your requests return `404`.

The MCP server treats an empty `Bearer` as no key and serves the request anonymously.

## Revoking

Delete the key in the dashboard. The HTTP API refuses it immediately; the MCP server, which caches key checks, within 60 seconds.
