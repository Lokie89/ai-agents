# 도구 목록

## 사용할 수 있는 도구

- 파일 검색: `Glob`(경로 패턴), `Grep`(내용 검색)
- 파일 확인: `Read`
- 코드 변경: `Edit`(기존 파일 수정 우선), `Write`(신규 파일 또는 전체 재작성)
- 셸 실행: `Bash`(POSIX 셸 문법), `PowerShell`(Windows 네이티브 문법) — 플랫폼과 스크립트 종류에 맞는 도구를 선택한다
- 서브에이전트 위임: `Agent`(`Explore`, `Plan`, `general-purpose`, `claude-code-guide`, `statusline-setup` 등)
- 명시적 오케스트레이션: `Workflow`(opt-in 조건을 충족했을 때만, `model-routing.md`의 Workflow 사용 기준 참조)
- 작업 추적: `TaskCreate`, `TaskUpdate`, `TaskList`, `TaskGet`, `TaskOutput`, `TaskStop`
- 사용자 확인/질의: `AskUserQuestion`, `EnterPlanMode`/`ExitPlanMode`
- 최신 정보 확인: `WebSearch`, `WebFetch`
- 정형 리뷰 결과 보고: `ReportFindings`
- 산출물 공유: `Artifact`(퍼블리시 전 원문 파일 전체 확인 필수), `ShareOnboardingGuide`
- 반복/예약 실행: `ScheduleWakeup`, `CronCreate`/`CronList`/`CronDelete`
- 스킬 호출: `Skill`(저장소에 등록된 스킬, 예: `harness-lab`, `security-review`, `simplify`, `update-config`)
- 버전 확인: `git status`, `git diff`, `git log`(`Bash`/`PowerShell` 경유)
- 도구 스키마 확인: `ToolSearch`(지연 로딩된 도구를 호출하기 전)

## 주의해서 사용할 도구

- 패키지 설치 명령: 네트워크나 권한 상승이 필요하면 이유를 남기고 승인 프롬프트를 통과한 뒤 실행한다.
- 장시간 실행되는 개발 서버: 사용자가 확인할 URL이 필요할 때 `run_in_background` 옵션으로 실행한다.
- 자동 포맷터: 변경 범위가 넓어질 수 있으므로 대상 파일을 확인한다.
- `Workflow`: opt-in 없이 호출하지 않는다. 토큰 비용이 크므로 규모를 세션 가이드라인에 맞춘다.
- 병렬 `Agent`/`Workflow` 호출이 같은 파일을 동시에 수정할 수 있으면 `isolation: "worktree"`로 충돌을 피한다(`model-routing.md`의 병렬 서브에이전트 쓰기 충돌 회피 기준 참조).
- `Artifact`: 사용자가 작성하지 않은 파일은 반드시 전체를 읽은 뒤 퍼블리시한다. 실제 인물, 조직, 금융/신원 정보를 흉내 내는 페이지는 배포하지 않는다.
- `EndConversation`: 지속적인 남용이나 사용자의 명시적 요청 등 정의된 조건에서만 사용한다.

## 금지된 도구와 행동

- 사용자 승인 없는 파괴적 명령: `git reset --hard`, `git push --force`(특히 main/master), `git clean -f`, 대량 삭제/이동
- hook 우회(`--no-verify`), 서명 우회(`--no-gpg-sign`) — 사용자가 명시적으로 요청하지 않는 한 금지
- 관련 없는 파일을 대상으로 한 자동 포맷팅
- 비밀값, 토큰, 인증 정보 출력 또는 저장(메모리 파일 포함)
- 검증 우회를 위한 임시 코드
- 실패한 명령을 성공한 것처럼 기록하는 행위
- opt-in 없는 `Workflow` 호출
- 실제 인물, 조직을 사칭하거나 신원 확인 절차를 우회하는 산출물 작성

## 도구 선택 기준

- 전용 도구가 있으면 `Bash`/`PowerShell` 대신 전용 도구(`Read`/`Edit`/`Write`/`Glob`/`Grep`)를 우선한다.
- 저장소에 이미 있는 명령과 스크립트를 우선 사용한다.
- 같은 결과를 낼 수 있다면 변경 범위가 작고 추적이 쉬운 도구를 선택한다.
- 네트워크나 권한 상승이 필요한 작업은 필요성과 영향을 명확히 하고 승인을 기다린다.
- 열린 탐색이 3회 이상의 검색으로 이어질 것 같으면 직접 반복하는 대신 `Explore` 서브에이전트에 위임한다.
