# Python: Parallelism(병렬처리) Vs Concurrency(동시성) Vs Threading(스레딩)

[Python: Parallelism Vs Concurrency Vs Threading](https://pravash-techie.medium.com/python-parallelism-vs-concurrency-vs-threading-d74a79065dc8)을 읽고 정리하였습니다.  
  
여러 작업을 관리하고, 프로세스를 가속화하며, 독립적인 워크플로우를 보장하려면 동시성(Concurrency), 스레딩(Threading), 병렬 처리(Parallelism)를 이해하는 것이 중요합니다. 처음에는 이 개념들이 비슷하게 느껴질 수 있지만 서로 차이가 있습니다. 이번 글에서는 마치 카페가 직원과 장비를 관리하는 방식을 예시로 설명합니다.  
    
이 글에서는 기술적인 개념을 접근하기 쉽게 하기 위해 카페 시나리오를 통해 이러한 패러다임을 탐구할 것입니다. 또한 Python의 강력한 라이브러리인 `asyncio`, `threading`, `multiprocessing`을 활용한 예시도 확인합니다. 단일 스레드를 관리하든, 다중 코어를 활용하든, 이 개념을 효과적으로 프로젝트에 적용하는 방법을 더 명확히 이해할 수 있을 것입니다.  
  
## Concurrency(동시성)🕒  
혼자 운영하는 카페를 상상해보세요. 한 고객의 커피를 추출하는 동안, 다른 고객의 주문을 받고, 우유를 스팀하고, 또 다른 고객의 샌드위치를 준비합니다.   
    
한 번에 모든 작업을 하지 않지만, 작업 간 전환을 통해 모든 주문을 효율적으로 진행시킵니다.  
  
➡️ **Python에서 구현 방법:**  

```python
import asyncio

async def task(name, delay):
    print(f"{name} started")
    await asyncio.sleep(delay)
    print(f"{name} completed")

async def main():
    task1 = asyncio.create_task(task("Task1", 2))
    task2 = asyncio.create_task(task("Task2", 3))

    print("Tasks are running concurrently...")

    await task1
    await task2

    print("Both tasks are completed")

asyncio.run(main())
  ```

동시성은 `asyncio` 같은 패키지를 사용하여 모든 작업을 동시에 수행하지 않더라도 작업 간 전환을 통해 여러 작업을 효율적으로 관리합니다.

## Threading(스레딩) 🧵
분주한 커피숍을 운영한다고 상상해보세요. 여러 명의 자신이 복제되어 각기 다른 작업에 집중합니다. 한 사람은 커피를 추출하고, 다른 사람은 페이스트리를 준비하며, 또 다른 사람은 스무디를 만듭니다.  
  
이 복제된 자신(스레드)은 각자의 작업을 독립적으로 수행하지만, 모두 같은 공간과 장비를 공유하기 때문에 간혹 대기 상태가 발생할 수 있습니다.  
  
➡️ **Python에서 구현 방법:**

```python
import threading
import time

def task(name, delay):
    print(f"{name} started")
    time.sleep(delay)
    print(f"{name} completed")

if __name__ == '__main__':
    thread1 = threading.Thread(target=task, args=('Thread1', 2))
    thread2 = threading.Thread(target=task, args=('Thread2', 3))

    print("Threads are running concurrently...")

    thread1.start()
    thread2.start()

    thread1.join()
    thread2.join()

    print("Both Threads completed")
```
  
스레딩은 프로그램의 다른 부분을 별도 스레드로 실행시켜 동일한 메모리와 자원을 공유하도록 합니다. 작업은 동시에 실행되지만, 실제로는 CPU가 스레드 간을 전환하여 실행하기 때문에 완전히 동시에 실행되지는 않을 수 있습니다.  
  
## Parallelism(병렬 처리) 🏎️
각자 완벽히 장비를 갖춘 여러 바리스타가 있는 대형 카페를 상상해보세요. 한 바리스타는 커피를 만들고, 또 다른 바리스타는 스무디를 블렌딩하며, 세 번째 바리스타는 샌드위치를 준비합니다.
    
각 바리스타는 자신의 자원을 가지고 독립적으로 작업하므로 서로 기다리거나 간섭하지 않고 동시에 고객을 응대할 수 있습니다.  
  
➡️ **Python에서 구현 방법:**

```python
import multiprocessing
import time

def task(name, delay):
    print(f"{name} started")
    time.sleep(delay)
    print(f"{name} completed")

if __name__ == '__main__':
    process1 = multiprocessing.Process(target=task, args=("Process 1", 2))
    process2 = multiprocessing.Process(target=task, args=("Process 2", 3))

    print("Processes are running in parallel...")

    process1.start()
    process2.start()

    process1.join()
    process2.join()

    print("Both processes completed")
```

병렬 처리는 여러 CPU 코어를 사용하여 실제로 여러 작업을 동시에 실행합니다. `multiprocessing` 같은 패키지는 별도 프로세스를 생성하여 프로세서를 분리된 코어에서 독립적으로 실행하도록 합니다.
  
**🧠 동시성과 스레딩의 차이점:**  
➡️ **동시성:** 여러 작업을 처리하는 요리사가 각 작업 간 전환하며 진행합니다.    
➡️ **스레딩:** 여러 요리사(스레드)가 동시에 작업하지만 동일한 주방 자원을 공유합니다.
  
동시성은 작업을 관리하고 전환하는 방식에 초점을 맞추는 반면, 스레딩은 작업을 여러 스레드로 나눠 동시성을 구현하는 한 가지 방법입니다.  
  
## 결론
동시성, 스레딩, 병렬 처리 중 무엇을 선택할지는 작업의 특성에 따라 달라집니다.

- **동시성** (`asyncio`): CPU 부하가 적은 I/O 중심 작업에 적합.
- **스레딩**: 메모리를 공유하며, CPU 집약적이지 않은 작업에 적합.
- **병렬 처리** (`multiprocessing`): CPU 집약적 작업에 적합하며, 실제로 동시 실행이 필요할 때 사용.

이 차이를 이해하면 자원을 효율적으로 활용하고 프로그램 성능을 최적화할 수 있습니다.