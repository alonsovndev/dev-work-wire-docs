# Deployment Architecture

| Attribute        | Value                       |
| ---------------- | --------------------------- |
| **Project**      | [Project Name]              |
| **Version**      | 0.1                         |
| **Status**       | Draft                       |

## Table of Contents

- [Scope and NFR Alignment](#scope-and-nfr-alignment)
- [Cloud Platform Selection and Rationale](#cloud-platform-selection-and-rationale)
- [Backup and Disaster Recovery](#backup-and-disaster-recovery)
- [Environment Strategy](#environment-strategy)
- [Cost Optimization Strategy](#cost-optimization-strategy)
- [Infrastructure as Code (IaC) Approach](#infrastructure-as-code-iac-approach)
- [Security Architecture Considerations](#security-architecture-considerations)
- [Deployment Impact Summary](#deployment-impact-summary)
- [Related ADRs](#related-adrs)
- [Source References](#source-references)

## Scope and NFR Alignment

| NFR | How this document satisfies it |
| --- | ------------------------------ |
| [NFR-X05 — Performance] | [Compute sizing and scaling approach] |
| [NFR-X06 — Scalability] | [Scaling strategy] |

## Cloud Platform Selection and Rationale

### Decision: [Platform Name]

> Record the chosen cloud provider and the primary reasons it was selected (cost, team familiarity, feature fit, compliance).

### Trade-offs

| Option | Pros | Cons | Verdict |
| ------ | ---- | ---- | ------- |
| [Chosen] | [Pros] | [Cons] | Selected |
| [Alternative] | [Pros] | [Cons] | Rejected — [reason] |

### Selected Platform Architecture

| Layer | Service / Resource | Notes |
| ----- | ------------------ | ----- |
| Compute | [e.g. App Runner, Cloud Run, ECS] | [Rationale] |
| Database | [e.g. RDS, Cloud SQL] | [Rationale] |
| Object Storage | [e.g. S3, GCS] | [Rationale] |
| CDN | [e.g. CloudFront, Cloud CDN] | [Rationale] |
| Container Registry | [e.g. ECR, Artifact Registry] | [Rationale] |

## Deployment Architecture

### Compute Resources

[Describe the compute model, instance sizes or autoscaling parameters, and how the application is packaged.]

### Database and Storage

[Describe the managed database service, storage classes for object storage, and retention behavior.]

### Networking

[Describe the network topology: VPC/subnets, ingress path, and any load balancing.]

```
[Client] ──HTTPS──▶ [CDN / Load Balancer] ──▶ [Compute] ──▶ [Database]
                                                        │
                                                        └──▶ [Object Storage]
```

### Scaling Strategy

| Dimension | Strategy | Limits / Constraints |
| --------- | -------- | -------------------- |
| Compute  | [horizontal / vertical] | [max instances, cost ceiling] |
| Database | [read replicas / vertical] | [max size] |

### High Availability and Failover

- [How the system remains available during a single-node failure.]
- [Failover behavior for the database layer.]

## Backup and Disaster Recovery

| Resource | Backup Method | RPO | RTO | Recovery Runbook |
| -------- | ------------- | --- | --- | ---------------- |
| Database | [daily snapshot + WAL / point-in-time] | [e.g. 5 min] | [e.g. 15 min] | [link to runbook] |
| Object Storage | [platform default + versioning] | [24h] | [1h] | [link] |

> **RPO** = acceptable data loss window; **RTO** = acceptable downtime window.

## Environment Strategy

| Environment | Purpose | Deployed From | Seeding |
| ----------- | ------- | ------------- | ------- |
| Local | Developer workstation | `docker compose` | seed scripts |
| Production | Live user-facing | [tag on main] | migrations only |

## Cost Optimization Strategy

- [e.g. use free-tier-eligible services for MVP.]
- [e.g. review spend monthly; set billing alerts.]
- [e.g. downsize or sleep non-production resources.]

## Infrastructure as Code (IaC) Approach

- **Tool:** [Terraform / Pulumi / CDK / —]
- **State management:** [remote backend, locking]
- **Workflow:** `plan` on PR, `apply` on tag/deploy
- [Link the IaC ADR once created.]

## Security Architecture Considerations

- Secrets are injected at runtime; never stored in code or images (see [Security Architecture](../security/security-architecture.md)).
- [Network isolation rules, if any.]
- [Compliance considerations.]

## Deployment Impact Summary

- [Key constraints this architecture imposes on the CI/CD pipeline.]
- [What must happen (or not happen) during deployment.]

## Related ADRs

- [Deployment Platform ADR](../../04-decisions/README.md)
- [Infrastructure as Code ADR](../../04-decisions/README.md)
- [Containerization ADR](../../04-decisions/README.md)
- [Secrets Management ADR](../../04-decisions/README.md)

## Source References

- [CI/CD Pipeline](./ci-cd-pipeline.md)
- [Monitoring and Observability](./monitoring-observability.md)
- [Security Architecture](../security/security-architecture.md)
- [Feature Requirements](../../01-requirements/README.md)

---

**Last Updated**: YYYY-MM-DD
