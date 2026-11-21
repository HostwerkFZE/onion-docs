---
title: MCP server
description: Onion as Model Context Protocol tools — endpoint, authentication, behaviour.
---

```text
https://mcp.onion4.ai/mcp
```

Transport: Streamable HTTP. [Connect a client](/mcp/clients/) · [Tools](/mcp/tools/)

## Authentication

The key is optional.

| | Without a key | With a key |
|---|---|---|
| Limits | anonymous, per IP address | the account's [plan](/getting-started/plans/) |
| History | not stored in an account | account history, source `mcp` |
| `result_schema`, `output_format` | refused | accepted |

Headers: `Authorization: Bearer onion_sk_…` or `X-API-Key: onion_sk_…`. No header, or an empty `Bearer`, means anonymous. An unknown, revoked or expired key is refused.

## Behaviour

- **Stateless.** No `Mcp-Session-Id`; `GET` and `DELETE` on `/mcp` answer `405`. Each `POST` is authenticated by its own headers.
- **Key checks are cached** for 60 seconds, so a deleted key stops working for new calls within a minute. An `extract_and_wait` call already running continues up to its wait limit.
- **Submit, then read.** `extract` returns a job id immediately; `extract_result` returns the outcome. `extract_and_wait` combines them with a wait of up to 120 seconds.
- **Outcomes are not errors.** "No data found" (`data_found: false`) and a blocked page (`block_class`) are results of a finished job; only a `failed` job has `error`.
