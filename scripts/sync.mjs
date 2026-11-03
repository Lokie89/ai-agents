#!/usr/bin/env node
// 사용법: node scripts/sync.mjs [--dry-run] [대상 이름 ...]
// 원본 저장소(이 저장소)의 global을 sync-targets.json의 프로젝트들로 한 방향 동기화한다.
import {readFileSync} from "node:fs";
import {basename, dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {syncTarget} from "./lib/sync.mjs";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const only = args.filter((a) => !a.startsWith("--"));
const {targets} = JSON.parse(readFileSync(resolve(sourceRoot, "sync-targets.json"), "utf8"));
const selected = targets.map((t) => resolve(sourceRoot, t)).filter((t) => only.length === 0 || only.includes(basename(t)));

if (only.length && selected.length !== only.length) {
  console.error(`sync-targets.json에 없는 대상: ${only.filter((n) => !selected.some((t) => basename(t) === n)).join(", ")}`);
  process.exit(2);
}

let failed = 0;
for (const target of selected) {
  console.log(`\n=== ${basename(target)}${dryRun ? " (dry-run)" : ""}`);
  try {
    const {actions, warnings, commit} = syncTarget(sourceRoot, target, {dryRun});
    const counts = {};
    for (const a of actions) counts[a.split(" ")[0]] = (counts[a.split(" ")[0]] ?? 0) + 1;
    console.log(`source ${commit} | ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(", ") || "no changes"}`);
    for (const a of actions.filter((x) => !x.startsWith("write ai-agents/") && !x.startsWith("delete ai-agents/"))) console.log(`  ${a}`);
    for (const w of warnings) console.log(`  ! ${w}`);
  } catch (error) {
    failed += 1;
    console.error(`  FAILED: ${error.message}`);
  }
}
process.exit(failed ? 1 : 0);
