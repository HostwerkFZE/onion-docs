---
title: API reference
description: Base URL, authentication, the JSON:API format, pagination and the machine-readable spec.
---

The Onion HTTP API is a JSON:API service over HTTPS. Everything a key can do is on these pages; the complete, machine-readable description is the [OpenAPI spec](#openapi).

## Base URL

```text
https://user.onion4.ai/api/v1
```

## Authentication

Send your [API key](/getting-started/api-keys/) as a bearer token on every call:

```http
Authorization: Bearer onion_sk_...
```

A key does the work — submit, read, watch, judge. Account management (keys, plan, settings) is dashboard-only and answers `403 session_required` to a key.

## Format

Requests and responses use [JSON:API v1.1](https://jsonapi.org/format/), media type `application/vnd.api+json`:

```json
{ "data": { "type": "parse-requests", "id": "6f1c…", "attributes": { "status": "ready", … } } }
```

- Attribute names are **kebab-case**: `created-at`, `data-found`, `download-url`.
- Request attributes are **closed**: a name the endpoint does not know is `422` with a pointer at it, never ignored.
- Errors are JSON:API error objects — see [Errors](/api/errors/).

## Endpoints

| | | |
|---|---|---|
| <span class="method post">POST</span> | `/parse-requests` | [Submit a URL and an instruction](/api/parse-requests/#submit) |
| <span class="method get">GET</span> | `/parse-requests` | [Your request history](/api/parse-requests/#list) |
| <span class="method get">GET</span> | `/parse-requests/{id}` | [One request's status](/api/parse-requests/#status) |
| <span class="method get">GET</span> | `/parse-requests/{id}/result` | [The result](/api/parse-requests/#result) |
| <span class="method get">GET</span> | `/parse-requests/{id}/events` | [The pipeline's stages](/api/parse-requests/#events) |
| <span class="method get">GET</span> | `/parse-requests/{id}/artifacts` | [Everything the crawl stored](/api/parse-requests/#artifacts) |
| <span class="method ws">WS</span> | `/ws?request-id={id}` | [Live status](/api/websocket/) |
| <span class="method post">POST</span> | `/feedback` | [Judge an answer](/api/feedback/) |
| <span class="method get">GET</span> | `/me` | [Your plan and limits](/api/account/#me) |
| <span class="method get">GET</span> | `/activity` | [Your history, counted](/api/account/#activity) |
| <span class="method get">GET</span> | `/plans` | [The plan catalogue](/api/account/#plans) |

## Pagination

Lists are cursor-paginated, newest first. Follow `links.next` as it is — it carries the cursor, the page size and every filter you gave — until it is absent.

## OpenAPI

The API serves its own description, and a test compares it with the router on every build, so it cannot drift from what the service does:

- [Swagger UI](https://user.onion4.ai/api/v1/docs)
- [`openapi.yaml`](https://user.onion4.ai/api/v1/openapi.yaml) · [`openapi.json`](https://user.onion4.ai/api/v1/openapi.json) — for client generators
