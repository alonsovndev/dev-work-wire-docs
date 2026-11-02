import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import CodeBlock from "@theme/CodeBlock";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import styles from "./index.module.css";

const documentationSections = [
  { title: "Context", to: "/docs/context/", description: "The problem, the people, and the project boundaries." },
  { title: "Requirements", to: "/docs/requirements/", description: "Current capabilities, partial features, and future work." },
  { title: "Planning", to: "/docs/planning/", description: "The draft roadmap, roles, and delivery phases." },
  { title: "Architecture", to: "/docs/architecture/", description: "The CLI, Jira adapter, interfaces, and import state." },
  { title: "Decisions", to: "/docs/decisions/", description: "The reasoning behind the design, including superseded proposals." },
  { title: "Prototype", to: "/docs/prototype/", description: "Interaction references, design direction, and prototype briefs." },
];

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title="Documentation" description={siteConfig.tagline}>
      <main>
        <header className={styles.heroBanner}>
          <div className="container">
            <p className={styles.eyebrow}>DevWorkWire documentation</p>
            <Heading as="h1" className={styles.heroTitle}>
              Prepared work.<br />Ready for Jira.
            </Heading>
            <p className={styles.heroDescription}>
              Bring your Epic and Stories in Markdown. Use <code>dwire</code> to
              validate, preview, and import them from your terminal or through a
              terminal-capable AI agent.
            </p>
            <div className={styles.buttons}>
              <Link className="button button--primary button--lg" to="/docs/intro/">
                Start with the introduction
              </Link>
              <Link className="button button--outline button--primary button--lg" to="/docs/architecture/interfaces/interface-contract/">
                Explore the CLI contract
              </Link>
            </div>
            <p className={styles.heroNote}>A local CLI for already refined work. Jira is the current provider.</p>
          </div>
        </header>

        <HomepageFeatures />

        <section className={styles.section} aria-labelledby="import-workflow">
          <div className="container">
            <p className={styles.eyebrow}>From folder to backlog</p>
            <Heading as="h2" id="import-workflow">Inspect the work before you import it</Heading>
            <div className={styles.workflow}>
              <ol className={styles.steps}>
                <li><strong>Prepare your folder.</strong> Keep one Epic in <code>epic.md</code> and optional Stories in <code>stories.md</code>.</li>
                <li><strong>Preview locally.</strong> Check validation results and see what will be created or skipped, without writing to Jira.</li>
                <li><strong>Import and keep the state.</strong> Review the import preview and confirm in your terminal. Keep <code>.devworkwire-import.json</code> with the folder for resumable re-runs.</li>
              </ol>
              <div className={styles.commandExample}>
                <CodeBlock language="bash" title="With dwire installed and Jira configured">
                  {"dwire preview-folder ./work-items/my-epic\ndwire import-folder ./work-items/my-epic"}
                </CodeBlock>
                <p>Direct create commands write immediately. Non-interactive imports require <code>--yes</code> when there is work to create.</p>
                <Link to="/docs/architecture/interfaces/interface-contract/#writes-and-recovery">Read the write and recovery rules →</Link>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.documentation}`} aria-labelledby="documentation-map">
          <div className="container">
            <p className={styles.eyebrow}>Find your next page</p>
            <Heading as="h2" id="documentation-map">Explore the documentation</Heading>
            <p>New to the project? Start with Context and the CLI contract. Contributing? Follow Requirements, Architecture, and Decisions.</p>
            <div className={styles.docsGrid}>
              {documentationSections.map((section) => (
                <Link key={section.to} to={section.to} className={styles.docLink}>
                  <Heading as="h3">{section.title} <span aria-hidden="true">→</span></Heading>
                  <p>{section.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
