# 팩토리 패턴과 데코레이터 패턴
## 1. **팩토리 패턴 (Factory Pattern)**
   **설명:** 팩토리 패턴은 객체 생성을 팩토리 클래스에서 처리하도록 하여, 객체 생성 과정을 숨기고 코드의 유연성을 높이는 패턴입니다. 이 패턴은 객체 생성 로직을 캡슐화하여 클라이언트 코드가 직접 객체를 생성하지 않고, 생성 로직을 관리하는 클래스에 맡기는 방식입니다.

   **예시:**  
   여러 유형의 동물을 생성해야 할 때, 팩토리 패턴을 사용하여 동물 객체를 쉽게 생성할 수 있습니다.

   ```python
   from abc import ABC, abstractmethod

   # 동물에 대한 추상 클래스
   class Animal(ABC):
       @abstractmethod
       def speak(self):
           pass

   # 구체적인 동물 클래스
   class Dog(Animal):
       def speak(self):
           return "Woof!"

   class Cat(Animal):
       def speak(self):
           return "Meow!"

   # 팩토리 클래스
   class AnimalFactory:
       @staticmethod
       def create_animal(animal_type):
           if animal_type == "dog":
               return Dog()
           elif animal_type == "cat":
               return Cat()
           else:
               return None

   # 사용 예시
   factory = AnimalFactory()
   animal = factory.create_animal("dog")
   print(animal.speak())  # "Woof!"

   animal = factory.create_animal("cat")
   print(animal.speak())  # "Meow!"
   ```

   **설명:**  
   여기서 `AnimalFactory`는 클라이언트가 `Dog`나 `Cat`과 같은 객체를 직접 생성하지 않고, `create_animal` 메서드를 통해 원하는 동물 객체를 생성합니다. 이를 통해 객체 생성 로직이 캡슐화되었고, 객체를 추가할 때에도 클라이언트 코드를 수정할 필요가 없도록 유연하게 설계되었습니다.

## 2. **데코레이터 패턴 (Decorator Pattern)**
   **설명:** 데코레이터 패턴은 기존 객체에 새로운 기능을 추가할 때, 상속 대신에 객체를 감싸는 방식으로 처리하는 패턴입니다. 이 패턴은 객체에 기능을 동적으로 추가할 수 있게 해 주며, 기존 코드 수정 없이도 기능을 확장할 수 있습니다.

   **예시:**  
   음료에 여러 가지 첨가물을 추가하는 커피 주문 시스템을 데코레이터 패턴으로 구현할 수 있습니다.

   ```python
   # 기본 커피 클래스
   class Coffee:
       def cost(self):
           return 5

   # 데코레이터 추상 클래스
   class CoffeeDecorator:
       def __init__(self, coffee):
           self._coffee = coffee

       def cost(self):
           return self._coffee.cost()

   # 우유 추가 데코레이터
   class MilkDecorator(CoffeeDecorator):
       def cost(self):
           return self._coffee.cost() + 1

   # 설탕 추가 데코레이터
   class SugarDecorator(CoffeeDecorator):
       def cost(self):
           return self._coffee.cost() + 0.5

   # 사용 예시
   simple_coffee = Coffee()
   print(simple_coffee.cost())  # 5

   # 우유가 추가된 커피
   milk_coffee = MilkDecorator(simple_coffee)
   print(milk_coffee.cost())  # 6 (5 + 1)

   # 우유와 설탕이 추가된 커피
   milk_sugar_coffee = SugarDecorator(milk_coffee)
   print(milk_sugar_coffee.cost())  # 6.5 (5 + 1 + 0.5)
   ```

   **설명:**  
   `MilkDecorator`와 `SugarDecorator`는 `Coffee` 객체에 우유와 설탕을 동적으로 추가하는 역할을 합니다. 데코레이터 패턴을 사용함으로써 커피 객체에 다양한 첨가물을 추가하는 기능을 구현할 수 있으며, 이때 클래스 상속 없이 객체의 기능을 확장할 수 있습니다.

---

팩토리 패턴은 객체 생성을 관리하고, 데코레이터 패턴은 객체에 동적으로 기능을 추가할 때 사용됩니다. 두 패턴 모두 유연성을 높이고, 코드 재사용을 촉진하는 중요한 디자인 패턴입니다.