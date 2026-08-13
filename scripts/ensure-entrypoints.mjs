#!/usr/bin/env node
import {existsSync, writeFileSync} from "node:fs";

const entrypoints = [
  {
    path: "AGENTS.md",
    contents: `# Repository Agent Entry Point (Codex)

Before doing anything else, read \`global/models/codex/AGENT.md\` — it defines the reading order, priorities, and rules for working in this repository.

- Project-specific context lives under \`local/<project-name>/\`. If it is missing or incomplete, follow \`global/models/codex/project-rules.md\`.
- This repository also hosts a parallel [Claude model](./global/models/claude/README.md); both models share \`local/\`.
- Keep this entry point concise. Put detailed durable rules in the linked Codex documents and use nested \`AGENTS.md\` files only for subtree-specific overrides.
`,
  },
  {
    path: "CLAUDE.md",
    contents: `# Repository Agent Entry Point (Claude Code)

Before doing anything else, read \`global/models/claude/AGENT.md\` — it defines the reading order, priorities, and rules for working in this repository.

- Project-specific context lives under \`local/<project-name>/\`. If it's missing or thin, follow \`global/models/claude/project-rules.md\`.
- This repo also hosts a parallel [Codex model](./global/models/codex/README.md) under the same \`global/\`/\`local/\` split; \`local/\` is shared between them.
- Keep this entry point concise. Put detailed durable rules in the linked Claude documents and use nested \`CLAUDE.md\` files only for subtree-specific overrides.
`,
  },
];

let created = 0;

for (const entrypoint of entrypoints) {
  if (existsSync(entrypoint.path)) {
    console.log(`exists: ${entrypoint.path}`);
    continue;
  }

  writeFileSync(entrypoint.path, entrypoint.contents, "utf8");
  created += 1;
  console.log(`created: ${entrypoint.path}`);
}

console.log(`entrypoint bootstrap complete: ${created} created`);
