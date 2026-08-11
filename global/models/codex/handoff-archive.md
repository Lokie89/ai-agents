# 기록 아카이브

`handoff-log.md`의 최근 기록 보관 한도를 넘긴 이전 세션 기록을 오래된 순서로 보관한다.

## 2026-07-22

- 목표: AI Agents 저장소의 기본 모델 기준을 만들고 Codex 모델을 첫 번째로 정의한다.
- 변경: `README.md`와 `global/models/codex/` 문서 세트를 생성했다. Codex 모델에 청사진 우선 모드를 추가했다. 공통 문서는 `global/`, 프로젝트별 문서는 `local/`로 나누었다. 글로벌 Codex 규칙에 보이스카웃 규칙, 도메인 우선 원칙, 도메인 모델과 데이터베이스 모델 분리 원칙을 추가했다. 도메인 처리 방식은 글로벌 `domain-rules.md`로, 실제 도메인 정책은 로컬 `domain-policy.md`로 분리했다. 사람용 `README.md`와 에이전트용 `AGENT.md`를 분리했다. 역할별 모델 선택 루브릭을 `model-routing.md`로 추가하고, 작업 조건별 승격/강등 기준을 보강했다.
- 검증: 문서 구조와 내부 링크를 확인한다.
- 남은 작업: 실제 프로젝트 유형별 Codex 운영 예시와 템플릿을 추가할 수 있다.
- 주의 사항: 이 기록의 모델 별칭과 YAML frontmatter 기준은 2026-08-09 현행화에서 폐기됐다. 현재 기준은 `model-routing.md`를 따른다.

## 2026-07-26

- 목표: Codex 운영 문서를 실제 하네스로 검증하기 위한 기준 자료를 추가한다.
- 변경: `global/models/codex/harness/`에 상태 전이, 실패 케이스, 산출물 스키마, fixture 문서를 추가했다. 루트 README, Codex README, 컨텍스트 지도, 검증 문서에 하네스 참조를 연결했다. `local/sample-project/`에 샘플 로컬 정책과 검증 문서를 추가했다.
- 검증: `./scripts/validate-docs.sh`로 문서 구조와 핵심 참조를 확인한다.
- 남은 작업: 필요하면 Markdown 전체 링크 검사나 fixture별 응답 채점기를 추가할 수 있다.
- 주의 사항: 당시 자동 검증은 필수 파일과 핵심 참조 확인에 한정됐으며, 2026-08-09에 구조화 fixture와 실행 기록 evaluator가 추가됐다.

## 2026-07-28

- 목표: Codex 하네스가 실제 작업 판정에 더 직접적으로 쓰이도록 fixture와 판정 기준을 보강한다.
- 변경: `evaluation-rubric.md`를 추가해 요청 유형, 통과 기준, 실패 우선 원칙, 판정 기록 형식을 정의했다. 승인 필요한 명령, 사용자 변경 보호, 검증 실패 보고, HTML 템플릿 내 JavaScript 수정 fixture를 추가했다. 실패 케이스에 사용자 변경 보호, 승인 및 실행 경계, 최신 정보 사용, 템플릿 내 JavaScript 검증 누락을 추가했다. 하네스 README, 컨텍스트 지도, 검증 문서, 문서 검증 스크립트에 새 루브릭 참조를 연결했다. `compare-report.html`처럼 JavaScript가 들어간 HTML 템플릿을 수정한 뒤에는 Java 컴파일과 별도로 script를 추출해 `node --check`를 실행하도록 검증 기준을 보강했다.
- 검증: `bash scripts/validate-docs.sh`는 WSL 배포판 부재로 실행되지 않았다. 같은 파일 존재와 핵심 참조 조건을 PowerShell로 대체 실행해 통과했다.
- 남은 작업: fixture별 실제 응답 샘플과 자동 채점 스크립트를 추가할 수 있다.
- 주의 사항: 새 루브릭은 체크리스트 판정 기준이며, 실제 프로젝트 테스트나 보안 검토를 대체하지 않는다.
