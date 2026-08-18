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

### 2026-08-14 (Claude 기본 토론 에이전트 세트 추가)

- 목표: Codex에만 있던 기본 토론 서브에이전트 7종(`.codex/agents/*.toml`)과 짝을 맞춰 Claude 쪽 모델 병렬 대응 계약을 채운다. 이전 세션 기록의 "남은 작업"이었다.
- 변경: `.claude/agents/harness-deliberator.md`, `product-planner.md`, `ux-ui-designer.md`, `frontend-developer.md`, `backend-developer.md`, `database-specialist.md`, `product-tester.md`를 추가했다. `global/models/claude/model-routing.md`에 각 에이전트의 사용 기준과 모델/추론 강도를 연결하고, Codex 기본 세트와 역할이 대응하며 한쪽만 갱신하지 않는다는 문구를 추가했다. `scripts/bootstrap-project-root.mjs`와 `scripts/validate-docs.sh`가 이 파일들도 생성/검증하도록 갱신했고, `README.md`와 양쪽 `project-rules.md`의 안내 문구도 맞췄다. (커밋 `7a71646`)
- 검증: `bash scripts/validate-docs.sh`, `node scripts/validate-harness.mjs`, `node scripts/test-evaluator.mjs`, `git diff --check` 모두 통과.
- 남은 작업: 없음.
- 주의 사항: 이 기록은 커밋 당시 남기지 못해 뒤늦게 추가했다. `doc-lint.md`, `reviewer.md` 서브에이전트는 이보다 앞선 커밋(`5747b32`)에서 이미 존재했으므로 이번 변경 범위에 포함하지 않았다.

### 2026-08-13 (프로젝트 루트 부트스트랩 확장)

- 목표: 이 문서 세트를 다른 프로젝트에 복사했을 때 루트 진입 문서와 기본 Codex 에이전트 세트를 자동으로 보강할 수 있게 한다.
- 변경: `scripts/bootstrap-project-root.mjs`를 추가해 `AGENTS.md`, `CLAUDE.md`, `.codex/agents/*.toml` 기본 세트를 생성하도록 했다. 기존 파일은 덮어쓰지 않는다. `README.md`, Codex/Claude `project-rules.md`, Codex/Claude `validation.md`, `scripts/validate-docs.sh`에 새 명령과 검증 기준을 연결했다.
- 검증: Codex 세션에서 `node scripts/bootstrap-project-root.mjs`, 임시 디렉터리 생성 검증, `bash scripts/validate-docs.sh`, `node scripts/validate-harness.mjs`, `node scripts/test-evaluator.mjs`, `git diff --check`를 실행한다.
- 남은 작업: 없음.
- 주의 사항: Claude 전용 `.claude/agents/` 생성은 포함하지 않았다.

### 2026-08-13 (기본 토론 에이전트 기준 연결)

- 목표: 하네스와 에이전트 운영 정책 토론 결과를 durable 문서에 남기는 기준을 Claude 문서에도 연결한다.
- 변경: 공통 `global/harness/deliberation.md`에 토론 후 문서화 기준을 추가하고, Codex/Claude 검증·실패 케이스·산출물 스키마에 같은 기준을 연결했다. Codex 쪽에는 하네스 토론 에이전트와 제품 기획자, UX/UI 디자이너, 프론트엔드 개발자, 백엔드 개발자, DB 전문가, 테스터 커스텀 에이전트를 추가했다.
- 검증: Codex 세션에서 `bash scripts/validate-docs.sh`, `node scripts/validate-harness.mjs`, `node scripts/test-evaluator.mjs`, TOML 문법 검사, `git diff --check`를 실행한다.
- 남은 작업: Claude 전용 서브에이전트가 필요하면 별도 `.claude/agents/` 정의를 추가할 수 있다.
- 주의 사항: 이번 변경은 Claude Workflow opt-in 규칙을 바꾸지 않는다.

### 2026-08-13 (테스트 코드 문서성 명시)

- 목표: 테스트 코드가 기능 구현 시 자주 참조해야 하는 문서 역할도 한다는 기준을 명시한다.
- 변경: Codex/Claude `roles.md`의 Developer 기준에 "테스트 코드도 문서"라는 원칙과 요구사항, 사용 예, 경계 조건 참고 자료로 활용해야 한다는 문장을 추가했다.
- 검증: Codex 세션에서 `bash scripts/validate-docs.sh`, `node scripts/validate-harness.mjs`, `node scripts/test-evaluator.mjs`, `git diff --check`를 실행한다.
- 남은 작업: 없음.
- 주의 사항: 테스트를 문서로 보되, 실제 제품 문서나 도메인 정책을 대체하는 것으로 취급하지 않는다.

### 2026-08-12 (문서 언어 정책 추가)

- 목표: 저장소 운영 문서와 로컬 하네스 문서의 본문 언어 기준을 명시한다.
- 변경: Codex/Claude `AGENT.md`에 문서 언어 섹션을 추가해 본문은 기본적으로 한국어, 파일명·코드 식별자·명령어·스키마 필드명·모델 ID·외부 API 이름은 원문 또는 영어 유지 기준을 정의했다. 양쪽 `project-rules.md`, `validation.md`, `local/README.md`, 문서 검증 스크립트에도 같은 기준을 연결했다.
- 검증: `bash scripts/validate-docs.sh`, `git diff --check`를 실행한다.
- 남은 작업: 실제 프로젝트별 로컬 문서에서 영어 본문이 필요한 경우 예외 이유를 남기는 관례를 적용한다.
- 주의 사항: 루트 `AGENTS.md`/`CLAUDE.md` 같은 짧은 부트스트랩 문서는 영어를 허용하고, 상세 정책은 한국어 문서에 둔다.
