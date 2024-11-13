# Netflix 데이터 SQL로 분석해보기

[kaggle netflix movies and tv shows](https://www.kaggle.com/datasets/shivamb/netflix-shows) 데이터를 활용하여 SQL 구문을 작성해봅니다.

위의 데이터를 다운로드 받을 수 없다면 아래의 SQL 문을 실행하여 샘플 데이터를 생성할 수 있습니다.

```SQL
CREATE DATABASE netflix_data;

USE netflix_data;
CREATE TABLE netflix_data (
    show_id INT PRIMARY KEY,
    type VARCHAR(10),
    title VARCHAR(255),
    director VARCHAR(255),
    cast VARCHAR(255),
    country VARCHAR(255),
    date_added DATE,
    release_year INT,
    rating VARCHAR(10),
    duration VARCHAR(20),
    listed_in VARCHAR(255),
    description TEXT,
    genre VARCHAR(255)
);
INSERT INTO netflix_data (show_id, type, title, director, cast, country, date_added, release_year, rating, duration, listed_in, description, genre)
VALUES
    (1, 'Movie', 'Movie 1', 'Director 1', 'Cast 1', 'Country 1', '2023-01-01', 2022, 'PG-13', '2h 30m', 'Action, Drama', 'Description 1', 'Action'),
    (2, 'Movie', 'Movie 2', 'Director 2', 'Cast 2', 'Country 2', '2023-01-02', 2021, 'R', '1h 45m', 'Comedy, Romance', 'Description 2', 'Comedy'),
    (3, 'TV Show', 'Show 1', 'Director 1', 'Cast 1', 'Country 1', '2023-01-03', 2020, 'TV-MA', '3 Seasons', 'Drama', 'Description 3', 'Drama');

```

1. 전체 행 갯수 확인
```SQL
SELECT COUNT(*) AS total_records FROM netflix_data;
```

2. 가장 많은 컨텐츠를 보유한 감독 상위 10명 조회
```SQL
SELECT
    director,
    COUNT(*) AS content_count
FROM netflix_data
WHERE director IS NOT NULL
GROUP BY director
ORDER BY content_count DESC
LIMIT 10;
```

3. 가장 인기 있는 장르 조회
```SQL
SELECT
    genre,
    COUNT(*) AS count
FROM (
    SELECT
        UNNEST(string_to_array(listed_in, ', ')) AS genre
    FROM netflix_data
) AS genres
GROUP BY genre
ORDER BY count DESC
LIMIT 10;
```

4. 최근 추가된 10개의 콘텐츠 제목 조회
```SQL
SELECT
    title,
    date_added
FROM netflix_data
ORDER BY date_added DESC
LIMIT 10;
```

5. 콘텐츠별 평균 출시 연도
```SQL
SELECT
    type,
    AVG(release_year) AS avg_release_year
FROM netflix_data
GROUP BY type;
```

6. 가장 긴 시간과 짧은 시간을 가진 작품 제목 조회
```SQL
SELECT
    title,
    duration
FROM netflix_data
ORDER BY
    CASE WHEN duration LIKE '%h%' THEN CAST(SUBSTRING_INDEX(duration, 'h', 1) AS SIGNED) ELSE 0 END DESC,
    CASE WHEN duration LIKE '%m%' THEN CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(duration, 'h', -1), 'm', 1) AS SIGNED) ELSE 0 END DESC
LIMIT 1;

SELECT
    title,
    duration
FROM netflix_data
ORDER BY
    CASE WHEN duration LIKE '%h%' THEN CAST(SUBSTRING_INDEX(duration, 'h', 1) AS SIGNED) ELSE 0 END ASC,
    CASE WHEN duration LIKE '%m%' THEN CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(duration, 'h', -1), 'm', 1) AS SIGNED) ELSE 0 END ASC
LIMIT 1;
```

7. 가장 긴 영화 제목 조회
```SQL
SELECT
    title,
    LENGTH(title) AS title_length
FROM netflix_data
WHERE type = 'Movie'
ORDER BY title_length DESC
LIMIT 10;
```