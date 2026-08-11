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
