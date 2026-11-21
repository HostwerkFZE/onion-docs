---
title: Tools
description: Parameters and outputs of the Onion MCP tools.
---

| Tool | |
|---|---|
| [`extract`](#extract) | Submit; returns a job id. |
| [`extract_and_wait`](#extract_and_wait) | Submit (or attach to a job) and wait up to 120 s. |
| [`extract_status`](#extract_status) | Status of a job. |
| [`extract_result`](#extract_result) | Outcome of a job. |
| [`extract_progress`](#extract_progress) | Pipeline events of a job. |
| [`feedback`](#feedback) | Verdict on a result. |
| [`whoami`](#whoami) | Anonymous or authenticated; the plan's entitlements. |

## extract

| Parameter | Type | |
|---|---|---|
| `prompt` | string | The instruction. May contain the URL. Limited by the plan's prompt size (anonymous: 8,192 characters). |
| `url` | string | The page. Optional if `prompt` contains exactly one http(s) URL. Without `prompt`, the raw HTML of the page is returned. |
| `mode` | `fast` \| `full` | Default `fast`. [Crawl options](/guides/crawl-options/#mode) |
| `result_schema` | object | JSON Schema for the result. Requires a key. |
| `output_format` | `markdown` \| `text` \| `json` \| `table` \| `csv` \| `schema` | Requires a key. Adds a format sentence to the instruction. [Results](/guides/results/#data) |
| `idempotency_key` | string, 8–128 | Resubmitting with the same key returns the original job. |

Output: `job_id`, `status`, `url`, `mode`, `note`.

## extract_and_wait

The `extract` parameters, plus:

| Parameter | Type | |
|---|---|---|
| `wait_seconds` | integer | Default 60, maximum 120. |
| `job_id` | string | Wait for an existing job instead of submitting. |

Output: as `extract_result`. If the job has not finished in time — its current status (`queued` or `processing`) and `job_id`; the job continues. When too many waits are open on the server, the call returns immediately with the job id and a `note`.

## extract_status

Input `job_id`. Output `job_id`, `status` (`queued`, `processing`, `ready`, `failed`), `url`, `mode`.

## extract_result

Input `job_id`.

| Field | |
|---|---|
| `job_id`, `status` | |
| `data_found` | `true` — data extracted; `false` — not, see `reason`. `null` until finished. |
| `reason` | Why nothing was found. |
| `block_class` | Classification of a blocked final page. [Fields](/guides/results/#fields) |
| `http_status`, `rendered` | Status of the final page; whether it was rendered in a browser. |
| `content_type`, `download_url` | The data; the link is valid for 5 minutes. |
| `inline` | The data itself when it is JSON or text up to 64 KB (JSON parsed, text as a string). Best effort. |
| `error`, `error_code` | For a `failed` job. |
| `note` | Hint for the agent. |

## extract_progress

Input `job_id`. Output: `job_id`, `status`, `phase`, `events` (the pipeline events: `queued`, `crawling`, `crawl_job.succeeded`, `extracting`, …), `note`. See [Events](/guides/request-lifecycle/#events).

## feedback

| Parameter | Type | |
|---|---|---|
| `verdict` | `helpful` \| `incomplete` \| `wrong` \| `unusable` | Required. |
| `job_id` | string | Optional; without it the feedback is about the service. |
| `detail` | string, up to 4096 bytes | Required unless `verdict` is `helpful`. |

Output: `feedback_id`, `note`.

## whoami

No parameters. Output: `authenticated`, `user_id` (with a key), `entitlements` (the plan's services), `note`.
