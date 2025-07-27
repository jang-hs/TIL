# LimitRange와 ResourceQuota

쿠버네티스 환경에서 리소스를 효율적으로 관리하지 않으면, 특정 Pod나 네임스페이스가 클러스터 자원을 독점하여 다른 워크로드에 영향을 줄 수 있습니다.
LimitRange와 ResourceQuota는 이러한 상황을 예방하기 위한 두 가지 핵심 메커니즘입니다.


## 1. LimitRange: Pod/컨테이너 수준의 리소스 가이드라인

### 1-1. LimitRange가 필요한 이유

Pod 스펙에 `requests`와 `limits`를 지정하지 않으면 쿠버네티스 스케줄러는 자원의 요구량을 0으로 인식해 노드에 무분별하게 스케줄링할 수 있습니다. 이는 노드 리소스를 고갈시키고, 다른 Pod가 제때 스케줄되지 못하는 문제를 유발할 수 있습니다.

### 1-2. Admission Controller와의 관계

LimitRange는 `LimitRanger` Admission Controller에 의해 적용됩니다.
Pod이 API 서버로 제출될 때:

1. Pod 스펙에 요청/제한 값이 없으면 defaultRequest 및 default 값으로 자동 보정됩니다.
2. 요청값이 최소(min) 또는 최대(max) 범위를 벗어나면 유효성 검사에서 실패합니다.

### 1-3. LimitRange와 QoS 클래스

LimitRange는 쿠버네티스 QoS(Quality of Service) 클래스에도 직접적인 영향을 미칩니다:

* Guaranteed: 모든 컨테이너가 `request=limit` 설정.
* Burstable: request < limit.
* BestEffort: request/limit 미설정(→ LimitRange로 최소 보정 가능).

QoS 클래스는 Pod OOM(Out-Of-Memory) 발생 시 eviction 우선순위를 결정하므로, LimitRange는 QoS 설계에도 중요한 역할을 합니다.



## 2. ResourceQuota: 네임스페이스 자원의 상한선

### 2-1. ResourceQuota 컨트롤러

ResourceQuota는 네임스페이스 전체의 리소스 사용량을 추적하기 위해 `ResourceQuota Controller`를 사용합니다.

* Pod이나 PVC가 생성될 때 현재 사용량(usage)을 조회하고, `hard`에 정의된 한도를 초과하면 API 서버가 `Forbidden` 에러를 반환합니다.
* LimitRange가 없으면 Pod의 request가 0으로 계산되어 ResourceQuota가 실질적으로 동작하지 않을 수 있음.

### 2-2. 트래픽 폭주 방지

실서비스에서는 특정 팀/서비스가 스케일 아웃 시 수십 개 Pod을 동시에 생성할 수 있습니다. ResourceQuota는 이러한 트래픽 폭주를 방지하여 클러스터 안정성을 확보합니다.



## 3. LimitRange vs ResourceQuota: 내부 동작 차이

| 항목              | LimitRange                          | ResourceQuota         |
|  |  | - |
| 적용 범위       | Pod/컨테이너 단위                             | 네임스페이스 전체                 |
| 검증 시점       | Admission Controller 단계 (`LimitRanger`) | Quota Controller에서 사용량 검증 |
| 주요 목적       | 합리적인 리소스 요청 강제                          | 네임스페이스별 자원 독점 방지          |
| QoS 클래스에 영향 | O (defaultRequest/limit으로 결정)           | X                         |



## 4. 실무 설계 패턴

### 4-1. 개발/테스트 vs 운영 환경

* 개발/테스트:

  * LimitRange로 작은 defaultRequest 설정 (ex: `cpu=100m`, `memory=128Mi`).
  * ResourceQuota로 네임스페이스 CPU/메모리를 제한 (ex: `requests.cpu=1`, `limits.memory=2Gi`).
* 운영 환경:

  * 서비스별로 충분한 리소스를 보장 (`request=limit` 설정으로 Guaranteed QoS 확보).
  * ResourceQuota를 느슨하게 설정하되, 팀 단위로 명확히 구분.

### 4-2. 헬름(Helm) 기반 템플릿화

운영 시 팀별 네임스페이스에 동일한 패턴을 적용하기 위해 LimitRange + ResourceQuota를 Helm Chart로 묶어 배포하면 관리가 용이합니다.



## 5. 운영 시 발생할 수 있는 문제와 해결책

### 문제 1: Pod 스케줄 실패 (Insufficient CPU/Memory)

* 원인: ResourceQuota가 request 값을 초과하거나, LimitRange의 max 제한으로 Pod이 생성 거부.
* 해결: `kubectl describe quota`, `kubectl describe limitrange` 명령어로 원인 분석.

### 문제 2: QoS 클래스 BestEffort로 인한 Eviction

* 원인: LimitRange 미적용 시 request=0 → BestEffort로 스케줄됨.
* 해결: LimitRange를 통해 request 최소값 설정.

### 문제 3: PVC 초과 생성

* ResourceQuota에 PVC 수를 제한하지 않으면, 과도한 볼륨 사용 가능.
* 해결: `persistentvolumeclaims` 필드를 반드시 관리.



## 6. LimitRange + ResourceQuota 실전 YAML

```yaml
# LimitRange
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
  namespace: team-a
spec:
  limits:
  - type: Container
    defaultRequest:
      cpu: 200m
      memory: 256Mi
    default:
      cpu: 400m
      memory: 512Mi
    min:
      cpu: 100m
      memory: 128Mi
    max:
      cpu: 1
      memory: 1Gi

# ResourceQuota
apiVersion: v1
kind: ResourceQuota
metadata:
  name: namespace-quota
  namespace: team-a
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "6"
    limits.memory: 12Gi
    pods: "20"
    persistentvolumeclaims: "10"
```



## 7. 실무 TIP: 설계 체크리스트

1. LimitRange의 defaultRequest 값은 노드 리소스를 고려해 현실적인 값으로 설정.
2. ResourceQuota 값은 팀별/네임스페이스별 리소스 할당량과 매칭.
3. QoS 클래스(Guaranteed vs Burstable)를 의도적으로 관리하여 OOM 및 eviction 우선순위 제어.
4. `kubectl describe quota`와 `kubectl describe limitrange`로 지속적으로 상태 점검.
5. Prometheus로 ResourceQuota 사용량을 모니터링해 초과 위험 시 Alert.



## 8. 마무리

LimitRange와 ResourceQuota는 단순한 리소스 제한 도구가 아니라, 클러스터 리소스 전략의 핵심입니다.

* LimitRange → Pod 단위 리소스 품질 보장 (QoS 클래스 제어)
* ResourceQuota → 네임스페이스별 공평한 자원 분배

두 메커니즘을 함께 사용하면 안정적이고 예측 가능한 클러스터 운영이 가능합니다.