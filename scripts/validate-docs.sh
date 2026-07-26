#!/usr/bin/env sh
set -eu

failures=0

require_file() {
  if [ ! -f "$1" ]; then
    printf 'missing file: %s\n' "$1"
    failures=$((failures + 1))
  fi
}

require_text() {
  file="$1"
  text="$2"
  label="$3"

  if [ ! -f "$file" ]; then
    printf 'missing file for text check: %s\n' "$file"
    failures=$((failures + 1))
    return
  fi

  if ! grep -F "$text" "$file" >/dev/null 2>&1; then
    printf 'missing text: %s in %s\n' "$label" "$file"
    failures=$((failures + 1))
  fi
}

require_file "README.md"
require_file "global/models/codex/README.md"
require_file "global/models/codex/AGENT.md"
require_file "global/models/codex/context-map.md"
require_file "global/models/codex/validation.md"
require_file "global/models/codex/handoff-log.md"
require_file "global/models/codex/harness/README.md"
require_file "global/models/codex/harness/state-machine.md"
require_file "global/models/codex/harness/failure-cases.md"
require_file "global/models/codex/harness/output-schema.md"
require_file "global/models/codex/harness/fixtures.md"
require_file "local/README.md"
require_file "local/_template/domain-policy.md"
require_file "local/sample-project/goal.md"
require_file "local/sample-project/context-map.md"
require_file "local/sample-project/domain-policy.md"
require_file "local/sample-project/validation.md"
require_file "local/sample-project/handoff-log.md"

require_text "README.md" "./global/models/codex/harness/README.md" "root harness link"
require_text "global/models/codex/README.md" "./harness/README.md" "codex harness link"
require_text "global/models/codex/context-map.md" "Harness Documents" "harness context section"
require_text "global/models/codex/validation.md" "## 하네스 검증" "harness validation section"
require_text "global/models/codex/harness/README.md" "state-machine.md" "state machine reference"
require_text "global/models/codex/harness/README.md" "failure-cases.md" "failure cases reference"
require_text "global/models/codex/harness/README.md" "output-schema.md" "output schema reference"
require_text "global/models/codex/harness/README.md" "fixtures.md" "fixtures reference"
require_text "local/README.md" "./sample-project/" "sample project link"
require_text "local/sample-project/domain-policy.md" "Badge" "sample domain concept"

if [ "$failures" -ne 0 ]; then
  printf 'document validation failed: %s issue(s)\n' "$failures"
  exit 1
fi

printf 'document validation passed\n'
