---
sidebar_position: 3
---

# Monitoring and Observability

| Attribute        | Value                       |
| ---------------- | --------------------------- |
| **Project**      | DevWorkWire                 |
| **Version**      | 0.1                         |
| **Status**       | Draft                       |

## Table of Contents

- [1. Monitoring Strategy](#1-monitoring-strategy)
- [2. Logging Approach](#2-logging-approach)
- [3. Correlation Instead of Distributed Tracing](#3-correlation-instead-of-distributed-tracing)
- [4. What "Good" Looks Like Locally](#4-what-good-looks-like-locally)
- [5. Failure Surfacing Instead of Alerting](#5-failure-surfacing-instead-of-alerting)
- [6. Performance Monitoring](#6-performance-monitoring)
- [7. Observability in the Delivery Workflow](#7-observability-in-the-delivery-workflow)
- [8. Data Privacy and Security in Observability](#8-data-privacy-and-security-in-observability)
- [9. Cost Management](#9-cost-management)
- [Source References](#source-references)

## 1. Monitoring Strategy

**The user is the monitor.** Every operation is initiated by a person or their agent, who is
present for its outcome. There is no unattended process to watch, no availability to
measure, and no on-call rotation.

| Concern | Approach | Rationale |
| ------- | -------- | --------- |
| Error tracking | **None.** Errors are surfaced to the user at the point of use | A Sentry DSN in a local CLI would ship users' tracker content and stack traces to a third party without meaningful consent |
| Metrics | **None collected or exported** | Nothing runs unattended; there is no aggregate to compute |
| Log aggregation | **None.** Logs stay on the user's machine, on stderr | Aggregating them would require exfiltration |
| Usage analytics | **None, and none planned** | Users of a credential-holding developer tool should be able to verify it makes no unexpected network connections |
| Release health | Community reports, GitHub issues, dependency alerts | The realistic detection channel for open-source software |

**The one outbound connection DevWorkWire makes is to the configured Jira base URL.** No
update checks, no phone-home, no crash reporting. This claim should be verifiable by anyone
watching the process, and it should be stated in the README — it is a feature.

**What this costs, stated honestly:** there is no way to know how many users are on a broken
version, no aggregate error rates to spot a regression, and no signal that a release is bad
until someone reports it. That is the accepted price of not instrumenting users, and it is
why the pre-release gates in [CI/CD Pipeline](./ci-cd-pipeline.md) carry the weight that
post-deploy monitoring would carry elsewhere.

## 2. Logging Approach

- **Destination: stderr, always.** stdout is the MCP protocol channel — anything else
  written there corrupts the JSON-RPC stream. This is enforced by a test, not by
  convention, because a stray `print()` breaks the server
  ([Interface Design Standards](../interfaces/interface-standards.md)).
- **Format:** human-readable by default; `--log-format=json` for structured output when
  attaching logs to a bug report. Fields: `timestamp`, `level`, `message`, `run_id`,
  `version`.
- **Levels:**

  | Level | Use |
  | ----- | --- |
  | `ERROR` | The operation failed. Always shown |
  | `WARNING` | Proceeding, but the user should know — drift detected, item skipped, Jira retry |
  | `INFO` | Default: what is being done and what happened |
  | `DEBUG` | `--verbose`: Jira request/response metadata (method, path, status, timing — **never** headers or bodies), parse and validation detail, timing |

- **Verbosity is user-controlled** (`--quiet` / `--verbose`), defaulting to a level that
  reports outcomes without narrating internals.
- **Retention is the user's.** Nothing is written to a log file unless the user redirects
  output; DevWorkWire creates no log files of its own to grow unbounded on their disk.
- **Redaction is enforced by a logging filter**, not by call-site discipline — see
  [§8](#8-data-privacy-and-security-in-observability).

## 3. Correlation Instead of Distributed Tracing

There are no services to trace across: one process, one call stack, one outbound host.

What is needed instead is **correlation within a single run**, so a user reporting a problem
can hand over one identifier that ties everything together:

- **`run_id`** — generated per CLI invocation or per MCP tool call. Logged on every record,
  returned in every result and error, and stored on `commit_run`
  ([Database Design](../database/database-design.md)).
- **`preview_handle`** — ties a commit back to the plan that authorized it, which is the
  correlation that matters most when investigating an unexpected write.
- **`idempotency_key`** — ties retries of the same commit together.

**Practical goal:** a user pastes a `run_id` and the `--verbose` output into an issue, and
the maintainer can reconstruct what happened without asking follow-up questions. That is
the entire observability requirement.

## 4. What "Good" Looks Like Locally

These are qualities verified by tests and review, not measured in production:

| Property | What it means | How it is verified |
| -------- | ------------- | ------------------ |
| Errors identify the item | A validation failure names the Story and the problem, not "validation failed" ([FR-001-02](../../01-requirements/f-001-validate-preview-commit.md)) | Tests asserting error message content |
| Errors identify the fix | A config error names the missing field ([FR-008-03](../../01-requirements/f-008-provider-auth-configuration.md)); a Jira 403 says which permission | Tests + review |
| All problems reported at once | A document with three faults produces three errors, not the first one | Test with a multi-fault document |
| Commit outcome is unambiguous | Committed / failed / untried are distinct ([FR-001-06](../../01-requirements/f-001-validate-preview-commit.md)); `result_type` distinguishes preview from write ([NFR-004-01](../../01-requirements/f-004-mcp-tool-surface.md)) | Schema tests |
| Preview is readable at 80 columns | ([NFR-003-01](../../01-requirements/f-003-cli-dwire-flow.md)) | Manual review against a representative document |
| State is signalled by text, not color | Errors and warnings carry text prefixes ([NFR-X06](../../01-requirements/README.md#cross-cutting-quality-baseline)) | Manual review; non-TTY output check |
| Retries are visible | A Jira 429 backoff says so rather than appearing as a hang | Test with a mocked 429 |
| Failures are never silent | No operation exits 0 having partially failed; exit code `4` exists specifically for partial commits | Exit-code tests |

## 5. Failure Surfacing Instead of Alerting

There is nobody to page and no channel to route to. The equivalent is making the right
thing impossible to miss at the moment it happens:

| Condition | Surfaced as |
| --------- | ----------- |
| Validation failed | Blocking error listing every problem; exit `1`; no preview generated |
| Config or credentials invalid | Blocking error naming the field; exit `2`; **before** any Jira call |
| Drift detected on a matched item | Warning in the preview, and an explicit per-item overwrite/skip the user must answer ([FR-002-04](../../01-requirements/f-002-dedup-on-rerun.md)) |
| Jira rate limited | Warning during backoff, so a slow run is legible rather than looking hung |
| Jira permission denied | Blocking error naming the operation and issue; exit `3` |
| Partial commit (fail-fast) | Prominent summary of committed / failed / untried, with the retry instruction; **exit `4`**, distinct from success and from total failure |
| Interrupted prior run detected | `COMMIT_INTERRUPTED` with what is known — never a fabricated replay result |

Exit code `4` is the closest thing to an alert this system has: "some of your items are now
in Jira" is operationally different from "nothing happened", and a script or agent must be
able to tell them apart without parsing prose
([Interface Design Standards](../interfaces/interface-standards.md#exit-codes)).

## 6. Performance Monitoring

No frontend, no backend service, no database server — Core Web Vitals, endpoint latency
distributions, connection pool stats, and query performance monitoring are all **Not
Applicable**.

- **`--verbose` reports timings**: parse, validation, per-Jira-call duration, and total run
  time. Enough for a user to see where a slow run went, and to include it in a report.
- **Latency is dominated by Jira round-trips**, not local computation. A commit is N
  sequential REST calls; parsing is milliseconds
  ([Technology Stack](../core/technology-stack.md)).
- **Retry counts are surfaced**, so "Jira is throttling you" is distinguishable from
  "DevWorkWire is slow" — the distinction that determines whether a user files a bug.
- **[NFR-X04](../../01-requirements/README.md#cross-cutting-quality-baseline) is still
  `TBD`.** No latency target is committed. If one is set, the measurement point should be
  local processing time excluding Jira round-trips, since the latter is not something
  DevWorkWire controls.
- **CI tracks test-suite duration** as the only ongoing performance signal, because that is
  the only environment the project can measure.

## 7. Observability in the Delivery Workflow

- **The version is in every log line and in `dwire --version`.** With no telemetry, the
  version a user reports is the only way to know what code produced a failure — so it must
  be trivially available.
- **`run_id` is in every result and error**, so an issue report contains a correlatable
  identifier without the user knowing to ask for one.
- **A bug report template** should request: `dwire --version`, the platform and Python
  version, the `run_id`, and `--verbose` output — with a reminder that output is safe to
  share because the token is redacted.
- **`SECURITY.md` and issue reporting must be easy to find.** Community reporting is the
  actual detection channel for a bad release, so friction there is a monitoring gap, not a
  documentation nicety ([Security Architecture](../security/security-architecture.md#security-monitoring-and-incident-response)).
- **CI is where signals are collected**: test results, coverage trend, `pip-audit` findings,
  and CodeQL alerts. This is the project's real dashboard.
- **Release checklist** includes a manual verification pass against a real Jira project,
  covering the gap that mocked adapter tests leave
  ([CI/CD Pipeline](./ci-cd-pipeline.md#9-environment-strategy)).

## 8. Data Privacy and Security in Observability

This section is short because the strongest privacy control is having no observability
pipeline at all — there is no ingestion endpoint, no vendor, and no retention policy to get
wrong.

- **Nothing leaves the user's machine.** No error reports, no metrics, no analytics.
- **The Jira API token and `Authorization` header are redacted at every verbosity level**,
  enforced by a logging filter rather than by remembering at each call site. A test asserts
  the token never appears in captured output at maximum verbosity
  ([NFR-008-01](../../01-requirements/f-008-provider-auth-configuration.md)).
- **Raw Jira request and response bodies are never logged**, even under `--debug`. Metadata
  only: method, path, status, duration.
- **Issue content is logged only where the user needs to see it** — a preview line, a
  validation error naming an item. Not dumped wholesale.
- **DevWorkWire creates no log files.** Persisting logs is the user's explicit choice via
  shell redirection, so no unexpected file accumulates tracker content on their disk.
- **Output is safe to paste into a public issue.** This should be true by construction, and
  the bug report template should say so — otherwise users either over-redact and file
  useless reports, or under-redact and leak.

## 9. Cost Management

**Zero, and structurally so.** No observability vendor, no ingestion volume, no retention
tier, no sampling to tune, no free-tier limit to approach, no spend alert to configure.

The only cost is maintainer attention on GitHub issues and dependency alerts — which is the
project's genuinely scarce resource
([Phased Roadmap](../../02-planning/phased-roadmap.md) single-developer risk), and the
reason the tooling here stays deliberately minimal.

## Source References

- [CI/CD Pipeline](./ci-cd-pipeline.md)
- [Deployment Architecture](./deployment-architecture.md)
- [Security Architecture](../security/security-architecture.md)
- [Interface Design Standards](../interfaces/interface-standards.md)
- [Architecture Solution Design](../core/architecture-solution-design.md)
- [ADR Decision Log](../../04-decisions/README.md)

---

**Last Updated**: 2026-09-01
