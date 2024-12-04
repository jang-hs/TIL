# SparkSession과 SparkContext 이해하기
[Understanding SparkSession and SparkContext in PySpark](https://medium.com/@santosh_beora/understanding-sparksession-and-sparkcontext-in-pyspark-e74ecc688886)를 읽고 정리하였습니다.
  
PySpark는 대규모 데이터 세트를 처리하기 위한 강력한 도구입니다. PySpark의 핵심 개념 중 두 가지는 `SparkSession`과 `SparkContext`입니다. 이를 간단하게 설명하고 몇 가지 예제를 통해 작동 방식을 살펴보겠습니다.

## SparkSession이란?
`SparkSession`은 Spark 프로그래밍의 진입점입니다. Spark의 기능을 활용하고 DataFrame 및 DataSet을 생성할 수 있는 단일 진입점을 제공합니다.

## 왜 SparkSession을 사용할까요?
1. 통합 인터페이스: 기존의 `SQLContext`, `HiveContext`, `SparkContext`를 단일 진입점으로 통합합니다.  
2. 사용 용이성: Spark 애플리케이션을 시작하고 구성하는 과정을 간소화합니다.

### 예제
PySpark에서 `SparkSession`을 생성하는 방법은 다음과 같습니다:

```python
from pyspark.sql import SparkSession

# SparkSession 생성
spark = SparkSession.builder \
    .appName("example_spark_session") \
    .getOrCreate()
```
- `SparkSession.builder`: `SparkSession` 생성을 시작합니다.  
- `appName("example_spark_session")`: 애플리케이션의 이름을 설정합니다.  
- `getOrCreate()`: 기존에 존재하는 `SparkSession`을 가져오거나 새로 생성합니다.

## SparkContext란?
`SparkContext`는 Spark 기능의 원래 진입점입니다. Spark 클러스터에 연결하고 데이터를 로드하며, Spark의 핵심 기능과 상호작용하는 역할을 합니다.
## 왜 SparkContext를 사용할까요?
1. 저수준 작업 지원: 저수준 작업 및 구성을 사용할 수 있는 기능을 제공합니다.  
2. RDD 조작: Resilient Distributed Datasets(RDDs)을 직접 다루기 위해 필수적입니다.

### 예제:
PySpark에서 `SparkContext`를 생성하는 방법은 다음과 같습니다:

```python
from pyspark import SparkContext, SparkConf

# Spark 구성 생성
conf = SparkConf().setAppName("example_spark_context")

# SparkContext 생성
sc = SparkContext(conf=conf)
```
- `SparkConf().setAppName("example_spark_context")`: Spark 설정에서 애플리케이션 이름을 설정합니다.  
- `SparkContext(conf=conf)`: 주어진 설정을 사용하여 `SparkContext`를 초기화합니다.

## 언제 무엇을 사용해야 할까요?
1. SparkSession:  
   - DataFrame과 SQL 같은 고수준 API를 사용할 때 사용합니다.  
   - 간단하고 통합된 인터페이스 덕분에 대부분의 데이터 처리 작업에 적합합니다.

2. SparkContext:  
   - 저수준 RDD 작업을 수행할 때 사용합니다.  
   - Spark 실행의 기본 요소를 더 많이 제어하거나 RDD를 직접 조작해야 할 때 필요합니다.

### 예제:
`SparkSession`과 `SparkContext`를 함께 사용하는 방법을 살펴보겠습니다:

```python
from pyspark.sql import SparkSession

# SparkSession 생성
spark = SparkSession.builder \
    .appName("example_spark_session") \
    .getOrCreate()

# SparkSession에서 SparkContext 가져오기
sc = spark.sparkContext

# SparkContext를 사용하여 간단한 RDD 생성
rdd = sc.parallelize([1, 2, 3, 4, 5])

# SparkSession을 사용하여 RDD를 DataFrame으로 변환
df = spark.createDataFrame(rdd.map(lambda x: (x,)), ["number"])

# DataFrame 출력
df.show()
```
1. `SparkSession`을 생성합니다.  
2. `spark.sparkContext`를 사용해 기본 `SparkContext`에 접근합니다.  
3. 숫자로 구성된 리스트에서 RDD를 생성합니다.  
4. RDD를 DataFrame으로 변환하고, `show()`를 사용해 출력합니다.

## 결론
- `SparkSession`: 사용하기 쉽고 통합된 인터페이스 덕분에 대부분의 데이터 처리 작업에 적합합니다.  
- `SparkContext`: 저수준 작업이나 RDD를 직접 다뤄야 할 때 사용합니다.