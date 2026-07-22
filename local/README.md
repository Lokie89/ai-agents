# Local 프로젝트 문서

이 디렉터리는 프로젝트별로 달라지는 에이전트 문서와 데이터를 둡니다.

## 사용 원칙

- 모든 프로젝트에 공통으로 적용할 규칙은 `global/`에 둡니다.
- 특정 프로젝트에만 필요한 목표, 컨텍스트, 도메인 정책, 도구 제약, 검증 방법, 작업 기록은 `local/`에 둡니다.
- 로컬 문서는 글로벌 규칙을 덮어쓸 수 있지만, 충돌이 있으면 어떤 이유로 예외가 필요한지 기록합니다.

## 권장 구조

```text
local/
  README.md
  <project-name>/
    goal.md
    context-map.md
    domain-policy.md
    tools.md
    validation.md
    handoff-log.md
```

## 현재 상태

아직 등록된 로컬 프로젝트 문서는 없습니다.
