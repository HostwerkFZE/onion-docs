---
title: API keys
description: Create, name and delete keys, and what a key can and cannot do.
---

An API key identifies your account to the HTTP API and to the MCP server. It looks like `onion_sk_…` and travels in the `Authorization` header:

```http
Authorization: Bearer onion_sk_...
```

## Create a key

1. Sign in to the [dashboard](https://user.onion4.ai/) and open **API keys**.
2. Give the key a name that says where it will live — `billing-cron`, `claude-desktop` — and create it.
3. Copy the key into the environment of the program that will use it.

You can open and copy a key from the list whenever you need it again.

## Many keys, one account

An account can hold up to **100** keys. Give each program its own: they all reach the same account, share its [plan and limits](/getting-started/plans/) and land in the same request history — but each one can be deleted without touching the others, and the list shows, for every key, how many requests it made on each of the last 14 days. A key nobody has used for two weeks is easy to spot.

A key created in the dashboard does not expire. It works until you delete it.

## What a key cannot do

A key does the work — submitting requests, reading statuses and results, watching them live, sending feedback — but it **does not manage the account**. Creating or deleting keys, changing the plan, changing settings and deleting the account are dashboard-only; with a key those calls answer `403`.

That is deliberate. A key lives in config files and environment variables, and if one leaks it should cost you a bill, not your account.

## When a key leaks

Delete it in the dashboard and create a new one. The deleted key is refused by the API at once; the MCP server, which remembers a key's answer briefly, stops accepting it within a minute.

## Errors you may see

| Status | Code | Meaning |
|---|---|---|
| `401` | `unauthenticated` | The key was sent but does not resolve: mistyped, cut short, or deleted. Onion never quietly treats a bad key as "no key". |
| `403` | `session_required` | The call manages the account; make it from the dashboard. |
| `409` | `key_limit_reached` | You already have 100 keys. Delete one you no longer use. |

:::caution[An empty variable is still a credential]
If `$ONION_API_KEY` is unset, `Authorization: Bearer ` goes out with nothing after it — and is refused with `401`, not run anonymously. That is on purpose: otherwise your requests would quietly land outside your account.
:::
