# [Tracker 배포 회고 4] 로컬에서 docker compose up 한 번 성공하기까지

지난 글에서는 애플리케이션 코드만으로는 재현할 수 없었던 DB 스키마를 MyBatis 매퍼와 실제 Oracle DB를 대조해가며 SQL 파일로 복원하는 과정을 정리했다.

이번 글에서는 그렇게 준비한 Dockerfile, docker-compose.yml, 스키마/시드 SQL을 로컬 PC에서 실제로 `docker compose up` 한 번 돌려보는 과정을 정리한다. 미리 말하자면 한 번에 되지 않았고, 순서대로 문제를 만나고 하나씩 해결해야 했다.

## 문제 1. Docker Desktop이 아예 안 켜진다 (BIOS AMD SVM)

Docker Desktop을 설치하고 실행했는데 가상화 관련 오류로 아예 켜지지 않았다. Docker Desktop은 WSL2 기반으로 동작하고, WSL2는 다시 하드웨어 가상화 기능이 필요한데, 내 PC는 BIOS에서 AMD의 가상화 기능(SVM)이 꺼져있는 상태였다.

> [이미지: 01-bios-virtualization-not-detected.png — Docker Desktop "Virtualization support not detected" 에러 화면]

BIOS로 들어가서 SVM Mode를 Enabled로 바꾸고 나서야 이 문제가 해결됐다. 개발 PC에서는 한 번도 신경 쓸 일이 없던 설정이라, Docker를 쓰려면 OS 레벨이 아니라 하드웨어 레벨에서부터 가상화가 필요하다는 걸 이번에 처음 체감했다.

## 문제 2. WSL2 설치가 `wsl --install`에서 멈춘다

BIOS 설정을 바꾼 다음에는 WSL2 자체가 설치되어 있지 않아서 `wsl --install`을 실행했는데, 도중에 WSL 업데이트 설치 프로그램이 오류를 내며 진행이 막혔다.

> [이미지: 02a-wsl-update-setup-error.png — "This update only applies to machines with the Windows Subsystem for Linux" 오류 창]

찾아보니 `wsl --install`이 자동으로 켜줘야 할 Windows 선택적 기능("Linux용 Windows 하위 시스템", "가상 머신 플랫폼")이 아직 활성화되지 않은 상태에서 커널 업데이트 패키지부터 먼저 실행되려다 보니 생긴 문제였다. 제어판의 "Windows 기능 켜기/끄기"에서 두 기능을 직접 체크해서 켜고,

> [이미지: 02b-windows-features-checklist.png — "Windows 기능" 목록에서 "Linux용 Windows 하위 시스템", "가상 머신 플랫폼" 체크]

`dism /online /get-featureinfo`로 두 기능의 상태가 "사용"으로 바뀐 걸 확인했다.

> [이미지: 02c-dism-feature-enabled.png — dism 명령으로 두 기능이 모두 "상태: 사용"으로 확인된 결과]

이 상태에서 다시 아래 명령을 실행하니 두 기능 모두 100%까지 정상적으로 설치됐다.

```bash
# Windows 선택적 기능(WSL/가상 머신 플랫폼)이 이미 켜져 있는 상태에서
# 배포판 없이 WSL 커널/플랫폼 구성 요소만 다시 설치
wsl --install --no-distribution
```

> [이미지: 02d-wsl-install-no-distribution-success.png — 두 기능 모두 100% 설치 완료, 재시작 안내 메시지]

재시작 후에야 Docker Desktop도 WSL2 백엔드를 정상적으로 인식했다.

## 문제 3. C 드라이브 용량 부족으로 이미지 pull이 깨진다

WSL2까지 정상 동작하는 걸 확인하고 처음으로 `docker compose up -d --build`를 돌렸는데, Oracle 이미지를 받아오는 도중에 IDE가 "디스크 공간 부족" 경고를 띄우면서 이미지 추출이 실패했다.

> [이미지: 03a-disk-full-warning.png — "디스크 공간 부족: 시스템 드라이브 파티션(C:)에 1MiB 미만이 남아 있습니다" 경고와 함께 `failed to commit snapshot ... input/output error`로 끝난 빌드 로그]

`Get-PSDrive`로 확인해보니 원인은 명확했다. 그동안 로컬 개발을 C 드라이브 하나에서만 해왔는데, 남은 공간이 10GB도 안 되는 상태였다.

```
Name Used (GB) Free (GB) Provider Root
---- --------- --------- -------- ----
C    109.07    9.62      FileSystem C:\
```

> [이미지: 03b-c-drive-almost-full.png — `Get-PSDrive C` 결과 Free 9.62GB]

다행히 다른 드라이브(E:)에는 여유 공간이 충분했다. 프로젝트 폴더 자체를 `E:\projects\tracker`로 옮기고, Docker Desktop 설정(Settings → Resources → Advanced)에서 "Disk image location"도 C에서 E로 옮기려 했는데, 처음 시도에서는 Docker가 아직 해당 vhdx 파일을 사용 중이라 이동이 실패했다.

> [이미지: 03c-docker-disk-move-failed.png — "failed to move WSL disk: ... The process cannot access the file because it is being used by another process." 오류]

Docker Desktop을 완전히 종료한 뒤 다시 시도하니 WSL 디스크 이미지가 정상적으로 E 드라이브로 이동했고, 그 이후로는 이미지 pull/추출 과정에서 디스크 공간 문제가 재발하지 않았다.

> [이미지: 03d-docker-disk-moved-to-e.png — Disk image location이 `E:\DockerDesktopWSL`로 정상 변경된 화면]

돌이켜보면 개발 PC의 기본 드라이브 용량을 평소에 신경 쓰지 않고 있다가, Docker 이미지처럼 용량을 크게 잡아먹는 작업을 하면서 처음으로 문제를 체감한 케이스였다. 프로젝트와 Docker의 데이터 디스크를 함께 여유 있는 드라이브로 옮기고 나서야 다음 단계로 넘어갈 수 있었다.

## 문제 4. DB 포트 1521 충돌

WSL2 문제까지 해결하고 다시 `docker compose up`을 돌렸더니, 이번엔 Oracle DB 컨테이너가 포트 바인딩에서 실패했다. 원인은 간단했다. 예전부터 로컬에 직접 설치해서 쓰던 Oracle이 이미 1521 포트를 쓰고 있었고, 컨테이너의 Oracle XE도 기본 포트로 1521을 쓰려다 충돌한 것이었다.

> [이미지: 04-port-1521-conflict.png — `ports are not available: exposing port ... 1521` 에러 로그]

```yaml
# docker-compose.yml
oracle-db:
  ports:
    - "1522:1521"
    # 호스트(내 PC) 포트만 1522로 바꿔서 기존 로컬 Oracle과 충돌을 피함
    # 컨테이너 내부 포트는 그대로 1521 (컨테이너 안에서는 여전히 1521로 접속)
```

호스트 쪽 포트만 1522로 바꾸는 걸로 해결했다. 컨테이너 내부 포트까지 바꿀 필요는 없었고, 로컬 SQL 클라이언트로 컨테이너 DB에 붙을 때만 1522를 쓰면 됐다.

## 문제 5. Oracle 컨테이너가 계속 죽었다가 다시 뜬다 (ORA-01157)

포트까지 정리하고 나니 이번엔 Oracle 컨테이너가 뜨는 것 같다가 `ORA-01157` 에러를 내면서 계속 재시작을 반복했다. (디스크를 E 드라이브로 옮긴 뒤라 공간 문제는 아니었다.)

> [이미지: 05-oracle-crash-before-fix.png — `docker compose down -v` 후 다시 올려도 tracker-db가 계속 unhealthy로 실패하던 상태]

당시 사용하던 `gvenzl/oracle-xe:21-slim-faststart` 이미지에서 Oracle 초기화 과정 중 `ORA-01157`이 발생하며 컨테이너가 반복 재시작되는 현상이 있었다. 정확한 내부 원인을 끝까지 특정하지는 못했지만, `-faststart` 태그가 걸려있던 이미지를 `gvenzl/oracle-xe:21-slim`(faststart 없는 버전)으로 바꾸자 더 이상 재현되지 않고 정상적으로 초기화됐다.

> [이미지: 06-oracle-fixed-healthy.png — 이미지를 21-slim으로 바꾼 뒤 tracker-db가 Healthy로 뜬 로그]

## 문제 6. 로그인이 안 된다 ("로그인 정보가 없습니다")

DB까지 정상적으로 뜨고 스키마/시드 SQL도 실행됐는데, 정작 데모 계정(`testuser` / `1234`)으로 로그인을 시도하니 "로그인 정보가 없습니다" 에러가 났다.

> [이미지: 07-login-error-screen.png — 실제 로그인 화면에 뜬 "로그인 정보가 없습니다." 에러]

DB에 직접 접속해서 확인해보니 `USERS.USER_PASSWORD`에 저장된 BCrypt 해시가 실제로 `1234`를 해싱한 값과 맞지 않는 값이었다. 아마 3편에서 시드 데이터를 만들 때 임의로 생성한 해시 값을 그대로 넣은 게 원인으로 보인다. `sqlplus`로 접속해서 새로 생성한 BCrypt 해시로 직접 `UPDATE`해서 해결했다.

이 과정에서 두 가지를 더 신경 써야 했다.

- `UPDATE`로 지금 떠 있는 DB는 고쳤지만, 이 값이 `02_seed.sql`에는 반영돼 있지 않다는 걸 알아챘다. `docker compose down -v`로 볼륨을 초기화하고 다시 올리면 시드 SQL이 처음부터 다시 실행되면서 파일 안의 옛날 해시값으로 되돌아간다는 뜻이었다. 그래서 지금 DB만 고치는 데서 그치지 않고 `02_seed.sql`의 해시값도 같이 바꿔서, 나중에 볼륨을 초기화해도 같은 문제가 재발하지 않도록 해뒀다.
- `sqlplus` 재접속 시 서비스명(`@XEPDB1`)을 빼먹으면 `CDB$ROOT`에 붙어버려서 `TRACKER` 스키마 자체가 안 보이는 문제가 있었다. `UPDATE`가 `ORA-00942: table or view does not exist` 에러로 실패해서 처음엔 당황했는데, `SHOW CON_NAME`으로 확인해보니 `CDB$ROOT`에 붙어있었다. 서비스명을 명시해서 다시 접속하니 정상적으로 해결됐다.

> [이미지: 08a-sqlplus-ora00942-error.png — `UPDATE` 시도 시 `ORA-00942: table or view does not exist` 에러]
> [이미지: 08b-sqlplus-show-con-name-cdbroot.png — `SHOW CON_NAME` 결과 `CDB$ROOT`에 붙어있던 상태]
> [이미지: 09-sqlplus-fixed-password.png — `CONNECT TRACKER@XEPDB1`로 정상 접속 후 비밀번호 해시 UPDATE + COMMIT 성공]

## 문제 7. 로그인은 되는데 Dashboard가 전부 0으로 나온다

로그인까지는 성공했는데, 이번엔 Dashboard 화면의 모든 통계가 0으로 나왔다. 데이터가 아예 없나 싶었는데, 원인은 `DemoDataSeeder`가 실행되지 않은 것이었다.

> [이미지: 10-dashboard-all-zero.png — 총 작업/완료 작업/완료율이 전부 0, 카테고리별 분포는 "데이터 없음"으로 나온 Dashboard 화면]

`DemoDataSeeder`는 `@Profile("seed")`로 지정돼 있는데, 컨테이너는 `SPRING_PROFILES_ACTIVE=prod`만 활성화된 상태로 떠 있어서 시더 자체가 아예 동작하지 않았던 것이다.

```yaml
# docker-compose.yml
backend:
  environment:
    SPRING_PROFILES_ACTIVE: prod,seed
    # prod 프로파일만으로는 DemoDataSeeder(@Profile("seed"))가 실행되지 않아서
    # seed 프로파일을 함께 활성화
```

프로파일을 `prod,seed`로 바꾸고 다시 올리니 데모 데이터가 정상적으로 채워지고 Dashboard 수치도 제대로 나왔다.

## 마무리

여기까지 정리하고 나서 다시 `docker compose up -d`를 실행하니, 전체 컨테이너가 모두 healthy 상태로 뜨고 로그인과 데모 데이터 모두 정상적으로 동작했다.

> [이미지: 11-final-docker-ps-healthy.png — `docker ps` 결과 frontend/backend/db 세 컨테이너 모두 정상 구동 중인 최종 화면]
> (여유가 되면 여기에 실제 데이터가 채워진 Dashboard 화면도 함께 — README에 이미 쓰신 images/dashboard.png를 재사용해도 좋습니다)

돌아보면 문제는 한꺼번에 나타난 게 아니라 계층별로 하나씩 드러났다. 하드웨어 가상화(BIOS) → WSL2 → 로컬 디스크 용량 → Docker 네트워크/포트 → Oracle 이미지 초기화 → DB 데이터 정합성 → Spring 프로파일 설정 순으로, 아래 계층 문제를 해결해야 그 위 계층의 문제가 비로소 보이는 식이었다. 그리고 `docker compose down -v`가 컨테이너뿐 아니라 볼륨까지 지운다는 걸 알고 나니, DB 관련 수정은 지금 떠 있는 DB뿐 아니라 시드 SQL에도 같이 반영해둬야 나중에 볼륨을 초기화해도 같은 문제가 재발하지 않는다는 것도 배웠다.

Oracle Cloud에 실제로 배포할 때도 면접관이 접속했을 때 데모 데이터가 바로 보여야 하므로 `seed` 프로파일은 계속 켜둔 채로 배포하기로 했다. `DemoDataSeeder`는 실행될 때마다 기존 데이터를 지우고 다시 채우는 방식으로 만들어뒀기 때문에, 이 상태로는 컨테이너가 재시작될 때마다 그 시점까지 쌓인 데이터(예: 면접관이 화면에서 직접 만들어본 작업)까지 함께 초기화된다는 트레이드오프를 감수한 셈이다.

다음 편에서는 이렇게 로컬에서 검증한 구성을 Oracle Cloud Always Free VM에 실제로 올리는 과정을 정리할 예정이다.
