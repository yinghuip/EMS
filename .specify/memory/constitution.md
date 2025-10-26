# EMS Web Application Constitution

## Core Principles

### I. Library-First
Every feature must start as a small, self-contained library or module. Libraries should have clear public APIs, unit tests, and simple documentation so they can be tested and reasoned about independently.

### II. HTTP-First (Web API + UI)
All externally-facing functionality is exposed via well-documented HTTP APIs. The web UI consumes those APIs; server-rendering is allowed when it improves performance or SEO.

### III. Test-First (Mandatory)
Write automated tests before implementing features: unit tests for libraries, integration tests for service interactions, and end-to-end tests for critical user flows. Every PR must keep the test suite green.


### V. Observability & Reliability
Emit structured logs (JSON), capture metrics (request rates, error rates, latency), and add distributed traces for cross-service flows. Set up alerting for SLO breaches and high error/latency rates.

## Minimal Technical Requirements
- Backend: a single responsibility service architecture; use a supported runtime (e.g., Node.js, Python, Ruby, or JVM) following the project's conventions.
- Web API: versioned REST or GraphQL endpoints with clear request/response schemas. Prefer OpenAPI or GraphQL schema documents for contract testing.
- Frontend: a component-based framework (React/Vue/Svelte) or server-rendered pages; must be buildable with reproducible toolchain and pinned deps.
- If the project uses Angular: adopt and enforce Angular's template control-flow and reactive patterns. Use Angular's structural directives (*ngIf, *ngFor, *ngSwitch, ng-container) and prefer the framework's supported control-flow primitives when available (upgrade path permitting). Ensure templates remain statically analyzable (avoid runtime-evaluated imports/expressions in component `imports`) and favor Angular Signals / reactive forms for state where appropriate. Do not use non-Angular templating syntaxes (e.g., server-side `@if` blocks) inside Angular templates.
- Data: transactional relational DB (Postgres preferred) for core data; use a single source of truth and migration tooling (e.g., Flyway, Liquibase, or framework migrations).
- CI/CD: every push runs lint, unit tests, and integration tests in CI. Deployments require passing CI and an approved PR; staged environments (staging → production) must exist.
- Secrets & config: manage secrets via a vault or environment-based secret manager; never commit plaintext secrets.
- Accessibility: public UI must meet basic accessibility standards (WCAG AA where practical).

## Development Workflow & Quality Gates
- Branching: use topic branches for features/bugs; PRs required for mainline changes.
- Reviews: at least one approving review from a maintainer for non-trivial changes; critical changes require two reviewers.
- Tests: unit tests + one integration test per changed service; add an end-to-end test for user-facing features before merging significant UX changes.
- Linting & formatting: enforce consistent style automatically (prettier/black + linter).
- Versioning: follow semantic versioning for public APIs and services; document breaking changes in release notes.
- Rollbacks & migrations: database migrations must be backward compatible where possible; include rollback steps and migration plans in PR descriptions.


## Governance
This constitution is the minimal, non-negotiable baseline. Amendments require a documented proposal in a PR and approval by at least two maintainers. All releases and major changes must reference compliance with this constitution in their PR description.

**Version**: 0.1.0 | **Ratified**: 2025-10-26 | **Last Amended**: 2025-10-26
