(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{348:function(t,s,a){"use strict";a.r(s);var n=a(25),e=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"팩토리-패턴과-데코레이터-패턴"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#팩토리-패턴과-데코레이터-패턴"}},[t._v("#")]),t._v(" 팩토리 패턴과 데코레이터 패턴")]),t._v(" "),s("h2",{attrs:{id:"_1-팩토리-패턴-factory-pattern"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1-팩토리-패턴-factory-pattern"}},[t._v("#")]),t._v(" 1. "),s("strong",[t._v("팩토리 패턴 (Factory Pattern)")])]),t._v(" "),s("p",[s("strong",[t._v("설명:")]),t._v(" 팩토리 패턴은 객체 생성을 팩토리 클래스에서 처리하도록 하여, 객체 생성 과정을 숨기고 코드의 유연성을 높이는 패턴입니다. 이 패턴은 객체 생성 로직을 캡슐화하여 클라이언트 코드가 직접 객체를 생성하지 않고, 생성 로직을 관리하는 클래스에 맡기는 방식입니다.")]),t._v(" "),s("p",[s("strong",[t._v("예시:")]),s("br"),t._v("\n여러 유형의 동물을 생성해야 할 때, 팩토리 패턴을 사용하여 동물 객체를 쉽게 생성할 수 있습니다.")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" abc "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" ABC"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" abstractmethod\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 동물에 대한 추상 클래스")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Animal")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("ABC"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token decorator annotation punctuation"}},[t._v("@abstractmethod")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("def")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("speak")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("self"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("pass")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 구체적인 동물 클래스")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Dog")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("Animal"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("def")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("speak")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("self"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Woof!"')]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Cat")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("Animal"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("def")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("speak")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("self"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Meow!"')]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 팩토리 클래스")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("AnimalFactory")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token decorator annotation punctuation"}},[t._v("@staticmethod")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("def")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("create_animal")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("animal_type"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" animal_type "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"dog"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" Dog"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("elif")]),t._v(" animal_type "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"cat"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" Cat"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("else")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("None")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 사용 예시")]),t._v("\nfactory "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" AnimalFactory"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nanimal "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" factory"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("create_animal"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"dog"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("animal"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("speak"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v('# "Woof!"')]),t._v("\n\nanimal "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" factory"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("create_animal"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"cat"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("animal"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("speak"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v('# "Meow!"')]),t._v("\n")])])]),s("p",[s("strong",[t._v("설명:")]),s("br"),t._v("\n여기서 "),s("code",[t._v("AnimalFactory")]),t._v("는 클라이언트가 "),s("code",[t._v("Dog")]),t._v("나 "),s("code",[t._v("Cat")]),t._v("과 같은 객체를 직접 생성하지 않고, "),s("code",[t._v("create_animal")]),t._v(" 메서드를 통해 원하는 동물 객체를 생성합니다. 이를 통해 객체 생성 로직이 캡슐화되었고, 객체를 추가할 때에도 클라이언트 코드를 수정할 필요가 없도록 유연하게 설계되었습니다.")]),t._v(" "),s("h2",{attrs:{id:"_2-데코레이터-패턴-decorator-pattern"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-데코레이터-패턴-decorator-pattern"}},[t._v("#")]),t._v(" 2. "),s("strong",[t._v("데코레이터 패턴 (Decorator Pattern)")])]),t._v(" "),s("p",[s("strong",[t._v("설명:")]),t._v(" 데코레이터 패턴은 기존 객체에 새로운 기능을 추가할 때, 상속 대신에 객체를 감싸는 방식으로 처리하는 패턴입니다. 이 패턴은 객체에 기능을 동적으로 추가할 수 있게 해 주며, 기존 코드 수정 없이도 기능을 확장할 수 있습니다.")]),t._v(" "),s("p",[s("strong",[t._v("예시:")]),s("br"),t._v("\n음료에 여러 가지 첨가물을 추가하는 커피 주문 시스템을 데코레이터 패턴으로 구현할 수 있습니다.")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 기본 커피 클래스")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Coffee")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("def")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("cost")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("self"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("5")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 데코레이터 추상 클래스")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("CoffeeDecorator")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("def")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("__init__")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("self"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" coffee"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n        self"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_coffee "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" coffee\n\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("def")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("cost")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("self"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" self"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_coffee"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cost"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 우유 추가 데코레이터")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("MilkDecorator")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("CoffeeDecorator"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("def")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("cost")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("self"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" self"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_coffee"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cost"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 설탕 추가 데코레이터")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("SugarDecorator")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("CoffeeDecorator"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("def")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("cost")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("self"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" self"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_coffee"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cost"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0.5")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 사용 예시")]),t._v("\nsimple_coffee "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" Coffee"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("simple_coffee"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cost"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 5")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 우유가 추가된 커피")]),t._v("\nmilk_coffee "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" MilkDecorator"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("simple_coffee"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("milk_coffee"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cost"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 6 (5 + 1)")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 우유와 설탕이 추가된 커피")]),t._v("\nmilk_sugar_coffee "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" SugarDecorator"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("milk_coffee"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("milk_sugar_coffee"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cost"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 6.5 (5 + 1 + 0.5)")]),t._v("\n")])])]),s("p",[s("strong",[t._v("설명:")]),s("br"),t._v(" "),s("code",[t._v("MilkDecorator")]),t._v("와 "),s("code",[t._v("SugarDecorator")]),t._v("는 "),s("code",[t._v("Coffee")]),t._v(" 객체에 우유와 설탕을 동적으로 추가하는 역할을 합니다. 데코레이터 패턴을 사용함으로써 커피 객체에 다양한 첨가물을 추가하는 기능을 구현할 수 있으며, 이때 클래스 상속 없이 객체의 기능을 확장할 수 있습니다.")]),t._v(" "),s("hr"),t._v(" "),s("p",[t._v("팩토리 패턴은 객체 생성을 관리하고, 데코레이터 패턴은 객체에 동적으로 기능을 추가할 때 사용됩니다. 두 패턴 모두 유연성을 높이고, 코드 재사용을 촉진하는 중요한 디자인 패턴입니다.")])])}),[],!1,null,null,null);s.default=e.exports}}]);