# Kubernetes HPA (Horizontal Pod Autoscaler) 알아보기
Horizontal Pod Autoscaler (HPA)는 Kubernetes에서 애플리케이션의 부하에 따라 Pod의 개수를 자동으로 조정하는 메커니즘입니다. CPU 사용량, 메모리 사용량 또는 사용자 정의 메트릭(예: 네트워크 트래픽, 요청 수 등)을 기준으로 스케일링합니다.

## HPA의 주요 구성 요소
1. Target Resource:
- HPA가 적용될 Deployment, ReplicaSet, 또는 StatefulSet 등의 리소스.
2. Metrics:
- 기본적으로 CPU/메모리 사용량과 같은 리소스 메트릭을 사용.
- 사용자 정의 메트릭(Custom Metrics)과 외부 메트릭(External Metrics)도 지원.
3. 스케일링 범위:
- 최소 및 최대 Pod 개수를 설정.

## HPA 작동 방식
1. 메트릭 수집:
- HPA는 Metrics Server를 통해 메트릭 데이터를 주기적으로 조회합니다.
2. 스케일링 계산:
- HPA는 목표 메트릭(Target Value)과 현재 메트릭(Current Value)을 비교하여 Pod 개수를 조정.
- 예: CPU 사용량 기준 스케일링 공식  
$DesiredReplicas = CurrentReplicas \times \frac{CurrentMetricValue}{TargetMetricValue}$
3. Pod 수 조정:
- 계산된 Pod 수가 설정된 범위를 초과하지 않는 한, Kubernetes는 이를 기반으로 Pod를 생성하거나 제거.

## HPA 설정 방법
1. 전제 조건
- Metrics Server 설치: HPA는 Metrics Server를 통해 메트릭 데이터를 수집하므로 반드시 설치되어 있어야 합니다.
```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```
- 대상 리소스(예: Deployment)가 이미 배포되어 있어야 합니다.

2. HPA 매니페스트 작성 및 적용
(1) Deployment 생성
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
 matchLabels:
app: my-app
  template:
 metadata:
labels:
  app: my-app
 spec:
containers:
- name: my-app
  image: nginx
  resources:
 requests:
cpu: 200m
 limits:
cpu: 500m
```   
적용하기  
```bash
kubectl apply -f deployment.yaml
```
(2) HPA 매니페스트 작성  
```yaml  
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
 apiVersion: apps/v1
 kind: Deployment
 name: my-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
 resource:
name: cpu
target:
  type: Utilization
  averageUtilization: 50
```
적용하기  
```bash
kubectl apply -f hpa.yaml
```
  
3. HPA 확인
```bash
kubectl get hpa
```  
출력 예시   
```
NAME          REFERENCE            TARGETS         MINPODS   MAXPODS   REPLICAS   AGE
my-app-hpa    Deployment/my-app    40% / 50%       2         10        3          5m

```

## HPA 동작 테스트

1. 부하 생성
- 부하를 시뮬레이션하기 위해 `kubectl run` 명령어를 사용하거나, 부하 테스트 도구(예: `stress`, `ab`)를 활용합니다.
```bash
kubectl run -i --tty load-generator --image=busybox /bin/sh
```

```bash
# 부하 생성 (CPU를 100% 사용)
while true; do :; done
```

2. HPA 상태 확인
```bash
kubectl get hpa
```

부하가 증가하면 `REPLICAS` 값이 증가하는 것을 확인할 수 있습니다.

## 주요 설정 옵션  
1. 메트릭 타입
- Resource: CPU, 메모리 등 리소스 기반 메트릭.
- Pods: Pod의 특정 메트릭(예: 요청 수).
- External: 외부 메트릭(예: 클라우드 서비스, 외부 API).
2. 스케일링 정책
HPA v2부터는 스케일링 정책을 세부적으로 정의할 수 있습니다.
```yaml
behavior:
  scaleUp:
 stabilizationWindowSeconds: 30
 selectPolicy: Max
 policies:
 - type: Percent
value: 50
periodSeconds: 60
  scaleDown:
 stabilizationWindowSeconds: 60
 selectPolicy: Min
 policies:
 - type: Percent
value: 20
periodSeconds: 60
```

## 기타 팁
- HPA가 작동하지 않는 경우:
  - Metrics Server가 제대로 설치되어 있는지 확인:
 ```bash
 kubectl get apiservices | grep metrics
 ```
  - Deployment가 `resources.requests`를 정의했는지 확인.
  
- Custom Metrics 사용:
  - Prometheus Adapter를 설치하고 Prometheus 메트릭을 활용.

HPA는 Kubernetes 환경에서 워크로드를 동적으로 확장할 수 있는 강력한 도구입니다. 기본적인 CPU/메모리 기준 외에도 다양한 메트릭을 활용하여 사용자 정의 확장이 가능합니다.