# ADR-006: Per-Project YAML Config with an Environment-Variable Secret

- **Status**: Proposed
- **Date**: 2026-09-02

## Context

[F-008](../01-requirements/f-008-provider-auth-configuration.md) is the foundational
dependency for every other feature — nothing reaches Jira without it. It requires
connection settings in a local file, the API token supplied **via an environment variable
and never stored in the config file** (`FR-008-02`), configuration validated before any
Jira-touching command runs (`FR-008-03`), and one configuration scoped to exactly one Jira
project (`FR-008-04`).

[NFR-008-01](../01-requirements/f-008-provider-auth-configuration.md) is absolute: the token
must never appear in any file DevWorkWire writes.

The token is the highest-value asset in the system — it grants full user-level tracker
access, and DevWorkWire holds no copy to revoke. Two open questions the requirements leave
to design: what format the file takes, and where it lives.

## Decision

- **Format: YAML**, holding only non-secret settings — Jira base URL and project key.
- **Location: per-project**, `.devworkwire.yaml` in the working directory, beside the
  `.devworkwire/` state directory.
- **Token: process environment only.** DevWorkWire does **not** discover or load `.env`
  files. It is read at run time and lives only in process memory.
- **The token is never accepted as a CLI argument** — command-line arguments are
  world-readable in the process table and land in shell history.
- **`yaml.safe_load` only.** `yaml.load` permits arbitrary object construction and is
  forbidden, enforced by a lint rule rather than review habit.
- **Pydantic v2 validates the parsed structure** at the boundary, with errors naming the
  offending field.
- **Validation runs before any Jira call** and checks connectivity, project access, and the
  presence of the import-reference custom field — failing with `CONFIG_MISSING`,
  `CONFIG_INVALID`, `CREDENTIALS_MISSING`, or `REFERENCE_FIELD_MISSING`.
- **`http://` base URLs are rejected.** TLS verification is always on, with no bypass option.
- **File permissions `0600`**; `.devworkwire/` must be gitignored.
- **Redaction is enforced by a logging filter**, not call-site discipline, so the token and
  `Authorization` header never appear at any verbosity.

## Consequences

### Positive

- The token never touches disk, so an accidentally committed config file exposes a base URL
  and project key — undesirable, but not a credential leak.
- One config = one Jira project matches `FR-008-04` naturally, and an agent working inside a
  repo targets the right project with no extra setup.
- The config travels with the repo, so teammates inherit the right settings.
- Refusing `.env` discovery removes a real hazard: silently picking up a token from a parent
  directory the user did not intend.
- Failing fast with a field-naming error beats surfacing a confusing `401` several steps in.
- Checking the reference custom field at this stage is important — creating it needs Jira
  admin rights, and without it dedup cannot work at all.

### Negative

- **Environment variables are visible to other processes running as the same user and can
  leak through shell history.** This is inherent to the mechanism and is the accepted
  residual risk recorded in `F-008`. *Mitigation:* documentation recommends a git-ignored
  `.env` sourced by the user's own tooling or a shell-profile export, and warns against
  shared machines. An OS keychain integration is the correct long-term answer and is
  deferred.
- Rejecting `.env` auto-loading costs setup convenience, and is felt most in the MCP case,
  where harnesses do not always pass shell environment through to spawned subprocesses.
  **This may prove to be the wrong trade** and should be revisited if MCP setup friction is
  a common complaint.
- YAML brings a `PyYAML` dependency and its indentation and implicit-typing pitfalls, where
  TOML would have been stdlib on Python 3.11+.
- Per-project placement means a config file per repo, and users must know to gitignore
  `.devworkwire/` (though not the config itself).
- One project per configuration means no multi-project workflows in the MVP.

## Alternatives Considered

1. **TOML instead of YAML**
   - Considered because `tomllib` is stdlib on the 3.11+ floor
     ([ADR-002](./adr-002-python-runtime-cli-platforms.md)) — zero dependency, unambiguous
     typing, no indentation traps, and consistent with `pyproject.toml`.
   - Not selected: YAML was chosen for familiarity and consistency with existing tooling in
     the workspace. *This remains the strongest alternative if the `PyYAML` dependency or a
     YAML parsing bug becomes a problem.*
2. **JSON**
   - Considered as stdlib, universal, and trivially machine-writable by an agent.
   - Rejected: no comments, which hurts a hand-edited configuration file.
3. **Auto-load a `.env` from the project directory**
   - Considered for noticeably friendlier setup, especially under MCP harnesses.
   - Rejected: adds a dependency and a file-precedence rule, and risks silently using a
     token from an unintended directory.
4. **Per-user config in the home directory**
   - Considered so setup happens once and works from anywhere.
   - Rejected: binds the user to a single Jira project globally, awkward the moment they work
     across two repos.
5. **OS keychain for the token**
   - Considered as the strongest protection against the residual risk above.
   - Deferred per `F-008` scope: an interactive credential wizard is out of MVP scope.
