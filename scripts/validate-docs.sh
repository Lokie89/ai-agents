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
require_file "global/models/codex/project-rules.md"
require_file "global/models/codex/validation.md"
require_file "global/models/codex/handoff-log.md"
require_file "global/models/codex/harness/README.md"
require_file "global/models/codex/harness/state-machine.md"
require_file "global/models/codex/harness/failure-cases.md"
require_file "global/models/codex/harness/output-schema.md"
require_file "global/models/codex/harness/fixtures.md"
require_file "global/models/codex/harness/evaluation-rubric.md"
require_file "local/README.md"
require_file "local/_template/domain-policy.md"
require_file "local/_template/goal.md"
require_file "local/_template/context-map.md"
require_file "local/_template/tools.md"
require_file "local/_template/validation.md"
require_file "local/_template/handoff-log.md"
require_file "local/sample-project/goal.md"
require_file "local/sample-project/context-map.md"
require_file "local/sample-project/domain-policy.md"
require_file "local/sample-project/validation.md"
require_file "local/sample-project/handoff-log.md"

require_text "README.md" "./global/models/codex/harness/README.md" "root harness link"
require_text "README.md" "project-rules.md" "root project rules reference"
require_text "global/models/codex/README.md" "./harness/README.md" "codex harness link"
require_text "global/models/codex/context-map.md" "Harness Documents" "harness context section"
require_text "global/models/codex/validation.md" "## 하네스 검증" "harness validation section"
require_text "global/models/codex/harness/README.md" "state-machine.md" "state machine reference"
require_text "global/models/codex/harness/README.md" "failure-cases.md" "failure cases reference"
require_text "global/models/codex/harness/README.md" "output-schema.md" "output schema reference"
require_text "global/models/codex/harness/README.md" "fixtures.md" "fixtures reference"
require_text "global/models/codex/harness/README.md" "evaluation-rubric.md" "evaluation rubric reference"
require_text "global/models/codex/context-map.md" "evaluation-rubric.md" "evaluation rubric context reference"
require_text "global/models/codex/validation.md" "evaluation-rubric.md" "evaluation rubric validation reference"
require_text "global/models/codex/README.md" "./project-rules.md" "project rules readme reference"
require_text "global/models/codex/AGENT.md" "project-rules.md" "project rules agent reference"
require_text "global/models/codex/context-map.md" "project-rules.md" "project rules context reference"
require_text "global/models/codex/validation.md" "## 프로젝트 하네스 검증" "project harness validation section"
require_text "global/models/codex/harness/output-schema.md" "## 로컬 하네스 대화 산출물" "local harness dialog schema"
require_text "global/models/codex/harness/output-schema.md" "## 프로젝트 생성 결과 산출물" "project creation result schema"
require_text "global/models/codex/harness/fixtures.md" "Fixture 10" "project bootstrap fixture"
require_text "global/models/codex/harness/fixtures.md" "프로젝트 경로" "project report fields fixture"
require_text "global/models/codex/harness/evaluation-rubric.md" "project_bootstrap" "project bootstrap request type"
require_text "global/models/codex/harness/failure-cases.md" "프로젝트 하네스 위반" "project harness failure section"
require_text "global/models/codex/project-rules.md" "새 프로젝트 기본 완료 체크리스트" "project completion checklist"
require_text "global/models/codex/project-rules.md" "프로젝트 유형별 최소 기준" "project type minimums"
require_text "global/models/codex/project-rules.md" "로컬 하네스 작성 품질 기준" "local harness quality criteria"
require_text "global/models/codex/project-rules.md" "local/_template/" "local template reference"
require_text "global/models/codex/validation.md" "유형별 최소 기준" "project type validation"
require_text "local/_template/goal.md" "## 완료 기준" "goal template completion section"
require_text "local/_template/context-map.md" "## 먼저 확인할 위치" "context template first locations"
require_text "local/_template/tools.md" "## 승인 필요한 작업" "tools template approval section"
require_text "local/_template/validation.md" "## 검증 보고 기준" "validation template report section"
require_text "local/_template/handoff-log.md" "## 현재 기록" "handoff template current log"
require_text "global/models/codex/AGENT.md" "청사진, 계획, 설계만 요청" "blueprint-only boundary"
require_text "global/models/codex/AGENT.md" "구현, 수정, 실행을 명확히 요청" "implementation boundary"
require_text "global/models/codex/roles.md" "동작 변경에는 TDD" "behavior-change TDD boundary"
require_text "global/models/codex/harness/output-schema.md" "인계 가치가 낮은 작업은 최종 보고" "conditional handoff rule"
require_text "global/models/codex/harness/fixtures.md" "Fixture 9" "html javascript fixture"
require_text "local/README.md" "./sample-project/" "sample project link"
require_text "local/sample-project/domain-policy.md" "Badge" "sample domain concept"

if [ "$failures" -ne 0 ]; then
  printf 'document validation failed: %s issue(s)\n' "$failures"
  exit 1
fi

printf 'document validation passed\n'
