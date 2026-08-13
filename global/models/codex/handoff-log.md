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

### 2026-08-12 (프로젝트 시작 청사진 선행 강화)

- 목표: 새 프로젝트 생성이나 초기 세팅 요청에서 파일 생성보다 청사진 제시가 먼저 일어나도록 하네스 기준을 강화한다.
- 변경: Codex/Claude `AGENT.md`, `goal.md`, `project-rules.md`, `context-map.md`, 상태 머신, 평가 루브릭, fixture, 실패 케이스, 산출물 스키마, 검증 문서에 프로젝트 bootstrap의 blueprint-first 규칙을 추가했다. 구조화 fixture `project_bootstrap_customer_support`도 `writes_allowed: false`로 바꿔 청사진 승인 전 파일 생성이 실패로 판정되게 했다.
- 검증: `bash scripts/validate-docs.sh`, `node scripts/validate-harness.mjs`, `node scripts/test-evaluator.mjs`, `git diff --check`를 실행한다.
- 남은 작업: 실제 새 프로젝트 시작 세션에서 agent가 청사진 후 승인 대기하는지 사례로 확인할 수 있다.
- 주의 사항: 사용자가 "바로 파일 생성해", "청사진 생략하고 구현해"처럼 명시적으로 승인한 경우에는 구현으로 넘어갈 수 있지만, 기본값은 청사진 선행이다.

### 2026-08-12 (로컬 아키텍처 청사진 추가)

- 목표: 프로젝트별 로컬 하네스가 도메인 정책뿐 아니라 아키텍처 청사진도 먼저 확인하도록 기준을 확장한다.
- 변경: `local/_template/architecture.md`와 `local/sample-project/architecture.md`를 추가했다. Codex/Claude 프로젝트 규칙, 목표, AGENT, 컨텍스트 지도, 검증, 하네스 산출물, fixture, 실패 케이스에 `architecture.md` 확인과 청사진 질문 기준을 연결했다. `local/README.md`, 샘플 context-map, 루트 README, 문서 검증 스크립트도 새 필수 문서에 맞췄다.
- 검증: `bash scripts/validate-docs.sh`, `node scripts/validate-harness.mjs`, `node scripts/test-evaluator.mjs`, `git diff --check`를 실행한다.
- 남은 작업: 실제 프로젝트에 적용하면서 아키텍처 질문 항목이 과하거나 부족한지 사례를 보고 조정할 수 있다.
- 주의 사항: 아키텍처는 현재 기준의 청사진이며 모든 항목을 한 번에 확정하지 않는다. 구현 전제에 직접 영향을 주는 항목만 질문으로 승격하고, 나머지는 `미정` 또는 `해당 없음`으로 기록한다.
