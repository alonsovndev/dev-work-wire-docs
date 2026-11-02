# Contributing to DevWorkWire documentation

This repository maintains the Docusaurus documentation site for DevWorkWire.
Contributions should improve the accuracy, navigation, presentation, or delivery
of these project docs. Application changes belong in the separate
[DevWorkWire repository](https://github.com/alonsovndev/dev-work-wire).

## Development workflow

Use Node.js 22 from `.node-version` and its bundled npm. Follow the
[local setup instructions](./README.md#local-development), then create a named
working branch from `main`:

```sh
git switch -c docs/my-improvement
npm ci
npm start
```

Keep changes focused, follow existing conventions, and update setup instructions
when configuration changes affect contributors. Never commit credentials or local
environment files. Use a Conventional Commit message when committing your work.

## Documentation standards

- Preserve the numbered section structure under `docs/` and its category metadata.
- Prefer relative Markdown links between documentation pages.
- Distinguish current CLI behavior from proposed requirements and superseded ADRs.
- Mark unknown owners, URLs, or deployment facts as `TBD`.
- Keep examples consistent with the [CLI contract](./docs/03-architecture/interfaces/interface-contract.md).
- Check Mermaid diagrams and keep headings and descriptions easy to scan.

Site scaffolding lives in `src/`; configuration lives in `docusaurus.config.ts`.
Keep UI changes compatible with mobile layouts, keyboard navigation, and both
themes. Reuse Docusaurus components and the existing blue theme.

## Verification

Run these checks before opening a pull request:

```sh
npm run typecheck
npm run build
npm run serve
```

The build fails on broken links and anchors. Inspect changed pages in the served
production build, including direct refreshes of nested routes. Check home-page
changes on narrow and wide viewports, in light and dark themes, and with keyboard
navigation. There is currently no automated test suite or dedicated lint script.

## Pull requests and deployment

Open a pull request against `main` and include the problem, resulting behavior,
checks run, and screenshots for visual changes. GitHub Actions validates types
and the production build on pull requests and pushes to `main`.

Once configured, **Cloudflare Pages Git integration** builds branch previews and
publishes successful `main` builds to production. GitHub Actions does not publish
the site. Changes to account settings or live deployment require separate
coordination; see the [Cloudflare setup and cutover guide](./README.md#cloudflare-pages-deployment).

Before submitting, confirm:

- The change addresses one concern and preserves existing product requirements.
- Typecheck and build pass, and changed pages have been inspected locally.
- Setup instructions and examples reflect the resulting behavior.
- The pull request identifies any unverified Cloudflare or browser behavior.

## Reporting issues

Include the affected page or configuration, steps to reproduce, expected and
actual behavior, and relevant browser, Node.js, or build details. Add screenshots
or focused logs when they help explain the issue. Remove credentials and private
Jira information before sharing logs.
