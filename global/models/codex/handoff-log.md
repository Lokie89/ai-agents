# 기록 방식

## 아카이브 안내

- `현재 기록`에는 최근 5개 세션 기록만 남긴다.
- 그보다 오래된 기록은 오래된 순서대로 `./handoff-archive.md`로 옮긴다.
- 여기서 찾는 내용이 보이지 않으면 `./handoff-archive.md`(있다면)를 먼저 확인한다.

## 세션 기록 템플릿

### YYYY-MM-DD

- 목표:
- 변경:
- 검증:
- 남은 작업:
- 주의 사항:

## 현재 기록

### 2026-08-11 (Codex 운영 공백 보완)

- 목표: 현재 문서 기준에서 Codex 작업 시 빠지기 쉬운 실행 환경, 하위 지침, 사용자 변경 보호, 최신 정보 검증, 최종 리뷰 기준을 보완한다.
- 변경: `AGENT.md`에 하위 `AGENTS.md` 적용 범위, UTF-8 읽기, dirty worktree 확인, Codex hook 부재 시 수동 Reviewer 확인, 최신 정보 출처 확인 기준을 추가했다. `context-map.md`, `tools.md`, `validation.md`, 하네스 실패 케이스와 루브릭에 같은 기준을 연결했다. Windows에서 `bash scripts/validate-docs.sh`가 불가할 때 PowerShell과 Node 기반 대체 검증을 기록하도록 했다.
- 검증: `node scripts/validate-harness.mjs`, `node scripts/test-evaluator.mjs`, PowerShell 필수 문구 확인, `git diff --check`가 통과했다. `bash scripts/validate-docs.sh`는 sandbox에서 `E_ACCESSDENIED`, 권한 밖 재시도에서 CRLF 줄끝 해석 문제로 실패해 대체 검증으로 보완했다.
- 남은 작업: Codex 전용 PowerShell 문서 검증 스크립트가 필요하면 `scripts/validate-docs.ps1`로 별도 추가할 수 있다.
- 주의 사항: Claude 전용 hook, Workflow, Agent 도구명은 Codex 문서로 옮기지 않았다. Codex에서는 자동 hook 대신 최종 리뷰 체크를 문서 기준으로 수행한다.

### 2026-08-09 (실행 기록 자동 판정)

- 목표: 문서 fixture를 실제 실행 기록과 비교할 수 있는 결정론적 evaluator를 추가한다.
- 변경: 실행 기록에 `evidence`와 도구의 `mutates_state`를 표현하도록 스키마를 확장했다. fixture와 run record를 비교해 종료 상태, 쓰기 금지, 금지 행동, 승인 누락, 필수 근거, 예산 초과, 보고된 위반을 판정하는 evaluator와 CLI를 추가했다. 정상 계획 실행과 승인 없는 파괴적 실행 샘플을 회귀 테스트로 연결했다.
- 검증: `node scripts/validate-harness.mjs`, `node scripts/test-evaluator.mjs`, 정상 실행 기록에 대한 `node scripts/evaluate-run.mjs ...`, `bash scripts/validate-docs.sh`, `git diff --check`가 통과했다.
- 남은 작업: 실제 Codex 또는 Claude 실행을 `run-record.schema.json`으로 변환하는 adapter와 자연어 의미 evaluator는 아직 없다.
- 주의 사항: 현재 evaluator는 기록된 event와 evidence를 신뢰하는 결정론적 판정기다. trace 수집기가 연결되기 전에는 실제 행동을 독립적으로 증명하지 않는다.

### 2026-08-09 (Codex 문서 현행화)

- 목표: 현재 Codex 문서를 공식 Codex 운영 방식과 대조해 실행 경계와 설정 정확성을 보완한다.
- 변경: 계획 단계에서 읽기 전용 조사와 안전한 진단은 허용하되 파일·외부 상태 변경은 금지하도록 경계를 바로잡았다. 추상 모델 별칭과 YAML frontmatter 예시를 제거하고 실제 모델 ID, `model_reasoning_effort`, `.codex/agents/<name>.toml`, `[agents]` 설정 기준으로 모델 라우팅 문서를 개편했다. `AGENTS.md` 계층을 간결하게 유지하는 원칙, 메인 컨텍스트 절약, 읽기 중심 서브에이전트 우선, 동시 쓰기 충돌 방지 기준을 추가했다. `global/harness/`에 런타임 계층, 종료·재시도·승인·관측성 계약, JSON Schema, 공통 fixture를 추가하고 무의존성 정적 검증기를 연결했다.
- 검증: 공식 Codex 매뉴얼의 Best practices, Subagents, AGENTS.md 섹션과 대조했다. `node scripts/validate-harness.mjs`, `bash scripts/validate-docs.sh`, `git diff --check`를 실행한다.
- 남은 작업: 실제 커스텀 에이전트를 도입할 때만 `.codex/config.toml`과 `.codex/agents/*.toml`을 추가한다.
- 주의 사항: 모델 ID와 지원 추론 강도는 제품·계정·시점에 따라 바뀔 수 있으므로 글로벌 문서에 특정 ID를 영구 기본값으로 고정하지 않는다.

### 2026-08-09

- 목표: Claude 문서의 개선 사항 중 Codex에도 공통으로 유효한 운영 규칙을 선별해 반영한다.
- 변경: 루트 `AGENTS.md` 진입점을 추가했다. Codex 내장 안전 규칙 우선, 공유 상태 변경 사전 확인, hook/서명 우회 금지, 모델 간 `local/` 공유 원칙, handoff 최근 5개 보관 및 아카이브 규칙, UI/프론트엔드 실동작 검증 기준을 Codex 문서에 추가했다. Claude 전용 도구명과 Workflow 규칙은 옮기지 않았다.
- 검증: `bash scripts/validate-docs.sh`로 문서 구조와 핵심 참조를 확인한다.
- 남은 작업: `handoff-archive.md`는 현재 기록이 5개를 초과할 때 생성한다.
- 주의 사항: 모델별 도구 이름과 실행 방식은 각 모델 문서에만 두고, 공유 `local/` 문서는 프로젝트 기준으로 유지한다.

### 2026-08-04

- 목표: Codex 운영 규칙에서 청사진, handoff, TDD, 프로젝트 진입 기준을 실제 작업 흐름에 맞게 조정한다.
- 변경: 청사진만 요청받은 경우와 명확한 구현 요청을 분리했다. handoff 기록은 문서, 정책, 하네스, 장기 작업처럼 인계 가치가 있는 변경에 필수로 두고 작은 단일 변경은 최종 보고로 대체할 수 있게 했다. TDD 기준은 동작 변경 중심으로 완화하고 문서, 설정 변경에는 대체 검증 기준을 사용할 수 있게 했다. `project-rules.md`를 추가해 로컬 규칙이 없거나 부족한 프로젝트에서 로컬 하네스 대화를 생성하고, 필요한 경우 `local/<project-name>/` 문서를 만들도록 기준을 정의했다. `local/_template/`에 `goal.md`, `context-map.md`, `tools.md`, `validation.md`, `handoff-log.md` 템플릿을 추가했다. 새 프로젝트 기본 완료 체크리스트, 프로젝트 유형별 최소 기준, 프로젝트 생성 결과 보고 스키마를 추가했다. 문서 검증 스크립트에 새 경계 규칙, 프로젝트 규칙, 로컬 템플릿, 하네스 fixture 참조 확인을 추가했다.
- 검증: sandbox 내부 `bash scripts/validate-docs.sh`는 `E_ACCESSDENIED`로 실패했다. 권한 밖에서 같은 명령을 다시 실행해 `document validation passed`를 확인했고, PowerShell 대체 검증으로 필수 파일과 핵심 문구도 확인했다.
- 남은 작업: 필요하면 Markdown 링크 전체 검사 스크립트를 별도 추가할 수 있다.
- 주의 사항: 명확한 구현 요청은 실행할 수 있지만, 도메인 정책, 보안, 권한, 데이터 손실, 되돌리기 어려운 변경이 불명확하면 구현 전에 질문해야 한다. 새 프로젝트 생성이나 프로젝트별 실행/검증 방식이 필요한 작업은 로컬 하네스 필요 여부를 먼저 판단해야 한다.
