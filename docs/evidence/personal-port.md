# Standalone personal port verification

## Scope and source assessment

- Publishes reusable bounded-assignment setup/runner fixes on upstream `cf75c94`, with truthful setup instructions and one portable assignment skill. Runtime/image fixes match the supplied source package; no new runtime design was introduced during publication.
- Exact-commit checkout prevents branch movement from changing the assignment. Durable Git bundles close the no-push/failed-push recovery gap that a recorded SHA cannot address. Real-session mirroring and ordered writes prevent read-only turns from losing their answers. Shared result classification keeps VM lifecycle separate from saved assistant settlement evidence.
- Independently inspected the final endpoint repair: the guest cannot populate its public proxy endpoint, so the shared status reader merges the current value from AWS without rewriting storage. Temporarily omitting that merge failed both missing/stale-endpoint tests for the expected values; restoring it passed.
- The main portability uncertainty was whether standalone instructions retained intended settings and whether the skill needed harness-only files. The built CLI preview and real Pi skill-loader/package checks below address those local questions, not live deployment readiness.
- Retained the coherent launcher split and shared result owner as supplied. Omitted the previously absent harness-only scheduler, its build/deploy scripts, tests, TypeScript include and SDK dependency; bounded assignments do not require a scheduling subsystem. The lockfile matches the supplied lockfile except for the root manifest and removed scheduler package.
- Replaced account-specific Toolkit instructions and obsolete mandatory phase/task rituals with current README/protocol, ownership/credential rules, proportionate verification and explicit target-region cleanup. Historical plans remain references in the repository, not active setup prerequisites or packaged runtime context. Experimental attach/continue features remain labeled, not deleted.
- Packaged one portable assignment skill with explicit Pi discovery and package-local documentation links. Removed the integration scaffold whose only assertion was `true`; retained both substantive local integrations.

## Fresh standalone checks

All commands ran with a temporary HOME/XDG configuration and minimal environment, without ambient Pi-directory overrides, TMUX or cloud/model credential variables. The README preview explicitly selected an empty temporary agent directory. Tests use synthetic credentials, mocked AWS services, temporary Git/storage and local servers; the assignment integration runs real Pi 1.4.0 with a mock provider, not a live model.

- `npm ci --ignore-scripts`: passed. The interrupted initial install was resumed; an offline attempt lacked a cached dependency, then the normal registry install succeeded.
- `npm run typecheck`: passed.
- `npm run lint`: passed, including glyph scanning; repeated after documentation cleanup.
- `npm run test:unit -- --maxWorkers=2`: **66 files, 544 tests passed**. The supplied combined suite's 554 includes 11 scheduler tests omitted here; this port adds one skill-discovery test.
- `npm run test:integration -- --maxWorkers=1`: **2 files, 2 tests passed**. These are the substantive local end-to-end and assignment round-trip tests; the removed always-true scaffold is not counted.
- `npm run build`: passed for runner, image ZIP, ESM controller ZIP and standalone CLI.
- `npm run schemas:gen`: passed; generated schemas match the delivered contracts.
- Focused status/tool/skill run after restoring the endpoint regression probe: **3 files, 30 tests passed**.
- Final skill/CLI-packaging run after documentation/package cleanup: **2 files, 5 tests passed**. The real Pi loader discovers exactly one skill without diagnostics; all linked local files resolve. `npm pack --dry-run --json --ignore-scripts` includes skill, current documentation and built artifacts, without the scheduler.
- The README's exact JSON example passed `node dist/cli/main.js setup --non-interactive --config <temporary-example.json> --dry-run --json`. It retained OpenAI selection/opt-in, no-push, concurrency one, GitHub mode none and the separate stack. No AWS calls or credentials were needed; this does not verify deployment.
- Original-checkout baseline: typecheck/lint passed; units were 503 passed and one failure because the update-command test expected an unbuilt `dist/image/app.zip`. The delivered suite passed; the baseline failure was not treated as a runtime regression.

## Review and boundaries

- Reviewed changed runtime callers, contracts, infrastructure/build changes, tests, documentation and new files. Supplied independent-context review findings have regression coverage; those reviews were not cross-provider, and no new agent review was commissioned for this publication.
- Checked copied-file equivalence. Standalone deviations are documentation/skill/package adaptations, scheduler omission and the removed trivial scaffold; runtime/image sources remain as supplied. Dependency-lock changes beyond scheduler omission came from the supplied Pi 1.4.0 update, not a new dependency upgrade during publication.
- Full diff/new-file review, whitespace checks and targeted secret/private-context scans found no private paths, real credentials, account identifiers or transcripts in the delivery. Numeric account values in unit fixtures are synthetic examples.
- Git remote is `https://github.com/ashnaahmad/pi-cloud-agents.git`; fetched `origin/main` matched the starting revision before publication. No force push or other remote is authorized.
- No live AWS/model/browser operations, credential inspection, employer resources or other agents were used here. [The cloud trial](personal-cloud-trial.md) is supplied prior evidence, not a trial repeated during publication.

## Remaining limits

- TUI attach, cross-VM continuation and unattended/guest-to-secret OAuth renewal remain unverified.
- Bundles omit ignored files, external LFS objects and submodule repositories. Large histories/storage failures may exceed hook deadlines; manifest/session writes are ordered, not a cross-object transaction. Stop/checkpoint is best effort; inspect and recover the reported artifacts rather than treating VM termination as proof of preservation.
- No fresh deployment or measured billing total is claimed. Recover artifacts before deleting trial storage and verify cleanup only against the explicit target resources/region.
