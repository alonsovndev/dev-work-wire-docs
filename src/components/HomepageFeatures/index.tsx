import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Validate, Preview, Confirm",
    description: (
      <>
        Load an already-refined Epic → Story → Acceptance Criteria structure into your project management platform —
        validated for consistency and previewed before anything is written, with dedup on every re-run.
      </>
    ),
  },
  {
    title: "One CLI, One MCP Server",
    description: (
      <>
        Drive it by hand with the <code>dwire</code> CLI, or let your AI agent drive it through DevWorkWire's own MCP
        server — both built on the same core service, with no divergent logic.
      </>
    ),
  },
  {
    title: "Confirm Gate for Every Agent",
    description: (
      <>
        Every externally-visible action — comments, transitions, import commits — goes through the same
        confirm-before-execute gate, whether it's triggered by a human or an AI agent.
      </>
    ),
  },
];

function Feature({ title, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
