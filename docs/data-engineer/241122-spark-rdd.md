# Apache Spark RDD(Resilient Distributed Dataset)
Apache Spark의 RDD(Resilient Distributed Dataset)는 Spark의 핵심 데이터 추상화로, 대규모 데이터를 분산 환경에서 효율적으로 처리하기 위한 불변성(immutable) 및 분산(distributed) 데이터 구조입니다. RDD는 분산 데이터 처리를 간소화하고 신뢰성을 보장하기 위해 설계되었습니다.

## **RDD의 주요 특징**

1. **Resilient (탄력성)**
    - RDD는 장애 복구가 가능합니다.
    - 데이터는 변환 내역(계보, lineage)을 저장하며, 일부 파티션이 손실되더라도 lineage를 기반으로 재생성할 수 있습니다.
2. **Distributed (분산)**
    - RDD는 클러스터의 여러 노드에 걸쳐 데이터를 저장하고 계산을 분산 처리합니다.
    - 각 파티션은 클러스터 내 워커 노드에 분산되어 작업을 병렬로 실행.
3. **Immutable (불변성)**
    - RDD는 생성 후 변경이 불가능하며, 데이터 변환은 새로운 RDD를 생성합니다.
    - 이는 데이터의 신뢰성을 높이고 병렬 처리를 쉽게 만듭니다.
4. **Lazy Evaluation (지연 평가)**
    - RDD 변환(transformations)은 즉시 실행되지 않고, 실행이 필요할 때(예: 액션 수행 시) 연산이 평가됩니다.
    - 이를 통해 최적화된 실행 계획(DAG: Directed Acyclic Graph)이 생성됩니다.
5. **In-Memory Computing (메모리 기반 연산)**
    - RDD는 데이터를 메모리에 저장하여 I/O 오버헤드를 줄이고 처리 속도를 향상시킵니다.
    - 디스크 기반 연산도 지원.

## **RDD의 주요 구성 요소**

1. **데이터 분할 (Partitions)**
    - RDD는 여러 파티션으로 분리되며, 각 파티션은 클러스터 노드에서 병렬로 처리됩니다.
2. **변환(Transformations)**
    - RDD에서 새로운 RDD를 생성하는 연산으로, **Lazy Evaluation**을 따릅니다.
    - 예: `map`, `filter`, `flatMap`, `distinct`, `groupByKey`, `reduceByKey`.
3. **액션(Actions)**
    - 변환 결과를 클러스터에서 수집하거나 저장하는 연산으로, 연산을 실행합니다.
    - 예: `collect`, `count`, `reduce`, `saveAsTextFile`, `foreach`.
4. **계보(Lineage)**
    - RDD가 생성된 변환 내역을 추적하여 장애 시 데이터 복구에 사용.

## **RDD 생성 방법**

1. **외부 데이터 로드**
    - 파일 시스템, HDFS, Cassandra, HBase 등에서 데이터를 로드하여 생성.
```python
rdd = spark.sparkContext.textFile("hdfs://path/to/file")
```
        
2. **컬렉션에서 변환**
    - 로컬 데이터 컬렉션을 병렬화하여 생성.
```python
rdd = spark.sparkContext.parallelize([1, 2, 3, 4])
```
        
3. **변환을 통한 생성**
    - 기존 RDD에 변환을 적용하여 새로운 RDD 생성.
```python
rdd2 = rdd.map(lambda x: x * 2)
```
        
## **RDD의 Transformations 예시**

| 연산              | 설명                       | 예시                                    |
| --------------- | ------------------------ | ------------------------------------- |
| **map**         | 각 요소에 대해 주어진 함수를 적용      | `rdd.map(lambda x: x * 2)`            |
| **filter**      | 주어진 조건을 만족하는 요소만 선택      | `rdd.filter(lambda x: x > 10)`        |
| **flatMap**     | 각 입력 요소를 여러 출력 요소로 매핑    | `rdd.flatMap(lambda x: x.split(" "))` |
| **distinct**    | 중복을 제거                   | `rdd.distinct()`                      |
| **reduceByKey** | 동일 키를 가진 요소들을 지정된 함수로 병합 | `rdd.reduceByKey(lambda x, y: x + y)` |
| **join**        | 두 RDD를 키를 기준으로 조인        | `rdd1.join(rdd2)`                     |

## **RDD의 Actions 예시**

|연산|설명|예시|
|---|---|---|
|**collect**|모든 데이터를 드라이버 프로그램으로 반환|`rdd.collect()`|
|**count**|RDD의 요소 개수를 반환|`rdd.count()`|
|**reduce**|주어진 함수를 사용해 RDD의 모든 요소를 병합|`rdd.reduce(lambda x, y: x + y)`|
|**take**|상위 N개의 요소를 반환|`rdd.take(10)`|
|**saveAsTextFile**|데이터를 텍스트 파일로 저장|`rdd.saveAsTextFile("output/path")`|

## **RDD의 장단점**

### 장점
1. **유연성:** 데이터의 다양한 변환 및 액션 지원.
2. **확장성:** 대규모 데이터를 쉽게 분산 처리.
3. **장애 복구:** 계보를 통한 데이터 복구 가능.

### 단점
1. **메모리 요구량:** 큰 데이터셋을 처리할 때 메모리 소모가 큼.
2. **복잡성:** 고수준 API(DataFrame, Dataset)에 비해 사용법이 복잡.
3. **최적화 한계:** DataFrame/Dataset에 비해 실행 최적화가 제한적.

## **RDD와 DataFrame/Dataset의 비교**

| 특징             | RDD                 | DataFrame             | Dataset               |
| -------------- | ------------------- | --------------------- | --------------------- |
| **데이터 추상화 수준** | 저수준 (Row-by-Row 연산) | 고수준 (스키마 기반)          | 고수준 (스키마 기반 + 타입 세이프) |
| **최적화**        | 제한적 (RDD 계보 사용)     | Catalyst Optimizer 사용 | Catalyst Optimizer 사용 |
| **유형**         | Java/Python 객체      | Row 객체                | 사용자 정의 객체             |
| **퍼포먼스**       | 느림                  | 빠름                    | 빠름                    |
