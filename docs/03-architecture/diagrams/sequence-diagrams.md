# Sequence diagrams

These diagrams show shipped CLI behavior. The earlier MCP, SQLite preview
handle, Jira-side drift, and fail-fast diagrams described unimplemented
proposals and are superseded by
[ADR-011](../../04-decisions/adr-011-cli-first-agent-integration.md).

## Read a work item

```mermaid
sequenceDiagram
  autonumber
  participant Caller as Developer or agent
  participant CLI as dwire CLI
  participant Provider as JiraProvider
  participant Jira as Jira REST API
  Caller->>CLI: dwire --format json fetch-story KEY
  CLI->>Provider: fetch_story(KEY)
  Provider->>Jira: GET issue
  Jira-->>Provider: issue data
  Provider-->>CLI: UserStory
  CLI-->>Caller: JSON result on stdout
```

## Preview and import a folder

```mermaid
sequenceDiagram
  autonumber
  participant Caller as Developer or agent
  participant CLI as dwire CLI
  participant State as Local import state
  participant Jira as Jira REST API
  Caller->>CLI: preview-folder FOLDER
  CLI->>State: read recorded keys
  CLI-->>Caller: local create/skip preview
  Caller->>CLI: import-folder FOLDER --yes
  CLI->>State: lock folder and re-read state
  CLI->>Jira: create missing Epic and Stories
  Jira-->>CLI: created keys or errors
  CLI->>State: record each outcome
  CLI-->>Caller: completed or partial result
```

`preview-folder` makes no Jira write. A non-interactive import needs `--yes`;
the agent may use it only within the user's approved task. When Jira's outcome
is uncertain, the importer stops and records a pending attempt for manual
resolution. A definite story rejection can leave a partial result while later
stories are attempted.

## Diagram coverage by feature

| Feature | Current diagram |
|---|---|
| Individual read | [Read a work item](#read-a-work-item) |
| Folder preview/import | [Preview and import a folder](#preview-and-import-a-folder) |
| Rich query and progress reporting | Planned; no current sequence |
| MCP | Deferred; no current sequence |
