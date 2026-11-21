---
title: Crawl options
description: mode, device and os, location.
---

| Attribute | Values | Plan |
|---|---|---|
| `mode` | `fast` (default), `full` | every plan |
| `device` + `os` | `desktop` with `win`, `linux`, `macos`; `mobile` with `android`, `ios` | Basic and up |
| `location` | two-letter country code | Ultimate; chosen for you on Pro and up |

An attribute name the API does not know is refused with `422`, with `source.pointer` naming it.

## mode

- `fast` — open the page with minimal JavaScript.
- `full` — also scroll, load lazy content and run the page's scripts.

```json
"mode": "full"
```

## device and os

```json
"device": "mobile", "os": "ios"
```

Both or neither. Valid pairs: `desktop` with `win`, `linux`, `macos`; `mobile` with `android`, `ios`. A single value or an invalid pair: `422 validation_error`, on every plan. A valid pair on the Free plan: `403 forbidden_entitlement`, `meta.required-service: platform_selection`.

## location

The country the crawl is made from.

```json
"location": "DE"
```

- Below Ultimate, any value: `403 forbidden_entitlement`, `meta.required-service: geo_routing`.
- On Ultimate: two letters, either case, stored uppercase; anything else is `422`. The code is not checked against a country list here — one the crawler does not accept makes the request `failed`.

### Chosen for you

On Pro, Ultimate and Enterprise, a request without `location` is crawled from the country of the site's national domain — `.de` → `DE`, `.co.uk` → `GB` — when the crawler has an exit there: US, GB, DE, FR, JP, RU. The request then shows that `location`. Other sites (`.com`, `.io`, national domains outside the list) are crawled without one. An explicit `location` always wins.
