// 원본 ai-agents 저장소의 global을 대상 프로젝트로 한 방향 동기화한다.
// 정책(global/models/*/AGENT.md `글로벌과 로컬`):
// - 대상의 `ai-agents/`는 원본의 읽기 전용 사본이다. 동기화가 덮어쓴다.
// - 대상의 local 하네스(`docs/agents/`)는 프로젝트 소유다. 없을 때 뼈대만 만들고 그 뒤로는 고치지 않는다.
//   단, 옛 위치(`ai-agents/local/<project>/`)에 있으면 한 번 옮기고 경로를 고친다.
// - 루트 `.claude/`, `.codex/`에는 원본 파일을 설치하되, 원본 이력에 없는 사용자 수정본은 건너뛴다.
import {createHash} from "node:crypto";
import {execFileSync} from "node:child_process";
import {
  existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, rmdirSync, statSync, writeFileSync,
} from "node:fs";
import {dirname, join, relative, resolve, sep} from "node:path";

export const LOCAL_DIR = "docs/agents";
export const COPY_DIR = "ai-agents";
export const BLOCK_START = "<!-- ai-agents:start -->";
export const BLOCK_END = "<!-- ai-agents:end -->";
export const LOCAL_DOC_LIMIT_BYTES = 40 * 1024;
export const HANDOFF_ENTRY_LIMIT = 5;

const COPY_SOURCES = ["global", "local/_template", "local/sample-project", "local/README.md"];
const ROOT_INSTALL_SOURCES = [".claude/agents", ".claude/hooks", ".codex/agents"];
const SOURCE_LOCAL_NAMES = new Set(["_template", "sample-project", "ai-agents", "README.md"]);
const TEXT_EXT = /\.(md|txt|json|ya?ml|toml|sh|mjs|cjs|js|ts|py|kt|kts|java|gradle|properties|xml|cfg|ini)$/i;
const WALK_SKIP = new Set([".git", "node_modules", "build", ".gradle", ".idea", ".venv", "venv", "dist", "out", COPY_DIR]);

const posix = (p) => p.split(sep).join("/");
const lf = (s) => s.replace(/\r\n/g, "\n");
const gitBlobId = (buf) => createHash("sha1").update(`blob ${buf.length}\0`).update(buf).digest("hex");

function walk(root, rel = "", skip = new Set()) {
  const dir = join(root, rel);
  if (!existsSync(dir)) return [];
  if (statSync(dir).isFile()) return [rel];
  const out = [];
  for (const name of readdirSync(dir)) {
    const child = rel ? `${rel}/${name}` : name;
    if (skip.has(name)) continue;
    if (statSync(join(root, child)).isDirectory()) out.push(...walk(root, child, skip));
    else out.push(child);
  }
  return out;
}

function sourceCommit(sourceRoot) {
  try {
    const head = execFileSync("git", ["-C", sourceRoot, "rev-parse", "HEAD"], {encoding: "utf8"}).trim();
    const dirty = execFileSync("git", ["-C", sourceRoot, "status", "--porcelain", "--", ...COPY_SOURCES, ...ROOT_INSTALL_SOURCES],
      {encoding: "utf8"}).trim();
    return dirty ? `${head}+uncommitted` : head;
  } catch {
    return "unknown";
  }
}

// 원본 이력에 한 번이라도 있었던 파일 내용의 집합. 대상 파일이 여기에 속하면 "원본에서 온 것"으로 본다.
function knownBlobs(sourceRoot, currentFiles) {
  const ids = new Set();
  try {
    const out = execFileSync("git", ["-C", sourceRoot, "rev-list", "--all", "--objects"],
      {encoding: "utf8", maxBuffer: 64 * 1024 * 1024});
    for (const line of out.split("\n")) if (line) ids.add(line.slice(0, 40));
  } catch {
    // git이 없으면 현재 원본 파일만 기준으로 삼는다.
  }
  for (const text of currentFiles.values()) ids.add(gitBlobId(Buffer.from(text, "utf8")));
  return ids;
}

function isKnown(buf, blobs) {
  if (blobs.has(gitBlobId(buf))) return true;
  const text = buf.toString("utf8");
  return text.includes("\r\n") && blobs.has(gitBlobId(Buffer.from(lf(text), "utf8")));
}

function claudeBlock() {
  return [
    BLOCK_START,
    "<!-- 원본 ai-agents 저장소의 scripts/sync.mjs가 관리하는 블록입니다. 블록 안은 직접 고치지 마세요. -->",
    "## AI 에이전트 하네스",
    "",
    `- 공통 규칙(global): \`${COPY_DIR}/global/\`. 원본 \`ai-agents\` 저장소의 읽기 전용 사본이므로 이 프로젝트 세션에서는 수정하지 않는다.`,
    `- 이 프로젝트의 local 하네스: \`${LOCAL_DIR}/\`. global 문서의 \`local/<project-name>/\`는 이 경로를 뜻한다. 이 프로젝트에서 생기는 규칙과 기록은 여기에만 쓴다.`,
    "- 규칙 확인 순서: global을 먼저 보고 local을 본다. 충돌하면 local을 따른다.",
    `- 아래 \`AGENT.md\`에 나오는 문서 이름(\`goal.md\`, \`roles.md\` 등)은 \`${COPY_DIR}/global/models/claude/\` 기준이다.`,
    "",
    `@${COPY_DIR}/global/models/claude/AGENT.md`,
    `@${LOCAL_DIR}/context-map.md`,
    BLOCK_END,
  ].join("\n");
}

function codexBlock() {
  return [
    BLOCK_START,
    "<!-- 원본 ai-agents 저장소의 scripts/sync.mjs가 관리하는 블록입니다. 블록 안은 직접 고치지 마세요. -->",
    "## AI 에이전트 하네스",
    "",
    `- 작업 전에 \`${COPY_DIR}/global/models/codex/AGENT.md\`를 읽고 그 읽는 순서를 따른다. 문서 이름은 \`${COPY_DIR}/global/models/codex/\` 기준이다.`,
    `- 그다음 이 프로젝트의 local 하네스 \`${LOCAL_DIR}/context-map.md\`를 읽는다.`,
    `- 공통 규칙(global): \`${COPY_DIR}/global/\`. 원본 \`ai-agents\` 저장소의 읽기 전용 사본이므로 이 프로젝트 세션에서는 수정하지 않는다.`,
    `- 이 프로젝트의 local 하네스: \`${LOCAL_DIR}/\`. global 문서의 \`local/<project-name>/\`는 이 경로를 뜻한다. 이 프로젝트에서 생기는 규칙과 기록은 여기에만 쓴다.`,
    "- 규칙 확인 순서: global을 먼저 보고 local을 본다. 충돌하면 local을 따른다.",
    BLOCK_END,
  ].join("\n");
}

function copyNotice(model, commit) {
  const entry = model === "claude" ? "CLAUDE.md" : "AGENTS.md";
  return [
    `# ai-agents 사본 (읽기 전용)`,
    "",
    `이 디렉터리는 원본 \`ai-agents\` 저장소에서 \`scripts/sync.mjs\`로 복사한 global 규칙의 읽기 전용 사본이다 (원본 커밋: \`${commit}\`).`,
    "",
    `- 작업 진입점은 프로젝트 루트의 \`${entry}\`다.`,
    `- 이 디렉터리 안의 파일은 수정하지 않는다. 다음 동기화 때 덮어써진다.`,
    `- 이 프로젝트의 규칙과 기록은 \`../${LOCAL_DIR}/\`에 쓴다. global 문서의 \`local/<project-name>/\`는 그 경로를 뜻한다.`,
    "",
  ].join("\n");
}

function upsertBlock(existing, block) {
  if (existing === null) return `${block}\n`;
  const text = lf(existing);
  const start = text.indexOf(BLOCK_START);
  const end = text.indexOf(BLOCK_END);
  if (start !== -1 && end > start) {
    return text.slice(0, start) + block + text.slice(end + BLOCK_END.length);
  }
  return `${block}\n\n${text}`;
}

function rewriteLinks(text, oldFileAbs, newFileAbs, movedRootAbs) {
  return text.replace(/\]\(([^)\s]+)\)/g, (whole, target) => {
    if (/^([a-z]+:|#|\/)/i.test(target)) return whole;
    const [path, anchor] = target.split("#");
    if (!path) return whole;
    const abs = resolve(dirname(oldFileAbs), path);
    if (abs === movedRootAbs || abs.startsWith(movedRootAbs + sep)) return whole;
    const next = posix(relative(dirname(newFileAbs), abs)) + (anchor !== undefined ? `#${anchor}` : "");
    return `](${next})`;
  });
}

function rewriteRefs(text, legacyName, {bareLocal}) {
  const esc = legacyName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let out = text
    .replace(new RegExp(`${COPY_DIR}/local/${esc}(?![A-Za-z0-9_.-])`, "g"), LOCAL_DIR)
    .replace(new RegExp(`${COPY_DIR}\\\\local\\\\${esc}(?![A-Za-z0-9_.-])`, "g"), LOCAL_DIR.replace("/", "\\"));
  if (bareLocal) {
    out = out.replace(new RegExp(`(?<![A-Za-z0-9_./-])local/${esc}(?![A-Za-z0-9_.-])`, "g"), LOCAL_DIR);
  }
  return out;
}

function projectTextFiles(targetRoot) {
  let files;
  try {
    files = execFileSync("git", ["-C", targetRoot, "ls-files", "-z"], {encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"]})
      .split("\0").filter(Boolean);
  } catch {
    files = walk(targetRoot, "", WALK_SKIP);
  }
  return files.filter((f) => TEXT_EXT.test(f) && !f.startsWith(`${COPY_DIR}/`) && !f.startsWith(`${LOCAL_DIR}/`)
    && existsSync(join(targetRoot, f)) && statSync(join(targetRoot, f)).size < 2 * 1024 * 1024);
}

// 훅은 명령 문자열이 아니라 가리키는 스크립트(.claude/hooks/<이름>)로 식별한다.
// 같은 스크립트를 가리키는 대상 훅은 원본이 관리하는 것이므로 원본 명령으로 교체한다(경로 형식 변경 이관).
const hookScript = (command) => command?.match(/\.claude\/hooks\/[\w.-]+/)?.[0] ?? null;

function mergeSettings(targetText, sourceSettings) {
  const target = targetText === null ? {} : JSON.parse(targetText);
  const hooks = target.hooks ?? {};
  for (const [event, groups] of Object.entries(sourceSettings.hooks ?? {})) {
    let current = hooks[event] ?? [];
    for (const group of groups) {
      const sourceHooks = group.hooks ?? [];
      const scripts = new Set(sourceHooks.map((h) => hookScript(h.command)).filter(Boolean));
      const sourceCommands = new Set(sourceHooks.map((h) => h.command));
      current = current
        .map((g) => ({...g, hooks: (g.hooks ?? []).filter((h) =>
          sourceCommands.has(h.command) || !scripts.has(hookScript(h.command)))}))
        .filter((g) => g.hooks.length > 0);
      const commands = new Set(current.flatMap((g) => g.hooks.map((h) => h.command)));
      if (!sourceHooks.every((h) => commands.has(h.command))) current.push(group);
    }
    hooks[event] = current;
  }
  return `${JSON.stringify({...target, hooks}, null, 2)}\n`;
}

export function syncTarget(sourceRootIn, targetRootIn, {dryRun = false} = {}) {
  const sourceRoot = resolve(sourceRootIn);
  const targetRoot = resolve(targetRootIn);
  const actions = [];
  const warnings = [];
  const commit = sourceCommit(sourceRoot);

  const writeText = (rel, text) => {
    const p = join(targetRoot, rel);
    if (existsSync(p) && lf(readFileSync(p, "utf8")) === lf(text)) return false;
    actions.push(`write ${rel}`);
    if (!dryRun) {
      mkdirSync(dirname(p), {recursive: true});
      writeFileSync(p, text, "utf8");
    }
    return true;
  };

  // 1. 원본 파일 목록
  const copyFiles = new Map();
  for (const src of COPY_SOURCES) {
    for (const rel of walk(sourceRoot, src)) copyFiles.set(`${COPY_DIR}/${rel}`, readFileSync(join(sourceRoot, rel), "utf8"));
  }
  copyFiles.set(`${COPY_DIR}/CLAUDE.md`, copyNotice("claude", commit));
  copyFiles.set(`${COPY_DIR}/AGENTS.md`, copyNotice("codex", commit));
  copyFiles.set(`${COPY_DIR}/README.md`, copyNotice("claude", commit));
  copyFiles.set(`${COPY_DIR}/VERSION`, `${commit}\n`);
  const rootFiles = new Map();
  for (const src of ROOT_INSTALL_SOURCES) {
    for (const rel of walk(sourceRoot, src)) rootFiles.set(rel, readFileSync(join(sourceRoot, rel), "utf8"));
  }
  const blobs = knownBlobs(sourceRoot, new Map([...copyFiles, ...rootFiles]));

  // 2. 옛 위치의 local 하네스 이전
  const legacyRoot = join(targetRoot, COPY_DIR, "local");
  const legacyNames = existsSync(legacyRoot)
    ? readdirSync(legacyRoot).filter((n) => !SOURCE_LOCAL_NAMES.has(n) && statSync(join(legacyRoot, n)).isDirectory())
    : [];
  const localAbs = join(targetRoot, LOCAL_DIR);
  let migrating = null;
  if (legacyNames.length > 1) {
    warnings.push(`옛 local 하네스가 여러 개라 옮기지 않았다: ${legacyNames.join(", ")}`);
  } else if (legacyNames.length === 1 && existsSync(localAbs)) {
    warnings.push(`${COPY_DIR}/local/${legacyNames[0]}와 ${LOCAL_DIR}가 모두 있어 옮기지 않았다. 직접 합쳐야 한다.`);
  } else if (legacyNames.length === 1) {
    migrating = legacyNames[0];
  }
  const migratedFrom = migrating ? join(legacyRoot, migrating) : null;

  if (migrating) {
    const moved = walk(migratedFrom);
    actions.push(`move ${COPY_DIR}/local/${migrating} -> ${LOCAL_DIR} (${moved.length} files)`);
    // 옮길 파일 안의 상대 링크와 경로 표현을 새 위치 기준으로 고친다.
    const rewritten = new Map();
    for (const rel of moved.filter((f) => TEXT_EXT.test(f))) {
      const oldAbs = join(migratedFrom, rel);
      const before = readFileSync(oldAbs, "utf8");
      let after = rel.endsWith(".md") ? rewriteLinks(before, oldAbs, join(localAbs, rel), migratedFrom) : before;
      after = rewriteRefs(after, migrating, {bareLocal: true});
      if (after !== before) rewritten.set(rel, after);
    }
    if (rewritten.size) actions.push(`rewrite paths in ${rewritten.size} moved file(s)`);
    const projectRewrites = [];
    for (const rel of projectTextFiles(targetRoot)) {
      const before = readFileSync(join(targetRoot, rel), "utf8");
      const isEntry = rel === "CLAUDE.md" || rel === "AGENTS.md";
      const after = rewriteRefs(before, migrating, {bareLocal: isEntry});
      if (after !== before) projectRewrites.push([rel, after]);
    }
    // 이동이 먼저다. 이동이 실패하면(예: Windows에서 다른 프로세스가 폴더를 잡고 있음) 아무것도 쓰지 않고 멈춘다.
    if (!dryRun) {
      mkdirSync(dirname(localAbs), {recursive: true});
      try {
        renameSync(migratedFrom, localAbs);
      } catch (error) {
        throw new Error(`${COPY_DIR}/local/${migrating}를 ${LOCAL_DIR}로 옮기지 못해 아무것도 바꾸지 않았다. `
          + `그 폴더를 열고 있는 IDE, 터미널, 프로세스를 닫고 다시 실행한다. (${error.code ?? error.message})`);
      }
      for (const [rel, text] of rewritten) writeFileSync(join(localAbs, rel), text, "utf8");
    }
    for (const [rel, text] of projectRewrites) writeText(rel, text);
  }

  // 3. global 사본: 관리 파일은 덮어쓰고, 그 밖의 파일은 원본 이력에 있으면 지우고 없으면 남긴다.
  for (const [rel, text] of copyFiles) {
    const p = join(targetRoot, rel);
    if (existsSync(p) && lf(readFileSync(p, "utf8")) !== lf(text) && !isKnown(readFileSync(p), blobs)) {
      warnings.push(`원본에 없던 내용의 ${rel}을 원본으로 덮어썼다 (global 사본은 읽기 전용).`);
    }
    writeText(rel, text);
  }
  const copyRoot = join(targetRoot, COPY_DIR);
  for (const rel of walk(targetRoot, COPY_DIR)) {
    if (copyFiles.has(rel)) continue;
    if (migratedFrom && join(targetRoot, rel).startsWith(migratedFrom + sep)) continue;
    if (isKnown(readFileSync(join(targetRoot, rel)), blobs)) {
      actions.push(`delete ${rel}`);
      if (!dryRun) rmSync(join(targetRoot, rel));
    } else {
      warnings.push(`원본 이력에 없는 파일이라 남겼다: ${rel}`);
    }
  }
  if (!dryRun && existsSync(copyRoot)) removeEmptyDirs(copyRoot);

  // 4. 루트 .claude / .codex 설치
  for (const [rel, text] of rootFiles) {
    const p = join(targetRoot, rel);
    if (existsSync(p) && lf(readFileSync(p, "utf8")) !== lf(text) && !isKnown(readFileSync(p), blobs)) {
      warnings.push(`사용자가 고친 것으로 보여 덮어쓰지 않았다: ${rel}`);
      continue;
    }
    writeText(rel, text);
  }
  const sourceSettings = JSON.parse(readFileSync(join(sourceRoot, ".claude/settings.json"), "utf8"));
  const settingsPath = join(targetRoot, ".claude/settings.json");
  try {
    const current = existsSync(settingsPath) ? readFileSync(settingsPath, "utf8") : null;
    writeText(".claude/settings.json", mergeSettings(current, sourceSettings));
  } catch (error) {
    warnings.push(`.claude/settings.json을 해석할 수 없어 hook을 병합하지 않았다: ${error.message}`);
  }

  // 5. 루트 진입점 관리 블록
  for (const [rel, block] of [["CLAUDE.md", claudeBlock()], ["AGENTS.md", codexBlock()]]) {
    const p = join(targetRoot, rel);
    // 이전 단계에서 dry-run으로 경로만 바꾼 경우에도 같은 결과를 내도록 현재 내용 기준으로 계산한다.
    let current = existsSync(p) ? readFileSync(p, "utf8") : null;
    if (current !== null && migrating) current = rewriteRefs(current, migrating, {bareLocal: true});
    const next = upsertBlock(current, block);
    if (existsSync(p) && lf(readFileSync(p, "utf8")) === lf(next)) continue;
    if (!actions.includes(`write ${rel}`)) actions.push(`write ${rel}`);
    if (!dryRun) writeFileSync(p, next, "utf8");
  }

  // 6. local 뼈대와 크기 점검
  const localDocsRoot = migrating && dryRun ? migratedFrom : localAbs;
  const templateRoot = join(sourceRoot, "local/_template");
  if (!migrating && !existsSync(localAbs)) {
    for (const rel of walk(templateRoot)) writeText(`${LOCAL_DIR}/${rel}`, readFileSync(join(templateRoot, rel), "utf8"));
    warnings.push(`${LOCAL_DIR}/를 템플릿으로 새로 만들었다. 프로젝트 내용으로 채워야 한다.`);
  } else if (!existsSync(join(localDocsRoot, "context-map.md"))) {
    writeText(`${LOCAL_DIR}/context-map.md`, readFileSync(join(templateRoot, "context-map.md"), "utf8"));
    warnings.push(`${LOCAL_DIR}/context-map.md가 없어 템플릿으로 만들었다. 진입점이 이 파일을 불러오므로 채워야 한다.`);
  }
  if (existsSync(localDocsRoot)) {
    for (const name of readdirSync(localDocsRoot)) {
      const p = join(localDocsRoot, name);
      if (!name.endsWith(".md") || !statSync(p).isFile() || name === "handoff-archive.md") continue;
      const size = statSync(p).size;
      if (size > LOCAL_DOC_LIMIT_BYTES) {
        warnings.push(`${LOCAL_DIR}/${name} 크기 ${Math.round(size / 1024)}KB (상한 ${LOCAL_DOC_LIMIT_BYTES / 1024}KB): 한 번에 읽히지 않는다.`);
      }
      if (name === "handoff-log.md") {
        const entries = (readFileSync(p, "utf8").match(/^#{2,3} \d{4}-\d{2}-\d{2}/gm) ?? []).length;
        if (entries > HANDOFF_ENTRY_LIMIT) {
          warnings.push(`${LOCAL_DIR}/handoff-log.md 기록 ${entries}건 (최근 ${HANDOFF_ENTRY_LIMIT}건 규칙): 오래된 기록을 handoff-archive.md로 옮겨야 한다.`);
        }
      }
    }
  }

  return {target: targetRoot, commit, actions, warnings};
}

function removeEmptyDirs(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) removeEmptyDirs(p);
  }
  if (readdirSync(dir).length === 0) rmdirSync(dir);
}
