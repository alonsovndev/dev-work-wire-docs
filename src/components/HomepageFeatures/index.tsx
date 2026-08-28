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
    title: "Structured Content",
    description: (
      <>
        Organize your documentation with sidebars, versioning, and
        a clear hierarchy — so readers find what they need fast.
      </>
    ),
  },
  {
    title: "Write, Ship, Repeat",
    description: (
      <>
        Write in Markdown, preview locally, and deploy with a single
        command. Focus on your content while the toolchain handles the rest.
      </>
    ),
  },
  {
    title: "Fully Customizable",
    description: (
      <>
        Extend layouts, themes, and components to match your brand.
        Built on React so you can customize anything when the defaults
        aren't enough.
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
