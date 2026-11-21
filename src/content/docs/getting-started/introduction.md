---
title: Introduction
description: What Onion does, the three ways to reach it, and what happens to a request.
---

Onion extracts data from webpages. You give it a **URL** and an **instruction in plain language** — "extract product names, prices and availability" — and it gives you back the data, in the format you asked for.

Behind that one call Onion opens the page (rendering it when the content is drawn by scripts), gets past the defences that turn ordinary scrapers away, and reads the page with a language model that follows your instruction. You do not write selectors, run browsers or rotate proxies.

## Three ways in, one product

| Door | Who it is for | Credential |
|---|---|---|
| [HTTP API](/getting-started/quickstart/) | your code: a script, a backend, a cron job | an API key |
| [MCP server](/mcp/overview/) | an AI agent: Claude, Cursor, any MCP client | an API key, or none |
| [Playground](https://onion4.ai/) and [dashboard](https://user.onion4.ai/) | a person, in the browser | none, or a session |

They are the same product. A request made through any of them lands in the same request history, counts against the same plan, and can be read, watched and judged the same way. The only things kept to the dashboard are the ones that manage the account itself: keys, plan, settings.

## What happens to a request

1. **You submit** a URL and an instruction. Onion answers at once with an `id` and the status `queued`.
2. **It runs.** When a slot of your plan is free, the request moves to `processing`: the page is fetched or rendered, and the instruction is applied to it.
3. **It settles** as `ready` — with a result you can download — or `failed`, with the reason.

Crawls take seconds to minutes, so the API never makes you hold a connection open for the whole job: you submit, then [wait for the result](/guides/waiting/) the way that suits you — poll, open a WebSocket, or let an MCP tool wait for you.

:::note[Nothing found is an answer, not an error]
A request can be `ready` and still report `data-found: false` with a `reason`: the page was read and did not contain what you asked for. That is different from a site refusing the crawl, and both are different from a failure. See [How a request works](/guides/request-lifecycle/).
:::

## What you need

- **For the API:** an account and an [API key](/getting-started/api-keys/). The [Free plan](/getting-started/plans/) is enough to start.
- **For an AI agent:** the MCP server's URL, `https://mcp.onion4.ai/mcp`. Without a key the agent gets the anonymous tier; with one it gets your plan.

## Next steps

- [Quickstart: HTTP API](/getting-started/quickstart/) — your first request with cURL, Python or JavaScript.
- [Quickstart: AI agents](/getting-started/agents/) — connect Claude or Cursor in a minute.
- [Writing instructions](/guides/instructions/) — how to ask for exactly the data you need.
