# AI Agents

이 저장소는 에이전트가 여러 프로젝트에서 일관되게 일하도록 만드는 기준 문서 모음입니다.

핵심 목표는 단순합니다. 프로젝트마다 매번 새로 설명하지 않아도 되는 공통 규칙은 `global/`에 두고, 프로젝트마다 달라지는 맥락은 `local/`에 둡니다.

## 범위 구분

- `global/`: 어느 프로젝트에서든 공통으로 가져갈 에이전트 기준을 둡니다.
- `local/`: 각 프로젝트별로 달라지는 문서, 데이터, 제약, 기록을 둡니다.

## 현재 모델

- [Codex 모델](./global/models/codex/README.md)
- [프로젝트별 로컬 문서](./local/README.md)
- [Codex 하네스](./global/models/codex/harness/README.md)

## 문서 기준

각 에이전트 모델은 다음 문서들을 기준으로 관리합니다.

| 문서 | 역할 |
| --- | --- |
| `AGENT.md` | 에이전트가 먼저 읽는 실행 진입 문서 |
| `goal.md` | 해야 할 일과 하지 말아야 할 일 |
| `context-map.md` | 필요한 문서와 데이터 위치 |
| `project-rules.md` | 프로젝트 진입과 로컬 하네스 생성 기준 |
| `domain-rules.md` | 도메인 정책을 다루는 글로벌 규칙 |
| `model-routing.md` | 역할별 모델 선택 기준 |
| `tools.md` | 허용 도구와 금지 도구 |
| `validation.md` | 검증 체크리스트 |
| `handoff-log.md` | 작업 기록과 다음 세션 인계 |

사람은 각 모델의 `README.md`를 먼저 보면 되고, 에이전트는 `AGENT.md`를 먼저 보면 됩니다. 실제 프로젝트의 도메인 정책은 `local/<project-name>/domain-policy.md`에 둡니다.

## 하네스 기준

Codex 모델은 규칙 문서 외에 하네스 문서를 함께 사용합니다.

- `harness/state-machine.md`: 작업 상태와 전이 조건
- `harness/failure-cases.md`: 실패로 판정해야 하는 위반 사례
- `harness/output-schema.md`: 청사진, 구현 결과, 리뷰 결과의 필수 산출물
- `harness/fixtures.md`: 대표 요청과 기대 행동

문서 하네스의 필수 파일과 핵심 참조는 아래 명령으로 확인합니다.

```sh
./scripts/validate-docs.sh
```
