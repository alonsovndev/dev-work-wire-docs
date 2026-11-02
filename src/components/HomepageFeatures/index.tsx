import type { ReactNode } from "react";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const features = [
  {
    title: "Preview without Jira writes",
    description: <>Validate your Markdown and inspect create, skip, and unresolved items locally with <code>preview-folder</code>.</>,
  },
  {
    title: "Resume with a local record",
    description: <>Imports record created Jira keys beside your Markdown. Keep the resume file so re-runs can skip recorded items; changed uploaded items are not updated.</>,
  },
  {
    title: "One CLI for people and agents",
    description: <>Use <code>dwire</code> directly, or let a terminal-capable agent use the same commands through a portable skill. Direct commands support JSON output.</>,
  },
];

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features} aria-labelledby="current-capabilities">
      <div className="container">
        <Heading as="h2" id="current-capabilities" className={styles.heading}>What you can do today</Heading>
        <div className={styles.grid}>
          {features.map((feature) => (
            <div key={feature.title}>
              <Heading as="h3">{feature.title}</Heading>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
