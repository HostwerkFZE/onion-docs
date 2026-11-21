---
title: Tools
description: The seven tools of the Onion MCP server — parameters, answers and when to use each.
---

| Tool | What it does |
|---|---|
| [`extract`](#extract) | Submits an extraction; returns a job id in milliseconds. |
| [`extract_and_wait`](#extract_and_wait) | Submits and waits for the outcome, up to two minutes. |
| [`extract_status`](#extract_status) | Cheap status read. |
| [`extract_result`](#extract_result) | The authoritative outcome. |
| [`extract_progress`](#extract_progress) | The stages a job has been through. |
| [`feedback`](#feedback) | Report how an extraction actually turned out. |
| [`whoami`](#whoami) | Anonymous or authenticated, and what the plan allows. |

## `extract`

Submits an extraction and returns at once. Give a URL and an instruction in plain language; a bare URL with no instruction returns the page itself.

| Parameter | | |
|---|---|---|
| `prompt` | string | What to extract, in plain language. May contain the URL. Counts against the plan's prompt size. |
| `url` | string | The page. Optional when `prompt` contains exactly one http(s) URL. |
| `mode` | `fast` \| `full` | `fast` (default) opens the page; `full` also scrolls and runs scripts for lazy content. |
| `result_schema` | object | A JSON Schema the answer must follow. Needs a key. |
| `output_format` | `markdown` \| `text` \| `json` \| `table` \| `csv` \| `schema` | The format you want. Needs a key. |
| `idempotency_key` | string | Resubmitting with the same key returns the original job instead of starting a second one. |

```json title="Answer"
{ "job_id": "6f1c…", "status": "queued", "url": "https://onion4.ai/products", "mode": "fast",
  "note": "Read the outcome with extract_result once the status is ready or failed." }
```

## `extract_and_wait`

The same parameters as `extract`, plus:

| Parameter | | |
|---|---|---|
| `wait_seconds` | integer | How long to wait. Default 60, maximum 120. |
| `job_id` | string | Wait on a job that is already running instead of submitting a new one. |

It answers like [`extract_result`](#extract_result). If the job is not done in time, the answer is `status: "processing"` with the job id — the work continues, and `extract_result` reads it later. When the server is holding many waits at once, it may answer straight away with the job id and a note to poll; that is not an error either.

## `extract_status`

`job_id` in; `queued`, `processing`, `ready` or `failed` out. Use it to poll cheaply.

## `extract_result`

`job_id` in; the outcome out.

| Field | Meaning |
|---|---|
| `status` | `queued`, `processing`, `ready` or `failed`. |
| `data_found` | `true` — the data is here. `false` with a `reason` — a **successful** crawl of a page that held nothing matching, not an error. |
| `block_class` | Set when the site refused the crawl. A reported outcome: retrying the same way will usually be refused the same way. |
| `http_status`, `rendered` | What the crawl saw, and whether the page went through a browser. |
| `inline` | The data itself, when it is text and small (up to 64 KB). |
| `download_url`, `content_type` | A short-lived link to the data, for anything larger. |
| `error`, `error_code` | Why a `failed` job failed. |

## `extract_progress`

`job_id` in; the stages the job has been through — planning, crawling, extracting, the turns of the extraction loop. Use it on a job that is taking a while: it tells "still working" from "stuck". It is not the outcome; that is `extract_result`.

## `feedback`

Report how an extraction actually turned out, once you have tried to use it. The agent is the only party that can tell the data was stale, answered a different question, or that "no data" was wrong because the page plainly has it.

| Parameter | | |
|---|---|---|
| `verdict` | `helpful` \| `incomplete` \| `wrong` \| `unusable` | Required. |
| `job_id` | string | The extraction this is about. Leave it out for feedback about the service in general. |
| `detail` | string | What was wrong and what you expected instead. Required unless the verdict is `helpful`. |

## `whoami`

No parameters. Says whether the session is anonymous or authenticated and, with a key, what the plan allows — call it before using a plan-gated option, or just send one and read the refusal, which names what would unlock it.
