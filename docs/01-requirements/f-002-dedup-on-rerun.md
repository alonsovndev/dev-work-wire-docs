# F-002 Resume and Skip on Re-Run

| Attribute | Value |
|---|---|
| **Project** | DevWorkWire |
| **Version** | 0.2 |
| **Status** | Implemented |
| **Owner** | Product Owner |

## Context

A folder import may be interrupted or rerun. The current CLI uses a local
resume file, not a Jira-side source reference, to avoid recreating items it
knows it uploaded.

## Functional requirements

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-002-01 | Record the Jira destination and each created Epic/Story key beside the Markdown. | `.devworkwire-import.json` records the destination, keys, and source hashes without credentials. |
| FR-002-02 | Skip recorded created items on re-run. | An unchanged re-run with the same resume file makes zero additional Jira create calls. |
| FR-002-03 | Detect local Markdown changes to recorded items without silently updating Jira. | Preview reports `changed` for those items; import skips their existing Jira issues. |
| FR-002-04 | Hold uncertain attempts for manual resolution. | A pending attempt blocks further imports until `resolve-import` binds a verified Jira key or clears a confirmed absent attempt. |

If the resume file is lost, the CLI cannot identify earlier uploaded items
from Jira alone. A future feature may add Jira-side references and updates;
that behavior is not part of this requirement's current implementation.
