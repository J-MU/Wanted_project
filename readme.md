## Notion 링크

: https://www.notion.so/softsquared/_A-6417e16f547e4b1b84d2a752bb1e728f

## API Document 링크

:https://docs.google.com/spreadsheets/d/1FJPlXTnkLF1kjtMaG1hKoZIqqBHE-8ivASr-MUI1Rrc/edit?usp=sharing

## 2022.07.16 개발일지- Ayaan

- ERD 설계(with 제제)
- API User Domain 리스트업 진행중(with 제제)
- AWS EC2 Key 공유받음

## 2022.07.16 개발일지- jeje

- 원티드 기획서 작성(기획서 보드 및 작업 범위 결정)
- 원티드 ERD 설계(with Ayaan)
- User API 리스트업
- AWS EC2 key 공유

## 2022.07.17 - Ayaan
- API 명세서 리스트업 작업중
- Wanted ERD 설계 수정
- RDS 연결 및 회원가입과 연관된 테이블 생성
- 회원가입 API 일부 구현중
- AWS EC2 서버 구축중
- => 라이징 테스트 전 기존 EC2삭제함(Ayaan)
- => ec2구축작업중 아애 다 꼬여버림(Jeje)
- => 위 이유로 EC2새로 구축중이며 이로인해 클라이언트에게 API제공 일정이 늦어지고 있음. 금일 새벽중에 크라이언트에게 API전달을 목표로 하고있음.

## 2022.07.17 - jeje
- API 명세서 리스트업(회원가입, 프로필 api 완성)
- 회원가입 validation 처리
- AWS EC2 서버 구축중

## 2022.07.18 - jeje
-proxy 설정 (80번 포트로 들어가면 3000번 포트로 이동할 수 있게)
-3번 회원가입 테이블 api 완성 중
-프론트랑 연결 확인!(api 요청이 잘 이뤄지고, 데이터베이스에 잘 저장되는지 확인)
-직군, 직무, tag 더미데이터 넣어주기
-첫 화면 api 구현 중

## 2022.07.18 - Ayaan
 - 회원가입 관련 API 4개 구축
 - client와 소통하여 위 API들이 정상 작동하는지 확인하고 발견된 에러를 수정
 - zezeserver.shop에 reverse proxy 설정 완료
 - 직군, 직무, tag 더미데이터 넣어주기

## 2022.07.19 - jeje
- 첫 화면 api 구축 완료 
  - 첫 화면의 배너이미지, 인사이트포스트, 아티클포스트, vod포스트 전부 가져오는 쿼리 작성.
- 이력서 api 구축 중
  - 이력서 조회 api 완성 

## 2022.07.19 -Ayaan
- userDomain의 회원가입 관련 API 4개 구축
- 각종 Dummy Data 작성
- 게시글, 회사에 필요한 Table 추가 구축

## 2022.07.20 -Ayaan
- Dummy Data 작성.
- 채용페이지와 관련된 각종 테이블 생성과 기존 테이블 수정
- 채용 첫 페이지와 관련된 API구축중

## 2020.07.20 -jeje
- 이력서 생성, 전체 조회, 개별 조회 api 생성
- 더미데이터 작성.

## 2022.07.21 -Ayaan
- 좋아요,북마크,팔로우 관련 API구현
- 좋아요,북마크,팔로우 관련 테이블 생성
- ERD 설계(100%) 완성.
- 채용 페이지 관련 API에 북마크 팔로우 적용

## 2022.07.21
- 이력서 API 명세서 6개 완성
- 검사 API 완성 및 수정
- 이력서 API 완성 중 ( 현재 스킬 부분 작성중)

## 2022.07.22 -jeje
- 이력서 API 유저 스킬 관련해서 4개 완성
- 이력서 API 명세서 작성

## 2022.07.22 -Ayaan
- 채용 조회 페이지 API 작성중.(오늘 새벽중 완성 예정)
- Dummy Data 삽입

## 2022.07.22 -jeje
- 관심 태그에 따라 다른 태그 목록들이 보여지도록 첫 화면 API 수정
- 더미데이터 삽입
- 첫 화면 API수정 중

## 2022.07.23 -Ayaan
- 채용 조회 페이지 API 구축 완료
- API 41,43,48,49 구축
- Dummy Data 삽입
<<<<<<< HEAD
=======

## 2022.07.24 -Ayaan
- profile API 구축중
- Dummy Data 삽입
>>>>>>> d79f1df692b436f3dd2985a769200bf3784a032c

## 2022.07.24 -jeje
- 첫 화면 API 수정중
- 인사이트 포스트 전체화면 보기 api 만드는 중

## 2022.07.25 - jeje
- 아티클 포스트 관련 API 구축 중
  - 전체 화면 조회, 태그별 조회, 필터 기능 API 구축 완료
- 작성 못 한 명세서 작성 완료
