# AI Agents

이 저장소는 에이전트가 여러 프로젝트에서 일관되게 일하도록 만드는 기준 문서 모음입니다.

핵심 목표는 단순합니다. 프로젝트마다 매번 새로 설명하지 않아도 되는 공통 규칙은 `global/`에 두고, 프로젝트마다 달라지는 맥락은 `local/`에 둡니다.

## 범위 구분

- `global/`: 어느 프로젝트에서든 공통으로 가져갈 에이전트 기준을 둡니다.
- `local/`: 각 프로젝트별로 달라지는 문서, 데이터, 제약, 기록을 둡니다.

## 현재 모델

- [Codex 모델](./global/models/codex/README.md)
- [Claude 모델](./global/models/claude/README.md)
- [프로젝트별 로컬 문서](./local/README.md)
- [Codex 하네스](./global/models/codex/harness/README.md)
- [Claude 하네스](./global/models/claude/harness/README.md)
- [공통 실행·평가 하네스](./global/harness/README.md)

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

사람은 각 모델의 `README.md`를 먼저 보면 되고, 에이전트는 `AGENT.md`를 먼저 보면 됩니다. 실제 프로젝트의 도메인 정책은 `local/<project-name>/domain-policy.md`, 아키텍처 청사진은 `local/<project-name>/architecture.md`에 둡니다.

## 하네스 기준

각 모델은 규칙 문서 외에 하네스 문서를 함께 사용합니다. 현재 모델별 하네스는 행동 정책과 판정 기준이고, `global/harness/`는 향후 실행 런타임과 자동 평가가 사용할 공통 데이터 계약입니다.

- `harness/state-machine.md`: 작업 상태와 전이 조건
- `harness/failure-cases.md`: 실패로 판정해야 하는 위반 사례
- `harness/output-schema.md`: 청사진, 구현 결과, 리뷰 결과의 필수 산출물
- `harness/fixtures.md`: 대표 요청과 기대 행동
- `global/harness/deliberation.md`: 독립 의견, 비판, 수정, 합성, 검증 라운드 기반 숙의형 멀티 에이전트 패턴

문서 하네스의 필수 파일과 핵심 참조는 아래 명령으로 확인합니다.

```sh
./scripts/validate-docs.sh
node scripts/validate-harness.mjs
node scripts/test-evaluator.mjs
```

같은 검사는 `.github/workflows/validate-docs.yml`을 통해 `master` 대상 push와 PR에서도 자동 실행됩니다.

## 다른 프로젝트에 적용하기

다른 프로젝트에 이 폴더를 직접 복사하지 않습니다. 이 저장소 세션에서 대상 프로젝트로 한 방향으로 동기화합니다. 대상 목록은 `sync-targets.json`에 있습니다.

```sh
node scripts/sync.mjs --dry-run          # 바뀔 내용과 경고를 먼저 확인
node scripts/sync.mjs                    # 모든 대상에 적용
node scripts/sync.mjs auto-simulate      # 일부 대상만
```

대상 프로젝트는 아래 모양이 됩니다.

| 위치 | 소유 | 동기화 동작 |
| --- | --- | --- |
| `ai-agents/` | 원본(읽기 전용 사본) | `global/`, `local/_template/` 등을 원본으로 덮어쓴다. 원본 이력에 있던 낡은 파일은 지우고, 모르는 파일은 남기고 경고한다. |
| `CLAUDE.md`, `AGENTS.md` | 프로젝트 + 관리 블록 | `<!-- ai-agents:start -->`~`end` 블록만 갱신한다. Claude 블록은 `@ai-agents/global/models/claude/AGENT.md`, `@docs/agents/context-map.md`를 import한다. |
| `.claude/agents`, `.claude/hooks`, `.codex/agents` | 원본 설치 | 원본 파일을 설치한다. 원본 이력에 없는 사용자 수정본은 건너뛴다. `.claude/settings.json`에는 hook만 병합한다. |
| `docs/agents/` | 프로젝트(local 하네스) | 없을 때 템플릿 뼈대만 만든다. 옛 위치 `ai-agents/local/<project>/`에 있으면 한 번 옮기고 경로를 고친다. 문서가 40KB를 넘거나 `handoff-log.md` 기록이 5건을 넘으면 경고한다. |

global 문서에 나오는 `local/<project-name>/`는 설치된 프로젝트에서 `docs/agents/`를 뜻합니다. 동기화 로직의 회귀 테스트는 `node scripts/test-sync.mjs`입니다.

현재 저장소는 문서 정책과 정적 평가 계약까지 제공하며, 모델 호출, checkpoint 저장, trace 수집, queue, 배포를 수행하는 프로덕션 런타임은 포함하지 않습니다.
