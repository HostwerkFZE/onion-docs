---
title: Introduction
description: What Onion does, the ways to reach it, and the request flow.
---

Onion extracts data from a webpage: you send a URL and an instruction in plain language ("extract product names, prices and availability"), Onion crawls the page, applies the instruction with a language model and returns the result.

## Access

| | For | Credential |
|---|---|---|
| [HTTP API](/getting-started/quickstart/) | your code | API key |
| [MCP server](/mcp/overview/) | AI agents (Claude, Cursor, other MCP clients) | API key, or none |
| [Dashboard](https://user.onion4.ai/) | a person in the browser | session |
| [Playground](https://onion4.ai/) | trying it without an account | none |

Requests made with a key or a session belong to the account: they appear in its request history and count against its plan. Requests without credentials (the playground, MCP without a key) are anonymous: limited per IP address and not stored in any account.

Keys, plan, settings, password and two-factor authentication are managed only in the dashboard.

## Request flow

1. Submit a URL and an instruction. The answer is an `id` and the status `queued`.
2. When the plan has a free slot, the request becomes `processing`: the page is fetched or rendered and the instruction applied.
3. The request ends as `ready` with a result, or `failed` with a reason.

The result is read separately: by polling, over a WebSocket, or through an MCP tool that waits. See [Waiting for results](/guides/waiting/).

`ready` does not always mean data was found: the result's `data-found` can be `false`, with a `reason`. See [How a request works](/guides/request-lifecycle/#outcomes).

## Next

- [Quickstart: HTTP API](/getting-started/quickstart/)
- [Quickstart: AI agents](/getting-started/agents/)
- [Writing instructions](/guides/instructions/)
