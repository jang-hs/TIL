# 예제로 살펴보는 AI를 위한 데이터 엔지니어링
[Data Engineering for AI: Practical Examples and Best Practices](https://blog.det.life/data-engineering-for-ai-practical-examples-and-best-practices-d40f9832f8dc?gi=b2932bdb277e) 를 읽고 정리했습니다.

AI 기반 애플리케이션이 점점 더 널리 사용됨에 따라, AI를 위한 데이터 관리도 전문적인 기술과 강력한 프레임워크를 요구하는 복잡한 작업으로 발전했습니다. AI 데이터 엔지니어링을 예제를 통해 함께 알아봅니다.

## 1. AI 워크로드를 위한 데이터 파이프라인 구축
AI를 위한 데이터 파이프라인은 유연성과 확장성이 필요하며, 종종 배치(batch)와 스트리밍(streaming) 기능을 모두 요구합니다. Apache Spark와 Kafka를 사용하여 데이터를 처리하는 파이프라인 예제를 살펴보겠습니다.

### 예시: Apache Spark와 Kafka를 활용한 실시간 데이터 수집
```python
from pyspark.sql import SparkSession  
from pyspark.sql.functions import from_json, col  
from pyspark.sql.types import StructType, StructField, StringType, DoubleType  
  
# Define the schema for incoming data  
schema = StructType([  
    StructField("id", StringType(), True),  
    StructField("timestamp", StringType(), True),  
    StructField("value", DoubleType(), True)  
])  
  
# Initialize Spark session  
spark = SparkSession.builder \  
    .appName("AI Data Pipeline") \  
    .getOrCreate()  
  
# Read streaming data from Kafka  
df = spark \  
    .readStream \  
    .format("kafka") \  
    .option("kafka.bootstrap.servers", "localhost:9092") \  
    .option("subscribe", "data-topic") \  
    .load()  
  
# Parse JSON data  
parsed_df = df.select(from_json(col("value").cast("string"), schema).alias("data")).select("data.*")  
  
# Apply transformations for AI model  
transformed_df = parsed_df.withColumn("feature", col("value") * 2)  # Example feature engineering  
  
# Write to data sink  
query = transformed_df.writeStream \  
    .format("console") \  
    .outputMode("append") \  
    .start()  
  
query.awaitTermination()
```

이 예시에서는:
- Kafka 토픽에서 Spark로 데이터를 가져와 변환 작업을 수행합니다.
- 간단한 피쳐 변환(feature transformation)을 적용하여 새로운 피쳐 열(feature column)을 생성하며, 이는 이후 단계에서의 AI 모델에 유용할 수 있습니다.
- 처리된 데이터는 콘솔, 데이터 레이크, 또는 실시간으로 AI 모델에 직접 출력할 수 있습니다.
## 2. 데이터 품질 및 관측성
AI를 위해 데이터 품질을 보장하는 것은 매우 중요하며, 자동화된 품질 검사를 설정하면 오류를 크게 줄일 수 있습니다. Great Expectations를 사용하여 AI 모델로 데이터가 전달되기 전에 유입 데이터를 검증하는 예를 살펴보겠습니다.
> great expectations는 python을 기반으로한 데이터 품질 평가 오픈소스 입니다. https://github.com/great-expectations/great_expectations 를 참고하세요

### 예시: Great Expectations를 활용한 데이터 검증

```python
from great_expectations.core.batch import BatchRequest  
from great_expectations.data_context import DataContext  
  
# Initialize Great Expectations context  
context = DataContext()  
  
# Define the data batch to validate  
batch_request = BatchRequest(  
    datasource_name="my_datasource",  
    data_connector_name="my_data_connector",  
    data_asset_name="my_table"  
)  
  
# Define a new expectation suite  
suite = context.create_expectation_suite("ai_data_quality_suite", overwrite_existing=True)  
  
# Add data expectations  
validator = context.get_validator(batch_request=batch_request, expectation_suite_name="ai_data_quality_suite")  
validator.expect_column_values_to_not_be_null("timestamp")  
validator.expect_column_values_to_be_in_set("status", ["active", "inactive"])  
  
# Run validation and check results  
results = validator.validate()  
if not results["success"]:  
    print("Data quality validation failed!")  
else:  
    print("Data quality validation passed!")
```

이 예시에서는:
- Great Expectations를 사용하여 데이터의 주요 특성들을 검증합니다. 예를 들어, 비어 있지 않은 타임스탬프 값이나 상태 열(status column)에서 허용 가능한 상태를 확인합니다.
- 이러한 검증은 AI 모델 학습 파이프라인에 데이터 이상값이 유입되기 전에 문제를 발견하는 데 도움을 줍니다.
- Great Expectations를 일반적인 예로 제시했지만, Splunk, SignalFx 또는 자체 개발한 도구와 같은 다른 프레임워크/도구를 선택할 수도 있습니다.
## 3. 데이터 카탈로그 및 메타데이터 관리
풍부한 메타데이터를 포함한 데이터 카탈로그를 생성하면 데이터 과학자가 사용하는 데이터의 계보(lineage), 품질, 맥락(context)을 이해하는 데 도움을 줍니다. Apache Atlas를 사용하면 메타데이터를 프로그래밍 방식으로 카탈로그화할 수 있습니다.
### 예시: Apache Atlas API를 활용한 데이터 카탈로그화
Apache Atlas는 데이터셋, 테이블, 계보를 나타내는 엔티티를 생성하는 등 메타데이터를 관리할 수 있는 REST API를 제공합니다.

```python
import requests  
import json  
  
# Define the entity details for a new dataset  
entity = {  
    "entities": [  
        {  
            "typeName": "hive_table",  
            "attributes": {  
                "name": "sales_data",  
                "qualifiedName": "sales_data@prod",  
                "description": "Sales data for AI model training",  
                "owner": "data_engineering_team",  
                "tableType": "MANAGED_TABLE",  
                "columns": [  
                    {"name": "timestamp", "dataType": "date"},  
                    {"name": "sale_amount", "dataType": "double"}  
                ]  
            }  
        }  
    ]  
}  
  
# Send a POST request to create the entity  
response = requests.post(  
    "http://atlas-server:21000/api/atlas/v2/entity",  
    headers={"Content-Type": "application/json"},  
    data=json.dumps(entity)  
)  
  
if response.status_code == 200:  
    print("Entity created in Apache Atlas")  
else:  
    print(f"Failed to create entity: {response.text}")# Define the entity details for a new dataset  
entity = {  
    "entities": [  
        {  
            "typeName": "hive_table",  
            "attributes": {  
                "name": "sales_data",  
                "qualifiedName": "sales_data@prod",  
                "description": "Sales data for AI model training",  
                "owner": "data_engineering_team",  
                "tableType": "MANAGED_TABLE",  
                "columns": [  
                    {"name": "timestamp", "dataType": "date"},  
                    {"name": "sale_amount", "dataType": "double"}  
                ]  
            }  
        }  
    ]  
}
```
이 예시에서는:
- sales_data 테이블을 스키마, 소유자, 목적에 대한 메타데이터로 카탈로그화하여 AI 학습에 사용되는 데이터를 추적하고 이해하기 쉽게 만듭니다.
## 4. 확장성을 위한 데이터 파티셔닝 및 인덱싱
데이터 파티셔닝과 인덱싱은 특히 분산 시스템에서 성능을 향상시킬 수 있습니다. Delta Lake를 사용한 파티셔닝과 인덱싱 예제를 살펴보겠습니다.
### 예시: Delta Lake를 활용한 파티셔닝과 인덱싱
```python
from delta.tables import DeltaTable  
from pyspark.sql import SparkSession  
  
spark = SparkSession.builder \  
    .appName("Delta Lake Example") \  
    .getOrCreate()  
  
# Load data and write with partitioning  
df = spark.read.csv("s3://my-bucket/data.csv")  
df.write.format("delta").partitionBy("date").save("/delta/sales_data")  
  
# Optimize and create Z-Order index on relevant columns  
delta_table = DeltaTable.forPath(spark, "/delta/sales_data")  
delta_table.optimize().executeZOrderBy("customer_id")
```
이 예시에서는:
- sales_data를 날짜별로 파티셔닝하여 데이터 스캔 크기를 줄여 쿼리 성능을 향상시킵니다.
- customer_id에 Z-Order 인덱싱을 적용하여 해당 열에 대한 읽기 성능을 최적화하고, downstream AI 프로세스(예: 고객 맞춤형 모델)를 더 빠르게 만듭니다.
## 5. 데이터 마스킹 및 익명화
민감한 데이터를 처리할 때 익명화는 필수적입니다. 다음 예시는 Python의 Faker 라이브러리를 사용하여 원본 데이터셋의 구조와 분포를 유지하면서 합성된 익명화된 데이터를 생성하는 방법을 보여줍니다.
### 예시: Python의 Faker를 사용한 데이터 마스킹
```python
from faker import Faker  
import pandas as pd  
  
fake = Faker()  
df = pd.DataFrame({  
    "customer_id": [fake.uuid4() for _ in range(100)],  
    "customer_name": [fake.name() for _ in range(100)],  
    "transaction_amount": [fake.random_number(digits=5) for _ in range(100)]  
})  
  
# Display anonymized data  
print(df.head())

```
이 예시에서는:
- Faker가 고객 ID를 위한 가짜 UUID, 합성된 이름, 임의의 거래 금액을 생성합니다.
- 이 익명화된 데이터셋은 고객 개인정보를 위험에 빠뜨리지 않고 AI 모델 학습과 테스트에 안전하게 사용할 수 있습니다.
- Faker를 일반적인 예로 사용했지만, PySyft, Presidio, SDV 등과 같은 다양한 마스킹 라이브러리가 있습니다. 사용자 정의 함수를 구축할 수도 있습니다.

## 결론
AI를 위한 데이터 관리에는 전통적인 데이터 엔지니어링 기술과 AI 에서 발생하는 문제를 처리하기 위한 전문 기술이 결합됩니다. 스트리밍 수집, 데이터 검증, 카탈로그화, 파티셔닝, 마스킹과 같은 예시를 통해 이러한 기술들이 어떻게 AI 워크로드를 지원하는지 알 수 있습니다. AI를 위한 데이터 엔지니어링의 분야는 방대하며, AI가 발전함에 따라 이러한 도구와 모범 사례에 대한 숙련도를 유지하는 것이 중요합니다.
