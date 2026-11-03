# Repository Agent Entry Point (Codex)

Before doing anything else, read `global/models/codex/AGENT.md` — it defines the reading order, priorities, and rules for working in this repository.

- Project-specific context lives under `local/<project-name>/`. If it is missing or incomplete, follow `global/models/codex/project-rules.md`.
- This repository also hosts a parallel [Claude model](./global/models/claude/README.md); both models share `local/`.
- Other projects receive `global/` one-way via `node scripts/sync.mjs` run from this repository (targets in `sync-targets.json`). Inside an installed copy, never edit `ai-agents/` or the managed entrypoint block.
- Keep this entry point concise. Put detailed durable rules in the linked Codex documents and use nested `AGENTS.md` files only for subtree-specific overrides.
