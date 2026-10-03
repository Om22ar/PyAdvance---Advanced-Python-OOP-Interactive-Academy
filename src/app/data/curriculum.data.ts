import { Module } from '../models/curriculum.model';

export const CURRICULUM_DATA: Module[] = [
  {
    id: 'functions-and-data-structures',
    number: '00',
    title: 'Python Functions & Data Structures',
    subtitle: 'Variables, Function Arguments (*args/**kwargs), Lists, Tuples, Sets, and Dictionaries.',
    icon: 'data_object',
    category: 'core',
    status: 'in_progress',
    progressPercent: 75,
    totalLessons: 6,
    completedLessons: 4,
    description: "Official 44-slide academic curriculum by T\\ Sondos Saif. Master core data types, function parameter passing (*args tuple pack & **kwargs dict pack), List comprehensions, Set math, and Dictionary lookups.",
    lessons: [
      {
        id: 'fds-vars-io',
        moduleId: 'functions-and-data-structures',
        title: 'Variables, Types & I/O Streams',
        durationMinutes: 12,
        concepts: ['Variables as memory boxes', 'int, float, str, bool', 'type() checking', 'print() & f-strings', 'input() with int casting'],
        slideReference: 'Slides 2–8 (Python Functions & Data Structures)',
        summary: 'Variables are named locations in memory holding mutable values. Input from input() always returns a string, while print(f"Age: {age}") formats outputs.',
        codeSnippet: `# Python Variables, Type Inspection, and Formatting
name = "Sara"
age = 20
is_student = True
pi_approx = 3.14159

print(f"User: {name}, Age: {age}, Status: {is_student}")
print("Type of age:", type(age))
print("Type of pi:", type(pi_approx))

# Simulate user prompt input processing
entered_val = "25"  # simulated input("Enter age: ")
converted_age = int(entered_val)
print("Next year age:", converted_age + 1)`,
        expectedOutput: `User: Sara, Age: 20, Status: True
Type of age: <class 'int'>
Type of pi: <class 'float'>
Next year age: 26`,
        explanation: 'Python uses dynamic typing. Variables store references to objects. The type() function reveals the runtime class.',
        quiz: {
          question: 'What is the return type of the built-in input() function in Python?',
          options: [
            'int if numeric, str otherwise',
            'Always str (string)',
            'Dynamic based on user typing',
            'NoneType'
          ],
          answerIndex: 1,
          explanation: 'The input() function always returns a string (str), even if digits are entered.'
        }
      },
      {
        id: 'fds-functions-params',
        moduleId: 'functions-and-data-structures',
        title: 'Function Definition, Arguments & Return',
        durationMinutes: 14,
        concepts: ['def keyword', 'positional arguments', 'keyword arguments (key=value)', 'default parameters', 'return statement'],
        slideReference: 'Slides 9–17 (Python Functions & Data Structures)',
        summary: 'Functions encapsulate reusable code. Positional arguments depend on order; keyword arguments specify names explicitly; default arguments provide fallbacks.',
        codeSnippet: `# Function Definition with Positional, Keyword, and Default Arguments
def describe_pet(animal, name="Guest"):
    """Returns a formatted pet description string."""
    return f"I have a {animal} named {name}."

# 1. Positional call
print(describe_pet("dog", "Max"))

# 2. Keyword call (order independent)
print(describe_pet(name="Luna", animal="cat"))

# 3. Default argument fallback
print(describe_pet("parrot"))`,
        expectedOutput: `I have a dog named Max.
I have a cat named Luna.
I have a parrot named Guest.`,
        explanation: 'Functions without an explicit return statement implicitly evaluate to None. Default arguments must follow non-default positional arguments.',
        quiz: {
          question: 'In Python, what happens when you call describe_pet(name="Max", animal="dog") using keyword arguments?',
          options: [
            'It fails because positional order was reversed',
            'It matches arguments by keyword name regardless of order',
            'It creates a dictionary instead of calling the function',
            'It sets animal to default value'
          ],
          answerIndex: 1,
          explanation: 'Keyword arguments pass values using key=value format, meaning parameter order does not matter.'
        }
      },
      {
        id: 'fds-args-kwargs',
        moduleId: 'functions-and-data-structures',
        title: 'Variable-Length Arguments (*args & **kwargs)',
        durationMinutes: 18,
        concepts: ['*args tuple packing', '**kwargs dictionary packing', 'arbitrary arguments', 'combined signature profile(role, *args, **kwargs)'],
        slideReference: 'Slides 18–22 (Python Functions & Data Structures)',
        summary: '*args groups arbitrary non-keyworded arguments into a tuple; **kwargs collects named keyword arguments into a dictionary.',
        codeSnippet: `# Combined Parameter Architecture: Positional, *args, **kwargs
def profile(role, *args, **kwargs):
    print("Role:", role)
    print("Args (Tuple):", args)
    print("Kwargs (Dict):", kwargs)

profile("Developer", "Python", "Django", "FastAPI", level="Senior", remote=True, region="EMEA")`,
        expectedOutput: `Role: Developer
Args (Tuple): ('Python', 'Django', 'FastAPI')
Kwargs (Dict): {'level': 'Senior', 'remote': True, 'region': 'EMEA'}`,
        explanation: '*args gathers variable arguments as an immutable tuple. **kwargs collects keyword arguments into a standard dictionary accessible via .items() or .get().',
        quiz: {
          question: 'Inside a function defined with def myFun(*args):, what data structure is args received as?',
          options: [
            'A mutable list []',
            'An immutable tuple ()',
            'A dictionary {key: value}',
            'A set {}'
          ],
          answerIndex: 1,
          explanation: 'The *args syntax packages variable-length positional arguments into an immutable tuple.'
        }
      },
      {
        id: 'fds-lists-comprehensions',
        moduleId: 'functions-and-data-structures',
        title: 'Lists, Slicing & List Comprehensions',
        durationMinutes: 16,
        concepts: ['List mutability', 'negative indexing [-1]', 'slicing [start:end:step]', '2D nested matrix', 'list comprehensions [x**2 for x in ...]'],
        slideReference: 'Slides 24–33 (Python Functions & Data Structures)',
        summary: 'Lists are ordered, mutable, and indexable. Comprehensions provide concise one-line syntax for mapping and filtering iterables.',
        codeSnippet: `# List Manipulation, Slicing, and Comprehensions
fruits = ["apple", "banana", "cherry", "mango", "orange"]
fruits.append("kiwi")
fruits.insert(1, "grape")

print("Indexed slice [1:4]:", fruits[1:4])
print("Step slice [::2]:", fruits[::2])

# List Comprehension: Square of numbers 0 to 5
squares = [i ** 2 for i in range(6)]
print("Squares:", squares)

# List Comprehension with Condition: Even numbers up to 10
even_numbers = [x for x in range(11) if x % 2 == 0]
print("Even numbers:", even_numbers)`,
        expectedOutput: `Indexed slice [1:4]: ['grape', 'banana', 'cherry']
Step slice [::2]: ['apple', 'banana', 'mango', 'kiwi']
Squares: [0, 1, 4, 9, 16, 25]
Even numbers: [0, 2, 4, 6, 8, 10]`,
        explanation: 'List slicing syntax a[start:stop:step] generates sublists without mutating the source list. Comprehensions execute in optimized C bytecode.',
        quiz: {
          question: 'What is the evaluated result of [x * 2 for x in range(5) if x % 2 != 0]?',
          options: [
            '[0, 2, 4]',
            '[2, 6]',
            '[1, 3]',
            '[0, 2, 4, 6, 8]'
          ],
          answerIndex: 1,
          explanation: 'Odd numbers in range(5) are 1 and 3. Multiplying each by 2 yields [2, 6].'
        }
      },
      {
        id: 'fds-tuples-sets',
        moduleId: 'functions-and-data-structures',
        title: 'Tuples & Sets (Mathematical Operations)',
        durationMinutes: 14,
        concepts: ['Tuple immutability', 'memory efficiency', 'Set uniqueness', 'Union |', 'Intersection &', 'Difference -'],
        slideReference: 'Slides 34–36 (Python Functions & Data Structures)',
        summary: 'Tuples cannot be altered once created. Sets eliminate duplicates and allow binary set mathematics: Union (|), Intersection (&), and Difference (-).',
        codeSnippet: `# Tuples Immutability and Set Operations
person = ("Ali", 25, "Sana'a")
print("Tuple access person[0]:", person[0])

# Sets and Set Mathematics
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print("Union (a | b):", sorted(list(a | b)))
print("Intersection (a & b):", sorted(list(a & b)))
print("Difference (a - b):", sorted(list(a - b)))`,
        expectedOutput: `Tuple access person[0]: Ali
Union (a | b): [1, 2, 3, 4, 5, 6]
Intersection (a & b): [3, 4]
Difference (a - b): [1, 2]`,
        explanation: 'Tuples are immutable and hashable, making them valid dictionary keys. Sets use hash tables for O(1) membership lookups and auto-deduplication.',
        quiz: {
          question: 'Given sets a = {1, 2, 3} and b = {3, 4, 5}, what does print(a & b) output?',
          options: [
            '{1, 2, 3, 4, 5}',
            '{3}',
            '{1, 2}',
            '{4, 5}'
          ],
          answerIndex: 1,
          explanation: 'The & operator computes the set intersection, which finds common elements ({3}).'
        }
      },
      {
        id: 'fds-dictionaries-matrix',
        moduleId: 'functions-and-data-structures',
        title: 'Dictionaries & Structure Decision Matrix',
        durationMinutes: 16,
        concepts: ['Key-Value pairs', '.get() fallback', '.keys(), .values(), .items()', '.update()', 'Comparison Matrix'],
        slideReference: 'Slides 37–44 (Python Functions & Data Structures)',
        summary: 'Dictionaries store associative key-value mappings. Compare List vs Tuple vs Set vs Dict across mutability, ordering, duplicates, and indexing.',
        codeSnippet: `# Dictionaries and Lookup Handling
student = {"name": "Sara", "age": 20, "grade": "A"}

# Safe retrieval with .get()
print("Name:", student.get("name"))
print("Missing key with fallback:", student.get("gpa", "N/A"))

# Dictionary updates
student.update({"age": 21, "city": "London"})

# Iterating over key-value pairs
print("--- Dictionary Items ---")
for key, value in student.items():
    print(f"{key} -> {value}")`,
        expectedOutput: `Name: Sara
Missing key with fallback: N/A
--- Dictionary Items ---
name -> Sara
age -> 21
grade -> A
city -> London`,
        explanation: 'Dictionaries provide O(1) average-time lookups by key. Use student.get(k, default) to prevent KeyError exceptions on absent keys.',
        quiz: {
          question: 'Which Python data structure is unordered, allows mutability, but requires unique, hashable keys?',
          options: [
            'List',
            'Tuple',
            'Set',
            'Dictionary'
          ],
          answerIndex: 3,
          explanation: 'Dictionaries are associative mappings where keys must be unique and hashable (e.g. strings, numbers, or tuples).'
        }
      }
    ]
  },
  {
    id: 'file-handling-modes',
    number: '01',
    title: 'File Handling & Memory Buffers',
    subtitle: 'Stream modes, binary vs text, seek byte pointers, and flush mechanisms.',
    icon: 'folder_open',
    category: 'advanced',
    status: 'in_progress',
    progressPercent: 84,
    totalLessons: 8,
    completedLessons: 6,
    description: 'Master low-level file streams, context managers, write buffers, and OS filesystem management.',
    lessons: [
      {
        id: 'file-modes-intro',
        moduleId: 'file-handling-modes',
        title: 'File Access Modes (r, w, a, rb, r+, x)',
        durationMinutes: 12,
        concepts: ['open() syntax', 'text vs binary mode', 'append vs write overwrite', 'exclusive creation x'],
        slideReference: 'Slide 4-6 (File, Error & Regex)',
        summary: 'Python provides flexible open() modes: r (read default), w (overwrite or create), a (append at EOF), rb (raw binary bytes), r+ (read & write), and x (exclusive creation, fails if file exists).',
        codeSnippet: `# Demonstration of Python File Opening Modes
filename = "runtime_demo.txt"

# 1. Write mode: creates new or overwrites
with open(filename, "w") as f:
    f.write("Line 1: System initialized\\n")
    f.write("Line 2: Data stream active\\n")

# 2. Append mode: writes strictly to end of file
with open(filename, "a") as f:
    f.write("Line 3: Appended log entry\\n")

# 3. Read mode: reads full content
with open(filename, "r") as f:
    content = f.read()

print("--- File Content ---")
print(content)
print(f"File closed status: {f.closed}")`,
        expectedOutput: `--- File Content ---
Line 1: System initialized
Line 2: Data stream active
Line 3: Appended log entry

File closed status: True`,
        explanation: 'Context managers ("with" statement) ensure that file descriptors are automatically closed even if exceptions occur. Binary modes (rb/wb) omit newline translation and return raw bytes.',
        quiz: {
          question: 'What occurs if you open a file with mode "x" when the file already exists on disk?',
          options: [
            'It truncates the file to 0 bytes and overwrites it',
            'It opens the file in read-only mode',
            'It raises FileExistsError (exclusive creation failed)',
            'It silently creates a copy named file_1'
          ],
          answerIndex: 2,
          explanation: 'Mode "x" is for exclusive creation. If the file already exists, Python halts with a FileExistsError.'
        }
      },
      {
        id: 'file-reading-methods',
        moduleId: 'file-handling-modes',
        title: 'Reading Streams: read(), readline() & readlines()',
        durationMinutes: 10,
        concepts: ['read([size])', 'readline()', 'readlines()', 'memory efficiency'],
        slideReference: 'Slide 8-9 (File, Error & Regex)',
        summary: 'Learn when to consume entire files vs processing line by line to keep memory footprint minimal.',
        codeSnippet: `# Comparing read(), readline(), and readlines()
sample_data = """First line of configuration
Second line: PORT=8080
Third line: DEBUG=False"""

# Simulate file
with open("config.txt", "w") as f:
    f.write(sample_data)

# Read first 10 bytes
with open("config.txt", "r") as f:
    partial = f.read(10)
    print("First 10 chars:", repr(partial))

# Read single line
with open("config.txt", "r") as f:
    line = f.readline()
    print("Single line:", line.strip())

# Read all lines into a list
with open("config.txt", "r") as f:
    all_lines = f.readlines()
    print("Lines list:", [l.strip() for l in all_lines])`,
        expectedOutput: `First 10 chars: 'First line'
Single line: First line of configuration
Lines list: ['First line of configuration', 'Second line: PORT=8080', 'Third line: DEBUG=False']`,
        explanation: 'read(size) reads up to size characters/bytes. readline() reads up to the next \\n newline. readlines() returns a list of all strings with newlines.',
        quiz: {
          question: 'Which method is most memory-efficient for parsing a 20GB log file?',
          options: [
            'f.read() all at once into RAM',
            'f.readlines() into a large Python list',
            'Iterating line by line with "for line in f:"',
            'Calling f.seek(0) repeatedly'
          ],
          answerIndex: 2,
          explanation: 'Iterating directly on the file object "for line in f:" uses a lazy generator buffer, reading one line at a time without exhausting memory.'
        }
      },
      {
        id: 'file-seek-tell',
        moduleId: 'file-handling-modes',
        title: 'Byte Pointer Navigation: seek(offset, whence) & tell()',
        durationMinutes: 15,
        concepts: ['file pointer', 'seek(offset, whence)', 'whence values 0, 1, 2', 'tell()'],
        slideReference: 'Slide 11-18 (File, Error & Regex)',
        summary: 'Deep dive into stream pointers. In binary mode ("rb"), whence=0 is beginning, 1 is current, 2 is end of file. Relative and negative seeks require binary mode.',
        codeSnippet: `# Deep Seek & Tell Demo from Sondos Saif's slides
with open("sample.txt", "w") as f:
    f.write("Hello, this is a test file.\\nSecond line.\\n")

# 1. Seek from beginning
with open("sample.txt", "r") as f:
    f.seek(7) # Move to index 7 ("this is...")
    print("Offset 7 output:", f.read(11)) # Reads next 11 chars
    print("Current pointer tell():", f.tell())

# 2. Binary mode negative seek from EOF (whence=2)
with open("sample.txt", "rb") as f:
    f.seek(-7, 2) # Move 7 bytes before end
    print("End-relative read (-7, 2):", f.read())`,
        expectedOutput: `Offset 7 output: this is a 
Current pointer tell(): 18
End-relative read (-7, 2): b'line.\\r\\n'`,
        explanation: 'In text mode ("r"), Python only allows seeks from the start (whence=0) or seek(0, 2) due to multi-byte UTF-8 encoding. In binary mode ("rb"), raw bytes allow seeking backwards from end e.g. seek(-N, 2).',
        quiz: {
          question: 'Why does Python raise io.UnsupportedOperation when executing f.seek(-5, 2) on a file opened with mode "r"?',
          options: [
            'Because the file is empty',
            'Because text mode does not support non-zero end-relative seeks due to variable UTF-8 character byte widths',
            'Because the negative sign is a syntax error in Python',
            'Because seek() requires a float argument'
          ],
          answerIndex: 1,
          explanation: 'In text mode, variable-length UTF-8 encoding (1-4 bytes per character) makes end-relative byte seeks unpredictable. Python requires binary mode ("rb") for negative seeks.'
        }
      },
      {
        id: 'file-flush-buffers',
        moduleId: 'file-handling-modes',
        title: 'Buffer Flushing: file.flush() & Buffering Controls',
        durationMinutes: 11,
        concepts: ['I/O buffer', 'file.flush()', 'preventing data loss', 'buffering parameter'],
        slideReference: 'Slide 19-20 (File, Error & Regex)',
        summary: 'Learn why Python buffers output for disk I/O performance and how file.flush() forces immediate physical write.',
        codeSnippet: `# Flush & Buffering behavior
with open("audit_log.txt", "w", buffering=1) as f:
    f.write("CRITICAL TRANSACTION 1024\\n")
    # Force OS to flush user space buffer to disk immediately
    f.flush()
    print("Buffer flushed to storage.")

# Check file properties
print("f.name:", f.name)
print("f.mode:", f.mode)
print("f.closed:", f.closed)`,
        expectedOutput: `Buffer flushed to storage.
f.name: audit_log.txt
f.mode: w
f.closed: True`,
        explanation: 'Buffering groups small writes into larger chunks to minimize slow disk I/O operations. flush() is vital when logging real-time telemetry or crash logs before failure.',
        quiz: {
          question: 'What does buffering=1 mean when opening a text file?',
          options: [
            'Unbuffered - every character writes to disk immediately',
            'Line buffered - flushes automatically upon encountering a newline \\n',
            '1 kilobyte buffer size',
            'Only 1 user can access the file'
          ],
          answerIndex: 1,
          explanation: 'In text mode, buffering=1 enables line-buffered operation, flushing the buffer whenever a newline "\\n" is written.'
        }
      }
    ]
  },
  {
    id: 'json-csv-serialization',
    number: '02',
    title: 'JSON & CSV Serialization',
    subtitle: 'json.load/dump, custom class encoders, and csv.DictReader/DictWriter.',
    icon: 'data_object',
    category: 'data',
    status: 'in_progress',
    progressPercent: 78,
    totalLessons: 6,
    completedLessons: 4,
    description: 'Serialize complex domain classes, manage dictionaries, and exchange CSV records cleanly.',
    lessons: [
      {
        id: 'json-custom-objects',
        moduleId: 'json-csv-serialization',
        title: 'Custom OOP JSON Serialization (__dict__ & Deserialization)',
        durationMinutes: 14,
        concepts: ['json.dump vs dumps', 'TypeError: not JSON serializable', '__dict__ method', 'deserializing with Person(**data)'],
        slideReference: 'Slide 29-35 (File, Error & Regex)',
        summary: 'Standard json.dumps fails on custom Python class instances. Master 3 solutions: .to_dict(), custom_serializer(obj), and __dict__ inspection, followed by unpacking kwargs.',
        codeSnippet: `import json

class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __repr__(self):
        return f"Person(name={self.name!r}, age={self.age})"

# 1. Serializing using __dict__
p = Person("Ali", 25)
json_str = json.dumps(p.__dict__, indent=2)
print("Serialized JSON:")
print(json_str)

# 2. Deserializing back to Person object using **kwargs unpacking
data = json.loads(json_str)
p2 = Person(**data)
print("\\nDeserialized object:", p2)
print(f"p2.name = {p2.name}, p2.age = {p2.age}")`,
        expectedOutput: `Serialized JSON:
{
  "name": "Ali",
  "age": 25
}

Deserialized object: Person(name='Ali', age=25)
p2.name = Ali, p2.age = 25`,
        explanation: 'json.dumps(p) raises TypeError because the standard encoder only understands primitives. Using p.__dict__ or Person(**data) converts between dictionary and object cleanly.',
        quiz: {
          question: 'Why does json.dumps(Person("Sara", 20)) raise TypeError: Object of type Person is not JSON serializable?',
          options: [
            'Python requires all classes to inherit from json.Serializable',
            'JSON standard only supports dicts, lists, strings, numbers, booleans, and null',
            'The class name starts with a capital letter',
            'json module is not imported properly'
          ],
          answerIndex: 1,
          explanation: 'JSON only has native mappings for primitives, lists, and dicts. Custom objects require explicitly converting their state (via __dict__ or a default serializer).'
        }
      },
      {
        id: 'csv-dict-readers',
        moduleId: 'json-csv-serialization',
        title: 'CSV Processing: csv.DictReader & csv.DictWriter',
        durationMinutes: 12,
        concepts: ['csv.reader', 'csv.DictReader', 'csv.DictWriter', 'writeheader()'],
        slideReference: 'Slide 36-38 (File, Error & Regex)',
        summary: 'Process tabular data with structured column mappings rather than fragile numerical list indices.',
        codeSnippet: `import csv
import io

# In-memory CSV stream
csv_stream = io.StringIO()
fieldnames = ["name", "age", "city"]

# 1. Writing with DictWriter
writer = csv.DictWriter(csv_stream, fieldnames=fieldnames)
writer.writeheader()
writer.writerows([
    {"name": "Alice", "age": 25, "city": "London"},
    {"name": "Bob", "age": 30, "city": "New York"}
])

# Rewind and Read with DictReader
csv_stream.seek(0)
reader = csv.DictReader(csv_stream)

print("Parsed CSV Rows as Dictionaries:")
for row in reader:
    print(f"User: {row['name']} | Age: {row['age']} | City: {row['city']}")`,
        expectedOutput: `Parsed CSV Rows as Dictionaries:
User: Alice | Age: 25 | City: London
User: Bob | Age: 30 | City: New York`,
        explanation: 'DictReader maps headers to dictionary keys automatically, safeguarding code if column ordering shifts in incoming data files.',
        quiz: {
          question: 'What is the purpose of writer.writeheader() in csv.DictWriter?',
          options: [
            'It validates that all rows have equal lengths',
            'It writes the first row containing column names defined in fieldnames',
            'It writes copyright metadata to the top of the file',
            'It closes the file stream'
          ],
          answerIndex: 1,
          explanation: 'writeheader() prints the defined fieldnames as the first comma-separated row in the CSV file.'
        }
      }
    ]
  },
  {
    id: 'regex-engine',
    number: '03',
    title: 'Regular Expressions & Lexical Parsing',
    subtitle: 'Pattern matching, character classes, greedy quantifiers, and named groups.',
    icon: 'saved_search',
    category: 'advanced',
    status: 'in_progress',
    progressPercent: 65,
    totalLessons: 7,
    completedLessons: 4,
    description: 'Master re.search, findall, sub, character classes \\d \\w \\s, and named capturing groups (?P<name>...).',
    lessons: [
      {
        id: 'regex-search-findall',
        moduleId: 'regex-engine',
        title: 'Core re Functions: search(), findall(), sub() & split()',
        durationMinutes: 13,
        concepts: ['re.search() vs re.match()', 're.findall()', 're.sub()', 're.split()'],
        slideReference: 'Slide 39-45 (File, Error & Regex)',
        summary: 're.match only checks the start of the string, while re.search scans anywhere. re.sub replaces patterns, and re.split tokens on dynamic delimiters.',
        codeSnippet: `import re

text = "Call cybersecurity dispatcher at 987-654-3210 or backup 800-555-0199."

# 1. Search for first match
match = re.search(r"\\d{3}-\\d{3}-\\d{4}", text)
if match:
    print("Primary phone found:", match.group())

# 2. Findall all matching instances
all_phones = re.findall(r"\\d{3}-\\d{3}-\\d{4}", text)
print("All phones:", all_phones)

# 3. Sub sanitization
sanitized = re.sub(r"\\d{3}-\\d{3}-\\d{4}", "[REDACTED-PHONE]", text)
print("Sanitized text:", sanitized)

# 4. Multi-delimiter split
tags = re.split(r"[,\\s]+", "python, security   network,audit")
print("Tokens:", tags)`,
        expectedOutput: `Primary phone found: 987-654-3210
All phones: ['987-654-3210', '800-555-0199']
Sanitized text: Call cybersecurity dispatcher at [REDACTED-PHONE] or backup [REDACTED-PHONE].
Tokens: ['python', 'security', 'network', 'audit']`,
        explanation: 'Regular expressions use the raw string prefix r"..." to prevent Python from interpreting backslashes as escape characters.',
        quiz: {
          question: 'What is the fundamental difference between re.match() and re.search()?',
          options: [
            're.match() returns all matches as a list, re.search() returns one',
            're.match() only checks for a match starting at the beginning of the string, while re.search() scans the entire string',
            're.match() works only on integers, re.search() works on strings',
            'There is no difference in Python 3'
          ],
          answerIndex: 1,
          explanation: 're.match() only looks at the start of string (index 0). If the pattern does not match the first character, it returns None. re.search() searches anywhere.'
        }
      },
      {
        id: 'regex-groups',
        moduleId: 'regex-engine',
        title: 'Grouping & Named Groups (?P<name>...)',
        durationMinutes: 12,
        concepts: ['Capturing parentheses ()', 'group(1), group(2)', 'Named groups (?P<key>)', 'groupdict()'],
        slideReference: 'Slide 46 (File, Error & Regex)',
        summary: 'Extract individual components from complex patterns using named capturing groups for self-documenting code.',
        codeSnippet: `import re

# ISO Date string extraction
date_string = "Incident logged: Date: 2026-10-15 Status: Resolved"

# Named group pattern
pattern = r"Date:\\s*(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})"
match = re.search(pattern, date_string)

if match:
    print("Extracted Full Match:", match.group(0))
    print("Year :", match.group("year"))
    print("Month:", match.group("month"))
    print("Day  :", match.group("day"))
    print("Full Dict:", match.groupdict())`,
        expectedOutput: `Extracted Full Match: Date: 2026-10-15
Year : 2026
Month: 10
Day  : 15
Full Dict: {'year': '2026', 'month': '10', 'day': '15'}`,
        explanation: 'Syntax (?P<identifier>pattern) assigns a key to the capturing group, accessible via match.group("identifier") or match.groupdict().',
        quiz: {
          question: 'Which syntax defines a named capturing group in Python regex?',
          options: [
            '(name:pattern)',
            '(?P<name>pattern)',
            '(?<name>pattern)',
            '(:name=pattern:)'
          ],
          answerIndex: 1,
          explanation: 'Python uses the (?P<name>pattern) syntax for named capturing groups.'
        }
      }
    ]
  },
  {
    id: 'functions-args-signatures',
    number: '04',
    title: 'Functions & Variable-Length Arguments',
    subtitle: 'Positional, keyword, default values, *args tuple packing, and **kwargs dict packing.',
    icon: 'tune',
    category: 'core',
    status: 'in_progress',
    progressPercent: 92,
    totalLessons: 6,
    completedLessons: 6,
    description: 'Master flexible function design with positional arguments, keyword arguments, *args, and **kwargs combinations.',
    lessons: [
      {
        id: 'var-length-args',
        moduleId: 'functions-args-signatures',
        title: 'Mastering *args and **kwargs in Python',
        durationMinutes: 12,
        concepts: ['*args as tuple', '**kwargs as dict', 'Order: (pos, *args, **kwargs)', 'flexible APIs'],
        slideReference: 'Slide 14-22 (Functions & Data Structures)',
        summary: 'Learn how Python packs variable positional inputs into tuples (*args) and keyword pairs into dicts (**kwargs).',
        codeSnippet: `# Demonstration of Combined Signatures from Sondos Saif's slides
def profile(role, *skills, **metadata):
    print("Role  :", role)
    print("Skills (*args tuple):", skills)
    print("Metadata (**kwargs dict):", metadata)

# Call with positionals, variable args, and key-values
profile("Security Engineer", "Python", "Networking", "Cryptography",
        level="Senior", remote=True, clearance="Level-3")`,
        expectedOutput: `Role  : Security Engineer
Skills (*args tuple): ('Python', 'Networking', 'Cryptography')
Metadata (**kwargs dict): {'level': 'Senior', 'remote': True, 'clearance': 'Level-3'}`,
        explanation: 'Parameters must be declared in strict order: positional arguments first, then *args, then default arguments, then **kwargs.',
        quiz: {
          question: 'What Python data structure does *args construct inside the function body?',
          options: ['A mutable list', 'An immutable tuple', 'A set of unique arguments', 'A dictionary with indices'],
          answerIndex: 1,
          explanation: '*args groups non-keyword variable arguments into an immutable tuple.'
        }
      }
    ]
  },
  {
    id: 'oop-fundamentals',
    number: '05',
    title: 'OOP Core & Variable Lifecycles',
    subtitle: 'Classes, instance vs class variables, the "self" convention, and memory encapsulation.',
    icon: 'view_in_ar',
    category: 'oop',
    status: 'in_progress',
    progressPercent: 85,
    totalLessons: 7,
    completedLessons: 6,
    description: 'Learn how Python binds instance state with self, and understand differences between local, instance, and class variables.',
    lessons: [
      {
        id: 'self-variable-scopes',
        moduleId: 'oop-fundamentals',
        title: 'The "self" Parameter & Variable Scopes in Classes',
        durationMinutes: 14,
        concepts: ['self convention', 'Local variables vs Instance variables', 'Class variables shared state', 'Car example'],
        slideReference: 'Slide 23-27 (OOP Concepts)',
        summary: 'self binds method calls to the specific instance object. Class variables are shared across all instances, while instance variables are unique per object.',
        codeSnippet: `class Car:
    wheels = 4  # Class variable (shared across all cars)

    def __init__(self, brand, speed):
        self.brand = brand   # Instance variable
        self.speed = speed   # Instance variable

    def accelerate(self, delta):
        temp_delta = delta * 1.1  # Local variable (destroyed when method returns)
        self.speed += int(temp_delta)

    def info(self):
        return f"{self.brand}: speed={self.speed} km/h (wheels={Car.wheels})"

car1 = Car("Porsche", 120)
car2 = Car("Tesla", 100)

car1.accelerate(20)

print(car1.info())
print(car2.info())
print("Wheels shared:", car1.wheels == car2.wheels)`,
        expectedOutput: `Porsche: speed=142 km/h (wheels=4)
Tesla: speed=100 km/h (wheels=4)
Wheels shared: True`,
        explanation: 'Local variables live only during method execution. Instance variables live as long as the object exists. Class variables belong to the class blueprint.',
        quiz: {
          question: 'Is "self" an official reserved Python keyword?',
          options: [
            'Yes, Python will throw a SyntaxError if you use any other identifier',
            'No, self is a universally adopted convention; any valid parameter name works, but using anything else violates PEP 8',
            'Yes, self was introduced in Python 3.8 as a keyword',
            'No, self is only an alias for this'
          ],
          answerIndex: 1,
          explanation: 'self is not a reserved Python keyword, but a very strong convention. While you could technically name it something else, you should never do so.'
        }
      }
    ]
  },
  {
    id: 'inheritance-architectures',
    number: '06',
    title: 'Inheritance Architectures & super()',
    subtitle: 'Single, multiple, multilevel inheritance, method overriding, and parent delegation.',
    icon: 'account_tree',
    category: 'oop',
    status: 'in_progress',
    progressPercent: 75,
    totalLessons: 6,
    completedLessons: 4,
    description: 'Explore IS-A relationships, method overriding, super() call mechanics, and clean class hierarchies.',
    lessons: [
      {
        id: 'inheritance-super-override',
        moduleId: 'inheritance-architectures',
        title: 'Single & Multilevel Inheritance with super()',
        durationMinutes: 13,
        concepts: ['class Sub(Parent)', 'super().method()', 'Method overriding', 'Hierarchy tree'],
        slideReference: 'Slide 28-34 (OOP Concepts)',
        summary: 'Subclasses inherit parent methods and attributes. super() delegates to parent implementations without hardcoding class names.',
        codeSnippet: `class SecurityTool:
    def __init__(self, name):
        self.name = name

    def scan(self):
        return f"[{self.name}] Initiating generic security scan..."

class Firewall(SecurityTool):
    def __init__(self, name, blocked_ports):
        super().__init__(name)
        self.blocked_ports = blocked_ports

    def scan(self):
        # Override parent method while leveraging parent logic
        parent_msg = super().scan()
        return f"{parent_msg}\\n[Firewall] Monitoring ports: {self.blocked_ports}"

fw = Firewall("BorderGuard-1", [22, 23, 8080])
print(fw.scan())`,
        expectedOutput: `[BorderGuard-1] Initiating generic security scan...
[Firewall] Monitoring ports: [22, 23, 8080]`,
        explanation: 'super() avoids hardcoding the parent class name, ensuring smooth multi-tier inheritance and support for cooperative multiple inheritance.',
        quiz: {
          question: 'What is the primary benefit of super().method() over ParentClass.method(self)?',
          options: [
            'super() runs 10x faster in bytecode',
            'super() respects the C3 Method Resolution Order (MRO) dynamically in multiple inheritance',
            'ParentClass.method(self) is illegal in Python',
            'super() eliminates memory allocation'
          ],
          answerIndex: 1,
          explanation: 'super() dynamically respects the MRO chain, which is essential for cooperative multiple inheritance without duplicate base calls.'
        }
      }
    ]
  },
  {
    id: 'polymorphism-interfaces',
    number: '07',
    title: 'Polymorphism, Duck Typing & ABCs',
    subtitle: 'Unified interfaces, Python duck typing, abc.ABC, and @abstractmethod contracts.',
    icon: 'alt_route',
    category: 'oop',
    status: 'in_progress',
    progressPercent: 64,
    totalLessons: 6,
    completedLessons: 3,
    description: 'Enforce contracts using Abstract Base Classes (ABC) or leverage Pythonic duck typing ("if it walks like a duck...").',
    lessons: [
      {
        id: 'polymorphic-security-tools',
        moduleId: 'polymorphism-interfaces',
        title: 'Polymorphic Security Tool Suite with ABC',
        durationMinutes: 16,
        concepts: ['Polymorphism "many forms"', 'abc.ABC & @abstractmethod', 'Duck typing comparison', 'Unified dispatcher'],
        slideReference: 'Slide 35-41, 48-51 (OOP Concepts)',
        summary: 'Enforce that all security scanners implement an analyze() method using abc.ABC, and execute them interchangeably in a unified dispatcher.',
        codeSnippet: `from abc import ABC, abstractmethod

# 1. Abstract Base Class enforcing common interface
class SecurityTool(ABC):
    @abstractmethod
    def analyze(self):
        """Every security tool must implement analyze()"""
        pass

class PortScanner(SecurityTool):
    def analyze(self):
        return "PortScanner: Scanning open TCP/UDP ports..."

class MalwareScanner(SecurityTool):
    def analyze(self):
        return "MalwareScanner: Scanning file signatures for malware..."

class PacketSniffer(SecurityTool):
    def analyze(self):
        return "PacketSniffer: Sniffing live network packets..."

# 2. Polymorphic execution through common interface
tools = [PortScanner(), MalwareScanner(), PacketSniffer()]

print("--- Running Unified Security Pipeline ---")
for tool in tools:
    # Each object responds to analyze() with its specialized behavior
    print(tool.analyze())`,
        expectedOutput: `--- Running Unified Security Pipeline ---
PortScanner: Scanning open TCP/UDP ports...
MalwareScanner: Scanning file signatures for malware...
PacketSniffer: Sniffing live network packets...`,
        explanation: 'Trying to instantiate SecurityTool() directly raises TypeError: Can\'t instantiate abstract class with abstract methods. Subclasses are guaranteed to fulfill the contract.',
        quiz: {
          question: 'What occurs if a subclass of SecurityTool fails to implement the @abstractmethod analyze()?',
          options: [
            'Python will compile fine and return None when analyze() is called',
            'Python will raise a TypeError upon attempting to instantiate the subclass',
            'It will automatically inherit an empty pass function',
            'It will generate a warning in logs only'
          ],
          answerIndex: 1,
          explanation: 'If any @abstractmethod remains unimplemented, Python prevents instantiation of the subclass and raises TypeError.'
        }
      }
    ]
  },
  {
    id: 'diamond-problem-mro',
    number: '08',
    title: 'The Diamond Problem & C3 MRO',
    subtitle: 'Method Resolution Order, C3 linearization algorithm, Class.mro(), and cooperative super().',
    icon: 'hub',
    category: 'advanced',
    status: 'in_progress',
    progressPercent: 45,
    totalLessons: 5,
    completedLessons: 2,
    description: 'Unpack the Diamond inheritance structure and master how Python linearizes ancestors to avoid duplicate executions.',
    lessons: [
      {
        id: 'c3-mro-linearization',
        moduleId: 'diamond-problem-mro',
        title: 'C3 Linearization & Resolving the Diamond Graph',
        durationMinutes: 18,
        concepts: ['Diamond problem graph', 'C3 linearization', 'Class.mro()', 'super() cooperative chain'],
        slideReference: 'Slide 42-47 (OOP Concepts)',
        summary: 'When class D inherits from B and C, both inheriting from A, Python uses C3 MRO to establish a single linear search path: D -> B -> C -> A -> object.',
        codeSnippet: `# The Diamond Problem from Sondos Saif's slides
class A:
    def say(self):
        print("  -> Execution inside A")

class B(A):
    def say(self):
        print("  -> Execution inside B")
        super().say()

class C(A):
    def say(self):
        print("  -> Execution inside C")
        super().say()

class D(B, C):
    def say(self):
        print("  -> Execution inside D")
        super().say()

print("MRO Resolution Chain for D:")
for cls in D.mro():
    print(f"  {cls.__name__}")

print("\\nCalling d = D(); d.say():")
d = D()
d.say()`,
        expectedOutput: `MRO Resolution Chain for D:
  D
  B
  C
  A
  object

Calling d = D(); d.say():
  -> Execution inside D
  -> Execution inside B
  -> Execution inside C
  -> Execution inside A`,
        explanation: 'Because B calls super().say(), Python looks at the MRO of D and calls C, not A directly! This guarantees class A is called exactly once.',
        quiz: {
          question: 'In the diamond inheritance D(B, C) where B(A) and C(A), what is the order returned by D.mro()?',
          options: [
            '[D, A, B, C, object]',
            '[D, B, C, A, object]',
            '[D, B, A, C, A, object]',
            '[D, C, B, A, object]'
          ],
          answerIndex: 1,
          explanation: 'C3 MRO guarantees left-to-right priority (B before C) and resolves shared ancestor A only after all derived classes: D -> B -> C -> A -> object.'
        }
      }
    ]
  },
  {
    id: 'composition-over-inheritance',
    number: '09',
    title: 'Composition Over Inheritance & Delegation',
    subtitle: 'HAS-A vs IS-A design architecture, delegation, and pluggable SecuritySuite components.',
    icon: 'extension',
    category: 'advanced',
    status: 'next_up',
    progressPercent: 30,
    totalLessons: 5,
    completedLessons: 1,
    description: 'Design decoupled systems by assembling behavior through object attributes rather than rigid inheritance trees.',
    lessons: [
      {
        id: 'security-suite-composition',
        moduleId: 'composition-over-inheritance',
        title: 'Building a Pluggable SecuritySuite with Delegation',
        durationMinutes: 15,
        concepts: ['HAS-A relationship', 'Delegation', 'Single Responsibility Principle', 'Hot-swapping components'],
        slideReference: 'Slide 52-57 (OOP Concepts)',
        summary: 'Instead of deep inheritance trees, compose independent components inside a coordinator class. Easily swap modules at runtime.',
        codeSnippet: `class PortScanner:
    def scan(self):
        return "Scanning open ports (80, 443, 22)..."

class MalwareScanner:
    def scan(self):
        return "Scanning filesystem for trojans & malware..."

class VulnerabilityScanner:
    def scan(self):
        return "Scanning CVE database for known vulnerabilities..."

class SecuritySuite:
    """Coordinates security operations through composition (HAS-A)"""
    def __init__(self):
        self.port_scanner = PortScanner()
        self.malware_scanner = MalwareScanner()

    def full_scan(self):
        return [
            self.port_scanner.scan(),
            self.malware_scanner.scan()
        ]

suite = SecuritySuite()
print("Default scan:", suite.full_scan())

# Hot-swap component without modifying SecuritySuite class!
suite.port_scanner = VulnerabilityScanner()
print("\\nAfter component swap:", suite.full_scan())`,
        expectedOutput: `Default scan: ['Scanning open ports (80, 443, 22)...', 'Scanning filesystem for trojans & malware...']

After component swap: ['Scanning CVE database for known vulnerabilities...', 'Scanning filesystem for trojans & malware...']`,
        explanation: 'Composition allows swapping implementations dynamically without touching parent class blueprints or battling the Diamond Problem.',
        quiz: {
          question: 'What is the primary architectural advantage of "Composition (HAS-A)" over "Inheritance (IS-A)"?',
          options: [
            'Inheritance allows multiple parents while composition allows zero',
            'Composition provides loose coupling, hot-swappable components, and avoids brittle deep inheritance hierarchies',
            'Composition uses less memory than an empty class',
            'Composition automatically compiles code to C'
          ],
          answerIndex: 1,
          explanation: 'Composition promotes loose coupling and single responsibility: components can be modified or replaced without side effects across a deep hierarchy.'
        }
      }
    ]
  },
  {
    id: 'dunder-magic-methods',
    number: '10',
    title: 'Dunder Magic Methods & Operator Overload',
    subtitle: '__init__, __str__, __repr__, __len__, __add__, and custom operator behaviors.',
    icon: 'auto_fix_high',
    category: 'oop',
    status: 'next_up',
    progressPercent: 20,
    totalLessons: 6,
    completedLessons: 1,
    description: 'Empower custom classes to integrate natively with Python built-in operators (+, ==, len(), print()).',
    lessons: [
      {
        id: 'dunder-methods-deepdive',
        moduleId: 'dunder-magic-methods',
        title: 'String Representation & Operator Overloading',
        durationMinutes: 14,
        concepts: ['__init__', '__str__ vs __repr__', '__add__ operator +', '__len__ and __eq__'],
        slideReference: 'Slide 58-60 (OOP Concepts)',
        summary: '__str__ is for end-user readable formatting; __repr__ is for developers and debugging. __add__ overloads the + operator.',
        codeSnippet: `class FirewallRule:
    def __init__(self, rule_id, port, description):
        self.rule_id = rule_id
        self.port = port
        self.description = description

    # User-friendly string (print, str())
    def __str__(self):
        return f"Firewall Rule #{self.rule_id}: Port {self.port} ({self.description})"

    # Official developer representation (debug, logs)
    def __repr__(self):
        return f"FirewallRule(rule_id={self.rule_id!r}, port={self.port}, description={self.description!r})"

    # Equality operator (==)
    def __eq__(self, other):
        if not isinstance(other, FirewallRule):
            return False
        return self.port == other.port and self.rule_id == other.rule_id

r1 = FirewallRule(1, 443, "Allow HTTPS")
r2 = FirewallRule(1, 443, "Allow HTTPS")

print("str(r1)  :", str(r1))
print("repr(r1) :", repr(r1))
print("r1 == r2 :", r1 == r2)`,
        expectedOutput: `str(r1)  : Firewall Rule #1: Port 443 (Allow HTTPS)
repr(r1) : FirewallRule(rule_id=1, port=443, description='Allow HTTPS')
r1 == r2 : True`,
        explanation: 'Without __str__ and __repr__, printing an object outputs unhelpful memory addresses like <__main__.FirewallRule object at 0x7f...>.',
        quiz: {
          question: 'What is the distinction between __str__ and __repr__ in Python?',
          options: [
            '__str__ is for integers, __repr__ is for strings',
            '__str__ is designed for end-user readability, while __repr__ is unambiguous and aimed at developers and debugging',
            '__str__ cannot return strings with spaces',
            '__repr__ only works in Python 2'
          ],
          answerIndex: 1,
          explanation: '__str__ provides readable output for human consumption, whereas __repr__ should ideally be an unambiguous representation that could recreate the object.'
        }
      }
    ]
  },
  {
    id: 'security-crypto-builtins',
    number: '11',
    title: 'Core Built-ins & Cryptography (hashlib & base64)',
    subtitle: 'hashlib.sha256, base64 encode/decode, lambdas, and iterator transformations.',
    icon: 'security',
    category: 'advanced',
    status: 'next_up',
    progressPercent: 15,
    totalLessons: 5,
    completedLessons: 0,
    description: 'Explore Python security functions, SHA-256 password hashing, base64 data encoding, and functional lambda best practices.',
    lessons: [
      {
        id: 'crypto-builtins',
        moduleId: 'security-crypto-builtins',
        title: 'Cryptographic Hashing & Base64 Encoding',
        durationMinutes: 12,
        concepts: ['hashlib.sha256()', 'hexdigest()', 'base64.b64encode/decode', 'secure data handling'],
        slideReference: 'Slide 17 (Security-Related Built-ins)',
        summary: 'Generate deterministic cryptographic hashes with hashlib, and convert binary payloads to printable ASCII strings using base64.',
        codeSnippet: `import hashlib
import base64

# 1. SHA-256 Hashing
secret_payload = b"admin_pass_2026"
hash_obj = hashlib.sha256(secret_payload)
hex_digest = hash_obj.hexdigest()
print("SHA-256 Digest:", hex_digest)

# 2. Base64 Encoding and Decoding
raw_bytes = b"Cybersecurity Invariant Check OK"
encoded_b64 = base64.b64encode(raw_bytes)
print("Base64 Encoded:", encoded_b64.decode('utf-8'))

decoded_bytes = base64.b64decode(encoded_b64)
print("Decoded String:", decoded_bytes.decode('utf-8'))`,
        expectedOutput: `SHA-256 Digest: 5698b64e55e8fd0117b3f46f3d9d5926dd9c9b1397a06c74ad6d51c0800c14b3
Base64 Encoded: Q3liZXJzZWN1cml0eSBJbnZhcmlhbnQgQ2hlY2sgT0s=
Decoded String: Cybersecurity Invariant Check OK`,
        explanation: 'Cryptographic hash functions are one-way: you cannot reverse a SHA-256 hash to find the original password. Base64 is reversible encoding, not encryption.',
        quiz: {
          question: 'Can a SHA-256 hash be decoded back into its original plaintext string using hashlib?',
          options: [
            'Yes, with hashlib.sha256_decode()',
            'No, cryptographic hashes are irreversible mathematical one-way functions',
            'Only if the string is under 32 characters',
            'Yes, by passing the reverse salt'
          ],
          answerIndex: 1,
          explanation: 'Hashing is fundamentally one-way (irreversible), unlike encoding (like base64) which is bi-directional.'
        }
      }
    ]
  },
  {
    id: 'surge-deployment-hub',
    number: '12',
    title: 'Surge.sh Deployment & Free Custom Domains',
    subtitle: 'Production static export, 200.html SPA routing, CNAME config, and mobile performance.',
    icon: 'cloud_upload',
    category: 'advanced',
    status: 'in_progress',
    progressPercent: 100,
    totalLessons: 4,
    completedLessons: 4,
    description: 'Complete hands-on workflow to deploy this high-performance academy on Surge.sh free domain or custom domain with zero cost.',
    lessons: [
      {
        id: 'surge-quick-deploy',
        moduleId: 'surge-deployment-hub',
        title: 'One-Command Free Hosting with Surge.sh',
        durationMinutes: 10,
        concepts: ['surge CLI', 'dist static folder', '200.html client routing', 'free subdomain *.surge.sh'],
        slideReference: 'Deployment Module & Hosting Architecture',
        summary: 'Learn how to publish this application to your free domain on surge.sh (e.g., pyadvance-alex.surge.sh) in under 60 seconds with unlimited bandwidth.',
        codeSnippet: `# Step 1: Install Surge globally
# npm install --global surge

# Step 2: Build production bundle
# npm run build

# Step 3: Deploy to your custom free domain!
# surge dist/app/browser my-python-oop-academy.surge.sh

print("Deployment Steps Summary:")
print("1. Build static bundle: dist/app/browser")
print("2. Ensure 200.html exists for Angular routing")
print("3. Add CNAME file with your domain")
print("4. Run: surge <directory> <domain>")
print("Result: Live instantly with SSL at https://my-python-oop-academy.surge.sh")`,
        expectedOutput: `Deployment Steps Summary:
1. Build static bundle: dist/app/browser
2. Ensure 200.html exists for Angular routing
3. Add CNAME file with your domain
4. Run: surge <directory> <domain>
Result: Live instantly with SSL at https://my-python-oop-academy.surge.sh`,
        explanation: 'Surge.sh is the fastest static hosting service for single-page applications. Copying index.html to 200.html ensures that direct URL refreshes don\'t return 404 errors.',
        quiz: {
          question: 'Why is adding a 200.html file essential when deploying a Single Page App (Angular) to Surge.sh?',
          options: [
            'Surge requires it for billing verification',
            'It serves as the catch-all HTML fallback so deep routes (like /curriculum or /playground) reload without 404 errors',
            'It is where Google Analytics must be injected',
            'Surge refuses to deploy if 200.html is missing'
          ],
          answerIndex: 1,
          explanation: 'On Surge.sh, any request that doesn\'t match an exact static file serves 200.html with HTTP status 200, allowing the client-side router to handle the route.'
        }
      }
    ]
  }
];

export const INITIAL_SKILLS: { name: string; level: string; percentage: number; color: string }[] = [
  { name: 'File Streams & Seek Buffers', level: 'Strong', percentage: 84, color: '#0D9488' },
  { name: 'Functions & *args / **kwargs', level: 'Mastered', percentage: 92, color: '#059669' },
  { name: 'OOP Encapsulation & Scopes', level: 'Strong', percentage: 85, color: '#0D9488' },
  { name: 'JSON & Custom Class Serialization', level: 'In progress', percentage: 78, color: '#F59E0B' },
  { name: 'Inheritance & super() Delegation', level: 'In progress', percentage: 75, color: '#F59E0B' },
  { name: 'Polymorphism & Abstract Base Classes', level: 'In progress', percentage: 64, color: '#F59E0B' },
  { name: 'Regex Pattern Matching & Groups', level: 'In progress', percentage: 65, color: '#F59E0B' },
  { name: 'C3 MRO & The Diamond Problem', level: 'Starting', percentage: 45, color: '#EA580C' },
  { name: 'Composition Over Inheritance', level: 'Starting', percentage: 30, color: '#EA580C' },
  { name: 'Dunder Magic Methods & Overloading', level: 'Queued', percentage: 20, color: '#64748B' },
  { name: 'Surge.sh Deployment & Custom Domain', level: 'Ready', percentage: 100, color: '#10B981' }
];

export const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    title: 'Completed: Memory Byte Seeking with seek(-7, 2)',
    timestamp: 'Today, 9:42 AM',
    type: 'completed' as const,
    icon: 'check_circle'
  },
  {
    id: 'act-2',
    title: 'Ran SecuritySuite Composition Sandbox',
    timestamp: 'Yesterday, 4:18 PM',
    type: 'run' as const,
    icon: 'play_circle'
  },
  {
    id: 'act-3',
    title: 'Earned: C3 MRO Linearization Master',
    timestamp: 'Yesterday, 4:04 PM',
    type: 'earned' as const,
    icon: 'emoji_events'
  },
  {
    id: 'act-4',
    title: 'Saved: custom_person_serializer.py',
    timestamp: 'Monday, 11:26 AM',
    type: 'saved' as const,
    icon: 'bookmark'
  }
];
