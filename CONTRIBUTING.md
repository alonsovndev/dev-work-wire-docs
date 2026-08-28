# Contributing to template-docs

Thank you for contributing to this documentation template. This repository is a Docusaurus-based starter for project documentation sites, and improvements to the structure, examples, documentation, and workflow are welcome.

---

## Table of Contents

- [Project Context](#project-context)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing and Verification](#testing-and-verification)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Questions & Discussions](#questions--discussions)

---

## Project Context

This repository is a reusable documentation template built with Docusaurus and TypeScript. It is meant to help teams create polished project docs with a ready-made folder structure, sample requirements and architecture sections, and GitHub Pages deployment support.

**Key characteristics:**

- **Framework**: Docusaurus
- **Language**: TypeScript
- **Build Tooling**: Node.js + npm
- **Deployment**: GitHub Pages via GitHub Actions
- **Documentation Structure**: Context, requirements, planning, architecture, decisions, prototype, and examples

For the repository-specific setup and site structure, start with the [README](./README.md).

---

## How to Contribute

### Ways to Contribute

- 🐛 **Report bugs** — Found a broken template behavior or a documentation issue?
- ✨ **Suggest improvements** — Share ideas for better onboarding, structure, or examples.
- 📝 **Improve documentation** — Clarify setup steps, usage guidance, and project conventions.
- 🔧 **Fix template issues** — Update config, styles, docs, or workflow automation.
- 🧪 **Improve validation** — Add or refine checks so the template remains reliable.

### Good First Contributions

Good starting points include:

- Documentation clarity fixes
- README improvements
- Example cleanup or better scaffolding
- Small configuration corrections
- Template workflow and deployment fixes

---

## Development Workflow

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/<your-username>/template-docs.git
cd template-docs
git remote add upstream https://github.com/<original-owner>/template-docs.git
```

### 2. Create a Branch

Always work from a feature branch instead of `main`.

```bash
git checkout -b docs/my-improvement
```

**Branch naming conventions:**

| Type | Prefix | Example |
| ---- | ------ | ------- |
| Feature | `feature/` | `feature/docs-navigation` |
| Bug fix | `fix/` | `fix/github-pages-link` |
| Documentation | `docs/` | `docs/update-readme` |
| Refactor | `refactor/` | `refactor/sidebar-config` |
| Chore | `chore/` | `chore/deps-update` |

### 3. Make Your Changes

- Keep changes focused and related to a single concern.
- Match the existing repository style and structure.
- Update documentation when the change affects setup or usage.

### 4. Commit Your Changes

Write clear, meaningful commit messages.

```bash
git add .
git commit -m "docs: improve setup instructions"
```

**Commit message format** (Conventional Commits):

| Type | Usage |
| ---- | ----- |
| `feat` | A new feature or improvement |
| `fix` | A bug fix |
| `docs` | Documentation-only changes |
| `style` | Formatting or cosmetic adjustments |
| `refactor` | Structural improvements without feature changes |
| `test` | Test or validation improvements |
| `chore` | Build, tooling, or maintenance work |

### 5. Push and Open a Pull Request

```bash
git push origin docs/my-improvement
```

Then open a pull request against `main`.

---

## Project Structure

```text
template-docs/
├── docs/
│   ├── intro.md
│   ├── 00-context/
│   ├── 01-requirements/
│   ├── 02-planning/
│   ├── 03-architecture/
│   ├── 04-decisions/
│   ├── 05-prototype/
│   └── ...
├── examples/
│   └── work-items/
├── src/
├── static/
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── docusaurus.config.ts
├── sidebars.ts
├── package.json
├── tsconfig.json
└── .github/
```

---

## Coding Standards

### General Principles

- Follow existing patterns and conventions already in the repository.
- Keep pull requests small and focused.
- Remove stale or unused content when it no longer serves the template.
- Prefer clear names and straightforward structure over unnecessary abstraction.

### Documentation Standards

- Use clear, professional language.
- Keep examples and setup instructions accurate.
- Link related documents instead of duplicating the same guidance.
- Match the repository's existing Markdown and Docusaurus conventions.

### Frontend / Config Standards

- Keep TypeScript configuration and Docusaurus settings consistent with the rest of the project.
- Prefer minimal, maintainable edits over broad rewrites.
- Check that navigation, metadata, and links still work after changes.

---

## Testing and Verification

This repository is primarily a documentation site, so validation should focus on the working site and build health.

Before submitting a pull request:

- Run the project build locally with `npm run build`.
- Check that links and docs render correctly.
- Confirm changes do not break the configuration, navigation, or deployment workflow.

---

## Pull Request Process

### Before Opening a PR

- [ ] The change is scoped to the requested improvement.
- [ ] Documentation and examples were updated where needed.
- [ ] The site builds successfully locally.
- [ ] Commit messages follow the Conventional Commits format.

### PR Review

1. A maintainer or reviewer will review the PR.
2. Address any requested updates in the same branch.
3. Once approved, the change can be merged into `main`.

### PR Template

When opening a PR, include:

```markdown
## Description
Brief summary of the change and the reason for it.

## Related Issue
Fixes # (issue number) / Refs # (issue number)

## Type of Change
- [ ] Bug fix
- [ ] Documentation update
- [ ] Template improvement
- [ ] Refactor
- [ ] Build or workflow update

## Checklist
- [ ] Change is scoped and focused
- [ ] Site builds successfully
- [ ] Docs/examples updated as needed
- [ ] Commit messages follow conventional commits
```

---

## Reporting Issues

When reporting a problem, please include:

1. **Summary** — A concise description of the issue.
2. **Steps to reproduce** — What actions trigger it.
3. **Expected behavior** — What should happen.
4. **Actual behavior** — What happens instead.
5. **Environment** — OS, browser, Node.js/npm version, and repository state.
6. **Screenshots or logs** — If relevant.

---

## Questions & Discussions

- **Issues** — For bugs, documentation problems, and template improvements.
- **Discussions** — For ideas, configuration questions, and broader feedback.

If you are unsure where something belongs, open an issue or start a discussion. We appreciate the help.

---

Thank you for helping improve the template-docs project\! 🚀
