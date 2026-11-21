---
title: Writing instructions
description: How input is parsed into a URL and an instruction, its size limit, and which URLs are refused.
---

`input` holds one URL and the instruction for it:

```json
{ "data": { "type": "parse-requests", "attributes": {
  "input": "https://example.com extract the page title and the first paragraph, return the result in json"
} } }
```

## Parsing

- The URL is the one substring matching `http://…` or `https://…` (lowercase scheme), up to the first whitespace or `<`, `>`, `"`, `'`. It can stand anywhere in the text.
- Trailing `.` `,` `;` `:` `!` `?` `)` `]` `}` `"` `'` are not part of the URL.
- The instruction is the rest of the text, trimmed.
- Zero URLs, or more than one (the same URL twice included): `422 validation_error`.
- No instruction: the default instruction "Return the raw HTML source of the page." is used.

The instruction is passed to the extraction step as written. The format of the result follows it: say "return the result in json", "as CSV", "as Markdown". For a fixed structure use [`result-schema`](/guides/results/#structured-extraction).

## Size limit

The instruction is limited by the plan's prompt size, counted in characters:

| Free | Basic | Pro | Ultimate |
|---|---|---|---|
| 256 | 1,024 | 4,096 | 8,192 |

A longer instruction: `422 validation_error`, "instructions are longer than your plan allows".

## Refused URLs

Refused with `422 validation_error` before the request is stored or counted:

- not `http` or `https`; unparseable; no host; credentials in the URL (`user:pass@`);
- a host without a dot; a numeric host that is not a plain IP address (`2130706433`, `0x7f000001`);
- `localhost` and names ending in `.localhost`, `.local`, `.internal`, `.home.arpa`, `.localdomain`;
- an IP address — given directly or among the addresses the hostname resolves to — that is loopback, private, link-local, unspecified, multicast, carrier-grade NAT (`100.64.0.0/10`), or reserved (`192.0.0.0/24`, `198.18.0.0/15`, `240.0.0.0/4`), including IPv6 forms of these.

If the hostname does not resolve at submission time, the request is accepted and the crawler decides.
