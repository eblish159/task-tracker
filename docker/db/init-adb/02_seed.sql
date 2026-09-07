-- =========================================================
-- 기준 데이터(카테고리) + 데모 로그인 계정 (Autonomous Database 버전)
-- docker/db/init/02_seed.sql과 내용 동일, ALTER SESSION SET CONTAINER 줄만 제거.
-- Database Actions에서 TRACKER 유저로 로그인해 01_schema.sql 다음에 실행.
-- =========================================================

-- 데모 로그인 계정 (아이디: testuser / 비밀번호: demo1234!)
-- TASK_CATEGORY.USER_ID가 FK로 USERS를 참조하므로 카테고리보다 먼저 넣어야 함.
-- 비밀번호는 BCrypt 해시(Spring Security BCryptPasswordEncoder와 100% 호환)이며 평문은 저장되지 않음.
INSERT INTO USERS (USER_ID, USER_PASSWORD, NAME, EMAIL, ROLE, STATUS)
VALUES (
    'testuser',
    '$2b$10$qj9FjOrC8bE3Zubq1jghWO2KOIZ8DVl3najtBxI2FDmnldtQUc.4y',
    '데모 사용자',
    'demo@example.com',
    'USER',
    'ACTIVE'
);

-- 카테고리 1~10 (DemoDataSeeder 및 프론트엔드가 이 ID를 그대로 참조함)
INSERT INTO TASK_CATEGORY (CATEGORY_ID, TITLE, USER_ID) VALUES (1, '개발', 'testuser');
INSERT INTO TASK_CATEGORY (CATEGORY_ID, TITLE, USER_ID) VALUES (2, '운동', 'testuser');
INSERT INTO TASK_CATEGORY (CATEGORY_ID, TITLE, USER_ID) VALUES (3, '회의', 'testuser');
INSERT INTO TASK_CATEGORY (CATEGORY_ID, TITLE, USER_ID) VALUES (4, '문서', 'testuser');
INSERT INTO TASK_CATEGORY (CATEGORY_ID, TITLE, USER_ID) VALUES (5, '테스트', 'testuser');
INSERT INTO TASK_CATEGORY (CATEGORY_ID, TITLE, USER_ID) VALUES (6, '버그', 'testuser');
INSERT INTO TASK_CATEGORY (CATEGORY_ID, TITLE, USER_ID) VALUES (7, '배포', 'testuser');
INSERT INTO TASK_CATEGORY (CATEGORY_ID, TITLE, USER_ID) VALUES (8, '디자인', 'testuser');
INSERT INTO TASK_CATEGORY (CATEGORY_ID, TITLE, USER_ID) VALUES (9, '학습', 'testuser');
INSERT INTO TASK_CATEGORY (CATEGORY_ID, TITLE, USER_ID) VALUES (10, '개인', 'testuser');

COMMIT;
