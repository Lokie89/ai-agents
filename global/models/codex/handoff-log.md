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

### 2026-08-11 (숙의형 멀티 에이전트 패턴 추가)

- 목표: 여러 에이전트가 독립 의견, 비판, 수정, 합성, 검증 라운드로 더 나은 결론을 만드는 공통 패턴을 문서화한다.
- 변경: `global/harness/deliberation.md`를 추가해 Orchestrator, Proposer, Critic, Alternative, Synthesizer, Verifier 역할과 라운드, 산출물 형식, 라운드별 요약 로그, 실패 케이스, 종료 조건을 정의했다. 공통 하네스 README/architecture, 루트 README, Codex/Claude 모델 라우팅과 검증 문서, 모델별 실패 케이스, 문서 검증 스크립트에 참조를 연결했다.
- 검증: `bash scripts/validate-docs.sh`, `node scripts/validate-harness.mjs`, `node scripts/test-evaluator.mjs`, PowerShell 필수 문구 확인, `git diff --check`가 통과했다. 기존 CRLF 줄끝 문제는 `scripts/validate-docs.sh`를 LF로 정리해 해결했다. 라운드별 요약 로그 문구도 문서 검증 스크립트에 추가했다.
- 남은 작업: 실제 런타임을 만들 때 `AgentOpinion`, `Critique`, `FinalSynthesis` 같은 JSON 스키마와 샘플 run record를 추가할 수 있다.
- 주의 사항: 이 변경은 런타임 구현이 아니라 공통 설계 계약이다. 특정 도메인 판단은 hard gate와 프로젝트 정책이 우선하고, 숙의는 애매한 영역의 의견 품질 개선에 사용한다.
