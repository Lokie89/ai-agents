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
