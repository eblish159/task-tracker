# [Task Tracker 배포기 5편] A1.Flex 용량 대기 지옥, 그리고 아키텍처 전환 결정

지난 글에서 썼듯이 원래 배포는 Oracle Cloud Always Free A1.Flex(Ampere ARM) 인스턴스와 Docker Compose로 백엔드, 프론트엔드, Oracle DB 컨테이너 모두 하나의 VM으로 운영하려고 했다.

로컬에서는 이미 잘 돌아가고 있었기 때문에, 클라우드에 옮기기만 하면 될 줄 알았다.

## "Out of host capacity" — 며칠째 이 에러만 본다

근데 A1.Flex 인스턴스를 만들려고 하니 계속 이 에러가 나왔다.

```
Out of host capacity for shape VM.Standard.A1.Flex in availability domain ...
```

이 에러를 알아보니, 해당 리전에 A1.Flex를 배치할 물리적 호스트 용량이 부족하다는 의미였다. 즉 내가 뭘 잘못 설정해서 생기는 문제가 아니라, 그 리전에 물리적으로 빈자리가 없다는 뜻이었다.

내가 지정한 홈 리전이 인기가 많은 리전이라, 장기간 서버를 배당받지 못할 확률이 높았다. 그래서 포트폴리오 마감을 생각해서 아키텍처, 즉 기존 계획을 바꾸기로 했다.

## 선택지 정리

**1. 계속 재시도한다**

가장 간단하지만 언제 잡힐지 알 수 없다. 포트폴리오 배포 일정을 인스턴스 용량에 맡길 수는 없다고 판단했다.

**2. 다른 리전에서 시도한다**

다른 리전이면 여유가 있을 수도 있다고 생각했는데, 공식 문서를 확인해보니 **Always Free 리소스는 계정의 홈 리전에서만 생성할 수 있다**는 걸 확인했다. 즉 이 방법은 애초에 선택지가 아니었다.

**3. 아키텍처를 바꾼다**

두 방법 다 쓸 수 없다는 게 확인된 이상, 남은 건 이거뿐이었다. 결국 기존 계획을 바꾸기로 정했다.

- **VM.Standard.E2.1.Micro** — x86, 1/8 OCPU, 약 1GB RAM
- **Oracle Autonomous Database** — Oracle이 관리하는 DB 서비스

DB를 VM에서 분리하고, 애플리케이션만 VM에 올리는 구조다.

## 이 구성의 단점

물론 공짜로 얻는 건 없었다.

- E2.1.Micro는 RAM이 약 1GB, CPU도 1/8 OCPU라 Spring Boot와 React를 컨테이너 안에서 직접 빌드하기엔 부족했다.
- 로컬에서는 Docker로 Oracle DB까지 함께 실행하지만, 운영 환경에서는 Autonomous Database를 쓰기 때문에 로컬과 운영 환경의 구성이 달라졌다. `docker-compose.yml`과 운영용 `docker-compose.prod.yml`을 분리해야 했다.

그럼에도 이 구성을 택한 이유는 단순했다. "용량이 없어서 아예 못 만드는 환경"보다 "스펙은 낮아도 지금 바로 만들 수 있는 환경"이 포트폴리오 일정에는 더 적합했다.

## Autonomous Database 만들기

OCI 콘솔에서 Autonomous Database를 생성하고 Transaction Processing 워크로드와 Always Free 옵션을 적용했다.

또한 애플리케이션에서 관리자 계정을 직접 사용하지 않도록 `TRACKER`라는 별도의 앱 전용 DB 사용자를 생성했다.

JDBC에서는 Wallet 파일 없이 TLS 방식으로 연결하도록 설정했고, 이후 애플리케이션에서 사용할 접속 정보를 확인했다. 이 과정에서 Autonomous Database의 계정 및 비밀번호 정책도 확인할 수 있었다.

## E2.1.Micro는 정말 바로 만들어졌다

DB를 준비한 뒤 애플리케이션을 올릴 VM을 생성했다.

- Shape: VM.Standard.E2.1.Micro
- Image: Ubuntu 24.04 LTS
- Public IPv4 할당
- SSH 공개키 등록
- 기존 VCN/서브넷 재사용

A1.Flex에서 며칠째 `Out of host capacity`만 보고 있었던 것과 달리, E2.1.Micro는 생성 요청을 누르자마자 몇 초 만에 만들어졌다. 며칠을 기다려도 안 잡히던 셰이프와, 요청하자마자 바로 되는 셰이프의 차이를 이렇게 직접 겪어보니 확실히 체감이 됐다.

여기까지 VM과 DB 준비가 끝났다.

다음 6편에서는 실제 서버에 Docker와 프로젝트를 올리고 서비스를 실행하는 과정, 즉 실제 배포 과정에서 겪었던 트러블슈팅을 정리해보겠다.
