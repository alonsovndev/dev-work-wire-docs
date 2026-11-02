import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "DevWorkWire",
  tagline:
    "Turn prepared Markdown into Jira work, with local previews and resumable imports.",
  favicon: "img/favicon.svg",

  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Preview builds should keep canonical URLs on the production domain.
  url: process.env.SITE_URL || "https://dwire-docs.alonsovndev.com",
  baseUrl: "/",
  trailingSlash: true,

  onBrokenLinks: "throw",
  onBrokenAnchors: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  // Renders ```mermaid fences as diagrams. Both keys are required — the flag
  // alone does nothing without the theme registered.
  markdown: {
    mermaid: true,
  },

  themes: ["@docusaurus/theme-mermaid"],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Point this to your repository to enable the "Edit this page" links.
          editUrl: "https://github.com/alonsovndev/dev-work-wire-docs/edit/main/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "DevWorkWire",
      logo: {
        alt: "DevWorkWire Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Documentation",
        },
        {
          href: "https://github.com/alonsovndev/dev-work-wire-docs",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Introduction",
              to: "/docs/intro",
            },
            {
              label: "CLI contract",
              to: "/docs/architecture/interfaces/interface-contract/",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/alonsovndev/dev-work-wire-docs",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Alonsovndev. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    mermaid: {
      theme: { light: "neutral", dark: "dark" },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
