export interface SlideContent {
  slideNumber: number;
  title: string;
  subtitle?: string;
  author?: string;
  isTitle?: boolean;
  category: 'Overview' | 'Basics' | 'Functions' | 'Variable-Length' | 'Lists' | 'Tuples' | 'Sets' | 'Dictionaries' | 'Summary';
  contentLines: {
    type: 'text' | 'heading' | 'bullet' | 'code' | 'output' | 'table-header' | 'table-row';
    text: string;
  }[];
}

export const FUNCTIONS_AND_DATA_STRUCTURES_SLIDES: SlideContent[] = [
  // Slide 1
  {
    slideNumber: 1,
    title: 'PYTHON FUNCTIONS AND DATA STRUCTURES',
    subtitle: 'A Detailed Overview',
    author: 'T\\ Sondos Saif',
    isTitle: true,
    category: 'Overview',
    contentLines: [
      { type: 'heading', text: 'Python Functions and Data Structures' },
      { type: 'text', text: 'A Detailed Overview' },
      { type: 'text', text: 'Course Instructor: T\\ Sondos Saif' }
    ]
  },
  // Slide 2
  {
    slideNumber: 2,
    title: 'PYTHON BASICS – COURSE OVERVIEW',
    category: 'Overview',
    contentLines: [
      { type: 'heading', text: 'What is Python?' },
      { type: 'bullet', text: 'Why Python is popular for Artificial Intelligence and Data Science' },
      { type: 'bullet', text: 'Python is an interpreted, high-level, general-purpose programming language' },
      { type: 'bullet', text: 'Python programs are built from statements, variables, functions, and data structures' },
      { type: 'bullet', text: "Today's lecture reviews the essential Python concepts before advanced topics" }
    ]
  },
  // Slide 3
  {
    slideNumber: 3,
    title: 'VARIABLES',
    category: 'Basics',
    contentLines: [
      { type: 'heading', text: 'What is a Variable?' },
      { type: 'text', text: 'A variable is a named location in memory used to store data.' },
      { type: 'text', text: 'Think of a variable as a labeled box that holds information.' },
      { type: 'bullet', text: 'Every variable has a name' },
      { type: 'bullet', text: 'Every variable stores a value' },
      { type: 'bullet', text: 'The value can change while the program is running' },
      { type: 'heading', text: 'Example:' },
      { type: 'code', text: 'name = "Ali"' },
      { type: 'code', text: 'age = 20' },
      { type: 'text', text: 'Here: name is a variable containing "Ali", age is a variable containing 20' }
    ]
  },
  // Slide 4
  {
    slideNumber: 4,
    title: 'VARIABLES (DATA TYPES)',
    category: 'Basics',
    contentLines: [
      { type: 'table-header', text: 'Data Type | Description | Example' },
      { type: 'table-row', text: 'int | Integer (whole numbers) | 5, 100, -8' },
      { type: 'table-row', text: 'float | Decimal numbers | 3.14, 0.5, -7.25' },
      { type: 'table-row', text: 'str | Text (String) | "Hello", "Python"' },
      { type: 'table-row', text: 'bool | Boolean values | True, False' },
      { type: 'heading', text: 'Type Checking Example:' },
      { type: 'code', text: 'age = 20' },
      { type: 'code', text: 'print(type(age))' },
      { type: 'output', text: "# Output: <class 'int'>" }
    ]
  },
  // Slide 5
  {
    slideNumber: 5,
    title: 'OUTPUT',
    category: 'Basics',
    contentLines: [
      { type: 'heading', text: 'What is Output?' },
      { type: 'text', text: 'Output is the information that a program displays to the user.' },
      { type: 'text', text: 'Python uses the print() function to display text, numbers, or variable values.' },
      { type: 'heading', text: 'Syntax & Examples:' },
      { type: 'code', text: 'print("Welcome to Python!")' },
      { type: 'code', text: 'name = "Sara"' },
      { type: 'code', text: 'print(name)' },
      { type: 'code', text: 'age = 20' },
      { type: 'code', text: 'print("Age:", age)' },
      { type: 'code', text: 'print(f"Age: {age}")' }
    ]
  },
  // Slide 6
  {
    slideNumber: 6,
    title: 'INPUT',
    category: 'Basics',
    contentLines: [
      { type: 'heading', text: 'What is Input?' },
      { type: 'text', text: 'Input is information entered by the user while the program is running.' },
      { type: 'text', text: 'Python uses the input() function to receive user input from the keyboard.' },
      { type: 'code', text: 'variable = input("Enter something: ")' },
      { type: 'text', text: 'The text inside the parentheses is a prompt telling the user what to enter.' },
      { type: 'code', text: 'name = input("Enter your name: ")' },
      { type: 'code', text: 'print("Hello", name)' },
      { type: 'bullet', text: 'Note: input() always returns a string (str), even if the user enters a number.' },
      { type: 'code', text: 'age = int(input("Enter your age: "))' },
      { type: 'code', text: 'print(age + 1)' }
    ]
  },
  // Slide 7
  {
    slideNumber: 7,
    title: 'CONDITIONS (IF, ELIF, ELSE)',
    category: 'Basics',
    contentLines: [
      { type: 'heading', text: 'What are Conditions?' },
      { type: 'text', text: 'Conditions allow a program to make decisions based on whether an expression is True or False.' },
      { type: 'bullet', text: 'if – Executes code if condition is true.' },
      { type: 'bullet', text: 'elif – Checks another condition if previous was false.' },
      { type: 'bullet', text: 'else – Executes when none of the conditions are true.' },
      { type: 'heading', text: 'Example:' },
      { type: 'code', text: 'age = 18' },
      { type: 'code', text: 'if age >= 18:' },
      { type: 'code', text: '    print("Adult")' },
      { type: 'code', text: 'else:' },
      { type: 'code', text: '    print("Minor")' }
    ]
  },
  // Slide 8
  {
    slideNumber: 8,
    title: 'LOOPS (FOR, WHILE)',
    category: 'Basics',
    contentLines: [
      { type: 'heading', text: 'What are Loops?' },
      { type: 'text', text: 'Loops allow a program to repeat a block of code multiple times.' },
      { type: 'heading', text: 'for Loop (known repetition count):' },
      { type: 'code', text: 'for i in range(5):' },
      { type: 'code', text: '    print(i)' },
      { type: 'heading', text: 'while Loop (continues until condition is False):' },
      { type: 'code', text: 'count = 1' },
      { type: 'code', text: 'while count <= 3:' },
      { type: 'code', text: '    print(count)' },
      { type: 'code', text: '    count += 1' }
    ]
  },
  // Slide 9
  {
    slideNumber: 9,
    title: 'PYTHON FUNCTIONS OVERVIEW',
    category: 'Functions',
    contentLines: [
      { type: 'bullet', text: 'Functions are reusable blocks of code' },
      { type: 'bullet', text: "Defined using the 'def' keyword" },
      { type: 'bullet', text: 'Can take arguments and return results' },
      { type: 'bullet', text: 'Improve code readability and maintainability' }
    ]
  },
  // Slide 10
  {
    slideNumber: 10,
    title: 'DEFINING A FUNCTION',
    category: 'Functions',
    contentLines: [
      { type: 'heading', text: 'Syntax:' },
      { type: 'code', text: 'def function_name(parameters):' },
      { type: 'code', text: '    # code block' },
      { type: 'heading', text: 'Example:' },
      { type: 'code', text: 'def greet(name):' },
      { type: 'code', text: '    print(f"Hello, {name}!")' }
    ]
  },
  // Slide 11
  {
    slideNumber: 11,
    title: 'FUNCTION EXAMPLES',
    category: 'Functions',
    contentLines: [
      { type: 'heading', text: 'Basic Function (No Parameters):' },
      { type: 'code', text: 'def greet():' },
      { type: 'code', text: '    print("Hello, world!")' },
      { type: 'code', text: 'greet()' },
      { type: 'heading', text: 'Function with Parameters:' },
      { type: 'code', text: 'def greet(name):' },
      { type: 'code', text: '    print(f"Hello, {name}!")' },
      { type: 'code', text: 'greet("Alice")' }
    ]
  },
  // Slide 12
  {
    slideNumber: 12,
    title: 'RETURN STATEMENT',
    category: 'Functions',
    contentLines: [
      { type: 'bullet', text: 'Used to return a value from a function' },
      { type: 'bullet', text: "Functions without return statement return 'None'" },
      { type: 'bullet', text: 'Example: return result' }
    ]
  },
  // Slide 13
  {
    slideNumber: 13,
    title: 'RETURN TYPE EXAMPLES',
    category: 'Functions',
    contentLines: [
      { type: 'heading', text: 'Function with Return Value:' },
      { type: 'code', text: 'def add(a, b):' },
      { type: 'code', text: '    return a + b' },
      { type: 'code', text: 'result = add(5, 3)' },
      { type: 'code', text: 'print(result) # Output: 8' }
    ]
  },
  // Slide 14
  {
    slideNumber: 14,
    title: 'FUNCTION ARGUMENTS',
    category: 'Functions',
    contentLines: [
      { type: 'bullet', text: 'Positional Arguments' },
      { type: 'bullet', text: 'Keyword Arguments' },
      { type: 'bullet', text: 'Default Arguments' },
      { type: 'bullet', text: 'Variable-length Arguments (*args, **kwargs)' }
    ]
  },
  // Slide 15
  {
    slideNumber: 15,
    title: 'POSITIONAL ARGUMENTS',
    category: 'Functions',
    contentLines: [
      { type: 'heading', text: 'Arguments matched by position (order matters):' },
      { type: 'code', text: 'def describe_pet(animal, name):' },
      { type: 'code', text: '    print(f"I have a {animal} named {name}.")' },
      { type: 'code', text: 'describe_pet("dog", "Max")' },
      { type: 'output', text: '# Output: I have a dog named Max.' }
    ]
  },
  // Slide 16
  {
    slideNumber: 16,
    title: 'KEYWORD ARGUMENTS',
    category: 'Functions',
    contentLines: [
      { type: 'heading', text: 'Arguments passed using key=value format (order does not matter):' },
      { type: 'code', text: 'def describe_pet(animal, name):' },
      { type: 'code', text: '    print(f"I have a {animal} named {name}.")' },
      { type: 'code', text: 'describe_pet(name="Max", animal="dog")' },
      { type: 'output', text: '# Output: I have a dog named Max.' }
    ]
  },
  // Slide 17
  {
    slideNumber: 17,
    title: 'DEFAULT ARGUMENTS',
    category: 'Functions',
    contentLines: [
      { type: 'heading', text: "If a value isn't provided, the default value is used:" },
      { type: 'code', text: 'def greet(name="Guest"):' },
      { type: 'code', text: '    print(f"Hello, {name}!")' },
      { type: 'code', text: 'greet("Ali") # Output: Hello, Ali!' },
      { type: 'code', text: 'greet()      # Output: Hello, Guest!' }
    ]
  },
  // Slide 18
  {
    slideNumber: 18,
    title: 'VARIABLE-LENGTH (*ARGS, **KWARGS)',
    category: 'Variable-Length',
    contentLines: [
      { type: 'text', text: '*args and **kwargs allow functions to accept an arbitrary number of arguments.' },
      { type: 'heading', text: '*args:' },
      { type: 'text', text: 'Passes a variable number of non-keyworded arguments, grouped into a tuple.' },
      { type: 'code', text: 'def myFun(*args):' },
      { type: 'code', text: '    for arg in args:' },
      { type: 'code', text: '        print(arg)' },
      { type: 'code', text: "myFun('Hello', 'Welcome', 'to', 'PYTHON')" }
    ]
  },
  // Slide 19
  {
    slideNumber: 19,
    title: 'VARIABLE-LENGTH (*ARGS WITH POSITIONAL)',
    category: 'Variable-Length',
    contentLines: [
      { type: 'heading', text: 'Combining Regular Arguments and *argv:' },
      { type: 'code', text: 'def fun(arg1, *argv):' },
      { type: 'code', text: '    print("First argument :", arg1)' },
      { type: 'code', text: '    for arg in argv:' },
      { type: 'code', text: '        print("Argument *argv :", arg)' },
      { type: 'code', text: "fun('Hello', 'Welcome', 'to', 'python')" }
    ]
  },
  // Slide 20
  {
    slideNumber: 20,
    title: 'VARIABLE-LENGTH (**KWARGS)',
    category: 'Variable-Length',
    contentLines: [
      { type: 'heading', text: '**kwargs:' },
      { type: 'text', text: 'Passes a variable number of keyword arguments using the double star (**).' },
      { type: 'bullet', text: 'A keyword argument provides a name to the variable as passed into the function.' },
      { type: 'bullet', text: 'Collects all additional keyword arguments and stores them in a dictionary.' }
    ]
  },
  // Slide 21
  {
    slideNumber: 21,
    title: 'VARIABLE-LENGTH (**KWARGS EXAMPLES)',
    category: 'Variable-Length',
    contentLines: [
      { type: 'heading', text: 'Example 1: Pure **kwargs' },
      { type: 'code', text: 'def fun(**kwargs):' },
      { type: 'code', text: '    for k, val in kwargs.items():' },
      { type: 'code', text: '        print("%s == %s" % (k, val))' },
      { type: 'code', text: "fun(s1='A', s2='B', s3='c')" },
      { type: 'heading', text: 'Example 2: arg1 combined with **kwargs' },
      { type: 'code', text: 'def fun(arg1, **kwargs):' },
      { type: 'code', text: '    for k, val in kwargs.items():' },
      { type: 'code', text: '        print("%s == %s" % (k, val))' },
      { type: 'code', text: 'fun("Hi", s1="students", s2="of", s3="python")' }
    ]
  },
  // Slide 22
  {
    slideNumber: 22,
    title: '*ARGS AND **KWARGS COMBINED',
    category: 'Variable-Length',
    contentLines: [
      { type: 'heading', text: 'Complete Parameter Order (Positional, *args, **kwargs):' },
      { type: 'code', text: 'def profile(role, *args, **kwargs):' },
      { type: 'code', text: '    print("Role:", role)' },
      { type: 'code', text: '    print("Args:", args)' },
      { type: 'code', text: '    print("Kwargs:", kwargs)' },
      { type: 'code', text: 'profile("Developer", "Python", "Django", level="Senior", remote=True)' },
      { type: 'output', text: "# Role: Developer | Args: ('Python', 'Django') | Kwargs: {'level': 'Senior', 'remote': True}" }
    ]
  },
  // Slide 23
  {
    slideNumber: 23,
    title: 'PYTHON DATA STRUCTURES OVERVIEW',
    category: 'Overview',
    contentLines: [
      { type: 'bullet', text: 'Built-in types: List, Tuple, Set, Dictionary' },
      { type: 'bullet', text: 'Used to store collections of data' },
      { type: 'bullet', text: 'Each type has different characteristics and use-cases' }
    ]
  },
  // Slide 24
  {
    slideNumber: 24,
    title: 'LISTS',
    category: 'Lists',
    contentLines: [
      { type: 'text', text: 'A list is a built-in Python data structure used to store multiple items in a single variable.' },
      { type: 'code', text: 'fruits = ["apple", "banana", "mango"]' },
      { type: 'heading', text: 'Characteristics of Lists:' },
      { type: 'bullet', text: 'Ordered: items maintain their insertion order.' },
      { type: 'bullet', text: 'Mutable: you can change, add, or remove items.' },
      { type: 'bullet', text: 'Heterogeneous: can store items of different data types.' },
      { type: 'bullet', text: 'Indexable: access items using 0-based indexes.' }
    ]
  },
  // Slide 25
  {
    slideNumber: 25,
    title: 'LIST (CREATING & ACCESSING)',
    category: 'Lists',
    contentLines: [
      { type: 'heading', text: 'Creating Lists:' },
      { type: 'code', text: 'numbers = [1, 2, 3, 4, 5]' },
      { type: 'code', text: 'mixed = ["Ali", 22, 5.5, True]' },
      { type: 'code', text: 'empty = []' },
      { type: 'heading', text: 'Accessing List Elements:' },
      { type: 'code', text: 'fruits = ["apple", "banana", "cherry"]' },
      { type: 'code', text: 'print(fruits[0])  # Output: apple' },
      { type: 'code', text: 'print(fruits[-1]) # Output: cherry (last element)' }
    ]
  },
  // Slide 26
  {
    slideNumber: 26,
    title: 'LIST (MODIFYING, ADDING & REMOVING)',
    category: 'Lists',
    contentLines: [
      { type: 'heading', text: 'Changing Elements:' },
      { type: 'code', text: 'fruits[1] = "orange" # [\'apple\', \'orange\', \'cherry\']' },
      { type: 'heading', text: 'Adding Items:' },
      { type: 'code', text: 'fruits.append("kiwi")     # Add at end' },
      { type: 'code', text: 'fruits.insert(1, "grape") # Insert at index 1' },
      { type: 'heading', text: 'Removing Items:' },
      { type: 'code', text: 'fruits.remove("orange")   # Removes first matching value' },
      { type: 'code', text: 'fruits.pop(0)             # Removes and returns item by index' },
      { type: 'code', text: 'del fruits[1]             # Deletes specific index' },
      { type: 'code', text: 'fruits.clear()            # Removes all items' }
    ]
  },
  // Slide 27
  {
    slideNumber: 27,
    title: 'LIST (LOOPING & SEARCHING)',
    category: 'Lists',
    contentLines: [
      { type: 'heading', text: 'Looping Through Lists:' },
      { type: 'code', text: 'for fruit in fruits:\n    print(fruit)' },
      { type: 'heading', text: 'Looping Using Index:' },
      { type: 'code', text: 'for i in range(len(fruits)):\n    print(fruits[i])' },
      { type: 'heading', text: 'Searching in List:' },
      { type: 'code', text: 'if "apple" in fruits:\n    print("Apple is in the list")' }
    ]
  },
  // Slide 28
  {
    slideNumber: 28,
    title: 'COMMON LIST METHODS',
    category: 'Lists',
    contentLines: [
      { type: 'table-header', text: 'Method | Description' },
      { type: 'table-row', text: 'append() | Adds item at the end' },
      { type: 'table-row', text: 'insert() | Inserts item at specific index' },
      { type: 'table-row', text: 'remove() | Removes first match of value' },
      { type: 'table-row', text: 'pop() | Removes item at given index' },
      { type: 'table-row', text: 'sort() | Sorts the list in place' },
      { type: 'table-row', text: 'reverse() | Reverses the list' },
      { type: 'table-row', text: 'index() | Returns index of first match' },
      { type: 'table-row', text: 'count() | Counts how many times a value appears' },
      { type: 'table-row', text: 'copy() | Returns a shallow copy' },
      { type: 'table-row', text: 'clear() | Removes all elements' }
    ]
  },
  // Slide 29
  {
    slideNumber: 29,
    title: 'LIST (SORTING & REVERSING)',
    category: 'Lists',
    contentLines: [
      { type: 'code', text: 'numbers = [5, 3, 8, 1]' },
      { type: 'code', text: 'numbers.sort()    # [1, 3, 5, 8]' },
      { type: 'code', text: 'numbers.reverse() # [8, 5, 3, 1]' }
    ]
  },
  // Slide 30
  {
    slideNumber: 30,
    title: 'LIST (SLICING & NESTED LISTS)',
    category: 'Lists',
    contentLines: [
      { type: 'heading', text: 'List Slicing [start:end:step]:' },
      { type: 'code', text: 'a = [10, 20, 30, 40, 50]' },
      { type: 'code', text: 'print(a[1:4]) # [20, 30, 40]' },
      { type: 'code', text: 'print(a[:3])  # [10, 20, 30]' },
      { type: 'code', text: 'print(a[::2]) # [10, 30, 50]' },
      { type: 'heading', text: 'Nested lists (2D list / Matrix):' },
      { type: 'code', text: 'matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]' },
      { type: 'code', text: 'print(matrix[1][2]) # Output: 6' }
    ]
  },
  // Slide 31
  {
    slideNumber: 31,
    title: 'LIST COMPREHENSION',
    category: 'Lists',
    contentLines: [
      { type: 'heading', text: 'What is List Comprehension?' },
      { type: 'text', text: 'List comprehension is a concise and efficient way to create a new list from an existing iterable (such as a list, tuple, or range).' },
      { type: 'text', text: 'Instead of using a for loop to build a list step by step, list comprehension writes the same logic in a single line.' },
      { type: 'heading', text: 'Syntax:' },
      { type: 'code', text: 'new_list = [expression for item in iterable]' }
    ]
  },
  // Slide 32
  {
    slideNumber: 32,
    title: 'LIST COMPREHENSION (COMPARISON)',
    category: 'Lists',
    contentLines: [
      { type: 'heading', text: '# Using a for loop:' },
      { type: 'code', text: 'squares = []\nfor i in range(6):\n    squares.append(i ** 2)\nprint(squares)' },
      { type: 'heading', text: '# Using list comprehension:' },
      { type: 'code', text: 'squares = [i ** 2 for i in range(6)]\nprint(squares)' },
      { type: 'output', text: '# Output: [0, 1, 4, 9, 16, 25]' }
    ]
  },
  // Slide 33
  {
    slideNumber: 33,
    title: 'LIST COMPREHENSION (WITH CONDITIONS)',
    category: 'Lists',
    contentLines: [
      { type: 'heading', text: 'Create a List of Even Numbers:' },
      { type: 'code', text: 'even_numbers = [x for x in range(11) if x % 2 == 0]' },
      { type: 'code', text: 'print(even_numbers)' },
      { type: 'output', text: '# Output: [0, 2, 4, 6, 8, 10]' }
    ]
  },
  // Slide 34
  {
    slideNumber: 34,
    title: 'TUPLES',
    category: 'Tuples',
    contentLines: [
      { type: 'heading', text: 'Definition:' },
      { type: 'text', text: 'A tuple is an ordered, immutable collection. Once created, its elements cannot be changed.' },
      { type: 'code', text: 'person = ("Ali", 25, "Sana\'a")\nprint(person[0]) # Output: Ali' },
      { type: 'heading', text: 'Key Features:' },
      { type: 'bullet', text: 'Defined using parentheses ()' },
      { type: 'bullet', text: 'Can contain mixed data types' },
      { type: 'bullet', text: 'Supports indexing and slicing' },
      { type: 'bullet', text: 'Faster and more memory efficient than lists' },
      { type: 'bullet', text: 'Often used for fixed data or as function return values' },
      { type: 'bullet', text: 'Limitations: Cannot use append(), remove(), or modify values in place.' }
    ]
  },
  // Slide 35
  {
    slideNumber: 35,
    title: 'SETS',
    category: 'Sets',
    contentLines: [
      { type: 'heading', text: 'Definition:' },
      { type: 'text', text: 'A set is an unordered collection of unique items.' },
      { type: 'code', text: 'colors = {"red", "blue", "green"}\ncolors.add("yellow")\nprint(colors)' },
      { type: 'heading', text: 'Key Features:' },
      { type: 'bullet', text: 'Defined using curly braces {} or set()' },
      { type: 'bullet', text: 'Automatically removes duplicates' },
      { type: 'bullet', text: 'No indexing or slicing' },
      { type: 'bullet', text: 'Ideal for membership tests and mathematical set operations' }
    ]
  },
  // Slide 36
  {
    slideNumber: 36,
    title: 'SETS (SET OPERATIONS)',
    category: 'Sets',
    contentLines: [
      { type: 'heading', text: 'Set Operations:' },
      { type: 'code', text: 'a = {1, 2, 3}' },
      { type: 'code', text: 'b = {3, 4, 5}' },
      { type: 'code', text: 'print(a | b) # Union: {1, 2, 3, 4, 5}' },
      { type: 'code', text: 'print(a & b) # Intersection: {3}' },
      { type: 'code', text: 'print(a - b) # Difference: {1, 2}' }
    ]
  },
  // Slide 37
  {
    slideNumber: 37,
    title: 'DICTIONARIES',
    category: 'Dictionaries',
    contentLines: [
      { type: 'heading', text: 'Definition:' },
      { type: 'text', text: 'A dictionary is an unordered, mutable collection of key-value pairs.' },
      { type: 'code', text: 'student = {"name": "Sara", "age": 20, "grade": "A"}\nprint(student["name"]) # Output: Sara' },
      { type: 'heading', text: 'Key Features:' },
      { type: 'bullet', text: 'Defined using {key: value} pairs' },
      { type: 'bullet', text: 'Keys must be unique and immutable (hashable)' },
      { type: 'bullet', text: 'Values can be any data type' },
      { type: 'bullet', text: 'Used for fast lookups and structured data' }
    ]
  },
  // Slide 38
  {
    slideNumber: 38,
    title: 'DICTIONARIES (GET METHOD)',
    category: 'Dictionaries',
    contentLines: [
      { type: 'heading', text: 'Common Methods: get(key, [default])' },
      { type: 'text', text: 'Returns the value for the given key. If key is not found, returns None (or default value).' },
      { type: 'code', text: 'student = {"name": "Sara", "age": 20}' },
      { type: 'code', text: 'print(student.get("name"))         # Output: Sara' },
      { type: 'code', text: 'print(student.get("grade"))        # Output: None' },
      { type: 'code', text: 'print(student.get("grade", "N/A")) # Output: N/A' }
    ]
  },
  // Slide 39
  {
    slideNumber: 39,
    title: 'DICTIONARIES (ITERATION)',
    category: 'Dictionaries',
    contentLines: [
      { type: 'heading', text: 'Looping via dictionaries:' },
      { type: 'bullet', text: 'By default, iterates via keys: for k in student: ...' },
      { type: 'bullet', text: 'Can iterate by values: for v in student.values(): ...' },
      { type: 'bullet', text: 'Can iterate over both keys and values: for k, v in student.items(): ...' }
    ]
  },
  // Slide 40
  {
    slideNumber: 40,
    title: 'DICTIONARIES (KEYS & VALUES)',
    category: 'Dictionaries',
    contentLines: [
      { type: 'heading', text: 'keys() & values() Methods:' },
      { type: 'code', text: 'student = {"name": "Sara", "age": 20}' },
      { type: 'code', text: 'print(student.keys())   # Output: dict_keys([\'name\', \'age\'])' },
      { type: 'code', text: 'print(student.values()) # Output: dict_values([\'Sara\', 20])' }
    ]
  },
  // Slide 41
  {
    slideNumber: 41,
    title: 'DICTIONARIES (ITEMS & UPDATE)',
    category: 'Dictionaries',
    contentLines: [
      { type: 'heading', text: 'items() Method:' },
      { type: 'code', text: 'print(student.items()) # dict_items([(\'name\', \'Sara\'), (\'age\', 20)])' },
      { type: 'heading', text: 'update() Method:' },
      { type: 'text', text: 'Updates dictionary with key-value pairs from another dictionary or keyword arguments.' },
      { type: 'code', text: 'student.update({"grade": "A"})\nprint(student) # {\'name\': \'Sara\', \'age\': 20, \'grade\': \'A\'}' },
      { type: 'code', text: 'student.update(age=21)\nprint(student) # {\'name\': \'Sara\', \'age\': 21, \'grade\': \'A\'}' }
    ]
  },
  // Slide 42
  {
    slideNumber: 42,
    title: 'DICTIONARIES (REMOVING ITEMS)',
    category: 'Dictionaries',
    contentLines: [
      { type: 'heading', text: 'pop(key) – Removes specified key and returns value:' },
      { type: 'code', text: 'age = student.pop("age")\nprint(age)     # Output: 21\nprint(student) # {\'name\': \'Sara\', \'grade\': \'A\'}' },
      { type: 'heading', text: 'del dict[key] – Deletes specified key:' },
      { type: 'code', text: 'del student["grade"]\nprint(student) # {\'name\': \'Sara\'}' },
      { type: 'heading', text: 'clear() – Removes all items:' },
      { type: 'code', text: 'student.clear()\nprint(student) # Output: {}' }
    ]
  },
  // Slide 43
  {
    slideNumber: 43,
    title: 'CHOOSING THE RIGHT STRUCTURE',
    category: 'Summary',
    contentLines: [
      { type: 'bullet', text: 'List: when order and mutability matter' },
      { type: 'bullet', text: 'Tuple: when order matters and immutability needed' },
      { type: 'bullet', text: 'Set: when uniqueness and set operations are needed' },
      { type: 'bullet', text: 'Dictionary: for associative arrays (key-value lookups)' }
    ]
  },
  // Slide 44
  {
    slideNumber: 44,
    title: 'DATA STRUCTURES COMPARISON MATRIX',
    category: 'Summary',
    contentLines: [
      { type: 'table-header', text: 'Feature | List | Tuple | Set | Dictionary' },
      { type: 'table-row', text: 'Ordered | Yes | Yes | No | No' },
      { type: 'table-row', text: 'Mutable | Yes | No | Yes | Yes' },
      { type: 'table-row', text: 'Allows Duplicates | Yes | Yes | No | Keys: No, Values: Yes' },
      { type: 'table-row', text: 'Indexing | Yes | Yes | No | No (keys instead)' },
      { type: 'table-row', text: 'Syntax | [] | () | {} | {key: value}' },
      { type: 'table-row', text: 'Use Case | Sequence of items | Fixed group | Unique items | Key-value lookup' },
      { type: 'table-row', text: 'Hashable/Key | No | Yes (if immutable) | Yes | Keys must be hashable' }
    ]
  }
];

function escapePdf(str: string): string {
  return String(str).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

/**
 * Builds a valid, self-contained 44-page PDF-1.7 ISO 32000 binary data URI in landscape slide format
 */
export function buildFunctionsAndDataStructuresPdfBase64(): string {
  const objects: { num: number; content: string }[] = [];
  let objCount = 0;

  function nextObj(content: string): number {
    objCount++;
    objects.push({ num: objCount, content });
    return objCount;
  }

  // 1. Catalog
  nextObj('<< /Type /Catalog /Pages 2 0 R >>');
  
  // 2. Pages reservation
  const pagesObjIdx = objects.length;
  objCount++;
  const pagesNum = 2;

  // Fonts
  const f1 = nextObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  const f2 = nextObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const f3 = nextObj('<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold >>');

  const pageIds: number[] = [];

  for (const s of FUNCTIONS_AND_DATA_STRUCTURES_SLIDES) {
    const streamLines: string[] = [];

    if (s.isTitle) {
      // Top color banner matching the sage teal slide background (0.584, 0.722, 0.729)
      streamLines.push('q 0.584 0.722 0.729 rg 0 200 792 412 re f Q');
      // Dark title bar
      streamLines.push(`BT /F1 26 Tf 0.1 0.1 0.1 rg 50 140 Td (${escapePdf(s.title)}) Tj ET`);
      if (s.subtitle) {
        streamLines.push(`BT /F2 15 Tf 0.3 0.3 0.3 rg 50 105 Td (${escapePdf(s.subtitle)}) Tj ET`);
      }
      if (s.author) {
        streamLines.push(`BT /F1 14 Tf 0.1 0.1 0.1 rg 570 50 Td (${escapePdf(s.author)}) Tj ET`);
      }
    } else {
      // Left vertical accent banner
      streamLines.push('q 0.584 0.722 0.729 rg 50 490 4 65 re f Q');
      // Slide Title
      streamLines.push(`BT /F1 20 Tf 0.15 0.15 0.15 rg 65 525 Td (${escapePdf(s.title)}) Tj ET`);
      // Slide Number
      streamLines.push(`BT /F2 10 Tf 0.5 0.5 0.5 rg 720 525 Td (Slide ${s.slideNumber}/44) Tj ET`);

      let curY = 475;
      for (const line of s.contentLines) {
        if (line.type === 'heading') {
          curY -= 14;
          streamLines.push(`BT /F1 13 Tf 0.1 0.1 0.1 rg 65 ${curY} Td (${escapePdf(line.text)}) Tj ET`);
          curY -= 8;
        } else if (line.type === 'code') {
          curY -= 12;
          streamLines.push(`q 0.94 0.96 0.97 rg 60 ${curY - 3} 670 17 re f Q`);
          streamLines.push(`BT /F3 10.5 Tf 0.1 0.25 0.55 rg 70 ${curY} Td (${escapePdf(line.text)}) Tj ET`);
          curY -= 6;
        } else if (line.type === 'output') {
          curY -= 10;
          streamLines.push(`BT /F3 9.5 Tf 0.2 0.5 0.3 rg 70 ${curY} Td (${escapePdf(line.text)}) Tj ET`);
        } else if (line.type === 'bullet') {
          curY -= 14;
          streamLines.push(`BT /F2 11.5 Tf 0.2 0.2 0.2 rg 75 ${curY} Td (• ${escapePdf(line.text)}) Tj ET`);
        } else if (line.type === 'table-header') {
          curY -= 14;
          streamLines.push(`q 0.88 0.92 0.92 rg 60 ${curY - 3} 670 17 re f Q`);
          streamLines.push(`BT /F1 10.5 Tf 0.1 0.1 0.1 rg 68 ${curY} Td (${escapePdf(line.text)}) Tj ET`);
          curY -= 5;
        } else if (line.type === 'table-row') {
          curY -= 13;
          streamLines.push(`BT /F2 10 Tf 0.2 0.2 0.2 rg 68 ${curY} Td (${escapePdf(line.text)}) Tj ET`);
        } else {
          curY -= 14;
          streamLines.push(`BT /F2 11.5 Tf 0.25 0.25 0.25 rg 65 ${curY} Td (${escapePdf(line.text)}) Tj ET`);
        }
      }
    }

    const streamBody = streamLines.join('\n');
    const streamLen = typeof Buffer !== 'undefined' 
      ? Buffer.byteLength(streamBody, 'utf8') 
      : new TextEncoder().encode(streamBody).length;
    const streamObj = nextObj(`<< /Length ${streamLen} >>\nstream\n${streamBody}\nendstream`);

    // Standard 4:3 landscape slide dimensions: 792 x 612 pt
    const pageObj = nextObj(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 792 612] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R /F3 ${f3} 0 R >> >> /Contents ${streamObj} 0 R >>`);
    pageIds.push(pageObj);
  }

  // Insert Pages object
  objects.splice(pagesObjIdx, 0, {
    num: pagesNum,
    content: `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`
  });

  objects.sort((a, b) => a.num - b.num);

  let pdfStr = '%PDF-1.7\n\n';
  const xref: string[] = ['0000000000 65535 f \n'];

  const getByteLength = (s: string) =>
    typeof Buffer !== 'undefined' ? Buffer.byteLength(s, 'utf8') : new TextEncoder().encode(s).length;

  for (const obj of objects) {
    const offset = getByteLength(pdfStr);
    xref.push(String(offset).padStart(10, '0') + ' 00000 n \n');
    pdfStr += `${obj.num} 0 obj\n${obj.content}\nendobj\n\n`;
  }

  const startxref = getByteLength(pdfStr);
  pdfStr += `xref\n0 ${objects.length + 1}\n`;
  pdfStr += xref.join('');
  pdfStr += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;

  const base64Str = typeof Buffer !== 'undefined'
    ? Buffer.from(pdfStr, 'utf8').toString('base64')
    : btoa(unescape(encodeURIComponent(pdfStr)));

  return `data:application/pdf;base64,${base64Str}`;
}

export const FUNCTIONS_AND_DATA_STRUCTURES_MARKDOWN = `# Python Functions & Data Structures: Academic Slide Deck
**Instructor:** T\\ Sondos Saif  
**Course Module:** Python Functions & Built-in Data Structures  
**Total Slides:** 44 Pages (Official Academic Syllabus)

---

## 1. Course Overview & Core Syntax
* **Python Language:** Interpreted, high-level, general-purpose programming language favored across Artificial Intelligence and Data Science.
* **Variables:** Named memory locations acting as labeled containers.
* **Primitive Types:** \`int\` (e.g. 5, -8), \`float\` (3.14, -7.25), \`str\` ("Hello", "Python"), \`bool\` (True, False).
* **I/O Operations:**
  * Output: \`print("Welcome to Python!")\`, formatted strings \`f"Age: {age}"\`.
  * Input: \`input("Prompt: ")\` always returns a string; cast with \`int(input(...))\` for arithmetic.
* **Control Flow:**
  * Conditionals: \`if\`, \`elif\`, \`else\`.
  * Iteration: \`for i in range(5)\`, \`while count <= 3\`.

---

## 2. Functions Architecture
* **Declaration:** \`def function_name(parameters):\`
* **Return Mechanism:** Returns values with \`return\`; functions without explicit returns evaluate to \`None\`.
* **Argument Passing Paradigms:**
  1. **Positional Arguments:** Matched strictly by order (\`describe_pet("dog", "Max")\`).
  2. **Keyword Arguments:** Passed as \`name="Max", animal="dog"\` where order does not matter.
  3. **Default Arguments:** Fallback values defined in signature (\`def greet(name="Guest"):\`).

---

## 3. Variable-Length Arguments (\`*args\` & \`**kwargs\`)
* **\`*args\` (Tuple Pack):** Accepts variable number of positional arguments into a \`tuple\`.
  \`\`\`python
  def myFun(*args):
      for arg in args:
          print(arg)
  \`\`\`
* **\`**kwargs\` (Dictionary Pack):** Accepts variable keyword arguments into a \`dict\`.
  \`\`\`python
  def fun(**kwargs):
      for k, v in kwargs.items():
          print(f"{k} == {v}")
  \`\`\`
* **Unified Signature:**
  \`\`\`python
  def profile(role, *args, **kwargs):
      print("Role:", role)
      print("Args:", args)
      print("Kwargs:", kwargs)

  profile("Developer", "Python", "Django", level="Senior", remote=True)
  \`\`\`

---

## 4. Built-in Data Structures

### A. Lists (\`[]\`)
* **Properties:** Ordered, Mutable, Heterogeneous, Indexable (0-based and negative \`[-1]\`).
* **CRUD Operations:** \`.append()\`, \`.insert()\`, \`.remove()\`, \`.pop()\`, \`del\`, \`.clear()\`.
* **Utility Methods:** \`.sort()\`, \`.reverse()\`, \`.index()\`, \`.count()\`, \`.copy()\`.
* **Slicing & 2D Matrices:** \`a[1:4]\`, \`a[::2]\`, \`matrix[1][2]\`.
* **List Comprehension:**
  \`\`\`python
  # Generating squares:
  squares = [i ** 2 for i in range(6)]
  # Even filtering:
  even_numbers = [x for x in range(11) if x % 2 == 0]
  \`\`\`

### B. Tuples (\`()\`)
* **Properties:** Ordered, **Immutable**, Memory-efficient, Hashable (if items immutable).
* **Syntax:** \`person = ("Ali", 25, "Sana'a")\`.

### C. Sets (\`{}\` or \`set()\`)
* **Properties:** Unordered, Unique elements only (auto-deduplication), No indexing.
* **Mathematical Set Operations:**
  * Union: \`a | b\`
  * Intersection: \`a & b\`
  * Difference: \`a - b\`

### D. Dictionaries (\`{key: value}\`)
* **Properties:** Mutable, Key-Value associative mapping, Unique and hashable keys.
* **Methods:** \`.get(key, default)\`, \`.keys()\`, \`.values()\`, \`.items()\`, \`.update()\`, \`.pop(key)\`, \`del\`, \`.clear()\`.

---

## 5. Comprehensive Data Structure Decision Matrix

| Feature | List | Tuple | Set | Dictionary |
| :--- | :--- | :--- | :--- | :--- |
| **Ordered** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **Mutable** | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| **Allows Duplicates** | ✅ Yes | ✅ Yes | ❌ No | ❌ Keys: No, ✅ Values: Yes |
| **Indexing** | ✅ Yes (\`[0]\`) | ✅ Yes (\`[0]\`) | ❌ No | ❌ No (\`[key]\` lookup) |
| **Syntax** | \`[ ]\` | \`( )\` | \`{ }\` or \`set()\` | \`{key: value}\` |
| **Primary Use Case** | Ordered sequence of items | Fixed / Return groups | Unique collections & set math | Fast Key-Value lookups |
| **Hashable as Dict Key** | ❌ No | ✅ Yes (if immutable) | ❌ No (use frozenset) | ❌ No |
`;
