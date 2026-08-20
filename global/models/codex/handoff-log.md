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

### 2026-08-20 (코드 분석 산출물 문서화 규칙 동기화)

- 목표: Claude 쪽에만 반영된 코드 분석 산출물 문서화 규칙을 확인하고 Codex 쪽에도 동일한 공통 정책을 적용한다.
- 변경: `global/models/codex/project-rules.md`에 `코드 분석 산출물` 절을 추가해 코드베이스·아키텍처 분석 결과를 `local/<project-name>/analysis/YYYY-MM-DD-<주제-슬러그>.md`에 남기도록 했다. `global/models/codex/AGENT.md`의 작업 후 규칙에도 이 기준을 연결했다. 공통 `local/README.md`의 선택 구조 안내는 이미 반영돼 있어 중복 수정하지 않았다.
- 검증: `bash scripts/validate-docs.sh`, `node scripts/validate-harness.mjs`, `node scripts/test-evaluator.mjs`, `git diff --check`를 실행한다.
- 남은 작업: 없음.
- 주의 사항: Claude 전용 hook, 도구명, Workflow·서브에이전트 정책은 Codex에 그대로 이식하지 않았다. 분석 문서만 만드는 작업은 로컬 하네스 전체 생성을 강제하지 않는다.

### 2026-08-19 (DB 접근 시 auto-commit 해제 원칙 추가)

- 목표: 데이터베이스에 접근하는 코드/스크립트가 기본 auto-commit 모드를 쓰지 않고 명시적 트랜잭션으로 커밋/롤백을 제어하도록 저장소 전역 규칙을 추가한다. Claude 세션에서 사용자가 "Database 접근 시에는 auto-commit 해제한 상태로 하도록" 문서화를 요청했고, 저장소 전체 글로벌 규칙으로 Claude/Codex 양쪽에 반영하기로 확인했다.
- 변경: `global/models/codex/domain-rules.md`(및 대응하는 `global/models/claude/domain-rules.md`)에 "데이터베이스 접근 시 트랜잭션 원칙" 절을 추가해 auto-commit 해제, 트랜잭션 경계 직접 제어, 실패 시 롤백, 예외 시 이유 기록 기준을 명시했다. `.codex/agents/database-specialist.toml`(및 `.claude/agents/database-specialist.md`)의 책임 목록에도 이 원칙을 확인하는 항목을 추가했고, `scripts/bootstrap-project-root.mjs`의 두 에이전트 생성 블록도 같은 문구로 맞췄다.
- 검증: `bash scripts/validate-docs.sh`, `node scripts/validate-harness.mjs`(6 fixture), `node scripts/test-evaluator.mjs`(2 case) 모두 통과.
- 남은 작업: 실제 DB를 쓰는 local 프로젝트가 생기면 해당 `architecture.md`/`domain-policy.md`에 트랜잭션 격리 수준, 커밋 시점, 예외 처리 방식을 구체적으로 기록해야 한다.
- 주의 사항: 이 저장소에는 현재 실제 DB를 쓰는 local 프로젝트가 없어 글로벌 원칙 수준으로만 문서화했다. 이 세션 자체는 Claude에서 진행됐고, 두 모델 문서 세트를 동시에 갱신한 뒤 양쪽 handoff-log에 같은 내용을 기록했다.

### 2026-08-13 (프로젝트 루트 부트스트랩 확장)

- 목표: 이 문서 세트를 다른 프로젝트에 복사했을 때 루트 진입 문서와 기본 Codex 에이전트 세트를 자동으로 보강할 수 있게 한다.
- 변경: `scripts/bootstrap-project-root.mjs`를 추가해 `AGENTS.md`, `CLAUDE.md`, `.codex/agents/*.toml` 기본 세트를 생성하도록 했다. 기존 파일은 덮어쓰지 않는다. `README.md`, Codex/Claude `project-rules.md`, Codex/Claude `validation.md`, `scripts/validate-docs.sh`에 새 명령과 검증 기준을 연결했다.
- 검증: `node scripts/bootstrap-project-root.mjs`, 임시 디렉터리 생성 검증, `bash scripts/validate-docs.sh`, `node scripts/validate-harness.mjs`, `node scripts/test-evaluator.mjs`, `git diff --check`를 실행한다.
- 남은 작업: 없음.
- 주의 사항: `node scripts/ensure-entrypoints.mjs`는 루트 진입 문서만 보강하는 경량 명령으로 유지한다.

### 2026-08-13 (기본 토론 에이전트 추가)

- 목표: 하네스와 에이전트 운영 정책을 토론할 때 기본으로 쓸 Codex 커스텀 에이전트와 제품 개발 토론용 기본 역할 에이전트 세트를 추가한다.
- 변경: `.codex/agents/harness-deliberator.toml`, `product-planner.toml`, `ux-ui-designer.toml`, `frontend-developer.toml`, `backend-developer.toml`, `database-specialist.toml`, `product-tester.toml`을 추가했다. 공통 `global/harness/deliberation.md`에 토론 후 문서화 기준을 추가하고, Codex/Claude 검증·실패 케이스·산출물 스키마에 같은 기준을 연결했다. Codex `model-routing.md`에는 하네스·제품·기능 토론에서 이 커스텀 에이전트들을 우선 고려하도록 명시했다.
- 검증: `bash scripts/validate-docs.sh`, `node scripts/validate-harness.mjs`, `node scripts/test-evaluator.mjs`, TOML 문법 검사, `git diff --check`를 실행한다.
- 남은 작업: 실제 Codex 런타임에서 커스텀 에이전트들이 로드되는지는 다음 세션에서 호출해 확인할 수 있다.
- 주의 사항: 에이전트에는 모델을 고정하지 않아 현재 세션, 명시적 spawn 값, `[agents]` 기본값, 부모 설정을 상속하게 했다.

### 2026-08-13 (테스트 코드 문서성 명시)

- 목표: 테스트 코드가 기능 구현 시 자주 참조해야 하는 문서 역할도 한다는 기준을 명시한다.
- 변경: Codex/Claude `roles.md`의 Developer 기준에 "테스트 코드도 문서"라는 원칙과 요구사항, 사용 예, 경계 조건 참고 자료로 활용해야 한다는 문장을 추가했다.
- 검증: `bash scripts/validate-docs.sh`, `node scripts/validate-harness.mjs`, `node scripts/test-evaluator.mjs`, `git diff --check`를 실행한다.
- 남은 작업: 없음.
- 주의 사항: 테스트를 문서로 보되, 실제 제품 문서나 도메인 정책을 대체하는 것으로 취급하지 않는다.
