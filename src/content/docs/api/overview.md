---
title: API reference
description: Base URL, authentication, format, pagination and the OpenAPI spec.
---

## Base URL

```text
https://user.onion4.ai/api/v1
```

## Authentication

```http
Authorization: Bearer onion_sk_...
```

A request without the header is anonymous. An anonymous submission through the API is refused (`403`); see [Errors](/api/errors/). Account management (keys, plan, settings) is dashboard-only and answers `403 session_required` to a key.

## Format

[JSON:API v1.1](https://jsonapi.org/format/), media type `application/vnd.api+json`. Attribute names are kebab-case: `created-at`, `data-found`, `download-url`.

`POST /parse-requests` refuses attribute names it does not know with `422` and a `source.pointer` to the attribute.

## Endpoints

| | | |
|---|---|---|
| <span class="method post">POST</span> | `/parse-requests` | [Submit](/api/parse-requests/#submit) |
| <span class="method get">GET</span> | `/parse-requests` | [History](/api/parse-requests/#list) |
| <span class="method get">GET</span> | `/parse-requests/{id}` | [Status](/api/parse-requests/#status) |
| <span class="method get">GET</span> | `/parse-requests/{id}/result` | [Result](/api/parse-requests/#result) |
| <span class="method get">GET</span> | `/parse-requests/{id}/events` | [Events](/api/parse-requests/#events) |
| <span class="method get">GET</span> | `/parse-requests/{id}/artifacts` | [Artifacts](/api/parse-requests/#artifacts) |
| <span class="method ws">WS</span> | `/ws?request-id={id}` | [Live status](/api/websocket/) |
| <span class="method post">POST</span> | `/feedback` | [Feedback](/api/feedback/) |
| <span class="method get">GET</span> | `/me` | [Account](/api/account/#me) |
| <span class="method get">GET</span> | `/activity` | [Activity](/api/account/#activity) |
| <span class="method get">GET</span> | `/plans` | [Plans](/api/account/#plans) |

Other routes (bundles, payments, account events, support) are listed in the OpenAPI spec.

## Pagination

Lists are cursor-paginated, newest first. `links.next` is present while there is a next page and carries the cursor, page size and filters.

## OpenAPI

- [Swagger UI](https://user.onion4.ai/api/v1/docs)
- [`openapi.yaml`](https://user.onion4.ai/api/v1/openapi.yaml), [`openapi.json`](https://user.onion4.ai/api/v1/openapi.json)

A test checks that the spec lists exactly the routes the service serves.
