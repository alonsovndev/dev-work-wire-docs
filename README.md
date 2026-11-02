# DevWorkWire documentation

[![Validate documentation](https://github.com/alonsovndev/dev-work-wire-docs/actions/workflows/validate.yml/badge.svg)](https://github.com/alonsovndev/dev-work-wire-docs/actions/workflows/validate.yml)

The documentation site for **DevWorkWire**, a local CLI that imports prepared Epic
and Story Markdown into Jira. This repository contains the project context,
requirements, planning, architecture, decisions, and prototype references. The
application and portable agent skill live in the separate
[DevWorkWire repository](https://github.com/alonsovndev/dev-work-wire).

The site uses Docusaurus and deploys through **Cloudflare Pages Git integration**.
GitHub Actions validates changes; Cloudflare builds and hosts the site.

## Local development

Use Node.js **22**, as declared in `.node-version`, and its bundled npm.

```sh
git clone https://github.com/alonsovndev/dev-work-wire-docs.git
cd dev-work-wire-docs
npm ci
npm start
```

The development site runs at `http://localhost:3000/`.

| Command | Purpose |
|---|---|
| `npm start` | Start the development server with hot reload |
| `npm run typecheck` | Check TypeScript types |
| `npm run build` | Generate the static site in `build/`; broken links and anchors fail the build |
| `npm run serve` | Serve the production build locally |
| `npm run clear` | Clear the Docusaurus cache |

## Documentation structure

```text
docs/
├── intro.md                 # Introduction and reading paths
├── 00-context/              # Overview, personas, glossary, scope
├── 01-requirements/         # Feature requirements and implementation status
├── 02-planning/             # Draft roadmap and role mapping
├── 03-architecture/         # Core, interfaces, database, diagrams, ops, security
├── 04-decisions/            # Architectural Decision Records
└── 05-prototype/            # Prototype brief and design direction
```

Start with the [introduction](./docs/intro.md). For current command behavior, use
the [CLI contract](./docs/03-architecture/interfaces/interface-contract.md).
Some pages retain earlier proposals; a clarified requirement does not mean a
feature has shipped. [ADR-011](./docs/04-decisions/adr-011-cli-first-agent-integration.md)
is the accepted CLI-first integration decision.

The `examples/work-items/` folder contains reference Markdown work items.

## Cloudflare Pages deployment

The production site is [dwire-docs.alonsovndev.com](https://dwire-docs.alonsovndev.com/).
This repository does not provision a Cloudflare project or configure account access.
Follow [Cloudflare's Docusaurus guide](https://developers.cloudflare.com/pages/framework-guides/deploy-a-docusaurus-site/)
to connect the existing repository.

### Connect and configure

1. In Cloudflare **Workers & Pages**, create a **Pages** application and import
   `alonsovndev/dev-work-wire-docs` through the GitHub integration. Grant the
   integration access to this repository.
2. Set the following build settings for production and preview builds:

   | Setting | Value |
   |---|---|
   | Framework preset | Docusaurus |
   | Production branch | `main` |
   | Root directory | Repository root (leave blank) |
   | Build command | `npm ci && npm run typecheck && npm run build` |
   | Build output directory | `build` |
   | Node.js version | `22`, read from `.node-version` |

3. Set `SKIP_DEPENDENCY_INSTALL=1` in both production and preview build
   environments. The build command above installs from the committed lockfile
   instead of using Cloudflare's automatic dependency installation.
4. Connect the production custom domain `dwire-docs.alonsovndev.com` to the Pages
   project. The Docusaurus configuration defaults to that origin for canonical
   URLs and the sitemap. If `SITE_URL` is already configured, set it to
   `https://dwire-docs.alonsovndev.com` in both production and preview build
   environments, then rebuild.
5. Enable preview deployments for non-production branches. Branch pushes produce
   preview URLs; pushes to `main` update production after a successful build.

No Cloudflare API token or GitHub deployment secret is required for this Git
integration. The build runs on Cloudflare rather than in GitHub Actions.

### URL configuration

`docusaurus.config.ts` uses `https://dwire-docs.alonsovndev.com` as the default
canonical origin, including for local and preview builds. An optional `SITE_URL`
**build-time** environment variable overrides it. Cloudflare deployment URLs do
not change canonical URLs, and runtime environment bindings cannot change
metadata in an already generated static build.

Set origins without a path. The site always uses `baseUrl: "/"` and trailing-slash
routes. Preview deployments remain accessible at their own URLs; their canonical
links point to production unless `SITE_URL` is explicitly overridden.

To test a production origin locally:

```sh
npm run build
npm run serve
```

The production hostname is used automatically; `npm run serve` still serves the
files at localhost. Cloudflare build variables and runtime selection are described in the official
[build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
and [build image](https://developers.cloudflare.com/pages/configuration/build-image/)
guides.

### Verify and cut over

- Open the landing page, `/docs/intro/`, and a nested architecture page at the
  production URL. Refresh each directly and check assets, navigation, and Mermaid
  rendering.
- Check light and dark themes and mobile navigation. Confirm an unknown path
  displays the generated 404 page.
- Inspect the canonical link and `/sitemap.xml`: both must use the assigned
  production origin, with no `/dev-work-wire-docs/` prefix.
- Open a branch preview and confirm it does not replace production.
- After these checks pass, disable the old GitHub Pages site in the repository's
  Pages settings and update any published links. The previous `github.io` hostname
  cannot be redirected by Cloudflare; update old links separately.

A failed typecheck or build prevents Cloudflare from publishing that deployment.
For a bad successful deployment, use the Pages project's deployment history to
[roll back to an earlier successful production deployment](https://developers.cloudflare.com/pages/configuration/rollbacks/).
Then prepare a corrective pull request so the next `main` build retains the fix.

## Maintaining documentation with agents

The existing `/docs-*` commands are available under `.claude/commands/` for
Claude Code and `.github/prompts/` for Copilot.
Use `/docs-next` to inspect documentation status, then the relevant command:
`/docs-context`, `/docs-requirements`, `/docs-planning`, `/docs-decisions`,
`/docs-architecture`, or `/docs-prototype`. `/docs-work-items` generates
Jira-ready work-item Markdown from the documentation.

Review generated content against current behavior before publishing it. These
commands maintain documentation; they do not deploy the site.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Before opening a pull request against
`main`, run `npm run typecheck` and `npm run build`. The validation workflow runs
those same checks on pull requests, pushes to `main`, and manual dispatch.
