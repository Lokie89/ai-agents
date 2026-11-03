# 중첩 설치된 하네스에서 Claude가 문서를 잘 안 읽는 원인 (auto-simulate 사례)

- 대상: `D:\_Study\auto-simulate` (프로젝트 루트) 안에 복사된 `ai-agents/`
- 조사일: 2026-11-03
- 결론 요약: 위치 자체보다 **자동 로드되는 경로가 거의 없고**, **읽어야 할 로컬 문서가 Read 한도를 넘을 만큼 커서** 생긴 문제다. 나중에 위치를 손보면 일부는 해결되지만, 문서 크기 문제는 위치와 상관없이 남는다.

## 관찰한 구조

```text
auto-simulate/
  CLAUDE.md                 ← 자동 로드되는 유일한 지침 (186 bytes, "ai-agents/CLAUDE.md를 읽어라")
  .claude/settings.local.json  ← 권한 허용 목록만 있음
  ai-agents/
    CLAUDE.md               ← "global/models/claude/AGENT.md를 읽어라" (ai-agents 기준 상대 경로)
    .claude/settings.json   ← Stop hook (review-replan-check.sh)
    .claude/agents/*.md     ← reviewer, backend-developer 등 9개
    global/models/claude/   ← AGENT.md + 읽는 순서 9개 문서
    local/auto-simulate/
      domain-policy.md      551줄 / 약 100KB
      handoff-log.md        1550줄 / 약 303KB (제목 174개)
      handoff-archive.md    2745줄 / 약 334KB
      tools.md              18줄
      analysis/             140개
      (README.md, context-map.md, architecture.md 없음)
```

global 문서는 이번 세션의 `오류·버그 수정 원칙` 추가분 말고는 원본과 같다. 그러니 원본과 내용이 벌어진 것은 원인이 아니다.

## 원인

### 1. 실제로 지침이 이어지는 경로가 "읽어라" 문장 3단계뿐이다

- Claude Code가 세션을 시작할 때 자동으로 넣어 주는 파일은 루트 `CLAUDE.md` 하나뿐이다. 거기에는 "다른 파일을 읽어라"라는 문장만 있다.
- 그 뒤로는 루트 `CLAUDE.md` → `ai-agents/CLAUDE.md` → `AGENT.md` → 문서 9개로 이어지는데, 단계마다 모델이 스스로 `Read`를 해야 넘어간다. 사용자 요청이 구체적이면 모델은 이 단계를 건너뛰고 바로 작업에 들어가기 쉽다.
- `ai-agents/CLAUDE.md`의 경로(`global/models/claude/AGENT.md`)는 `ai-agents/` 기준이다. 작업 디렉터리인 `auto-simulate/` 기준으로 읽으면 없는 경로라서 한 번 더 헷갈린다.
- `@path` import를 쓰지 않아서 핵심 정책이 처음부터 컨텍스트에 들어가지 않는다.

### 2. `ai-agents/.claude/`가 적용되지 않는다

- Claude Code는 프로젝트 설정(`settings.json`의 hook, `agents/`의 서브에이전트)을 세션을 시작한 프로젝트 루트의 `.claude/`에서 읽는다. 하위 디렉터리의 `.claude/`는 읽지 않는다.
- 그래서 auto-simulate 세션에서는 Stop hook(재기획 확인)과 reviewer 같은 서브에이전트가 없는 상태다. 문서 쪽에서 "Reviewer 관점", "reviewer 서브에이전트"를 말해도 실제로 강제하거나 불러 쓸 수단이 없다.
- hook 명령도 `bash .claude/hooks/review-replan-check.sh`처럼 상대 경로라서, 루트로 옮길 때 경로를 같이 고쳐야 한다.

### 3. 로컬 문서가 너무 커서 한 번에 읽히지 않는다 (가장 큰 원인)

- `handoff-log.md`는 303KB, `domain-policy.md`는 100KB다. 둘 다 `Read` 도구의 한 번 읽기 한도(토큰 기준)를 넘는다. 그래서 "읽어라"를 따르더라도 첫 시도는 오류가 나거나 앞부분만 읽힌다.
- `handoff-log.md`에는 "최근 5개 세션만 남긴다"는 규칙이 있지만 실제로는 제목이 174개다. 기록 한 건 안에도 `진행 기록` 하위 목록이 길게 붙어서, 인계 문서라기보다 작업 일지가 됐다.
- `domain-policy.md`의 `simulation comparison 후보 평가` 절 하나가 225줄이다. 정책(규칙)과 조사 결과(실험 수치, 원인 분석)가 한 파일에 섞여 있다.
- 결과적으로 모델은 읽다가 포기하거나, 앞부분만 보고 다 읽은 줄 안다.

### 4. 길잡이 문서가 없다

- `project-rules.md`가 필수로 정한 `README.md`, `context-map.md`, `architecture.md`가 로컬에 없다.
- 어떤 질문에 어떤 문서나 `analysis/`의 어떤 파일을 보면 되는지 안내하는 색인이 없다. 그래서 분석 문서 140개를 모델이 찾아 쓰지 못한다.
- 루트 `CLAUDE.md`가 `tools.md`(18줄)만 직접 가리키는 것도 같은 문제다.

## 개선 방향 (아직 적용하지 않음)

| 우선순위 | 조치 | 해결되는 원인 |
| --- | --- | --- |
| 1 | `handoff-log.md`를 최근 5건·건당 5줄 형식으로 줄이고 나머지는 archive로 옮긴다. `domain-policy.md`는 확정된 정책만 남기고, 조사·근거는 `analysis/`로 빼서 링크로 연결한다. | 3 |
| 2 | 루트 `CLAUDE.md`에서 `@ai-agents/global/models/claude/AGENT.md`, `@ai-agents/local/auto-simulate/context-map.md`처럼 import로 핵심 문서를 처음부터 로드한다. 큰 문서는 import하지 않는다. | 1 |
| 3 | `context-map.md`(질문 유형 → 문서 색인)와 `architecture.md`를 만든다. | 4 |
| 4 | `ai-agents/.claude/agents`, `hooks`, `settings.json`의 hook을 루트 `.claude/`로 복사하거나 연결한다. `install-parent-entrypoints.mjs`가 이것도 하게 만든다. | 2 |
| 5 | 저장소 규칙으로 로컬 문서 크기 상한과 정책/근거 분리 원칙을 정하고, `validate-docs`에서 크기를 점검한다. | 3 재발 방지 |

## 정해야 할 정책 질문

- handoff-log의 `진행 기록` 같은 세부 작업 일지를 어디에 둘지 정해야 한다. 예: `analysis/` 또는 날짜별 `journal/`.
- `domain-policy.md`에서 정책과 근거를 나누는 기준을 정해야 한다. 지금은 실험 결론도 정책처럼 쌓이고 있다.
- 중첩 설치에서 `.claude/`를 부모로 옮길 때 복사할지 링크할지 정해야 한다. 복사하면 원본과 벌어지고, Windows에서 링크를 만들려면 권한이 필요하다.
