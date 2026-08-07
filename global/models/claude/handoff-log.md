# 기록 방식

## 세션 기록 템플릿

### YYYY-MM-DD

- 목표:
- 변경:
- 검증:
- 남은 작업:
- 주의 사항:

## 현재 기록

### 2026-08-07

- 목표: 저장소에 이미 있는 [Codex 모델](../codex/README.md) 문서 세트와 같은 구조로, Claude Code 하네스(Plan Mode, 서브에이전트, Skill, Workflow, 권한 프롬프트)에 맞춘 Claude 모델 문서 세트를 만든다.
- 변경: `global/models/claude/`에 `README.md`, `AGENT.md`, `goal.md`, `context-map.md`, `project-rules.md`, `domain-rules.md`, `model-routing.md`, `tools.md`, `validation.md`, `handoff-log.md`, `roles.md`와 `harness/`(README, state-machine, failure-cases, output-schema, fixtures, evaluation-rubric)를 추가했다. Codex의 청사진/도메인/보이스카웃 원칙은 그대로 유지하되, 청사진 단계는 `EnterPlanMode`/`ExitPlanMode`(Plan Mode)로, 모델 선택 별칭은 실제 Claude 별칭(`haiku`/`sonnet`/`opus`/`fable`/`inherit`)과 추론 강도(`low`~`max`) 두 축으로, 역할 구성은 Codex의 Planner/Researcher/Developer/Reviewer/Committer에 `Agent`/`Workflow` 위임을 다루는 Orchestrator 역할을 추가해 대응시켰다. `Workflow` 도구는 사용자의 명시적 opt-in이 있을 때만 사용하도록 모델 라우팅과 검증 기준에 명시했다. 루트 `README.md`에 Claude 모델 링크를 추가하고, `scripts/validate-docs.sh`에 Claude 문서 세트에 대한 파일 존재 및 핵심 참조 검사를 추가했다.
- 검증: `bash scripts/validate-docs.sh` 실행 결과를 확인한다.
- 남은 작업: 실제 Claude 서브에이전트 정의(`.claude/agents/*.md`)나 프로젝트별 사용 예시를 `local/`에 추가할 수 있다. 필요하면 Codex와 Claude 별칭 간 로컬 매핑 예시 파일을 별도로 추가할 수 있다.
- 주의 사항: 이 문서 세트는 Claude Code에 내장된 권한 프롬프트, 파괴적 작업 확인, hook, Plan Mode 동작을 대체하지 않고 보완한다. 충돌 시 Claude Code 내장 규칙이 항상 우선한다.
