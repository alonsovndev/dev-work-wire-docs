---
sidebar_position: 1
---

# Overview

**Tagline**: _"Load an already-defined work structure into your backlog, validated and duplicate-free — by hand or with your AI agent driving."_

## Core Concept

DevWorkWire is an open-source tool that takes an already-defined, refined structure of work — Epics with their User Stories and Acceptance Criteria — and loads it, validated and reliably, into a project-tracking system (Jira first). It does not interpret free-form or ambiguous text; the structure must already be complete when it arrives (for example, a Markdown document with the Epic → Story → Acceptance Criteria hierarchy already worked out). DevWorkWire's job is to validate that structure, preview exactly what will be written, and apply it without creating duplicates on re-run — usable directly by a developer through the interactive `dwire` CLI, or by an AI agent through DevWorkWire's own MCP server.

### Vision Statement

DevWorkWire becomes the trusted, provider-agnostic bridge between refined planning documents and project trackers — for a developer working by hand, or their AI agent working on their behalf — without manual ticket wrangling or duplicate-creation risk.

---

## Problem Statement

### The Challenge

Pain points the target users experience today:

- **Manual copy-paste is slow and error-prone**: turning a refined Epic/Story/AC document into tickets today means hand-creating each item in the project management platform's UI — tedious, inconsistent field usage, and easy to miss a parent/child link or an Acceptance Criterion.
- **Re-imports create duplicate tickets**: there is no safe way to re-run a load after the source document changes, so teams either avoid updating already-imported work or end up with duplicate Epics and Stories in the backlog.

### The Solution

How DevWorkWire addresses those pain points:

- **Loading engine (validate → preview → confirm)**: DevWorkWire validates the structure's consistency (counts, parent/child links, required fields), shows a clear preview of exactly what will be written, and requires confirmation before it touches the tracker — solving the manual, error-prone copy-paste problem.
- **Dedup on re-run**: re-running the same source file is treated as an update pass, matched by provider key or a stored import-source reference, so re-imports never create duplicate tickets.

---

## Target Audience

### Primary Audience

- **Solo/small-team developer**
  - Loads a refined Epic/Story/AC document into a project management platform (Jira first) and keeps it in sync from the terminal via the `dwire` CLI, without hand-creating tickets or risking duplicates on re-run.

### Secondary Audience

- **Developer directing an AI coding agent**
  - Lets their AI agent (Claude Code, OpenCode, Copilot, etc.) load work items and report progress through DevWorkWire's MCP server, while staying in the loop via the same confirm-before-execute gate the CLI uses — no looser, agent-only code path.

> Link each audience to a full persona in [User Personas](./user-personas.md).

---

## High-Level Goals

### Professional Impact Goals

- Eliminate manual, error-prone ticket creation for developers turning refined plans into their project management platform's backlog.
- Give developers and their AI agents a trustworthy way to keep their project management platform in sync with planning documents, without duplicate-creation risk.

### Technical Goals

- Hexagonal architecture: a `WorkItemProvider` port so Jira ships first (Phase 1) and Linear/Azure DevOps can be added later (Phase 3) with no changes to the core service, CLI, or MCP tool definitions.
- One core service (`WorkItemService`) shared by the CLI and the MCP server — no divergent logic between "human mode" and "agent mode".
- Confirm-before-execute gate on every externally-visible action (comment, transition, import commit) for both front doors.
- Proper packaging from Phase 1 (`pyproject.toml`, versioning, changelog) as the foundation every later distribution channel builds on.
- Security-by-design: no bypass path for autonomous agents to skip the confirm gate in the open-source core.

### Business Goals

- Broad, frictionless distribution: PyPI as the baseline (`pip install devworkwire`), pipx documented as the recommended install path, and a self-maintained Homebrew tap (`alonsovndev/devworkwire`) — lowering the bar to try the tool, ahead of Homebrew core or standalone binaries, which stay deferred until there's real traction.

---

## Key Differentiators

### What Makes This Project Stand Out

- **Same trust gate for humans and agents**: the CLI and the MCP server share the same `import.preview` → `import.commit` confirm gate on externally-visible actions — there is no separate, looser code path for AI agents to bypass.
- **Own MCP server, any harness**: built directly against its target platform's REST API (Jira first) rather than a vendor agent SDK, so DevWorkWire's MCP server works with any MCP-compatible harness (Claude, OpenCode, Copilot, Antigravity, and future entrants) with no per-harness integration work.

---

**Last Updated**: 2026-08-28
