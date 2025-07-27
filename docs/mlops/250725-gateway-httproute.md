# Gateway API와 HTTPRoute

Kubernetes에서 외부 트래픽을 내부 서비스로 연결할 때 가장 많이 사용되는 리소스는 Ingress입니다. Ingress는 간단하고 직관적인 설정 덕분에 초창기 Kubernetes 사용자들에게 필수 도구로 자리잡았습니다. 하지만 대규모 마이크로서비스 환경이나 다중 팀 협업 체계에서는 세밀한 트래픽 제어, 보안 관리, 확장성 등의 요구를 만족시키기 어려워졌습니다. 이를 해결하기 위해 Kubernetes SIG-Network에서 개발한 Gateway API가 등장했습니다.

이번 글에서는 Gateway API와 HTTPRoute의 개념, Ingress와의 실전 비교, 그리고 Ingress에서 Gateway API로 마이그레이션하는 가이드까지 종합적으로 다뤄보겠습니다.



## 1. Gateway API란 무엇인가?

Gateway API는 Ingress를 대체하거나 보완하기 위해 만들어진 차세대 트래픽 관리 표준입니다. 기존 Ingress가 단일 객체로 모든 규칙을 관리했다면, Gateway API는 역할을 분리하여 더 유연하고 확장 가능한 구조를 제공합니다.

* GatewayClass: Gateway를 구현하는 컨트롤러를 정의합니다. 예: NGINX, Istio, Kong Gateway.
* Gateway: L4 레벨에서 트래픽을 수용하는 진입점(Entry Point).
* Route (HTTPRoute, TCPRoute, GRPCRoute 등): L7 레벨에서 호스트, 경로, 헤더, 쿼리 조건에 따라 트래픽을 세밀하게 라우팅.

이러한 구조는 운영팀과 개발팀 간의 역할 분리, 보안 및 멀티 프로토콜 지원, 확장성 강화라는 장점을 제공합니다.



## 2. HTTPRoute란 무엇인가?

`HTTPRoute`는 Gateway API의 핵심 리소스로, HTTP 및 HTTPS 트래픽을 세밀하게 제어할 수 있습니다.

* Hostnames, Path, Headers, Query 기반 매칭을 지원.
* 요청/응답 필터링, URL Rewrite, Redirect 등의 고급 기능을 표준 스펙으로 제공합니다.
* Canary 배포와 A/B 테스트를 간단히 구성할 수 있습니다.

예시:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: example-route
spec:
  parentRefs:
    - name: example-gateway
  hostnames:
    - "example.com"
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /api
      backendRefs:
        - name: service-a
          port: 80
```

이 설정은 `example.com/api`로 들어오는 요청을 `service-a`로 라우팅합니다.



## 3. Ingress vs Gateway API – 왜 전환해야 하는가?

Ingress는 단순성과 빠른 설정이 장점이지만, 고급 라우팅과 다중 팀 관리에는 한계가 있습니다. Gateway API는 역할을 분리하여 관리 편의성을 높이고, 더 다양한 트래픽 제어 기능을 제공합니다.

| 항목        | Ingress      | Gateway API                   |
|  |  | -- |
| 구조        | 단일 객체        | Gateway + Route로 역할 분리        |
| 확장성       | 제한적          | 다양한 Route 리소스(TCP, gRPC 등) 지원 |
| Canary 배포 | 컨트롤러 종속      | 표준 스펙으로 지원                    |
| 고급 라우팅    | Path/Host 기반 | Path, Host, Header, Query 기반  |
| TLS 관리    | 간단하나 제한적     | 리스너 단위 TLS 관리 가능              |
| 협업 구조     | 충돌 가능성 높음    | 팀별 HTTPRoute 관리 가능            |



## 4. 실전 비교 예시

### Ingress 예시

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: example-ingress
spec:
  rules:
    - host: "example.com"
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: service-a
                port:
                  number: 80
```

Ingress는 단일 객체에서 모든 규칙을 정의하므로 서비스가 많아질수록 관리가 복잡해집니다.

### Gateway + HTTPRoute 예시

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
spec:
  gatewayClassName: nginx
  listeners:
    - name: http
      protocol: HTTP
      port: 80

apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: api-route
spec:
  parentRefs:
    - name: example-gateway
  hostnames:
    - "example.com"
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /api
      backendRefs:
        - name: service-a
          port: 80
```

이 구조에서는 Gateway와 HTTPRoute를 분리해 관리하므로 팀 간 충돌이 줄어듭니다.



## 5. Gateway API 고급 트래픽 관리

### (1) Canary 배포

```yaml
rules:
  - matches:
      - path:
          type: PathPrefix
          value: /api
    backendRefs:
      - name: service-v1
        port: 80
        weight: 70
      - name: service-v2
        port: 80
        weight: 30
```

70%는 `service-v1`, 30%는 `service-v2`로 트래픽을 보낼 수 있습니다.

### (2) 헤더 기반 라우팅

```yaml
matches:
  - headers:
      - name: X-Canary
        value: "true"
```

특정 헤더가 포함된 요청만 Canary 서비스로 전달할 수 있습니다.

### (3) 요청/응답 필터링

```yaml
filters:
  - type: RequestHeaderModifier
    requestHeaderModifier:
      add:
        X-Version: "v1"
  - type: URLRewrite
    urlRewrite:
      path:
        type: ReplaceFullPath
        replace: /v1/api
```

URL을 재작성하거나 헤더를 추가하는 등의 고급 처리가 가능합니다.



## 6. Gateway API 마이그레이션 가이드 (Ingress에서 전환하기)

Ingress를 이미 사용 중이라면 Gateway API로 전환하기 위해 다음 단계를 거칠 수 있습니다.

### (1) GatewayClass 선택

* 사용 중인 Ingress Controller(NGINX, Kong, Istio 등)가 Gateway API를 지원하는지 확인.
* `GatewayClass` 리소스를 정의하여 사용할 컨트롤러를 지정합니다.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: nginx
spec:
  controllerName: k8s.io/nginx
```

### (2) Gateway 생성

Ingress의 `spec.rules`에 있던 host와 port 정보를 Gateway의 `listeners`로 이전합니다.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
spec:
  gatewayClassName: nginx
  listeners:
    - name: http
      protocol: HTTP
      port: 80
```

### (3) HTTPRoute로 라우팅 규칙 변환

Ingress의 `rules`와 `paths`를 HTTPRoute의 `hostnames`와 `rules.matches`로 변환합니다.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: api-route
spec:
  parentRefs:
    - name: example-gateway
  hostnames:
    - "example.com"
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /api
      backendRefs:
        - name: service-a
          port: 80
```

### (4) 점진적 전환

* 초기에는 Ingress와 Gateway API를 병행하여 동작시킬 수 있습니다.
* 트래픽을 점차 Gateway로 이전하면서 Canary 전략으로 안정성을 확보합니다.

### (5) Helm 차트/CI 파이프라인 수정

* 기존 Ingress 리소스를 관리하던 Helm 차트나 GitOps 파이프라인을 Gateway + HTTPRoute 구조로 업데이트합니다.



## 7. 마무리

Gateway API와 HTTPRoute는 Kubernetes 네트워크 트래픽 관리의 미래 표준으로 자리잡고 있습니다. Ingress의 한계를 넘어, Canary 배포, A/B 테스트, 헤더 기반 라우팅 같은 고급 기능을 표준화된 방법으로 제공합니다.
기존 Ingress 사용자는 Gateway API로 점진적 마이그레이션을 고려하여 더 유연하고 안정적인 트래픽 관리 환경을 구축할 수 있습니다.