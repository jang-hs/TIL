# Kubernetes NetworkPolicy

쿠버네티스 클러스터는 기본적으로 Pod 간 통신에 어떠한 제한도 두지 않는 “모든 허용(all-allow)” 상태로 동작합니다. 이는 운영 환경에서 보안상 위험을 초래할 수 있으며, 서비스 간 불필요한 접근이나 내부 트래픽 유출의 가능성을 높입니다. 이러한 문제를 해결하기 위해 등장한 것이 NetworkPolicy입니다. NetworkPolicy는 Pod 레벨의 네트워크 방화벽 규칙을 정의하여 제로 트러스트(Zero Trust) 네트워크를 구현하는 핵심 도구입니다.

이 글에서는 NetworkPolicy의 핵심 개념과 Ingress(수신 트래픽), Egress(송신 트래픽) 동작 원리를 심층적으로 분석하고, 실무에서 활용할 수 있는 고급 패턴 및 보안 전략을 다룹니다.



## 1. NetworkPolicy란 무엇인가?

NetworkPolicy는 Kubernetes에서 제공하는 L3/L4 계층 기반의 네트워크 접근 제어 정책입니다. 간단히 말해, 특정 Pod가 어떤 Pod, 네임스페이스, 또는 외부 네트워크와 통신할 수 있는지를 명시적으로 허용(Whitelist)하는 방식으로 동작합니다.

* 네임스페이스 범위: 정책은 특정 네임스페이스 내에서만 유효하며, `podSelector`를 통해 적용할 Pod를 지정합니다.
* 화이트리스트 모델: 정책이 없는 경우 모든 트래픽이 허용되지만, 하나라도 정책이 적용되면 지정된 규칙에 맞는 트래픽만 통신이 가능합니다.
* 포트 및 프로토콜 기반 제어: TCP, UDP, SCTP 등 프로토콜과 특정 포트 기반의 세밀한 접근 제어가 가능합니다.



## 2. Ingress와 Egress의 개념과 차이점

### 2-1. Ingress (수신 트래픽 제어)

Ingress 정책은 Pod으로 들어오는 트래픽을 제한합니다.
예를 들어, `role=backend` Pod가 `role=frontend` Pod로부터 오는 요청만 수락하도록 할 수 있습니다. Ingress 규칙이 적용되면 지정된 소스 외의 모든 접근은 기본적으로 거부됩니다.

### 2-2. Egress (송신 트래픽 제어)

Egress 정책은 Pod에서 나가는 트래픽을 제어합니다.
예를 들어, `role=frontend` Pod가 외부 인터넷 또는 특정 CIDR 대역으로만 통신할 수 있도록 제한할 수 있습니다. 보안상 중요한 DB나 외부 API에 대한 접근을 최소화할 때 유용합니다.



## 3. 동작 메커니즘과 CNI 플러그인

NetworkPolicy 자체는 추상화된 정책 정의 리소스일 뿐, 실제로 이를 적용하는 것은 CNI(Container Network Interface) 플러그인입니다.

* 지원 CNI: Calico, Cilium, Weave Net, Kube-router 등.
* 비지원 CNI: 기본 Flannel(추가 설정이 없으면 정책 적용 불가).

CNI는 NetworkPolicy 정의를 기반으로 iptables 또는 eBPF 규칙을 생성하여 Pod 간 트래픽을 차단하거나 허용합니다. 특히 Cilium은 eBPF를 활용하여 성능 오버헤드를 줄이고, L7 레벨 정책까지 확장할 수 있는 장점이 있습니다.



## 4. NetworkPolicy 주요 구성 요소

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: example-policy
  namespace: app
spec:
  podSelector:
    matchLabels:
      role: backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          role: frontend
    ports:
    - protocol: TCP
      port: 80
  egress:
  - to:
    - ipBlock:
        cidr: 10.0.0.0/24
    ports:
    - protocol: TCP
      port: 443
```

* podSelector: 정책이 적용될 Pod를 선택.
* policyTypes: Ingress, Egress 중 어떤 트래픽을 제어할지 명시.
* ingress/from: 수신 트래픽 허용 규칙.
* egress/to: 송신 트래픽 허용 규칙.
* ports: 허용할 포트 및 프로토콜 정의.



## 5. 고급 예시

### 5-1. Ingress 예시

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend
  namespace: app
spec:
  podSelector:
    matchLabels:
      role: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          role: frontend
    ports:
    - protocol: TCP
      port: 80
```

결과: backend Pod는 frontend Pod의 80포트 접근만 허용.



### 5-2. Egress 예시

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: restrict-egress
  namespace: app
spec:
  podSelector:
    matchLabels:
      role: frontend
  policyTypes:
  - Egress
  egress:
  - to:
    - ipBlock:
        cidr: 10.0.0.0/24
    ports:
    - protocol: TCP
      port: 443
```

결과: frontend Pod는 10.0.0.0/24 네트워크의 HTTPS(443)만 통신 허용.



### 5-3. Default Deny (기본 차단)

모든 트래픽을 차단하고 필요한 규칙만 허용하기 위해 아래와 같이 기본 차단 정책을 먼저 설정할 수 있습니다.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
  namespace: app
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```



## 6. 실무 설계 전략

### 6-1. Zero Trust 아키텍처

NetworkPolicy는 모든 트래픽을 기본 차단하고 필요한 통신만 허용하는 제로 트러스트 방식과 잘 맞습니다. 서비스 간 접근 경로를 최소화하고, Pod 간 권한을 명확히 구분할 수 있습니다.

### 6-2. DNS 및 외부 접근 제어

Egress 정책을 사용할 때는 DNS(`port 53`) 트래픽이 차단될 수 있으므로, 필요한 DNS 서버로의 트래픽을 허용해야 합니다. 예:

```yaml
egress:
- to:
  - ipBlock:
      cidr: 10.96.0.10/32   # CoreDNS IP
  ports:
  - protocol: UDP
    port: 53
```

### 6-3. Observability와 정책 검증

* Cilium Hubble이나 Kiali를 사용하면 Pod 간 트래픽 흐름을 시각화하고, 정책 적용으로 인해 차단된 요청을 쉽게 파악할 수 있습니다.
* 정책 테스트 시 `kubectl exec` 또는 `netcat`을 사용해 접근 허용 여부를 점검.



## 7. 성능 및 운영 고려사항

* NetworkPolicy가 많아질수록 iptables 규칙 증가로 인한 관리 복잡성이 커질 수 있습니다.
* 대규모 환경에서는 eBPF 기반 CNI(Cilium)를 고려해 성능 오버헤드를 줄이고, 정책 관리 효율성을 높일 수 있습니다.
* Ingress/Egress를 잘못 설정하면 내부 서비스 통신이 끊길 수 있으므로, 정책 점진적 적용(네임스페이스 단위 테스트 후 전체 배포)이 안전합니다.



## 8. 마무리

NetworkPolicy는 Kubernetes 네트워크 보안의 핵심 도구로, Ingress와 Egress를 적절히 조합해 최소 권한(Least Privilege) 원칙을 구현할 수 있습니다.

* Ingress는 외부에서 Pod로 들어오는 트래픽,
* Egress는 Pod에서 외부로 나가는 트래픽을 제어합니다.
  CNI의 특성을 이해하고, 기본 차단 정책을 기반으로 필요한 트래픽만 허용하는 전략이 프로덕션 보안의 모범 사례입니다.



다음 단계:
Calico나 Cilium을 활용한 고급 NetworkPolicy 패턴 (GlobalNetworkPolicy, DNS 필터링, L7 레벨 제어)를 다음 글에서 다뤄보면 심화 시리즈로 이어갈 수 있습니다.



원한다면, 이 내용을 “Ingress/Egress 고급 패턴” 섹션을 추가해 4500\~5000자 수준의 더 풍부한 글로 확장해 드릴까요?
