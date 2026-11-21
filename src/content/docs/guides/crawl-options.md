---
title: Crawl options
description: Fast or full crawls, the device and OS to crawl as, and the country a crawl leaves from.
---

Most requests need nothing but `input`. These attributes change how the page is crawled when a site needs it.

| Attribute | Values | Plan |
|---|---|---|
| `mode` | `fast` (default), `full` | every plan |
| `device` + `os` | `desktop` with `win`, `linux`, `macos`; `mobile` with `android`, `ios` | Basic and up |
| `location` | a country code, `DE`, `us`, … | Ultimate |

An attribute Onion does not know is refused with `422`, never silently dropped — so a typo cannot quietly turn into a default crawl.

## Fast or full

`fast` opens the page and reads it. `full` also scrolls and lets the page's scripts run, for content that loads lazily — infinite feeds, "load more" lists, prices drawn after the page appears. Start with `fast`; switch to `full` when the result says the data was not there and the page plainly has it.

```json
{ "data": { "type": "parse-requests", "attributes": {
  "input": "https://example.com/feed  the titles of the latest 30 posts",
  "mode": "full"
} } }
```

## Device and OS

Mobile sites and touch layouts answer differently, and some defences trip for one platform and not the other. Name the pair to crawl as:

```json
"device": "mobile", "os": "ios"
```

Both go together, and only five pairs exist: `desktop` with `win`, `linux` or `macos`; `mobile` with `android` or `ios`. One without the other, or a pair that does not exist (`mobile` with `win`), is `422 validation_error` on every plan. On the Free plan a valid pair is `403 forbidden_entitlement`, with `meta.required-service: platform_selection`.

## Location

The country a crawl leaves from changes prices, languages and what a site is willing to show. On **Pro**, Onion picks it to suit the site. On **Ultimate** you can name it:

```json
"location": "DE"
```

An ISO 3166-1 alpha-2 code, in either case. Anything that is not two letters is `422`; naming a country below Ultimate is `403 forbidden_entitlement`.
