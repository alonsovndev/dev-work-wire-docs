---
sidebar_position: 3
---

# Glossary

This document defines key terms used throughout the requirements and architecture documentation. Keep it current: whenever a new domain term appears in any document, add it here first.

> Organize terms into sections that match your domain. The sections below are starting points — add, rename, or remove them as needed. Each entry follows the format: **Term** followed by a one-to-three sentence definition precise enough for engineers, designers, and stakeholders to share one meaning.

## User Roles

**[Role Name 1]**
[Definition: who holds this role, what permissions they have, and how the role is granted.]

**[Role Name 2]**
[Definition: who holds this role, what permissions they have, and how the role is granted.]

## Domain Entities

**Epic**
The top-level unit of work in a loaded structure, containing one or more Stories. Sourced from the already-refined input document and mapped to the tracking provider's native Epic type (e.g. Jira Epic).

**Story**
A User Story belonging to an Epic, carrying its own Acceptance Criteria. Mapped to the provider's native Story/Task type.

**Acceptance Criteria (AC)**
The testable conditions attached to a Story that define when it is done. Validated for presence and consistency before a load is written.

**WorkItemService**
The core application service shared by the CLI and the MCP server. Implements the loading, context-retrieval, and progress write-back logic once, so the CLI and MCP expose the same behavior rather than diverging.

**WorkItemProvider**
The port every tracking-system adapter implements (Jira in Phase 1; Linear and Azure DevOps later). `WorkItemService` depends only on this port, not on any specific provider.

## Lifecycle States

**[State 1]**
[Definition: what triggers this state, what is allowed while in it, and how it ends.]

**[State 2]**
[Definition: what triggers this state, what is allowed while in it, and how it ends.]

## Business Concepts

**[Concept 1]**
[Definition: the business meaning, including any limits, quotas, or rules attached to it.]

## Technical Terms

**dwire**
The command-line entry point for DevWorkWire's interactive CLI, published via the `devworkwire` PyPI package.

**import.preview / import.commit**
The two-step confirm gate every load goes through: `import.preview` validates the structure and shows exactly what will be written, without writing anything; `import.commit` executes it only after explicit confirmation. Applies identically whether triggered from the CLI or the MCP server.

**Trust Tier**
The classification of an action as either read-only (show/search/list — fully autonomous) or externally visible (comment, transition, import commit — confirm-before-execute by default). Determines whether an action needs a confirm step.

---

**Last Updated**: 2026-08-28
