# Local assignment and recovery verification

The bounded assignment repair preserves the existing remote Pi loop, direct AWS client and S3 registry. It does not implement a replacement control plane or repair the old attach/continue adapters.

## Behavior covered

- Launch resolves local HEAD to a full commit SHA. The guest fetches that revision and refuses an unavailable commit rather than substituting a branch tip. Dirty local changes are excluded.
- RPC events trigger mirroring of Pi's actual session file, not RPC frames. Session writes are serialized; settled/suspended/terminal manifest writes flush the session first.
- Settlement checkpoints before publishing resumable idle. A subsequent turn returns to running. Only real SSE/WS mirror channels count as attached clients; controller HTTP polling does not suppress suspension.
- Preservation and publication are independent. The checkpoint records agent-created commits and auto-committed dirty work, verifies a self-contained bundle in an empty repository, uploads it under its SHA-256 digest, then advertises the recovery reference.
- No-push and rejected-push tests delete the workspace, seed and source remote, then restore the exact commit and file contents solely from the stored bundle. A preservation/upload failure retains the earlier immutable reference without claiming it covers newer work. Missing configured workspaces use the same failure reporting.
- Durable result retrieval returns the actual assistant answer, recovery reference and errors without contacting or resuming the VM. Observed VM termination cannot promote an older answer over saved evidence of an interrupted follow-up.
- No-push precedence is explicit launch option, configuration, then the historical default true. Tests save/reload configuration and exercise the actual tool arguments.
- OAuth parsing preserves provider-owned renewal fields. Synthetic credentials verify Pi 1.4.0 resolves direct OpenAI ChatGPT authentication without another provider adapter; this is not evidence of unattended renewal.

## Checks and review

- Real Pi 1.4.0 with a local mock provider, RunnerServer hooks/API, temporary Git repositories and LocalStorageSink exercises two turns, durable answer/session/recovery, event-triggered mirroring and attachment-aware suspension. The additional streaming notification is simulated after a real first turn, not a live-model streaming test.
- Storage tests exercise overlapping session/manifest writes and independent reload. Result tests cover incomplete, error, abort, terminal, stale-manifest and follow-up states. Actual tool result tests check answer and recovery metadata rather than timeline descriptions.
- Supplied independent-context source and repair reviews identified no-push preservation, stale-answer promotion and missing-workspace reporting defects. Regression tests cover those repairs. The supplied reviews were not cross-provider reviews, and no new agent review was commissioned for publication.
- Fresh standalone publication checks and exact suite counts are recorded in [personal-port.md](personal-port.md). The separate [cloud trial](personal-cloud-trial.md) records live AWS/ChatGPT observations; publication checks do not repeat that trial.

## Limits

Git bundles omit ignored files, external LFS objects and submodule repositories. Large histories or storage outages may exceed lifecycle-hook deadlines. Ordered manifest/session writes are not a cross-object transaction. TUI attach, cross-VM continuation and guest-to-Secrets-Manager OAuth renewal remain unverified.
