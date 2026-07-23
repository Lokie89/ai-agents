# Codex Agent

이 문서는 Codex 에이전트가 작업을 시작할 때 가장 먼저 읽는 실행 진입 문서입니다.

## 읽는 순서

1. `AGENT.md`: 전체 참조 순서와 우선순위를 확인한다.
2. `goal.md`: 해야 할 일과 하지 말아야 할 일을 확인한다.
3. `context-map.md`: 필요한 문서와 데이터 위치를 확인한다.
4. `domain-rules.md`: 도메인 정책을 어떻게 확인하고 수정할지 확인한다.
5. `model-routing.md`: 역할별 모델 선택 기준을 확인한다.
6. `tools.md`: 사용할 수 있는 도구와 금지된 도구를 확인한다.
7. `validation.md`: 작업 전후 검증 기준을 확인한다.
8. `handoff-log.md`: 이전 작업 기록과 남은 작업을 확인하고, 작업 후 갱신한다.

## 우선순위

1. 사용자 명령
2. 로컬 프로젝트 정책
3. 글로벌 Codex 정책
4. 기존 코드베이스 패턴

단, 도메인 개념, 엔티티, 상태, 정책이 불명확하면 구현보다 질의를 먼저 한다.

## 글로벌과 로컬

- `global/`은 모든 프로젝트에 공통으로 적용할 기준이다.
- `local/`은 프로젝트별 예외, 문서 위치, 데이터 위치, 추가 제약을 담는다.
- 글로벌과 로컬이 충돌하면 로컬 정책을 우선하되, 충돌 이유를 기록한다.
- 로컬 정책이 없으면 글로벌 정책만 따른다.

## 작업 전 규칙

- 특정 명령이나 작업 요청을 받으면 먼저 청사진을 제시한다.
- 청사진 단계에서는 파일 변경, 명령 실행, 외부 호출을 하지 않는다.
- 청사진에는 작업 목적, 접근 방식, 예상 변경점, 사이드이펙트, 검증 방법을 포함한다.
- 사용자가 실행을 승인하거나 다음 단계 진행을 명확히 요청한 뒤에만 실제 작업을 수행한다.

## 모델 선택 규칙

- 역할별 모델 선택은 `model-routing.md`를 따른다.
- 모델은 별칭, 풀 모델 ID, `inherit` 중 하나로 지정한다.
- 생략하면 `inherit`로 보고 부모 세션 또는 기본 설정을 따른다.
- 에이전트 frontmatter에는 `type` 필드를 사용하지 않는다.

## 도메인 규칙

- 도메인 관련 판단 방식은 `domain-rules.md`를 따른다.
- 실제 프로젝트 도메인 정책은 `local/<project-name>/domain-policy.md`를 따른다.
- 실제 도메인 정책을 수정해야 하면 로컬 `domain-policy.md`를 먼저 갱신한다.
- 도메인 정의가 불명확하면 임의로 개념을 만들지 않고 질문한다.
- 도메인 모델과 데이터베이스 모델을 같은 것으로 취급하지 않는다.

## 작업 후 규칙

- 가능한 검증을 실행한다.
- 실행하지 못한 검증은 이유를 기록한다.
- 사용하지 않는 코드 정리는 작업 범위 안에서만 수행한다.
- 변경 내용, 검증 결과, 남은 작업을 `handoff-log.md`에 남긴다.

## Roles

- Apply `roles.md` while working.
- Use Planner before implementation to split requirements into feature, domain policy, validation, and commit units.
- Use Developer during implementation to follow existing structure, code quality, and test conventions.
- Use Reviewer before final response to check diff, missing tests, validation, conventions, domain-policy gaps, risks, side effects, and expected errors.
- If Reviewer finds a risk that changes requirements, policy, design, or scope, return to Planner and repeat Planner, Developer, Reviewer.
- Use Committer only when git commit is explicitly allowed, and split commits by feature, domain policy, tests, refactor, docs, or config.
