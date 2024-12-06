# PySpark 프로덕션 환경에서 OutOfMemory(OOM) 문제 해결하기
[Resolving OutOfMemory (OOM) Errors in PySpark: Best Practices for Optimizing Spark Jobs in Production](https://medium.com/@manoj.kdas37/resolving-outofmemory-oom-errors-in-pyspark-best-practices-for-optimizing-spark-jobs-in-8ad6c9992478)를 읽고 정리하였습니다.

캐싱, 재파티셔닝, 최적화된 조인, 손상된 레코드 처리, 데이터 불균형 문제를 해결하는 등의 최적화를 적용했음에도 불구하고 PySpark 프로덕션 환경에서 OutOfMemory(OOM) 오류가 발생하는 경우 데이터 구조의 불확실성이나 비효율적인 메모리 관리에 기인할 수 있습니다. 이를 해결하기 위한 방법은 다음과 같습니다:

### 1. 스파크 설정 조정 (메모리 관리)
- **Executor 메모리 증가**: 현재 Executor 메모리가 대량의 데이터를 처리하기에 부족하다면, 메모리 할당량을 늘려야 합니다.
    ```python
    spark.conf.set("spark.executor.memory", "8g")  # 필요에 따라 조정
    spark.conf.set("spark.driver.memory", "4g")
    ```
    
- **Executor 코어 조정**: Executor당 너무 많은 코어를 할당하면 메모리 과부하가 발생할 수 있으므로 적절히 조정합니다.
    ```python
    spark.conf.set("spark.executor.cores", "2")
    ```
    
- **디스크로 데이터 오프로드**: 더 큰 데이터를 디스크 기반 저장소로 오프로드하면 메모리 부족 오류를 방지할 수 있습니다.
    ```python
    df.persist(StorageLevel.DISK_ONLY)
    ```
### 2. 동적 자원 할당 활성화

- 작업 부하에 따라 Executor 수를 조정할 수 있는 동적 자원 할당을 활성화하면, 예상치 못한 대량 데이터 처리에 도움이 됩니다.
    ```python
    spark.conf.set("spark.dynamicAllocation.enabled", "true")
    spark.conf.set("spark.dynamicAllocation.minExecutors", "1")
    spark.conf.set("spark.dynamicAllocation.maxExecutors", "100")  # 클러스터 크기에 맞게 조정
    ```
### 3. 적응형 쿼리 실행(AQE) 활성화
- AQE를 활성화하면 런타임 데이터 메트릭에 따라 쿼리 플랜을 동적으로 최적화하고, 셔플 파티션을 조정하거나 통합하여 데이터 불균형을 효과적으로 처리할 수 있습니다.
    ```python
    spark.conf.set("spark.sql.adaptive.enabled", "true")
    spark.conf.set("spark.sql.adaptive.shuffle.targetPostShuffleInputSize", "64MB")  # 셔플 최적화
    ```
### 4. 비정형 데이터에 대한 스키마 강제 적용
- 들어오는 데이터의 구조가 불확실하거나 변동이 심한 경우, 스키마 추론 대신 스키마를 명시적으로 정의하면 메모리 사용을 최적화할 수 있습니다.
    ```python
    from pyspark.sql.types import StructType, StructField, StringType, IntegerType
    
    schema = StructType([
        StructField("col1", StringType(), True),
        StructField("col2", IntegerType(), True),
        # 나머지 스키마 정의
    ])
    
    df = spark.read.schema(schema).json("path/to/data")  # 스키마 지정
    ```
### 5. 파티션 수 조정
- 데이터 크기에 따라 DataFrame의 파티션을 조정하여 메모리와 성능 간 균형을 맞춥니다. 파티션 수가 너무 적으면 OOM 오류가 발생할 수 있고, 너무 많으면 오버헤드가 증가합니다.
    ```python
    df = df.repartition(200, "column_name")  # 클러스터 크기 및 데이터 양에 따라 조정
    ```
### 6. 데이터 불균형 동적 처리
- 데이터 불균형 문제가 여전히 존재한다면, Salting 기법이나 비대칭 조인 최적화를 사용하여 특정 Executor에 메모리 과부하가 발생하지 않도록 합니다.
    ```python
    import pyspark.sql.functions as F
    
    df1 = df1.withColumn("join_key_salted", F.concat(F.col("join_key"), F.lit("_"), F.rand()))
    df2 = df2.withColumn("join_key_salted", F.concat(F.col("join_key"), F.lit("_"), F.rand()))
    
    df_joined = df1.join(df2, "join_key_salted", "left")
    ```
### 7. 대규모 DataFrame 캐시 제한

- 대규모 DataFrame을 캐시하는 경우 필요성을 다시 검토하십시오. 메모리에 큰 데이터셋을 캐시하면 OOM 오류가 발생할 수 있습니다. 필요하다면 디스크에 저장합니다
    ```python
    df.persist(StorageLevel.MEMORY_AND_DISK)
    ```
### 8. 대규모 DataFrame 조인 최적화
- 조인을 사용할 때 OOM 오류가 발생한다면, 작은 테이블에는 Broadcast Join을 활용하고, 조인 키가 고르게 분산되었는지 확인합니다.
    ```python
    from pyspark.sql.functions import broadcast
    
    large_df = spark.read.parquet("path_to_large_df")
    small_df = spark.read.parquet("path_to_small_df")
    
    df_join = large_df.join(broadcast(small_df), "join_key", "left")
    ```
### 9. 스파크 작업 추적 및 모니터링
- Spark UI를 사용해 메모리 사용량, 작업 실행, 데이터 셔플링을 모니터링합니다. 메모리를 과도하게 사용하는 단계나 불균형을 유발하는 요소를 식별하고, 파이프라인을 최적화합니다.
### 10. 파티셔닝 전략 고려
- 대규모 데이터셋을 처리하는 작업에서는 HDFS, S3, Delta Lake와 같은 데이터 소스에 대해 적절한 파티셔닝을 사용하여 읽는 데이터 양을 제한해야 합니다. 적절히 파티셔닝된 데이터는 Spark가 작업에 필요한 데이터만 처리하도록 돕습니다.
    ```python
    df.write.partitionBy("partition_column").parquet("path_to_data")
    ```
### 결론
스파크에서 OutOfMemory(OOM) 오류는 주로 잘못된 메모리 설정, 데이터 불균형, 비효율적인 파티셔닝 전략으로 인해 발생합니다. 메모리 튜닝 기술, 스키마 강제 적용, 효율적인 파티셔닝을 통해 이러한 문제를 완화하고, 스파크 작업을 더 원활하고 빠르게 실행할 수 있습니다.  
데이터의 특성과 클러스터 환경을 기반으로 파이프라인을 모니터링하고 조정하면 OOM 문제를 해결하고 예측 불가능한 데이터 구조에도 안정적인 프로덕션 환경을 유지할 수 있습니다.