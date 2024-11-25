# Kubernetes의 Probe 알아보기
쿠버네티스(Kubernetes)에서 프로브(Probe)는 애플리케이션 컨테이너의 상태를 점검하는 메커니즘입니다. 프로브는 주로 헬스 체크에 사용되며, 이를 통해 쿠버네티스가 애플리케이션의 상태를 모니터링하고 적절한 조치를 취할 수 있습니다. 쿠버네티스에서 지원하는 주요 프로브는 다음과 같습니다:
- Liveness Probe: 생존 여부를 확인하며, 실패 시 컨테이너 재시작.
- Readiness Probe: 준비 상태를 확인하며, 실패 시 트래픽 차단.
- Startup Probe: 시작 완료 여부를 확인하며, Liveness/Readiness Probe의 실행을 지연.
## Liveness Probe 
**역할:** 컨테이너가 정상적으로 작동 중인지 확인.
- 실패하면 컨테이너를 재시작.
- 주로 **애플리케이션이 고장난 상태에서 복구 불가능할 경우**를 감지하기 위해 사용.
- 예: 애플리케이션이 데드락 상태에 빠졌거나, 응답하지 않는 상태.

```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 3
  periodSeconds: 5
```
## Readiness Probe
**역할:** 컨테이너가 요청을 처리할 준비가 되었는지 확인.
- 실패하면 해당 컨테이너로 트래픽을 전달하지 않음.
- 주로 애플리케이션 초기화나 의존 서비스가 준비될 때까지 대기하기 위해 사용.
- Liveness와 달리 컨테이너를 재시작하지는 않음.

```yaml
readinessProbe:
  tcpSocket:
    port: 3306
  initialDelaySeconds: 5
  periodSeconds: 10
```
## Startup Probe
**역할:** 애플리케이션이 완전히 시작되었는지 확인.
- Readiness와 Liveness의 역할을 대체하지 않지만, **시작이 느린 애플리케이션을 처리**하는 데 유용.
- Startup Probe가 성공하기 전에는 Liveness와 Readiness가 실행되지 않음.
```yaml
startupProbe:
  exec:
    command:
    - cat
    - /tmp/ready
  initialDelaySeconds: 10
  periodSeconds: 5
  failureThreshold: 30
```
## 프로브의 설정 구성
1. **동작 유형**
    - `httpGet`: HTTP 요청을 보내 상태 확인.
    - `tcpSocket`: 특정 포트에서 TCP 연결 가능 여부 확인.
    - `exec`: 컨테이너 내에서 특정 명령어를 실행하고 종료 코드를 확인.
2. **주요 파라미터**
    - `initialDelaySeconds`: 프로브 시작 전 대기 시간.
    - `periodSeconds`: 프로브 주기.
    - `timeoutSeconds`: 프로브 응답 타임아웃.
    - `failureThreshold`: 실패를 몇 번 연속으로 감지하면 상태를 "비정상"으로 판단할지 설정.
    - `successThreshold`: 몇 번 연속 성공하면 상태를 "정상"으로 판단할지 설정 (주로 Readiness Probe에 사용).
## 프로브 활용 시 주의점
- Startup Probe는 느린 초기화를 처리할 때만 필요하며, 설정하지 않으면 Liveness Probe가 초기화 과정에서 불필요하게 재시작을 유발할 수 있습니다.
- Readiness Probe는 애플리케이션 초기화뿐만 아니라 외부 의존성(예: 데이터베이스 연결 상태)을 확인하는 데도 적합합니다.
- Liveness Probe는 애플리케이션의 고장 상태를 신속히 감지하고 복구하는 데 중요한 역할을 합니다.
