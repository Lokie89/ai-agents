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

### 2026-08-13 (루트 진입 문서 부트스트랩)

- 목표: `ai-agents` 폴더를 다른 프로젝트로 복사했을 때 루트 `AGENTS.md` 또는 `CLAUDE.md`가 없으면 바로 생성할 수 있게 한다.
- 변경: `scripts/ensure-entrypoints.mjs`를 추가해 Codex용 `AGENTS.md`와 Claude Code용 `CLAUDE.md`를 생성한다. 기존 파일은 덮어쓰지 않는다. `README.md`, Codex/Claude `project-rules.md`, Codex/Claude `validation.md`, `scripts/validate-docs.sh`에 부트스트랩 명령과 검증 기준을 연결했다.
- 검증: `node scripts/ensure-entrypoints.mjs`는 기존 파일을 감지하고 `0 created`로 종료했다. `bash scripts/validate-docs.sh`, `node scripts/validate-harness.mjs`, `node scripts/test-evaluator.mjs`, `git diff --check`를 실행한다.
- 남은 작업: 없음.
- 주의 사항: 이 스크립트는 루트 진입 문서만 생성하며 `global/` 또는 `local/` 문서 세트가 누락된 경우까지 복원하지 않는다.

### 2026-08-12 (문서 언어 정책 추가)

- 목표: 저장소 운영 문서와 로컬 하네스 문서의 본문 언어 기준을 명시한다.
- 변경: Codex/Claude `AGENT.md`에 문서 언어 섹션을 추가해 본문은 기본적으로 한국어, 파일명·코드 식별자·명령어·스키마 필드명·모델 ID·외부 API 이름은 원문 또는 영어 유지 기준을 정의했다. 양쪽 `project-rules.md`, `validation.md`, `local/README.md`, 문서 검증 스크립트에도 같은 기준을 연결했다.
- 검증: `bash scripts/validate-docs.sh`, `git diff --check`를 실행한다.
- 남은 작업: 실제 프로젝트별 로컬 문서에서 영어 본문이 필요한 경우 예외 이유를 남기는 관례를 적용한다.
- 주의 사항: 루트 `AGENTS.md`/`CLAUDE.md` 같은 짧은 부트스트랩 문서는 영어를 허용하고, 상세 정책은 한국어 문서에 둔다.
