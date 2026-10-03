export interface Lec2TermItem {
  id: number;
  englishTerm: string;
  arabicTitle: string;
  arabicDefinition: string;
  category: 'functions' | 'oop-core' | 'inheritance' | 'polymorphism-mro' | 'composition-dunder';
}

export interface Lec2CodeExample {
  id: string;
  sectionNumber: number;
  sectionTitleAr: string;
  sectionTitleEn: string;
  titleAr: string;
  fileName: string;
  code: string;
  expectedOutput: string;
}

export interface Lec2CodeSection {
  sectionNumber: number;
  titleAr: string;
  titleEn: string;
  icon: string;
  examples: Lec2CodeExample[];
}

export const LEC2_TERMS_DATA: Lec2TermItem[] = [
  {
    id: 1,
    englishTerm: 'Functions',
    arabicTitle: 'الدوال',
    arabicDefinition: 'كتل برمجية قابلة لإعادة الاستخدام لتنفيذ مهام محددة.',
    category: 'functions',
  },
  {
    id: 2,
    englishTerm: 'Built-in Functions',
    arabicTitle: 'الدوال المدمجة',
    arabicDefinition: 'دوال جاهزة متوفرة في لغة بايثون مباشرة.',
    category: 'functions',
  },
  {
    id: 3,
    englishTerm: 'Function Arguments',
    arabicTitle: 'وسائط الدالة',
    arabicDefinition: 'القيم والمصطلحات الممررة للدالة عند الاستدعاء.',
    category: 'functions',
  },
  {
    id: 4,
    englishTerm: 'Positional Arguments',
    arabicTitle: 'الوسائط الموقعية',
    arabicDefinition: 'وسائط تُطابق قيمها بناءً على ترتيبها في الاستدعاء.',
    category: 'functions',
  },
  {
    id: 5,
    englishTerm: 'Keyword Arguments',
    arabicTitle: 'الوسائط المسماة',
    arabicDefinition: 'وسائط تُمرر بصيغة key=value لتحديد اسم المتغير.',
    category: 'functions',
  },
  {
    id: 6,
    englishTerm: 'Default Arguments',
    arabicTitle: 'الوسائط الافتراضية',
    arabicDefinition: 'قيم تُحدد مسبقاً للمعاملات في حال عدم تمريرها.',
    category: 'functions',
  },
  {
    id: 7,
    englishTerm: 'Variable-length Arguments (*args, **kwargs)',
    arabicTitle: 'الوسائط متغيرة الطول',
    arabicDefinition: 'آليات استقبال عدد غير محدد من المدخلات.',
    category: 'functions',
  },
  {
    id: 8,
    englishTerm: 'Non-keyworded Arguments (*args)',
    arabicTitle: 'وسائط غير مسماة',
    arabicDefinition: 'تُجمع في صف Tuple.',
    category: 'functions',
  },
  {
    id: 9,
    englishTerm: 'Keyworded Arguments (**kwargs)',
    arabicTitle: 'وسائط مسماة',
    arabicDefinition: 'تُجمع في قاموس Dictionary.',
    category: 'functions',
  },
  {
    id: 10,
    englishTerm: 'Lambda Function / Anonymous Function',
    arabicTitle: 'دالة لامبدا / دالة مجهولة',
    arabicDefinition: 'دالة صغيرة وبسيطة تُعرّف بدون اسم وسريعة التنفيذ.',
    category: 'functions',
  },
  {
    id: 11,
    englishTerm: 'Inline Function / Throwaway Function',
    arabicTitle: 'دالة مضمنة / مؤقتة',
    arabicDefinition: 'تُستخدم لمرة واحدة أو كـ Argument مباشر.',
    category: 'functions',
  },
  {
    id: 12,
    englishTerm: 'Object-Oriented Programming (OOP)',
    arabicTitle: 'البرمجة كائنية التوجه',
    arabicDefinition: 'نمط برمجي يعتمد على الفئات والكائنات.',
    category: 'oop-core',
  },
  {
    id: 13,
    englishTerm: 'Class',
    arabicTitle: 'الفئة / الصنف',
    arabicDefinition: 'المخطط الهيكلي الأساسي لبناء الكائنات.',
    category: 'oop-core',
  },
  {
    id: 14,
    englishTerm: 'Instance / Object',
    arabicTitle: 'الكائن / النسخة',
    arabicDefinition: 'كائن فعلي مستخرج ومبني من الفئة.',
    category: 'oop-core',
  },
  {
    id: 15,
    englishTerm: 'Method',
    arabicTitle: 'الطريقة',
    arabicDefinition: 'دالة مُعرفة داخل الفئة لتعبر عن سلوك الكائن.',
    category: 'oop-core',
  },
  {
    id: 16,
    englishTerm: 'self Reference',
    arabicTitle: 'المرجع self',
    arabicDefinition: 'مرجع يشير إلى نسخة الكائن الحالية لتصل للخصائص والدوال.',
    category: 'oop-core',
  },
  {
    id: 17,
    englishTerm: 'Local Variable',
    arabicTitle: 'متغير محلي',
    arabicDefinition: 'متغير يعيش فقط داخل النطاق المؤقت للدالة.',
    category: 'oop-core',
  },
  {
    id: 18,
    englishTerm: 'Instance Variable',
    arabicTitle: 'متغير الكائن',
    arabicDefinition: 'متغير يتبع كائناً محدداً وتختلف قيمته من كائن لآخر.',
    category: 'oop-core',
  },
  {
    id: 19,
    englishTerm: 'Class Variable',
    arabicTitle: 'متغير الفئة',
    arabicDefinition: 'متغير مشاع ومشارك بين جميع نسخ الكائنات.',
    category: 'oop-core',
  },
  {
    id: 20,
    englishTerm: 'Inheritance',
    arabicTitle: 'الوراثة',
    arabicDefinition: 'نقل الخصائص والطرق من فئة أب إلى فئة ابن.',
    category: 'inheritance',
  },
  {
    id: 21,
    englishTerm: 'Subclass / Child Class',
    arabicTitle: 'الفئة الفرعية / الابنة',
    arabicDefinition: 'الفئة التي ترث الخصائص من الفئة الأعلى.',
    category: 'inheritance',
  },
  {
    id: 22,
    englishTerm: 'Superclass / Parent Class',
    arabicTitle: 'الفئة الأساسية / الأب',
    arabicDefinition: 'الفئة الأم التي تُورث الخصائص.',
    category: 'inheritance',
  },
  {
    id: 23,
    englishTerm: 'Single Inheritance',
    arabicTitle: 'وراثة أحادية',
    arabicDefinition: 'فئة ابن ترث من فئة أب واحدة.',
    category: 'inheritance',
  },
  {
    id: 24,
    englishTerm: 'Multiple Inheritance',
    arabicTitle: 'وراثة متعددة',
    arabicDefinition: 'فئة ابن ترث من عدة فئات آباء.',
    category: 'inheritance',
  },
  {
    id: 25,
    englishTerm: 'Multilevel Inheritance',
    arabicTitle: 'وراثة متعددة المستويات',
    arabicDefinition: 'وراثية متسلسلة (ابن ← أب ← جد).',
    category: 'inheritance',
  },
  {
    id: 26,
    englishTerm: 'Hierarchical Inheritance',
    arabicTitle: 'وراثة هرمية',
    arabicDefinition: 'عدة فئات أبناء يرثون من نفس الفئة الأب.',
    category: 'inheritance',
  },
  {
    id: 27,
    englishTerm: 'super() Keyword',
    arabicTitle: 'الكلمة المفتاحية super',
    arabicDefinition: 'تُستخدم لاستدعاء طرق الفئة الأب من الفئة الابنة.',
    category: 'inheritance',
  },
  {
    id: 28,
    englishTerm: 'Method Overriding',
    arabicTitle: 'إعادة كتابة / تجاوز الطرق',
    arabicDefinition: 'تعديل الفئة الابنة لسلوك طريقة موروثة من الأب.',
    category: 'inheritance',
  },
  {
    id: 29,
    englishTerm: 'Polymorphism',
    arabicTitle: 'تعدد الأشكال (التعددية)',
    arabicDefinition: 'واجهة واحدة لاستدعاء طرق تنفيذية مختلفة.',
    category: 'polymorphism-mro',
  },
  {
    id: 30,
    englishTerm: 'Duck Typing',
    arabicTitle: 'التنميط المرن (Duck Typing)',
    arabicDefinition: 'فلسفة بايثون "إذا كان يمتلك الطريقة، فنفذها دون الاشتراط بوراثة رسمية".',
    category: 'polymorphism-mro',
  },
  {
    id: 31,
    englishTerm: 'Diamond Problem',
    arabicTitle: 'مشكلة الماسة',
    arabicDefinition: 'غموض استدعاء الطرق عند وراثة فئة من فئتين تتبعان نفس الأب.',
    category: 'polymorphism-mro',
  },
  {
    id: 32,
    englishTerm: 'Method Resolution Order (MRO)',
    arabicTitle: 'ترتيب حل الطرق',
    arabicDefinition: 'التسلسل الخوارزمي الذي تتبعه بايثون للبحث عن الطرق.',
    category: 'polymorphism-mro',
  },
  {
    id: 33,
    englishTerm: 'C3 Linearization Algorithm',
    arabicTitle: 'خوارزمية C3 الخطية',
    arabicDefinition: 'الخوارزمية المستخدمة لحساب مسار الـ MRO.',
    category: 'polymorphism-mro',
  },
  {
    id: 34,
    englishTerm: 'Abstract Class',
    arabicTitle: 'فئة مجردة',
    arabicDefinition: 'فئة بمثابة هيكل ولا يمكن إنشاء كائنات مباشرة منها.',
    category: 'composition-dunder',
  },
  {
    id: 35,
    englishTerm: '@abstractmethod Decorator',
    arabicTitle: 'مُزخرف الطرق المجردة',
    arabicDefinition: 'يُجبر الفئات الابنة على إعادة تنفيذ الطريقة.',
    category: 'composition-dunder',
  },
  {
    id: 36,
    englishTerm: 'Composition ("Has-a")',
    arabicTitle: 'التركيب / الاحتواء',
    arabicDefinition: 'تضمين كائنات من فئات أخرى كخصائص داخل الفئة.',
    category: 'composition-dunder',
  },
  {
    id: 37,
    englishTerm: 'Delegation',
    arabicTitle: 'التفويض',
    arabicDefinition: 'تفويض الفئة المهام التنفيذية للكائنات المركبة داخلها.',
    category: 'composition-dunder',
  },
  {
    id: 38,
    englishTerm: 'Single Responsibility Principle',
    arabicTitle: 'مبدأ المسؤولية المنفردة',
    arabicDefinition: 'أن تكون الفئة مخصصة لتأدية وظيفة واحدة فقط بوضوح.',
    category: 'composition-dunder',
  },
  {
    id: 39,
    englishTerm: 'Dunder Methods / Magic Methods',
    arabicTitle: 'الدوال السحرية',
    arabicDefinition: 'طرق بأسماء محاطة بتسطير مزدوج __method__ لتخصيص سلوك بايثون المدمج.',
    category: 'composition-dunder',
  },
  {
    id: 40,
    englishTerm: 'Operator Overloading',
    arabicTitle: 'تحميل العوامل الإضافي',
    arabicDefinition: 'تخصيص عمل المعاملات (مثل +, ==) مع الكائنات.',
    category: 'composition-dunder',
  },
];

export const LEC2_CODE_SECTIONS: Lec2CodeSection[] = [
  {
    sectionNumber: 1,
    titleAr: '1. استخدامات *args و **kwargs',
    titleEn: 'Variable-Length Arguments (*args & **kwargs)',
    icon: 'functions',
    examples: [
      {
        id: 'lec2-args-1',
        sectionNumber: 1,
        sectionTitleAr: '1. استخدامات *args و **kwargs',
        sectionTitleEn: '*args & **kwargs',
        titleAr: 'استقبال وسائط غير مسماة *args (مثال 1)',
        fileName: '01_args_basic.py',
        code: `def myFun(*args):
    for arg in args:
        print(arg)

myFun('Hello', 'Welcome', 'to', 'PYTHON')`,
        expectedOutput: `Hello\nWelcome\nto\nPYTHON`,
      },
      {
        id: 'lec2-args-2',
        sectionNumber: 1,
        sectionTitleAr: '1. استخدامات *args و **kwargs',
        sectionTitleEn: '*args & **kwargs',
        titleAr: 'دمج وسيط عادي مع *args (مثال 2)',
        fileName: '01_args_with_first.py',
        code: `def fun(arg1, *argv):
    print("First argument :", arg1)
    for arg in argv:
        print("Argument *argv :", arg)

fun('Hello', 'Welcome', 'to', 'python')`,
        expectedOutput: `First argument : Hello\nArgument *argv : Welcome\nArgument *argv : to\nArgument *argv : python`,
      },
      {
        id: 'lec2-kwargs-1',
        sectionNumber: 1,
        sectionTitleAr: '1. استخدامات *args و **kwargs',
        sectionTitleEn: '*args & **kwargs',
        titleAr: 'استقبال وسائط مسماة **kwargs (مثال 1)',
        fileName: '01_kwargs_basic.py',
        code: `def fun(**kwargs):
    for k, val in kwargs.items():
        print("%s == %s" % (k, val))

fun(s1='A', s2='B', s3='c')`,
        expectedOutput: `s1 == A\ns2 == B\ns3 == c`,
      },
      {
        id: 'lec2-kwargs-2',
        sectionNumber: 1,
        sectionTitleAr: '1. استخدامات *args و **kwargs',
        sectionTitleEn: '*args & **kwargs',
        titleAr: 'دمج وسيط عادي مع **kwargs (مثال 2)',
        fileName: '01_kwargs_with_arg1.py',
        code: `def fun(arg1, **kwargs):
    for k, val in kwargs.items():
        print("%s == %s" % (k, val))

fun("Hi", s1='students ', s2='of', s3='python')`,
        expectedOutput: `s1 == students \ns2 == of\ns3 == python`,
      },
      {
        id: 'lec2-args-kwargs-combined',
        sectionNumber: 1,
        sectionTitleAr: '1. استخدامات *args و **kwargs',
        sectionTitleEn: '*args & **kwargs',
        titleAr: 'الدمج بين *args و **kwargs ومعامل عادي',
        fileName: '01_profile_combined.py',
        code: `def profile(role, *args, **kwargs):
    print("Role:", role)
    print("Args:", args)
    print("Kwargs:", kwargs)

profile("Developer", "Python", "Django", level="Senior", remote=True)`,
        expectedOutput: `Role: Developer\nArgs: ('Python', 'Django')\nKwargs: {'level': 'Senior', 'remote': True}`,
      },
    ],
  },
  {
    sectionNumber: 2,
    titleAr: '2. دوال لامبدا (Lambda Functions)',
    titleEn: 'Lambda / Anonymous Functions',
    icon: 'bolt',
    examples: [
      {
        id: 'lec2-lambda-add',
        sectionNumber: 2,
        sectionTitleAr: '2. دوال لامبدا (Lambda Functions)',
        sectionTitleEn: 'Lambda Functions',
        titleAr: 'دالة جمع بسيطة',
        fileName: '02_lambda_add.py',
        code: `add = lambda x, y: x + y
print(add(3, 5))  # Output: 8`,
        expectedOutput: `8`,
      },
      {
        id: 'lec2-lambda-password',
        sectionNumber: 2,
        sectionTitleAr: '2. دوال لامبدا (Lambda Functions)',
        sectionTitleEn: 'Lambda Functions',
        titleAr: 'دالة فحص قوة كلمة المرور',
        fileName: '02_lambda_password.py',
        code: `is_strong = lambda password: len(password) >= 8
print(is_strong("admin123"))   # False
print(is_strong("Secr3tKey!")) # True`,
        expectedOutput: `True\nTrue`,
      },
      {
        id: 'lec2-lambda-best-practice',
        sectionNumber: 2,
        sectionTitleAr: '2. دوال لامبدا (Lambda Functions)',
        sectionTitleEn: 'Lambda Functions',
        titleAr: 'الممارسات الأفضل (مقارنة بين تعقيد Lambda و استخدام def)',
        fileName: '02_lambda_vs_def.py',
        code: `# ممارسة غير جيدة — تعقيد زائد على دالة lambda
process_lambda = lambda x: x**2 + 5 if x > 10 else x - 1

# الأسلوب الأفضل بـ def لزيادة وضوح الكود:
def process(x):
    if x > 10:
        return x**2 + 5
    else:
        return x - 1

print("process(12):", process(12))
print("process(5) :", process(5))`,
        expectedOutput: `process(12): 149\nprocess(5) : 4`,
      },
    ],
  },
  {
    sectionNumber: 3,
    titleAr: '3. أساسيات الكائنات ومتغيرات الفئات (OOP Concepts)',
    titleEn: 'OOP Basics, self, Local vs Instance vs Class Variables',
    icon: 'category',
    examples: [
      {
        id: 'lec2-oop-person',
        sectionNumber: 3,
        sectionTitleAr: '3. أساسيات الكائنات ومتغيرات الفئات (OOP Concepts)',
        sectionTitleEn: 'OOP Concepts',
        titleAr: 'تعريف فئة بسيطة واستخدام self',
        fileName: '03_person_self.py',
        code: `class Person:
    def __init__(self, name):
        self.name = name

    def greet(self):
        print("Hello, my name is", self.name)

p = Person("Ali")
p.greet()`,
        expectedOutput: `Hello, my name is Ali`,
      },
      {
        id: 'lec2-oop-local-vs-instance',
        sectionNumber: 3,
        sectionTitleAr: '3. أساسيات الكائنات ومتغيرات الفئات (OOP Concepts)',
        sectionTitleEn: 'OOP Concepts',
        titleAr: 'الفرق بين المتغير المحلي والمتغير التابع للكائن (self)',
        fileName: '03_car_local_vs_instance.py',
        code: `class Car:
    def set_speed(self, speed):
        temp_speed = speed  # متغير محلي (Local Variable)
        self.speed = speed  # متغير الكائن (Instance Variable)

    def print_speed(self):
        print(f"Speed is {self.speed}")

car = Car()
car.set_speed(60)
car.print_speed()  # Output: Speed is 60`,
        expectedOutput: `Speed is 60`,
      },
      {
        id: 'lec2-oop-class-vs-instance',
        sectionNumber: 3,
        sectionTitleAr: '3. أساسيات الكائنات ومتغيرات الفئات (OOP Concepts)',
        sectionTitleEn: 'OOP Concepts',
        titleAr: 'الفرق بين متغير الفئة ومتغيرات الكائن',
        fileName: '03_car_class_variable.py',
        code: `class Car:
    wheels = 4  # متغير فئة (Class Variable)

    def __init__(self, brand, speed):
        self.brand = brand   # متغير كائن
        self.speed = speed   # متغير كائن

    def info(self):
        print(f"{self.brand} runs at {self.speed} km/h (Wheels: {Car.wheels})")

car1 = Car("Toyota", 180)
car1.info()`,
        expectedOutput: `Toyota runs at 180 km/h (Wheels: 4)`,
      },
    ],
  },
  {
    sectionNumber: 4,
    titleAr: '4. أنواع الوراثة المختلفة (Inheritance Types)',
    titleEn: 'Single, Multiple, Multilevel Inheritance, super() & Overriding',
    icon: 'account_tree',
    examples: [
      {
        id: 'lec2-inh-single',
        sectionNumber: 4,
        sectionTitleAr: '4. أنواع الوراثة المختلفة (Inheritance Types)',
        sectionTitleEn: 'Inheritance Types',
        titleAr: 'الوراثة الأحادية (Single Inheritance)',
        fileName: '04_single_inheritance.py',
        code: `class SecurityTool:
    def scan(self):
        print("Scanning...")

class Antivirus(SecurityTool):
    pass

av = Antivirus()
av.scan()`,
        expectedOutput: `Scanning...`,
      },
      {
        id: 'lec2-inh-multiple',
        sectionNumber: 4,
        sectionTitleAr: '4. أنواع الوراثة المختلفة (Inheritance Types)',
        sectionTitleEn: 'Inheritance Types',
        titleAr: 'الوراثة المتعددة (Multiple Inheritance)',
        fileName: '04_multiple_inheritance.py',
        code: `class Encryptor:
    def encrypt(self):
        print("Encrypting...")

class Decryptor:
    def decrypt(self):
        print("Decrypting...")

class Cipher(Encryptor, Decryptor):
    pass

tool = Cipher()
tool.encrypt()
tool.decrypt()`,
        expectedOutput: `Encrypting...\nDecrypting...`,
      },
      {
        id: 'lec2-inh-multilevel',
        sectionNumber: 4,
        sectionTitleAr: '4. أنواع الوراثة المختلفة (Inheritance Types)',
        sectionTitleEn: 'Inheritance Types',
        titleAr: 'الوراثة متعددة المستويات (Multilevel Inheritance)',
        fileName: '04_multilevel_inheritance.py',
        code: `class Tool:
    def info(self):
        print("Basic Tool")

class Scanner(Tool):
    def scan(self):
        print("Scanning...")

class AdvancedScanner(Scanner):
    def deep_scan(self):
        print("Deep scanning...")

adv = AdvancedScanner()
adv.info()
adv.scan()
adv.deep_scan()`,
        expectedOutput: `Basic Tool\nScanning...\nDeep scanning...`,
      },
      {
        id: 'lec2-inh-super',
        sectionNumber: 4,
        sectionTitleAr: '4. أنواع الوراثة المختلفة (Inheritance Types)',
        sectionTitleEn: 'Inheritance Types',
        titleAr: 'استخدام الكلمة المفتاحية super()',
        fileName: '04_super_keyword.py',
        code: `class Parent:
    def greet(self):
        print("Hello from Parent")

class Child(Parent):
    def greet(self):
        super().greet()
        print("Hello from Child")

c = Child()
c.greet()`,
        expectedOutput: `Hello from Parent\nHello from Child`,
      },
      {
        id: 'lec2-inh-override',
        sectionNumber: 4,
        sectionTitleAr: '4. أنواع الوراثة المختلفة (Inheritance Types)',
        sectionTitleEn: 'Inheritance Types',
        titleAr: 'تجاوز الطرق (Method Overriding)',
        fileName: '04_method_overriding.py',
        code: `class Firewall:
    def block(self):
        print("Blocking traffic")

class CustomFirewall(Firewall):
    def block(self):
        print("Custom block rules")

fw = CustomFirewall()
fw.block()  # Output: Custom block rules`,
        expectedOutput: `Custom block rules`,
      },
    ],
  },
  {
    sectionNumber: 5,
    titleAr: '5. التعددية ومشكلة الماسة (Polymorphism & MRO)',
    titleEn: 'Duck Typing, Common Interfaces, Diamond Problem & MRO',
    icon: 'hub',
    examples: [
      {
        id: 'lec2-poly-duck',
        sectionNumber: 5,
        sectionTitleAr: '5. التعددية ومشكلة الماسة (Polymorphism & MRO)',
        sectionTitleEn: 'Polymorphism & MRO',
        titleAr: 'تعدد الأشكال القائم على Duck Typing',
        fileName: '05_duck_typing.py',
        code: `class Firewall:
    def block(self):
        print("Blocking suspicious IP")

class Antivirus:
    def block(self):
        print("Quarantining malicious file")

def perform_block(tool):
    tool.block()

perform_block(Firewall())   # Output: Blocking suspicious IP
perform_block(Antivirus())  # Output: Quarantining malicious file`,
        expectedOutput: `Blocking suspicious IP\nQuarantining malicious file`,
      },
      {
        id: 'lec2-poly-interface',
        sectionNumber: 5,
        sectionTitleAr: '5. التعددية ومشكلة الماسة (Polymorphism & MRO)',
        sectionTitleEn: 'Polymorphism & MRO',
        titleAr: 'تعدد الأشكال بفرض واجهة مشتركة',
        fileName: '05_polymorphism_interface.py',
        code: `class SecurityTool:
    def analyze(self):
        raise NotImplementedError("Subclass must implement analyze()")

class PortScanner(SecurityTool):
    def analyze(self):
        print("Scanning open ports...")

class MalwareScanner(SecurityTool):
    def analyze(self):
        print("Analyzing file for malware...")

class PacketSniffer(SecurityTool):
    def analyze(self):
        print("Sniffing network packets...")

tools = [PortScanner(), MalwareScanner(), PacketSniffer()]
for tool in tools:
    tool.analyze()`,
        expectedOutput: `Scanning open ports...\nAnalyzing file for malware...\nSniffing network packets...`,
      },
      {
        id: 'lec2-diamond-mro',
        sectionNumber: 5,
        sectionTitleAr: '5. التعددية ومشكلة الماسة (Polymorphism & MRO)',
        sectionTitleEn: 'Polymorphism & MRO',
        titleAr: 'مشكلة الماسة وتسلسل MRO',
        fileName: '05_diamond_mro.py',
        code: `class A:
    def say(self):
        print("A")

class B(A):
    def say(self):
        print("B")

class C(A):
    def say(self):
        print("C")

class D(B, C):
    pass

d = D()
d.say()  # Output: B

print(D.mro())  # يعرض التسلسل: D -> B -> C -> A -> object`,
        expectedOutput: `B\n[<class '__main__.D'>, <class '__main__.B'>, <class '__main__.C'>, <class '__main__.A'>, <class 'object'>]`,
      },
      {
        id: 'lec2-diamond-super',
        sectionNumber: 5,
        sectionTitleAr: '5. التعددية ومشكلة الماسة (Polymorphism & MRO)',
        sectionTitleEn: 'Polymorphism & MRO',
        titleAr: 'تتبع الـ MRO عند استخدام super() عبر شجرة الماسة',
        fileName: '05_diamond_super_trace.py',
        code: `class A:
    def say(self):
        print("A")

class B(A):
    def say(self):
        print("B")
        super().say()

class C(A):
    def say(self):
        print("C")
        super().say()

class D(B, C):
    def say(self):
        print("D")
        super().say()

d = D()
d.say()
# المخرجات بالتتابع حسب MRO:
# D
# B
# C
# A`,
        expectedOutput: `D\nB\nC\nA`,
      },
    ],
  },
  {
    sectionNumber: 6,
    titleAr: '6. الفئات المجردة والتركيب والدوال السحرية (Abstract Classes, Composition & Dunder)',
    titleEn: 'Abstract Classes (abc), Composition ("Has-A") & Dunder Methods',
    icon: 'extension',
    examples: [
      {
        id: 'lec2-abc-module',
        sectionNumber: 6,
        sectionTitleAr: '6. الفئات المجردة والتركيب والدوال السحرية',
        sectionTitleEn: 'Abstract Classes, Composition & Dunder',
        titleAr: 'الفئات المجردة عبر وحدات abc',
        fileName: '06_abstract_classes_abc.py',
        code: `from abc import ABC, abstractmethod

class SecurityTool(ABC):
    @abstractmethod
    def scan(self):
        pass

class Firewall(SecurityTool):
    def scan(self):
        print("Scanning network ports for suspicious activity")

class Antivirus(SecurityTool):
    def scan(self):
        print("Scanning files for malware")

firewall = Firewall()
firewall.scan()

antivirus = Antivirus()
antivirus.scan()

# tool = SecurityTool()  # يُطلق خطأ لعدم إمكانية بناء كائن من فئة مجردة`,
        expectedOutput: `Scanning network ports for suspicious activity\nScanning files for malware`,
      },
      {
        id: 'lec2-composition-basic',
        sectionNumber: 6,
        sectionTitleAr: '6. الفئات المجردة والتركيب والدوال السحرية',
        sectionTitleEn: 'Abstract Classes, Composition & Dunder',
        titleAr: 'التركيب التفويضي (Composition - "Has-A")',
        fileName: '06_composition_suite.py',
        code: `class PortScanner:
    def scan(self):
        print("Scanning open ports...")

class MalwareScanner:
    def scan(self):
        print("Scanning files for malware...")

class SecuritySuite:
    def __init__(self):
        self.port_scanner = PortScanner()
        self.malware_scanner = MalwareScanner()

    def full_scan(self):
        self.port_scanner.scan()
        self.malware_scanner.scan()

suite = SecuritySuite()
suite.full_scan()`,
        expectedOutput: `Scanning open ports...\nScanning files for malware...`,
      },
      {
        id: 'lec2-composition-swap',
        sectionNumber: 6,
        sectionTitleAr: '6. الفئات المجردة والتركيب والدوال السحرية',
        sectionTitleEn: 'Abstract Classes, Composition & Dunder',
        titleAr: 'مرونة التركيب باستبدال المكونات المضمنة',
        fileName: '06_composition_swap.py',
        code: `class PortScanner:
    def scan(self):
        print("Scanning open ports...")

class MalwareScanner:
    def scan(self):
        print("Scanning files for malware...")

class SecuritySuite:
    def __init__(self):
        self.port_scanner = PortScanner()
        self.malware_scanner = MalwareScanner()

    def full_scan(self):
        self.port_scanner.scan()
        self.malware_scanner.scan()

class VulnerabilityScanner:
    def scan(self):
        print("Scanning vulnerabilities...")

suite = SecuritySuite()
suite.port_scanner = VulnerabilityScanner()  # استبدال فاحص المنافذ بفاحص الثغرات
suite.full_scan()`,
        expectedOutput: `Scanning vulnerabilities...\nScanning files for malware...`,
      },
      {
        id: 'lec2-dunder-str',
        sectionNumber: 6,
        sectionTitleAr: '6. الفئات المجردة والتركيب والدوال السحرية',
        sectionTitleEn: 'Abstract Classes, Composition & Dunder',
        titleAr: 'استخدام الدوال السحرية (Dunder Methods)',
        fileName: '06_dunder_str.py',
        code: `class Firewall:
    def __init__(self, name):
        self.name = name

    def __str__(self):
        return f"Firewall: {self.name}"

fw = Firewall("MyFirewall")
print(fw)  # يستدعي تلقائياً fw.__str__()؛ المخرجات: Firewall: MyFirewall`,
        expectedOutput: `Firewall: MyFirewall`,
      },
    ],
  },
];
