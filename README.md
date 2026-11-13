# pi-cloud-agents

Experimental cloud assignments for [Pi](https://pi.dev), using AWS Lambda MicroVMs in your own AWS account. This personal port carries deployment and recovery fixes on top of upstream `cf75c94`.

The supported workflow under test is a bounded `cloud_agent` assignment: pin a reachable Git commit, run with selected credentials, retrieve the assistant answer and a verified Git bundle, then clean up. See the [personal cloud trial](docs/evidence/personal-cloud-trial.md) and [local verification](docs/evidence/personal-assignment-round-trip.md) for evidence and remaining limits.

## Current limits

- `/cloud attach` uses an older Pi adapter and remains experimental. Cross-VM `/cloud continue` does not restore the previous workspace or session. Neither is a verified recovery path.
- `verify` includes checks that report success without executing a model assignment. A passing setup/verify report does not prove the workflow works.
- ChatGPT OAuth requires explicit opt-in. Provider renewal metadata is preserved, but guest refreshes are not written back to Secrets Manager. Do not share one rotating credential between active local and cloud processes or assume unattended subscription renewal works.
- Suspension reduces compute use; images, snapshots, storage and supporting AWS services can still incur charges. See [AWS pricing](https://aws.amazon.com/lambda/pricing/) for the selected region. Maximum duration bounds a VM, not total account spending.

## Setup from source

Use Node.js 22.19 or newer, an installed Pi CLI, Git and a configured AWS profile. The guest image pins Pi 1.4.0. Run this port from source; the commands below do not install an npm release.

```sh
npm ci
npm run build
```

Create a dedicated agent directory outside the checkout. Set both variables before starting the CLI or Pi extension:

```sh
export PI_AGENT_DIR="$HOME/.pi/cloud-personal/agent"
export PI_CODING_AGENT_DIR="$PI_AGENT_DIR"
mkdir -p "$PI_AGENT_DIR"
chmod 700 "$PI_AGENT_DIR"
```

Use Pi's `/login` in that profile for the intended provider. Do not copy global auth, settings, environment files or conversation history. For personal ChatGPT assignments, create `pi-cloud-agents.json` in that directory with an explicitly selected AWS profile/region and separate short stack/image names. For example, replace the profile and region below with your own:

```json
{
  "aws": { "profile": "personal", "region": "eu-north-1" },
  "stackName": "pi-cloud-personal",
  "image": { "name": "pi-cloud-personal", "memoryMiB": 2048 },
  "defaults": {
    "model": { "provider": "openai", "id": "gpt-6.1-sol" },
    "autoPush": false,
    "maxDurationHours": 1,
    "maxConcurrent": 1,
    "idle": { "suspendAfterMin": 2, "terminateAfterSuspendedMin": 5 }
  },
  "providers": { "synced": ["openai"], "oauthOptIn": ["openai"], "bedrockRole": false },
  "github": { "mode": "none" }
}
```

Use an owned public repository when testing without a GitHub credential. Inspect the selected profile and configuration, then preview and deploy:

```sh
node dist/cli/main.js setup --non-interactive --config "$PI_AGENT_DIR/pi-cloud-agents.json" --dry-run
node dist/cli/main.js setup --non-interactive --config "$PI_AGENT_DIR/pi-cloud-agents.json"
```

Setup deploys core storage/roles, the image and controller, then syncs selected provider credentials to Secrets Manager. `--skip-providers` clears the provider selection; it does not retain it for later sync. Subsequent `sync` and `update` can transfer the selected local configuration again. Keep account-specific stacks and credential namespaces separate.

The example above is a reusable personal stack, not a disposable test deployment. Test operations must follow [the cloud-operation rules](AGENTS.md#cloud-operations--only-when-explicitly-authorized): explicit profile and region, test-prefixed/tagged resources, bounded runtime and verified cleanup. Existing stacks require an image rebuild to use runner changes.

## Launch and retrieve

Start Pi with this checkout's extension and the selected profile environment. Use an absolute extension path when starting from the assignment repository:

```sh
pi -e /absolute/path/to/pi-cloud-agents/extension/index.ts --skill /absolute/path/to/pi-cloud-agents/skills/cloud-assignment
```

The portable [cloud-assignment skill](skills/cloud-assignment/SKILL.md) describes input/account
isolation, bounded execution, artifact recovery and cleanup. A local package installation
(`pi install /absolute/path/to/pi-cloud-agents`) discovers both the extension and skill;
loading only `extension/index.ts` requires the explicit `--skill` option above.

The model-facing tool supports `launch`, `status`, `result`, `steer` and `stop`. For a bounded assignment that must not publish:

```json
{
  "action": "launch",
  "prompt": "Verify the requested change in this repository, preserve it, and report the evidence. Do not push.",
  "autoPush": false,
  "model": "openai/gpt-6.1-sol"
}
```

Launch resolves local `HEAD` to a commit and the guest fetches that exact commit. Dirty or unpushed work is not silently uploaded or substituted. Publishing policy resolves per-run `autoPush`, then `defaults.autoPush`, then the historical default `true`; set it explicitly when publication is not authorized.

Retrieve with `cloud_agent` action `result` and the returned `runId`. `wait: true` waits for settlement, subject to `timeoutSeconds`. The answer is read from persisted Pi session records; `settled` describes an agent turn, not a terminated VM or independently verified work. Interrupted work can retain an earlier answer marked incomplete.

The result includes a recovery reference with an S3 key, commit and SHA-256 digest. Download that bundle, verify its digest, and fetch it into an empty Git repository to recover the reported commit. Preservation includes agent-created commits and checkpointed dirty work even with pushing disabled. A preservation error means an earlier bundle may remain recoverable without covering the latest work. See [the protocol](docs/protocol.md) for exact fields.

Finish by stopping the exact run and verifying termination. Recover artifacts before deleting storage. Delete only the trial's provider secrets, object versions, image and stacks; broad cleanup can include another session's resources.

## Development

```sh
npm run check
npm run test:integration -- --maxWorkers=1
npm run build
```

Ordinary tests use fake services, temporary Git repositories and a mock model provider. Live AWS tests are separately gated and require cleanup. [AGENTS.md](AGENTS.md) describes the operating rules and [the protocol](docs/protocol.md) documents persisted contracts.

## License

MIT. Upstream notices are retained in [LICENSE](LICENSE).
