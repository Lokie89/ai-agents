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
