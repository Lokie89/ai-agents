# 기록 아카이브

`handoff-log.md`의 최근 기록 보관 한도를 넘긴 이전 세션 기록을 오래된 순서로 보관한다.

## 2026-08-07

- 목표: 저장소에 이미 있는 [Codex 모델](../codex/README.md) 문서 세트와 같은 구조로, Claude Code 하네스(Plan Mode, 서브에이전트, Skill, Workflow, 권한 프롬프트)에 맞춘 Claude 모델 문서 세트를 만든다.
- 변경: `global/models/claude/`에 `README.md`, `AGENT.md`, `goal.md`, `context-map.md`, `project-rules.md`, `domain-rules.md`, `model-routing.md`, `tools.md`, `validation.md`, `handoff-log.md`, `roles.md`와 `harness/`(README, state-machine, failure-cases, output-schema, fixtures, evaluation-rubric)를 추가했다. Codex의 청사진/도메인/보이스카웃 원칙은 그대로 유지하되, 청사진 단계는 `EnterPlanMode`/`ExitPlanMode`(Plan Mode)로, 모델 선택 별칭은 실제 Claude 별칭(`haiku`/`sonnet`/`opus`/`fable`/`inherit`)과 추론 강도(`low`~`max`) 두 축으로, 역할 구성은 Codex의 Planner/Researcher/Developer/Reviewer/Committer에 `Agent`/`Workflow` 위임을 다루는 Orchestrator 역할을 추가해 대응시켰다. `Workflow` 도구는 사용자의 명시적 opt-in이 있을 때만 사용하도록 모델 라우팅과 검증 기준에 명시했다. 루트 `README.md`에 Claude 모델 링크를 추가하고, `scripts/validate-docs.sh`에 Claude 문서 세트에 대한 파일 존재 및 핵심 참조 검사를 추가했다.
- 검증: `bash scripts/validate-docs.sh` 실행 결과를 확인한다.
- 남은 작업: 실제 Claude 서브에이전트 정의(`.claude/agents/*.md`)나 프로젝트별 사용 예시를 `local/`에 추가할 수 있다. 필요하면 Codex와 Claude 별칭 간 로컬 매핑 예시 파일을 별도로 추가할 수 있다. Codex 쪽 `handoff-log.md`에는 아직 아카이브 규칙을 적용하지 않았으므로, 필요하면 동일한 방식으로 옮길 수 있다.
- 주의 사항: 이 문서 세트는 Claude Code에 내장된 권한 프롬프트, 파괴적 작업 확인, hook, Plan Mode 동작을 대체하지 않고 보완한다. 충돌 시 Claude Code 내장 규칙이 항상 우선한다.

같은 세션 후속 작업: 콜드 스타트(다른 PC에서 새 세션 시작) 시 토큰 소비를 줄이기 위해 아래를 추가했다.

- 변경: 루트에 `CLAUDE.md`를 추가해 세션 시작 시 `global/models/claude/AGENT.md`를 바로 가리키도록 했다(매번 구조를 탐색해서 찾지 않도록). `handoff-log.md`(이 파일, `local/_template/handoff-log.md`, `local/sample-project/handoff-log.md`) 맨 위에 "아카이브 안내" 섹션을 추가해 `현재 기록`은 최근 5개만 남기고 나머지는 `handoff-archive.md`로 옮기도록 했으며, 문서를 열자마자 아카이브 파일의 존재를 인지하도록 안내 문구를 최상단에 배치했다. `project-rules.md`와 `validation.md`에 이 아카이브 규칙을 체크 항목으로 추가했다. `context-map.md`에는 넓은 탐색을 `Explore` 서브에이전트에 위임하는 이유(메인 세션 컨텍스트를 작게 유지)를 명시했고, `local/_template/context-map.md`는 디렉터리 대신 구체적 진입점 파일 경로를 적도록 안내 문구를 바꿨다. `scripts/validate-docs.sh`에 이 변경들에 대한 검사를 추가했다.
- 검증: `bash scripts/validate-docs.sh` 통과 확인.
- 남은 작업: `handoff-archive.md`는 실제로 5개를 초과하는 시점에 생성하면 된다(현재는 아직 만들 필요 없음). Codex 쪽 문서에도 같은 아카이브 규칙과 CLAUDE.md 상당 진입점을 적용할지는 별도 논의가 필요하다.
- 주의 사항: `CLAUDE.md`는 세션마다 자동으로 로드되므로 내용을 최소한으로 유지해야 한다. 항목을 추가할 때마다 이 파일이 커지지 않도록 주의한다.

## 2026-08-10

- 목표: Codex 문서가 2026-08-09에 먼저 현행화된 내용(`fae1bb8`, `df5faaf`, `de5fb7b`) 중 Claude 문서에도 반영할 게 있는지 대조하고 반영한다.
- 변경: (1) `EnterPlanMode` 툴이 실제로 Plan Mode에서 `Glob`/`Grep`/`Read` 탐색을 허용한다는 사실에 맞춰, `AGENT.md`/`goal.md`/`harness/evaluation-rubric.md`/`harness/fixtures.md`/`harness/failure-cases.md`/`validation.md`의 청사진 단계 서술을 "명령 실행을 전혀 하지 않는다"에서 "파일·외부 상태 변경은 하지 않되 계획 근거 확보를 위한 읽기 전용 조사는 허용한다"로 정정했다. (2) 루트 `CLAUDE.md`에 Codex `AGENTS.md`와 동일한 "진입점을 간결하게 유지하고 서브트리 예외는 중첩 `CLAUDE.md`로 둔다" 원칙을 추가했다. (3) `model-routing.md`에 병렬 서브에이전트가 같은 파일을 동시에 쓰지 않도록 하는 절과, `Agent`/`Workflow`의 `isolation: "worktree"` 사용 기준을 추가하고 `tools.md`에도 대응 문구를 추가했다.
- 검증: `bash scripts/validate-docs.sh`, `node scripts/validate-harness.mjs`, `node scripts/test-evaluator.mjs` 모두 통과.
- 남은 작업: Codex 쪽 `model-routing.md`가 실제 모델 ID/`.codex/agents/*.toml` 기준으로 크게 개편됐지만, 이는 Codex 고유의 설정 방식(가상의 별칭 사용 문제)을 고친 것이라 Claude에는 적용하지 않았다(Claude의 별칭 `haiku`/`sonnet`/`opus`/`fable`은 실제 런타임 별칭이라 문제가 없었음).
- 주의 사항: 앞으로 Codex/Claude 중 한쪽 문서를 고칠 때는 반대쪽에도 같은 종류의 부정확성이 있는지 확인하는 습관을 들인다.

## 2026-08-10 (문서 하네스 보강)

- 목표: 문서 리뷰에서 나온 개선 후보(로컬 샘플 누락, CI 미연동, 서브에이전트/모델 매핑 예시 부재, 구조화 fixture 커버리지, 서브트리 오버라이드 예시 부재)를 모두 반영한다.
- 변경: `local/sample-project/tools.md`를 추가해 로컬 하네스 필수 파일 6개를 채웠다. `.github/workflows/validate-docs.yml`을 추가해 `validate-docs.sh`/`validate-harness.mjs`/`test-evaluator.mjs`를 push/PR에서 자동 실행하도록 했다(README에도 명시). `.claude/agents/reviewer.md`, `.claude/agents/doc-lint.md` 예시 서브에이전트를 추가하고 `model-routing.md`/`tools.md`에서 참조했다. `local/_template/model-routing-map.md`(템플릿)와 `local/sample-project/model-routing-map.md`(예시)를 추가해 Codex/Claude를 함께 쓰는 프로젝트의 모델 매핑 방법을 보여주고, 이 과정에서 `model-routing.md`에 남아 있던 stale한 Codex 별칭(`fast/balanced/deep/max`, 2026-08-09 Codex 개편에서 이미 폐기됨) 참조도 함께 고쳤다. `global/harness/fixtures/core.json`에 `review`/`project_bootstrap` 카테고리 fixture 2개를 추가해 스키마가 정의한 카테고리 커버리지를 넓혔다. `local/sample-project/legacy-module/`에 중첩 `CLAUDE.md`/`AGENTS.md` 서브트리 오버라이드 예시를 추가하고 `goal.md`/`context-map.md`/`local/README.md`에서 연결했다.
- 검증: `bash scripts/validate-docs.sh`, `node scripts/validate-harness.mjs`(6 fixture 통과), `node scripts/test-evaluator.mjs` 모두 통과.
- 남은 작업: `.claude/agents/*.md`와 `local/*/model-routing-map.md`는 실제 사용 예시가 쌓이면 내용을 더 구체화할 수 있다. 구조화 fixture는 여전히 prose fixture(Claude 11개)보다 적으므로 필요하면 계속 늘릴 수 있다.
- 주의 사항: `local/sample-project/`는 실행 코드가 없는 문서 전용 샘플이라는 전제를 유지해야 한다. `legacy-module/`의 오버라이드 내용은 가상 예시이며 실제 정책이 아니다.

## 2026-08-11 (Stop hook으로 review→plan 루프 강제)

- 목표: `AGENT.md`/`roles.md`/`state-machine.md`에 문서로만 존재하던 "Reviewer가 재기획 필요 위험을 발견하면 Planner로 되돌아간다" 규칙이 실제로는 아무 것도 강제하지 않는 산문 규범이라는 점을 사용자와 확인하고, 위험 신호가 있는 세션에서만 이를 강제하는 Stop hook을 추가한다.
- 변경: `.claude/hooks/review-replan-check.sh`(git diff/status 기준으로 위험 신호를 저비용 패턴 매칭하고, 감지되면 transcript에서 `REVIEW-CHECK:` 마커 존재를 확인)와 `.claude/settings.json`(Stop hook 등록, 팀 공유 파일로 결정)을 새로 추가했다. 위험 신호가 없으면 즉시 종료해 일반 세션에는 토큰 비용이 들지 않고, 감지되면 응답 종료를 막고 `REVIEW-CHECK: 재기획 불필요 - <근거>` 또는 `REVIEW-CHECK: 재기획 필요 - Planner로 복귀 - <근거>` 형식의 명시적 확인을 요구한다. `stop_hook_active`를 확인해 무한 루프를 방지했다.
- 검증: 위험 없음/위험+마커 없음/위험+마커 있음/`stop_hook_active=true` 4가지 시나리오를 합성 stdin으로 직접 pipe-test했고 모두 기대대로 동작했다(각 테스트 후 임시 파일 정리 확인). `jq -e`로 `settings.json`의 훅 스키마도 확인했다. `Stop` 이벤트 자체는 이번 대화 턴 밖에서 발생하므로 실제 세션에서 훅이 발화하는 것은 증명하지 못했다.
- 남은 작업: 다음 세션에서 실제로 위험 신호가 있는 변경을 만들고 응답을 끝낼 때 훅이 실제로 걸리는지 확인이 필요하다. `.claude/settings.json`이 이번 세션 시작 후 처음 생긴 파일이라 설정 감시가 바로 걸리지 않으면 `/hooks`를 한 번 열거나 재시작해야 할 수 있다. `RISK_PATH_RE`/`RISK_KEYWORD_RE` 패턴은 이 저장소에서 실제 위험 사례가 쌓이면 넓히거나 좁힐 수 있다.
- 주의 사항: 이 훅은 review→plan 전이가 실제로 일어났는지까지 검증하지 못한다 — Claude가 `REVIEW-CHECK:` 마커만 붙이고 실제로는 재기획을 안 해도 훅은 통과시킨다. 판단의 정직성까지는 강제할 수 없는 구조적 한계로 남긴다.

같은 세션 후속 작업: 커밋 후 사용자가 "새 세션이 문서만 읽고 들어와도 이 훅의 존재를 알 수 있는가"를 물어서 확인한 결과, `tools.md`/`validation.md`에는 이 훅에 대한 언급이 전혀 없어 유일한 기록이 `handoff-log.md`뿐이었다(아카이브되면 사라짐). `tools.md`에 "자동 강제 장치" 섹션을 추가해 훅의 존재, 트리거 조건, `REVIEW-CHECK:` 형식, Codex에는 적용되지 않는다는 점을 명시했고, `validation.md` 기본 체크리스트에도 대응 항목을 추가했다. `bash scripts/validate-docs.sh` 통과 확인. 남은 갭: Codex는 이 메커니즘의 영향권 밖이며(Codex에는 Claude Code의 hook 시스템이 없음), `roles.md`/`codex/roles.md` 양쪽에 동일하게 있는 "Reviewer가 재기획 필요 위험을 찾으면 Planner로 돌아간다" 규칙은 Codex 쪽에서는 여전히 순수 산문 규범으로만 남아 있다. 이 비대칭을 Codex 쪽 문서에 알릴지는 사용자가 보류했다.
