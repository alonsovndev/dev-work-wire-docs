# ADR-009: No Telemetry — Local Diagnosability Only

> **Design status:** This page includes earlier planning assumptions. The [current CLI contract](../03-architecture/interfaces/interface-contract.md) and [ADR-011](adr-011-cli-first-agent-integration.md) govern the CLI-first agent integration; MCP, SQLite preview handles, and server-side confirmation described below are not shipped.

- **Status**: Proposed
- **Date**: 2026-09-02

## Context

The Recommended Decision Areas checklist calls for a monitoring and observability decision.
For a hosted service that means picking an error tracker and a metrics backend. DevWorkWire
is neither hosted nor observable in that sense: it runs on users' machines, is invoked by a
person or their agent who is present for every outcome, and has no unattended process to
watch.

It also handles a Jira API token granting full user-level tracker access
([ADR-006](./adr-006-config-and-secrets.md)), and reads and writes the contents of a team's
backlog. Any telemetry pipeline would be exfiltrating that activity from machines the
maintainer does not own.

There is a real cost to declining. Distribution is irreversible
([ADR-007](./adr-007-packaging-and-release.md)): a published release cannot be recalled from
installed copies, and without telemetry there is no signal that one is bad.

## Decision

**Collect and export nothing.** No error tracking, no metrics backend, no log aggregation,
no usage analytics, no update checks, no crash reporting — and none planned.

**The only outbound connection DevWorkWire makes is to the configured Jira base URL.** This
should be verifiable by anyone watching the process, and stated in the README as a feature.

What replaces a monitoring stack:

- **Structured logging to stderr**, never stdout — stdout is the MCP protocol channel, and
  anything else there corrupts the JSON-RPC stream. Enforced by a test.
- **A `run_id` per CLI invocation or MCP tool call**, logged on every record, returned in
  every result and error, and stored on `commit_run`. One identifier ties a whole run
  together in a bug report.
- **Mandatory redaction via a logging filter** — the token and `Authorization` header never
  appear at any verbosity, enforced by a test rather than call-site discipline.
- **No log files created by DevWorkWire.** Persisting logs is the user's explicit choice via
  shell redirection, so nothing accumulates tracker content on their disk.
- **Failure surfacing instead of alerting:** blocking errors that name the offending item and
  the fix, and distinct exit codes — notably `4` for a partial commit, because "some of your
  items are now in Jira" is operationally different from "nothing happened".
- **Detection depends on users reporting.** `SECURITY.md` and issue reporting must therefore
  be easy to find, and output must be safe to paste into a public issue.

## Consequences

### Positive

- The strongest privacy position available: there is no ingestion endpoint, no vendor, and no
  retention policy to get wrong. [NFR-X02](../01-requirements/README.md#cross-cutting-quality-baseline)
  holds trivially at this layer.
- Users of a credential-holding developer tool can verify it makes no unexpected network
  connections — which is exactly the kind of trust this product trades on.
- Zero observability cost, and zero configuration.
- `run_id` correlation gives a reproducible bug report without the user knowing to ask for it.

### Negative

- **No way to know how many users are on a broken version**, no aggregate error rates, and no
  signal that a release is bad until someone reports it. This is the real price, and it is
  why the pre-release gates in [ADR-007](./adr-007-packaging-and-release.md) and
  [ADR-008](./adr-008-quality-toolchain-github-actions.md) carry the weight that post-deploy
  monitoring would carry elsewhere.
- No usage data to prioritise features or confirm which flows matter.
- Community reporting is a slow and biased detection channel — most users who hit a bug will
  simply stop using the tool.
- Diagnosis depends on users successfully capturing and sharing `--verbose` output.

## Alternatives Considered

1. **Opt-in error reporting (e.g. Sentry) disabled by default**
   - Considered as the standard compromise, giving crash visibility for consenting users.
   - Rejected for now: stack traces and error context from this tool can carry issue content
     and configuration detail, so even opt-in needs careful scrubbing. **The strongest
     alternative** — revisit if release-quality problems reach users repeatedly.
2. **Anonymous usage counters (install/run counts)**
   - Considered to size the user base and justify roadmap effort.
   - Rejected: any phone-home undermines the verifiable "one outbound host" property, for
     data that would not change a solo maintainer's decisions.
3. **An update check on startup**
   - Considered so users learn about security patches, given releases cannot be pushed.
   - Rejected: it is a network call on every run and a nag in a scripted tool. Advisories and
     the changelog carry that job instead.
4. **A local log file with rotation**
   - Considered to make bug reports easier to capture.
   - Rejected: accumulates tracker content on the user's disk by default. Shell redirection
     gives the same benefit as an explicit choice.
