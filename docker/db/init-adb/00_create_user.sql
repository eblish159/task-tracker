-- =========================================================
-- Autonomous Database에 앱 전용 스키마 유저 생성 (최초 1회만 실행)
-- Database Actions(브라우저 SQL Worksheet)에서 ADMIN 계정으로 로그인해 실행.
-- =========================================================

-- <새비밀번호>는 아래 규칙을 지켜서 직접 정할 것:
--   12~30자, 대문자/소문자/숫자 각 1개 이상, 'TRACKER' 문자열 포함 금지, 큰따옴표(") 금지
CREATE USER TRACKER IDENTIFIED BY "<새비밀번호>";

-- DWROLE: Autonomous DB 기본 제공 롤 (CREATE TABLE/SEQUENCE/VIEW/PROCEDURE 등 포함)
GRANT DWROLE TO TRACKER;
GRANT CREATE SESSION TO TRACKER;
GRANT UNLIMITED TABLESPACE TO TRACKER;
