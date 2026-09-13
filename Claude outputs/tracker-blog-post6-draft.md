# [Task Tracker 배포기 6편] 실제 배포와 트러블슈팅 총정리

> 5편에서 준비한 E2.1.Micro 서버 + Autonomous Database 위에, 실제로 코드를 올리고 서비스를 띄우기까지의 기록이다. 결론부터 말하면 무사히 배포에 성공했지만, 가는 길은 순탄치 않았다. 이번 편은 그 삽질을 최대한 가감 없이 정리했다.

## 1. Docker 설치, 그런데 붙여넣기가 자꾸 깨진다

Docker 공식 문서의 설치 스크립트를 여러 줄 한 번에 복사해서 터미널에 붙여넣었는데, 이상하게 `newgrp: group 'docker' does not exist` 같은 에러가 났다. 분명 설치 명령어를 실행했는데 그룹이 안 만들어졌다는 건, 애초에 설치가 제대로 안 됐다는 뜻이었다.

원인은 SSH 터미널에 **여러 줄을 한꺼번에 붙여넣을 때 줄 사이가 뒤섞이는 현상**이었다. 실제 로그를 보면 이렇게 명령어 중간에 다른 명령어가 끼어 들어가 있었다.

```
echo "deb [arch=$(dpkg --print-architesudo apt install -y ca-certificates curl gnupg
```

이후로는 여러 줄을 절대 한 번에 붙여넣지 않고, **한 줄씩 실행하고 결과를 확인하면서** 진행하는 방식으로 바꿨다. 확실히 느리지만 훨씬 안전했다.

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
```

## 2. GitHub에 Docker 관련 파일이 애초에 올라간 적이 없었다

서버에 코드를 올리려고 `git status`를 확인했는데, `docker-compose.prod.yml` 같은 신규 파일뿐 아니라 **`Dockerfile`, `docker-compose.yml`, `docker/` 폴더 전체, `frontend/Dockerfile`까지 전부 한 번도 커밋된 적이 없는 상태**였다. 그동안 로컬에서만 파일이 존재했을 뿐, 실제로는 GitHub 저장소에 Docker 관련 설정이 하나도 반영되어 있지 않았던 것이다.

커밋하기 전에 두 가지를 먼저 점검했다.

- `.gitignore`에 `.env`가 제대로 제외돼 있는지 확인 (진짜 비밀번호가 실수로 올라가면 안 되니까). 서버에서 새로 만들 `.env.prod`도 안전하게 관리하려고 `.gitignore`에 한 줄 추가했다.
  ```
  .env.prod
  ```
- 커밋 대상 목록에 프로젝트 코드가 아닌 폴더(예: 블로그 초안, 캡처 이미지를 모아둔 폴더)가 섞여 있는지 확인하고, 있다면 `.gitignore`에 추가해서 제외했다.

정리 후 필요한 파일만 정확히 골라서 커밋/푸시했다.

```bash
git add .gitignore README.md Dockerfile docker-compose.yml docker-compose.prod.yml docker/ frontend/ src/main/resources/application-prod.yaml ...
git commit -m "feat: 운영 배포용 Docker 설정 추가 (E2.1.Micro + Autonomous DB)"
git push
```

이후 서버에서는 `git clone`으로 한 번에 코드를 받아왔다.

```bash
git clone https://github.com/<내계정>/task-tracker.git tracker
```

## 3. `.env.prod`로 운영 환경변수 분리하기

`docker-compose.prod.yml`은 DB 접속 정보를 코드에 박아두지 않고 환경변수로 받도록 설계했다. Autonomous DB의 TLS 접속 문자열은 이런 형태다.

```
DB_URL=jdbc:oracle:thin:@(description=(retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=<호스트>))(connect_data=(service_name=<서비스명>))(security=(ssl_server_dn_match=yes)))
DB_USERNAME=TRACKER
DB_PASSWORD=<비밀번호>
```

이 파일은 절대 git에 커밋하지 않고, 서버에 SSH로 접속한 상태에서 `nano`로 직접 만들었다. Docker Compose는 `--env-file` 옵션으로 이 값을 읽어서 컨테이너 안에 주입한다.

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

## 4. 방화벽은 두 겹으로 열어야 한다

80번 포트로 접속이 안 될 때 처음엔 당황했는데, Oracle Cloud는 방화벽이 **두 레이어**로 되어 있다는 걸 알게 됐다.

1. **OCI Security List** (클라우드 네트워크 레벨) — VCN의 Security List에서 Ingress Rule을 추가 (Source `0.0.0.0/0`, TCP, 목적지 포트 `80`)
2. **서버 내부 iptables** (OS 레벨) — Ubuntu 안에도 별도의 방화벽 규칙이 있어서 이것도 따로 열어야 함

```bash
sudo iptables -L INPUT -n --line-numbers   # 현재 규칙 확인
sudo iptables -I INPUT 5 -m state --state NEW -p tcp --dport 80 -j ACCEPT   # REJECT 규칙보다 앞에 삽입
sudo netfilter-persistent save   # 재부팅해도 유지되도록 저장
```

둘 중 하나만 열어서는 절대 접속이 안 되고, 두 곳 다 열어야 실제로 뚫린다.

## 5. 1GB RAM으로 빌드하기 — 스왑 메모리로 버티기

E2.1.Micro는 RAM이 954MB밖에 안 되는데, Spring Boot(Gradle)와 React(npm)를 컨테이너 안에서 직접 빌드해야 했다. 빌드 중간에 메모리 부족(OOM)으로 죽을 위험이 커서, 미리 2GB짜리 스왑 파일을 만들어 안전장치를 걸어뒀다.

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

스왑은 디스크 공간을 "비상용 여분 RAM"처럼 쓰는 개념이라 진짜 RAM보다 느리지만, "빌드가 중간에 강제 종료되는 것"보다는 "느려도 끝까지 완료되는 것"이 훨씬 나은 선택이었다.

## 6. 배포는 됐는데... 백엔드가 계속 재시작한다

빌드는 무사히 끝났고 컨테이너도 떴는데, `docker ps`로 확인해보니 이상한 점이 있었다.

```
CONTAINER ID   IMAGE             CREATED       STATUS
...            tracker-backend   4 hours ago   Up 10 seconds
```

**생성된 지 4시간이 지났는데 "Up 10 seconds"** — 즉 4시간 내내 죽었다 살아나기를 반복하고 있다는 신호였다. 로그를 뽑아보니 원인이 나왔다.

```
Caused by: java.sql.SQLException: ORA-01017: invalid credential or not authorized; logon denied
Caused by: java.sql.SQLException: ORA-28000: The account is locked; login denied.
```

정리하면 이런 흐름이었다.

1. 예전에 Database Actions에서 TRACKER 비밀번호를 헷갈려서 로그인을 여러 번 실패했었다.
2. Autonomous DB는 로그인 실패가 누적되면 **계정을 자동으로 잠근다.**
3. 그 뒤에 비밀번호를 올바르게 재설정했지만, **비밀번호 변경과 계정 잠금 해제는 별개의 작업**이라 잠금은 그대로 남아있었다.
4. 배포된 앱이 컨테이너가 재시작될 때마다 로그인을 시도했고, 잠긴 계정이라 계속 `ORA-28000`을 맞으면서 재시작 루프에 빠졌다.

해결 과정에서도 규칙 관련 실수를 두 번 더 했다.

- 새 비밀번호를 예전에 썼던 값으로 다시 지정하려다 `ORA-28007: 비밀번호를 재사용할 수 없습니다` 에러를 만났다 (Autonomous DB는 최근 사용한 비밀번호 재사용을 막는 정책이 기본으로 걸려 있다).
- 그다음 정한 비밀번호에 실수로 "Tracker"라는 단어가 들어가서 `ORA-20002: Password contains the username` 에러를 또 만났다.

최종적으로 규칙을 다 지킨 새 비밀번호로 바꾸고, 계정 잠금도 풀었다.

```sql
ALTER USER TRACKER IDENTIFIED BY "<새비밀번호>";
ALTER USER TRACKER ACCOUNT UNLOCK;
```

서버의 `.env.prod`도 같은 비밀번호로 맞추고, 컨테이너를 강제로 새로 만들어서 새 환경변수를 적용했다.

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --force-recreate backend
```

## 7. 드디어 성공

로그 마지막 줄에서 원하던 메시지를 봤다.

```
HikariPool-1 - Added connection oracle.jdbc.driver.T4CConnection@...
HikariPool-1 - Start completed.
[DemoDataSeeder] 오늘(...) 기준 데모 데이터 32건 생성 완료
```

`docker ps`로 재확인했을 때도 재시작 없이 안정적으로 `Up`상태를 유지했고, 브라우저에서 서버 IP로 접속하니 로그인 화면이 정상적으로 떴다. `testuser` 계정으로 로그인해서 데모 데이터까지 잘 보이는 걸 확인하고서야 진짜 배포가 끝났다는 걸 실감했다.

## 마무리 — 배운 것들

이번 배포에서 가장 크게 느낀 건, **매끄럽게 한 번에 성공하는 배포보다 오히려 문제를 하나씩 진단하고 고쳐나간 경험이 더 남는 게 많다**는 점이었다.

- 인프라 용량 문제는 재시도만이 답이 아니라, 요구사항(포트폴리오 일정)에 맞춰 아키텍처 자체를 재검토하는 것도 방법이라는 것
- 클라우드 방화벽은 한 겹이 아니라 여러 겹으로 되어 있을 수 있다는 것
- 계정 잠금·비밀번호 정책처럼 눈에 잘 안 띄는 보안 정책이 실제 장애의 원인이 될 수 있다는 것, 그리고 에러 메시지(`ORA-` 코드)를 끝까지 읽고 정확한 원인을 찾는 습관의 중요성
- 터미널에 여러 줄을 한 번에 붙여넣는 습관이 생각보다 위험할 수 있다는 것

다음에 새 프로젝트를 배포할 때는 이번에 겪은 문제들을 체크리스트로 만들어서 미리 대비할 생각이다.

**배포된 서비스**: `http://<서버IP>`
**저장소**: `https://github.com/<내계정>/task-tracker`
