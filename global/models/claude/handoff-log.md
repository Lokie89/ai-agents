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

같은 문서, 다른 세션 후속 작업: 사용자가 Codex 세션에서 만든 이 커밋의 Claude 쪽 내용을 검토해달라고 요청해 확인했다. `AGENT.md`/`goal.md`/`project-rules.md`/`context-map.md`/`state-machine.md`/`evaluation-rubric.md`/`output-schema.md`/`validation.md`/`handoff-archive.md` 변경은 Claude 도구(`EnterPlanMode`/`ExitPlanMode`/`AskUserQuestion`/`TaskCreate`) 기준과 일치했고 상태 전이에도 모순이 없었다. 다만 `harness/fixtures.md`의 Fixture 10 "실패 판정"에 이전 버전(승인 없이도 바로 구현하던 시절) 문구 "프로젝트를 만들었지만 실행 명령이나 동작하는 핵심 흐름을 보고하지 않았다"가 그대로 남아 있었다 — 이 fixture의 새 기대 행동은 승인 전 파일 생성을 금지하므로 "만든 프로젝트"가 있을 수 없어 자기 모순이었다. "청사진에 예상 핵심 흐름(문의 등록, 조회, 상태 변경)이나 실행/검증 명령 후보가 없다"로 고쳤다. `bash scripts/validate-docs.sh`, `node scripts/validate-harness.mjs`, `node scripts/test-evaluator.mjs`, `git diff --check` 모두 통과 확인. 같은 leftover 문구가 `global/models/codex/harness/fixtures.md`의 동일 Fixture 10(216행)에도 남아 있어, 사용자 확인 후 같은 문장으로 함께 고쳤다.

### 2026-08-12 (Codex 운영 기준 보완 대조)

- 목표: Codex 쪽 `7a00434`(하위 `AGENTS.md`, PowerShell 인코딩, dirty worktree 보호, 최신 정보 확인, hook 부재 시 수동 Reviewer 체크 보완) 커밋을 Claude 문서와 대조해 반영할 게 있는지 확인한다.
- 변경: 대부분은 이미 Claude 쪽에 동등하거나 더 강한 형태로 있었다(중첩 `CLAUDE.md`는 Claude Code가 네이티브로 자동 로드하므로 별도 규칙 불필요, `Read` 툴이 인코딩을 처리, `사용자 변경 보호 위반`/`최신 정보 사용 위반` 실패 케이스 기존 존재, Codex에는 없는 Stop hook을 Claude는 이미 보유). 실제로 빠진 항목 2개만 반영했다: `harness/failure-cases.md`의 "사용자 변경 보호 위반"에 "커밋이나 스테이징을 수행하면서 현재 작업과 무관한 변경을 포함했다"를 추가했고, `validation.md`의 "결과 보고 형식"에 "최신 정보나 외부 사실을 확인했다면 사용한 공식 문서 또는 1차 출처"를 추가했다.
- 검증: `bash scripts/validate-docs.sh`, `node scripts/validate-harness.mjs`(6 fixture 통과), `node scripts/test-evaluator.mjs`(2 케이스 통과), `git diff --check` 모두 통과.
- 남은 작업: 없음.
- 주의 사항: Codex와 Claude는 실행 환경이 달라(네이티브 중첩 CLAUDE.md 로드, Stop hook 존재, Bash 툴이 Git Bash를 문제없이 사용) 모든 항목을 1:1로 옮길 필요는 없다. 대조할 때마다 "Codex에 없는 기능을 보완한 항목"과 "Codex의 샌드박스/환경 제약 때문에 추가된 항목"을 구분해서 판단해야 한다.

### 2026-08-12 (로컬 아키텍처 청사진 추가)

- 목표: 프로젝트별 로컬 하네스가 도메인 정책뿐 아니라 아키텍처 청사진도 먼저 확인하도록 기준을 확장한다.
- 변경: `local/_template/architecture.md`와 `local/sample-project/architecture.md`를 추가했다. Codex/Claude 프로젝트 규칙, 목표, AGENT, 컨텍스트 지도, 검증, 하네스 산출물, fixture, 실패 케이스에 `architecture.md` 확인과 청사진 질문 기준을 연결했다. `local/README.md`, 샘플 context-map, 루트 README, 문서 검증 스크립트도 새 필수 문서에 맞췄다.
- 검증: `bash scripts/validate-docs.sh`, `node scripts/validate-harness.mjs`, `node scripts/test-evaluator.mjs`, `git diff --check`를 실행한다.
- 남은 작업: 실제 프로젝트에 적용하면서 아키텍처 질문 항목이 과하거나 부족한지 사례를 보고 조정할 수 있다.
- 주의 사항: 아키텍처는 현재 기준의 청사진이며 모든 항목을 한 번에 확정하지 않는다. 구현 전제에 직접 영향을 주는 항목만 질문으로 승격하고, 나머지는 `미정` 또는 `해당 없음`으로 기록한다.

### 2026-08-11 (숙의형 멀티 에이전트 패턴 연결)

- 목표: 공통 하네스에 추가된 숙의형 멀티 에이전트 패턴을 Claude 라우팅과 검증 기준에도 연결한다.
- 변경: `global/harness/deliberation.md`를 공통 패턴으로 두고, Claude `model-routing.md`의 Workflow 사용 기준과 `validation.md`의 숙의형 멀티 에이전트 검증 기준에서 참조했다. 모델별 실패 케이스에 라운드 미구분, 단순 다수결 판정, 라운드별 요약 로그 누락을 위반으로 추가했다.
- 검증: Codex 세션에서 `bash scripts/validate-docs.sh`, 공통 Node 검증, PowerShell 문구 확인, `git diff --check`가 통과했다. 기존 Windows CRLF 줄끝 문제는 `scripts/validate-docs.sh`를 LF로 정리해 해결했고, 라운드별 요약 로그 문구도 문서 검증 스크립트에 추가했다.
- 남은 작업: 실제 Claude Workflow로 구현할 때는 opt-in 조건과 세션 workflow size guideline을 별도로 확인해야 한다.
- 주의 사항: Claude의 Workflow opt-in 원칙은 유지한다. 숙의형 패턴은 Workflow 사용을 자동 허용하지 않고, 사용자가 명시적으로 오케스트레이션을 원할 때 적용한다.

같은 문서, 다른 세션 후속 작업: 사용자가 "Java Spring Boot 아키텍처" 질문으로 숙의형 패턴을 실제로 시켜봤는데, `Workflow` opt-in 표현을 전혀 쓰지 않았음에도 `Agent` 도구만으로(proposer 3개 병렬 독립분석 → critic 1개 → 직접 synthesis/verification) deliberation.md의 라운드 구조를 그대로 재현해 잘 작동했다. 그런데 `model-routing.md` 133~134행이 "Workflow(멀티 에이전트 오케스트레이션) 사용 기준" 섹션 안, opt-in 규칙 바로 다음에 붙어 있어서 "숙의형 패턴 = Workflow 하위 항목 = opt-in 필요"로 잘못 읽힐 여지가 있었다. `model-routing.md`에 "숙의형 패턴 자체는 Workflow opt-in의 하위 항목이 아니다. 규모가 작으면(proposer/critic/synthesizer) opt-in 없이 `Agent`만으로 라운드를 직접 진행해도 되고, 라운드를 스크립트로 강제해야 하거나 규모가 커지면 그때 opt-in을 확인하고 `Workflow`로 승격한다"는 문장을 추가해 두 실행 경로를 명시했다. `bash scripts/validate-docs.sh` 통과 확인. 이 실행 경로 구분은 `validation.md`의 "숙의형 멀티 에이전트 검증" 절에는 원래도 Workflow 종속 서술이 없어 추가 수정은 하지 않았다.

### 2026-08-11 (Stop hook으로 review→plan 루프 강제)

- 목표: `AGENT.md`/`roles.md`/`state-machine.md`에 문서로만 존재하던 "Reviewer가 재기획 필요 위험을 발견하면 Planner로 되돌아간다" 규칙이 실제로는 아무 것도 강제하지 않는 산문 규범이라는 점을 사용자와 확인하고, 위험 신호가 있는 세션에서만 이를 강제하는 Stop hook을 추가한다.
- 변경: `.claude/hooks/review-replan-check.sh`(git diff/status 기준으로 위험 신호를 저비용 패턴 매칭하고, 감지되면 transcript에서 `REVIEW-CHECK:` 마커 존재를 확인)와 `.claude/settings.json`(Stop hook 등록, 팀 공유 파일로 결정)을 새로 추가했다. 위험 신호가 없으면 즉시 종료해 일반 세션에는 토큰 비용이 들지 않고, 감지되면 응답 종료를 막고 `REVIEW-CHECK: 재기획 불필요 - <근거>` 또는 `REVIEW-CHECK: 재기획 필요 - Planner로 복귀 - <근거>` 형식의 명시적 확인을 요구한다. `stop_hook_active`를 확인해 무한 루프를 방지했다.
- 검증: 위험 없음/위험+마커 없음/위험+마커 있음/`stop_hook_active=true` 4가지 시나리오를 합성 stdin으로 직접 pipe-test했고 모두 기대대로 동작했다(각 테스트 후 임시 파일 정리 확인). `jq -e`로 `settings.json`의 훅 스키마도 확인했다. `Stop` 이벤트 자체는 이번 대화 턴 밖에서 발생하므로 실제 세션에서 훅이 발화하는 것은 증명하지 못했다.
- 남은 작업: 다음 세션에서 실제로 위험 신호가 있는 변경을 만들고 응답을 끝낼 때 훅이 실제로 걸리는지 확인이 필요하다. `.claude/settings.json`이 이번 세션 시작 후 처음 생긴 파일이라 설정 감시가 바로 걸리지 않으면 `/hooks`를 한 번 열거나 재시작해야 할 수 있다. `RISK_PATH_RE`/`RISK_KEYWORD_RE` 패턴은 이 저장소에서 실제 위험 사례가 쌓이면 넓히거나 좁힐 수 있다.
- 주의 사항: 이 훅은 review→plan 전이가 실제로 일어났는지까지 검증하지 못한다 — Claude가 `REVIEW-CHECK:` 마커만 붙이고 실제로는 재기획을 안 해도 훅은 통과시킨다. 판단의 정직성까지는 강제할 수 없는 구조적 한계로 남긴다.

같은 세션 후속 작업: 커밋 후 사용자가 "새 세션이 문서만 읽고 들어와도 이 훅의 존재를 알 수 있는가"를 물어서 확인한 결과, `tools.md`/`validation.md`에는 이 훅에 대한 언급이 전혀 없어 유일한 기록이 `handoff-log.md`뿐이었다(아카이브되면 사라짐). `tools.md`에 "자동 강제 장치" 섹션을 추가해 훅의 존재, 트리거 조건, `REVIEW-CHECK:` 형식, Codex에는 적용되지 않는다는 점을 명시했고, `validation.md` 기본 체크리스트에도 대응 항목을 추가했다. `bash scripts/validate-docs.sh` 통과 확인. 남은 갭: Codex는 이 메커니즘의 영향권 밖이며(Codex에는 Claude Code의 hook 시스템이 없음), `roles.md`/`codex/roles.md` 양쪽에 동일하게 있는 "Reviewer가 재기획 필요 위험을 찾으면 Planner로 돌아간다" 규칙은 Codex 쪽에서는 여전히 순수 산문 규범으로만 남아 있다. 이 비대칭을 Codex 쪽 문서에 알릴지는 사용자가 보류했다.
