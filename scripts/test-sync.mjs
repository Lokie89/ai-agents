#!/usr/bin/env node
// sync.mjs 회귀 테스트: 원본 저장소(이 저장소)를 소스로, 임시 대상 프로젝트에 동기화한다.
import assert from "node:assert/strict";
import {existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {dirname, join, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {execFileSync} from "node:child_process";
import {syncTarget, BLOCK_START} from "./lib/sync.mjs";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let passed = 0;

function write(root, rel, text) {
  const p = join(root, rel);
  mkdirSync(dirname(p), {recursive: true});
  writeFileSync(p, text, "utf8");
}
const read = (root, rel) => readFileSync(join(root, rel), "utf8");

function legacyTarget() {
  const t = mkdtempSync(join(tmpdir(), "sync-target-"));
  write(t, "build.gradle", "// project marker\n");
  // 원본 이력에 있는 오래된 관리 파일
  write(t, "ai-agents/global/models/claude/AGENT.md", "stale\n");
  write(t, "ai-agents/scripts/ensure-entrypoints.mjs", execFileSync("git", ["-C", sourceRoot, "show", "d2dc8b5:scripts/ensure-entrypoints.mjs"], {encoding: "utf8"}));
  // 원본 이력에 없는 사용자 파일
  write(t, "ai-agents/custom-note.md", "user note\n");
  // 옛 위치의 local 하네스
  write(t, "ai-agents/local/demo/handoff-log.md",
    "# log\n\n[agent](../../global/models/claude/AGENT.md) [tools](tools.md)\n");
  write(t, "ai-agents/local/demo/tools.md", "# tools\n");
  write(t, "ai-agents/local/demo/analysis/a.md",
    "[g](../../../global/models/claude/goal.md) [up](../handoff-log.md)\n");
  // 프로젝트 루트
  write(t, "CLAUDE.md", "# Demo rules\n\nRead `ai-agents/local/demo/tools.md`.\n");
  write(t, "docs/readme.md", "see [log](../ai-agents/local/demo/handoff-log.md)\n");
  write(t, ".claude/agents/reviewer.md", "custom reviewer\n");
  write(t, ".claude/settings.json", JSON.stringify({permissions: {allow: ["Bash(ls)"]}}, null, 2));
  return t;
}

function test(name, fn) {
  const t = legacyTarget();
  try {
    fn(t);
    passed += 1;
  } catch (error) {
    console.error(`FAIL: ${name}`);
    throw error;
  } finally {
    rmSync(t, {recursive: true, force: true});
  }
}

test("dry-run은 아무것도 바꾸지 않는다", (t) => {
  const report = syncTarget(sourceRoot, t, {dryRun: true});
  assert.ok(report.actions.length > 0);
  assert.equal(read(t, "ai-agents/global/models/claude/AGENT.md"), "stale\n");
  assert.ok(existsSync(join(t, "ai-agents/local/demo/tools.md")));
  assert.ok(!existsSync(join(t, "docs/agents")));
});

test("옛 local 하네스를 docs/agents로 옮기고 경로를 고친다", (t) => {
  syncTarget(sourceRoot, t, {});
  assert.ok(!existsSync(join(t, "ai-agents/local/demo")));
  assert.match(read(t, "docs/agents/handoff-log.md"), /\]\(\.\.\/\.\.\/ai-agents\/global\/models\/claude\/AGENT\.md\)/);
  assert.match(read(t, "docs/agents/handoff-log.md"), /\]\(tools\.md\)/);
  const a = read(t, "docs/agents/analysis/a.md");
  assert.match(a, /\]\(\.\.\/\.\.\/\.\.\/ai-agents\/global\/models\/claude\/goal\.md\)/);
  assert.match(a, /\]\(\.\.\/handoff-log\.md\)/);
  assert.match(read(t, "docs/readme.md"), /\.\.\/docs\/agents\/handoff-log\.md/);
  assert.match(read(t, "CLAUDE.md"), /`docs\/agents\/tools\.md`/);
});

test("global 사본은 덮어쓰고, 원본 이력의 낡은 파일은 지우고, 모르는 파일은 남긴다", (t) => {
  const report = syncTarget(sourceRoot, t, {});
  assert.equal(read(t, "ai-agents/global/models/claude/AGENT.md"), read(sourceRoot, "global/models/claude/AGENT.md"));
  assert.ok(!existsSync(join(t, "ai-agents/scripts/ensure-entrypoints.mjs")));
  assert.ok(existsSync(join(t, "ai-agents/custom-note.md")));
  assert.ok(report.warnings.some((w) => w.includes("custom-note.md")));
  assert.ok(existsSync(join(t, "ai-agents/VERSION")));
  assert.ok(existsSync(join(t, "ai-agents/local/_template/context-map.md")));
});

test("루트 진입점은 관리 블록만 넣고 기존 내용은 보존하며, 다시 실행해도 그대로다", (t) => {
  syncTarget(sourceRoot, t, {});
  const claude = read(t, "CLAUDE.md");
  assert.ok(claude.startsWith(BLOCK_START));
  assert.match(claude, /^@ai-agents\/global\/models\/claude\/AGENT\.md$/m);
  assert.match(claude, /^@docs\/agents\/context-map\.md$/m);
  assert.match(claude, /# Demo rules/);
  assert.match(read(t, "AGENTS.md"), /ai-agents\/global\/models\/codex\/AGENT\.md/);
  const second = syncTarget(sourceRoot, t, {});
  assert.equal(read(t, "CLAUDE.md"), claude);
  assert.deepEqual(second.actions.filter((a) => a.startsWith("write") || a.startsWith("move")), []);
});

test("루트 .claude는 원본 파일을 설치하되 사용자 수정본은 건너뛰고 settings는 병합한다", (t) => {
  const report = syncTarget(sourceRoot, t, {});
  assert.equal(read(t, ".claude/agents/reviewer.md"), "custom reviewer\n");
  assert.ok(report.warnings.some((w) => w.includes(".claude/agents/reviewer.md")));
  assert.ok(existsSync(join(t, ".claude/agents/backend-developer.md")));
  assert.ok(existsSync(join(t, ".claude/hooks/review-replan-check.sh")));
  assert.ok(existsSync(join(t, ".codex/agents/reviewer.toml")));
  const settings = JSON.parse(read(t, ".claude/settings.json"));
  assert.deepEqual(settings.permissions.allow, ["Bash(ls)"]);
  assert.equal(settings.hooks.Stop.length, 1);
  syncTarget(sourceRoot, t, {});
  assert.equal(JSON.parse(read(t, ".claude/settings.json")).hooks.Stop.length, 1);
});

test("local 문서가 너무 크거나 인계 기록이 많으면 경고한다", (t) => {
  write(t, "ai-agents/local/demo/domain-policy.md", "x".repeat(50_000));
  write(t, "ai-agents/local/demo/handoff-log.md",
    Array.from({length: 7}, (_, i) => `## 2026-01-0${i + 1}\n- 목표: x\n`).join("\n"));
  const report = syncTarget(sourceRoot, t, {});
  assert.ok(report.warnings.some((w) => w.includes("domain-policy.md") && w.includes("KB")));
  assert.ok(report.warnings.some((w) => w.includes("handoff-log.md") && w.includes("7")));
});

test("local 하네스가 없는 프로젝트에는 템플릿 뼈대를 만든다", (t) => {
  rmSync(join(t, "ai-agents"), {recursive: true, force: true});
  syncTarget(sourceRoot, t, {});
  assert.ok(existsSync(join(t, "docs/agents/context-map.md")));
  assert.ok(existsSync(join(t, "docs/agents/domain-policy.md")));
});

console.log(`sync tests passed: ${passed} case(s)`);
