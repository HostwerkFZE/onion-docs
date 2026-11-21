---
title: MCP server
description: Onion as Model Context Protocol tools — what an agent gets, with and without a key.
---

The Onion MCP server gives an AI agent the same ability the API gives your code: a URL plus an instruction in plain language in, structured data out — through the bot-defended web. Any client that speaks the [Model Context Protocol](https://modelcontextprotocol.io/) over **Streamable HTTP** can use it.

```text
https://mcp.onion4.ai/mcp
```

[Connect a client →](/mcp/clients/)

## With a key, or without

A key is optional, and the server takes that literally.

| | Without a key | With a key |
|---|---|---|
| Who you are | an anonymous visitor, like the public playground | your account |
| Limits | the anonymous tier, counted by address | your [plan](/getting-started/plans/) |
| History | — | every request in your request history, marked `mcp` |
| Structured output (`result_schema`), `output_format` | — | ✓ |

Send the key as `Authorization: Bearer onion_sk_…`. Some agent runtimes can only set a custom header; `X-API-Key: onion_sk_…` works too.

A **missing** key is not an error — you get the anonymous product. A **bad** one is: a mistyped, cut-short or deleted key is refused, never quietly treated as anonymous.

## How it handles your key

- **Every call is checked on its own.** The server keeps no session: the key on each request is the key that request runs as. Deleting a key in the dashboard stops it within a minute, on every connection, including one that is open.
- **The server stores no keys.** It asks the account service whether a key is live and what its plan allows, and remembers the answer briefly — under a hash of the key, never the key itself.
- **Limits live with the plan, not the key.** All your keys and the HTTP API share one rate limit and one set of slots.

## Submit, then read

An extraction is a crawl plus a language-model pass — seconds to minutes. So the tools follow the API's shape: `extract` submits and returns a job id in milliseconds; `extract_result` reads the outcome. `extract_and_wait` does both for convenience, waiting up to two minutes — and if the job takes longer, it returns the job id and the work carries on.

Outcomes are not collapsed into errors. "The page had nothing to give", "the site refused us" and "the crawl failed" are three different answers, and only the last is an error — an agent that cannot tell them apart retries things that will never succeed.

[All tools →](/mcp/tools/)
