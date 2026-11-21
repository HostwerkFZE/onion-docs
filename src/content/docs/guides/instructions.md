---
title: Writing instructions
description: How to put the URL and the instruction into input, and how to phrase the instruction so the answer is the one you need.
---

Everything you ask of Onion goes into one field, `input`: **exactly one** `http(s)` URL and, around it, what you want from that page, in plain language.

```json
{ "data": { "type": "parse-requests", "attributes": {
  "input": "https://onion4.ai/products extract product names, prices and availability"
} } }
```

The URL can stand anywhere in the text — first, last, or in the middle of a sentence ("Extract the price from https://shop.example.com/p/1"). Punctuation right after it is not part of it. Separating the two with a blank line reads well in code:

```json
"input": "https://example.com/page\n\nExtract the title."
```

- **No URL, or two of them**, is refused with `422`: one request reads one page.
- **A URL alone**, with no instruction, returns the raw HTML of the page.

## Say what you want back

The instruction is read by a language model, so write it the way you would brief a person who has never seen the page:

- **Name the fields.** "product name, price, currency and whether it is in stock" beats "product info".
- **Say which items.** "every product in the grid", "only the first table", "the three most recent posts".
- **Say how to write values.** "prices as numbers without the currency sign", "dates as YYYY-MM-DD".
- **Say what to do when something is missing.** "use null when a price is not shown".
- **Say the format.** "return the result in json", "as a CSV table", "as Markdown" — or pin the structure down exactly with a [`result-schema`](/guides/results/#structured-extraction).

```text title="A vague instruction"
https://example.com/catalog  get the products
```

```text title="One that gets you the same answer every time"
https://example.com/catalog
Extract every product in the main grid: name, price as a number, currency code,
and in_stock as true or false. Use null for a price that is not shown.
Return the result in json.
```

## How long it can be

The instruction — `input` without its URL — counts against your plan's **prompt size**, in characters: 256 on Free, 1,024 on Basic, 4,096 on Pro, 8,192 on Ultimate. Every character counts as one, whatever the alphabet. A longer instruction is refused with `422` before anything runs. See [Plans and limits](/getting-started/plans/).

## URLs Onion will not open

Onion crawls the public web. A URL that points inward is refused with `422 validation_error` before anything is counted or stored:

- loopback, private, link-local and other reserved addresses — written literally, or what the hostname resolves to;
- `localhost`, and names ending in `.local` or `.internal`;
- hostnames without a dot;
- numeric hosts that are not a plain IP address;
- URLs with credentials in them (`https://user:pass@…`).

## When the answer is "nothing found"

If the page does not hold what you asked for, the request is `ready` with `data-found: false` and a `reason`. Read the reason: it often names what the page holds instead. Then change the instruction — or check that the URL is the page you meant: `final-url` says where the crawl ended up after redirects.
