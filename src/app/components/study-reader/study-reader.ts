import { ChangeDetectionStrategy, Component, inject, signal, computed, effect, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LearningStateService } from '../../services/learning-state.service';
import { SyntaxHighlighter } from '../../services/syntax-highlighter';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';

export interface StudyDocument {
  id: string;
  title: string;
  fileName: string;
  category: 'Academic Lecture' | 'User Upload' | 'Notes' | 'Code Lab';
  fileType: 'markdown' | 'python' | 'text' | 'json' | 'pdf';
  content: string;
  sizeBytes: number;
  uploadedAt: string;
  isCustom: boolean;
  author?: string;
  summary?: string;
  keyTakeaways?: string[];
}

const STORAGE_KEY = 'pyadvance_study_library';
const ACTIVE_DOC_ID_KEY = 'pyadvance_study_active_id';

// Valid, self-contained PDF-1.7 academic lecture document in base64 format
const SAMPLE_ACADEMIC_PDF_B64 = 
  'data:application/pdf;base64,JVBERi0xLjcKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA0IDAgUiAvRjIgNSAwIFIgPj4gPj4gL0NvbnRlbnRzIDYgMCBSID4+CmVuZG9iago0IDAgb2JqCjw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkID4+CmVuZG9iago1IDAgb2JqCjw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYSA+PgplbmRvYmoKNiAwIG9iago8PCAvTGVuZ3RoIDEyMzIgPj4Kc3RyZWFtCkJUCi9GMSAxOCBUZgo1MCA3MjAgVGQKKFB5QWR2YW5jZSBBY2FkZW15IC0gQWR2YW5jZWQgUHl0aG9uICYgT09QIEFyY2hpdGVjdHVyZSkgVGoKL0YxIDEyIFRmCjAgLTI2IFRkCihPZmZpY2lhbCBBY2FkZW1pYyBMZWN0dXJlIFNsaWRlcyAtIEN5YmVyc2VjdXJpdHkgJiBJVCBFbmdpbmVlcmluZykgVGoKL0YyIDEwIFRmCjAgLTE4IFRkCihDb3Vyc2UgSW5zdHJ1Y3RvcjogVFxcIFNvbmRvcyBTYWlmIHwgQWNhZGVtaWMgVGVybTogMjAyNikgVGoKL0YxIDEyIFRmCjAgLTM2IFRkCigxLiBDb3JlIFByaW5jaXBsZXM6IEMzIE1STyBMaW5lYXJpemF0aW9uIEFsZ29yaXRobSkgVGoKL0YyIDEwIFRmCjAgLTE2IFRkCiggICAtIFN5bGxhYnVzIFNsaWRlcyA0Mi00NjogUmVzb2x2aW5nIGRpYW1vbmQgbXVsdGlwbGUgaW5oZXJpdGFuY2UgaGllcmFyY2hpZXMuKSBUagowIC0xNSBUZAooICAgLSBJbnZhcmlhbnQ6IExvY2FsIFByZWNlZGVuY2UgT3JkZXIgYW5kIE1vbm90b25pY2l0eSBndWFyYW50ZWUuKSBUagowIC0xNSBUZAooICAgLSBjb29wZXJhdGl2ZSBzdXBlcigpIGRpc3BhdGNoIGZvbGxvd3MgcnVudGltZSBzZWxmLl9fbXJvX18uKSBUagowIC0yOCBUZAooMi4gTG93LUxldmVsIEJpbmFyeSBTdHJlYW0gUG9pbnRlciBOYXZpZ2F0aW9uOiBzZWVrKCkgJiB0ZWxsKCkpIFRqCi9GMiAxMCBUZgowIC0xNiBUZAooICAgLSBTeWxsYWJ1cyBTbGlkZXMgMTgtMjQ6IHdoZW5jZT0wIChTRUVLX1NFVCksIHdoZW5jZT0xIChTRUVLX0NVUiksIHdoZW5jZT0yIChTRUVLX0VORCkuKSBUagowIC0xNSBUZAooICAgLSBCaW5hcnkgcGF5bG9hZCBvZmZzZXRzLCBmaXhlZC13aWR0aCBwYWNrZXQgc2xpY2luZywgYW5kIGJ1ZmZlciByZXVzZS4pIFRqCjAgLTI4IFRkCigzLiBPT1AgQ29tcG9zaXRpb24gT3ZlciBJbmhlcml0YW5jZTogSEFTLUEgRGVmZW5zZSBJbiBEZXB0aCkgVGoKL0YyIDEwIFRmCjAgLTE2IFRkCiggICAtIER5bmFtaWMgc3dhcHBpbmcgb2Ygc2VjdXJpdHkgZGVjb2RlcnMgd2l0aG91dCBicml0dGxlIGJhc2UgY2xhc3MgY291cGxpbmcuKSBUagowIC0yOCBUZAooNC4gQ3J5cHRvZ3JhcGhpYyBCdWlsdC1pbnM6IGhhc2hsaWIgKFNIQS0yNTYpICYgYmFzZTY0IFByb3RvY29sKSBUagovRjIgMTAgVGYKMCAtMTYgVGQKKCAgIC0gTmV0d29yay1zYWZlIHBheWxvYWQgdHJhbnNwb3J0LCBjb25zdGFudC10aW1lIEhNQUMgZGlnZXN0IHZlcmlmaWNhdGlvbi4pIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMjUxIDAwMDAwIG4gCjAwMDAwMDAzMjYgMDAwMDAgbiAKMDAwMDAwMDM5NiAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDcgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjE2ODAKJSVFT0YK';

const INITIAL_ACADEMIC_LECTURES: StudyDocument[] = [
  {
    id: 'lecture-00-pdf-slides',
    title: 'Lecture Slides (PDF): Advanced Python & Cybersecurity OOP Syllabus',
    fileName: 'sondos_saif_advanced_python_slides.pdf',
    category: 'Academic Lecture',
    fileType: 'pdf',
    uploadedAt: '2026-10-02',
    isCustom: false,
    author: 'T\\ Sondos Saif (Course Syllabus Slides)',
    sizeBytes: 15420,
    summary: 'Official PDF Lecture slides covering OOP Architecture, C3 MRO, Stream I/O, Dunder Protocols, and Cryptography Built-ins rendered with high-DPI in-canvas PDF.js engine.',
    keyTakeaways: [
      'High-DPI in-canvas PDF rendering bypassing Chrome sandboxed iframe blocks completely.',
      'Includes page navigation (Page 1 of N), zoom scaling (50% - 250%), and rotation.',
      'Triple view mode: High-Res Canvas Reader, Extracted Searchable Text, and Stream Forensics.'
    ],
    content: SAMPLE_ACADEMIC_PDF_B64
  },
  {
    id: 'lecture-01-c3-mro',
    title: 'Lecture 01: C3 MRO & The Diamond Inheritance Problem',
    fileName: 'lecture_01_c3_mro.md',
    category: 'Academic Lecture',
    fileType: 'markdown',
    uploadedAt: '2026-10-01',
    isCustom: false,
    author: 'T\\ Sondos Saif (Course Syllabus Slides 42-46)',
    sizeBytes: 4120,
    summary: 'Comprehensive academic breakdown of Method Resolution Order (MRO) in Python, the C3 Linearization algorithm, and super() cooperative dispatch in diamond inheritance hierarchies.',
    keyTakeaways: [
      'In Python 3, all classes inherit from object (New-style classes using C3 MRO).',
      'The diamond problem occurs when class D inherits from B and C, both inheriting from A.',
      'C3 ensures two invariants: Local Precedence Order and Monotonicity.',
      'super() does not invoke the immediate parent; it follows the MRO list of the runtime type self.'
    ],
    content: `# Lecture 01: C3 MRO & The Diamond Problem

**Instructor:** T\\ Sondos Saif  
**Course Module:** Advanced Python & OOP Architecture  
**Syllabus References:** Slides 42–46

---

## 1. Executive Overview

In object-oriented programming, **multiple inheritance** allows a derived class to inherit attributes and methods from more than one base class. While powerful, it introduces the notorious **Diamond Problem** (also known as the "Deadly Diamond of Death").

Python resolved this ambiguity in Python 2.3+ by adopting the **C3 Method Resolution Order (C3 MRO)** algorithm, designed by Barrett et al. for the Dylan language.

\`\`\`
       [ A ]
      /     \\
   [ B ]   [ C ]
      \\     /
       [ D ]
\`\`\`

---

## 2. The C3 Linearization Formula

The linearization of class $C$ with parents $B_1, B_2, \\dots, B_n$ is defined by:

$$L[C] = C + \\text{merge}(L[B_1], L[B_2], \\dots, L[B_n], B_1 \\dots B_n)$$

### The Merge Algorithm Rules:
1. Look at the head of the first list $L[B_1]$.
2. If this head is **not** in the tail of any other list, add it to the linearization of $C$ and remove it from all candidate lists.
3. Otherwise, look at the head of the next list. Repeat until all candidate lists are exhausted.
4. If no good head can be found, Python raises a **\`TypeError: Cannot create a consistent method resolution order (MRO)\`**.

---

## 3. Reference Implementation & Step-by-Step Trace

Let us examine the canonical diamond scenario:

\`\`\`python
class A:
    def execute(self):
        print("A: Base security invariant verified.")

class B(A):
    def execute(self):
        print("B: Enforcing network access controls.")
        super().execute()

class C(A):
    def execute(self):
        print("C: Enforcing cryptographic signature check.")
        super().execute()

class D(B, C):
    def execute(self):
        print("D: Initiating unified defense pipeline.")
        super().execute()
\`\`\`

### C3 Evaluation for Class D:
1. $L[A] = [A, \\text{object}]$
2. $L[B] = [B, A, \\text{object}]$
3. $L[C] = [C, A, \\text{object}]$
4. $L[D] = D + \\text{merge}(L[B], L[C], [B, C])$
   - $= D + \\text{merge}([B, A, O], [C, A, O], [B, C])$
   - Head $B$ is candidate: not in tails $\\Rightarrow$ select $B$.
   - Remainder: $\\text{merge}([A, O], [C, A, O], [C])$
   - Head $A$ is in tail of $[C, A, O]$ $\\Rightarrow$ skip $A$!
   - Next list head is $C$: not in tails $\\Rightarrow$ select $C$.
   - Next select $A$, then $\\text{object}$.
5. **Final MRO for D:** \`[D, B, C, A, object]\`

---

## 4. Key Takeaways & Exam Checklist
* Never assume \`super()\` calls the direct parent class named in the header.
* In \`class D(B, C)\`, \`B.execute()\` calls \`C.execute()\` via \`super()\`, NOT \`A\`!
* Call \`D.mro()\` or \`D.__mro__\` in the Python REPL to inspect the exact linearization tuple.`
  },
  {
    id: 'lecture-02-file-seek-tell',
    title: 'Lecture 02: Binary File Streams, Stream Pointers & seek()/tell() Modes',
    fileName: 'lecture_02_stream_pointers.md',
    category: 'Academic Lecture',
    fileType: 'markdown',
    uploadedAt: '2026-10-01',
    isCustom: false,
    author: 'T\\ Sondos Saif (Course Syllabus Slides 18-24)',
    sizeBytes: 3890,
    summary: 'Exhaustive examination of stream pointer manipulation in POSIX and Python file handling, binary vs text mode seek constraints, whence offsets (0, 1, 2), and memory buffer flushing.',
    keyTakeaways: [
      'f.tell() returns the current integer byte offset from the start of the file.',
      'f.seek(offset, whence) accepts whence=0 (SEEK_SET), whence=1 (SEEK_CUR), whence=2 (SEEK_END).',
      'In Python 3 text mode (\'r\'), nonzero seeks relative to whence=1 or whence=2 are illegal.',
      'Always open with binary mode (\'rb\') when performing negative or relative seeks.'
    ],
    content: `# Lecture 02: Binary File Streams, Stream Pointers & seek()/tell() Modes

**Instructor:** T\\ Sondos Saif  
**Course Module:** Low-Level I/O & Memory Safety  
**Syllabus References:** Slides 18–24

---

## 1. Operating System File Pointers

Every active file descriptor opened by the operating system kernel maintains a cursor called the **file position pointer**. 

* Reading $N$ bytes increments the pointer by $N$.
* Writing $N$ bytes increments the pointer by $N$.
* The pointer can be queried via \`tell()\` and repositioned using \`seek()\`.

---

## 2. Whence Reference Modes

The \`f.seek(offset, whence)\` method accepts two arguments:
* \`offset\`: Number of bytes to move (positive or negative).
* \`whence\`: Anchor point in the file stream:
  * \`0\` (\`os.SEEK_SET\`): Offset relative to the **beginning** of the file (default).
  * \`1\` (\`os.SEEK_CUR\`): Offset relative to the **current position**.
  * \`2\` (\`os.SEEK_END\`): Offset relative to the **end** of the file.

\`\`\`python
# Creating sample binary stream
with open("audit_log.bin", "wb") as f:
    f.write(b"HEADER_V2|PAYLOAD_SHA256_VERIFIED|FOOTER_OK")

# Reading with seek navigation
with open("audit_log.bin", "rb") as f:
    # 1. Inspect initial pointer
    print("Initial Tell:", f.tell()) # Output: 0

    # 2. Seek 10 bytes forward from start
    f.seek(10, 0)
    print("Offset 10 Read:", f.read(7)) # Output: b'PAYLOAD'
    print("Pointer after read:", f.tell()) # Output: 17

    # 3. Read last 9 bytes before EOF (using whence=2)
    f.seek(-9, 2)
    print("Trailer Read (-9, 2):", f.read()) # Output: b'FOOTER_OK'
\`\`\`

---

## 3. Strict Python 3 Constraint: Text vs Binary Mode

> **Critical Rule:** In Python 3, opening a file in standard text mode (\`'r'\`) restricts \`seek()\`:
> * Only seeks from the beginning (\`whence=0\`) are allowed.
> * The only allowed call with \`whence=2\` in text mode is \`seek(0, 2)\` (jumping to end).
> * Calling \`seek(-10, 2)\` in text mode throws:
>   \`io.UnsupportedOperation: can't do nonzero end-relative seeks\`

---

## 4. Cybersecurity Invariant: File Flush & Sync
When writing security audit trails or encryption keys to disk, Python caches writes in a userspace buffer. 
* Call \`f.flush()\` to force userspace buffer transmission to OS kernel.
* Call \`os.fsync(f.fileno())\` to guarantee physical non-volatile storage commit before process termination.`
  },
  {
    id: 'lecture-03-composition-vs-inheritance',
    title: 'Lecture 03: Composition Over Inheritance (HAS-A) in Security Architecture',
    fileName: 'lecture_03_composition_patterns.md',
    category: 'Academic Lecture',
    fileType: 'markdown',
    uploadedAt: '2026-10-01',
    isCustom: false,
    author: 'T\\ Sondos Saif (Course Syllabus Slides 30-36)',
    sizeBytes: 3740,
    summary: 'Analysis of the "Favor Object Composition over Class Inheritance" architectural principle, preventing brittle base class anti-patterns in enterprise security pipelines.',
    keyTakeaways: [
      'Inheritance creates a tight coupling (IS-A relationship) that is fixed at compile time.',
      'Composition creates a loose coupling (HAS-A relationship) allowing runtime dynamic swaps.',
      'In security tools, analyzers should be injected into a pipeline rather than sub-classed.'
    ],
    content: `# Lecture 03: Composition Over Inheritance (HAS-A)

**Instructor:** T\\ Sondos Saif  
**Course Module:** Software Design Patterns in Python  
**Syllabus References:** Slides 30–36

---

## 1. The Architectural Problem with Deep Inheritance

While inheritance is taught early in OOP courses, enterprise systems often suffer from **deep inheritance trees**:
1. Changes to a base class propagate unpredictably down all derived classes ("Fragile Base Class" problem).
2. Subclasses inherit methods they do not need, violating the **Interface Segregation Principle (ISP)**.
3. Behavior cannot be changed dynamically at runtime.

---

## 2. The HAS-A Composition Model

Under composition, a composite class holds references to component objects and delegates tasks to them.

\`\`\`python
class PortScanner:
    def scan(self, target):
        return f"PortScan({target}): Ports 80, 443 open"

class VulnerabilityScanner:
    def scan(self, target):
        return f"VulnScan({target}): Zero known CVEs"

class SecuritySuite:
    def __init__(self, target, analyzers):
        self.target = target
        self.analyzers = analyzers # HAS-A relationship

    def execute_pipeline(self):
        results = []
        for analyzer in self.analyzers:
            results.append(analyzer.scan(self.target))
        return results

# Runtime flexibility:
suite = SecuritySuite("192.168.1.100", [PortScanner(), VulnerabilityScanner()])
print(suite.execute_pipeline())
\`\`\`

---

## 3. Comparison Matrix

| Attribute | Inheritance (IS-A) | Composition (HAS-A) |
| :--- | :--- | :--- |
| **Coupling** | High / Rigid | Low / Flexible |
| **Modification Time** | Compile / Declaration time | Runtime dynamically |
| **Encapsulation** | Breaks encapsulation (White-box reuse) | Preserves encapsulation (Black-box reuse) |
| **Testing** | Difficult to isolate base | Trivial to mock/stub components |`
  },
  {
    id: 'lecture-04-dunder-methods',
    title: 'Lecture 04: Dunder Protocols & Operator Overloading (__str__, __repr__, __eq__)',
    fileName: 'lecture_04_dunder_protocols.md',
    category: 'Academic Lecture',
    fileType: 'markdown',
    uploadedAt: '2026-10-01',
    isCustom: false,
    author: 'T\\ Sondos Saif (Course Syllabus Slides 50-58)',
    sizeBytes: 3950,
    summary: 'The Python Data Model: Implementing dunder methods (__init__, __str__, __repr__, __eq__, __hash__) to build first-class Python objects with natural syntax.',
    keyTakeaways: [
      '__str__ provides readable representation for end users; __repr__ provides unambiguous code representation for developers.',
      'If __str__ is missing, Python falls back to __repr__.',
      'Implementing __eq__ requires consistent type checking (isinstance).',
      'Overriding __eq__ disables default __hash__ in Python 3 unless explicitly defined.'
    ],
    content: `# Lecture 04: Dunder Protocols & Operator Overloading

**Instructor:** T\\ Sondos Saif  
**Course Module:** Python Data Model & Metaprogramming  
**Syllabus References:** Slides 50–58

---

## 1. What are Dunder Methods?

**Dunder** (Double Underscore) methods allow custom classes to hook into Python's built-in operators and protocols.

---

## 2. __str__ vs __repr__

\`\`\`python
class FirewallRule:
    def __init__(self, rule_id: int, port: int, action: str):
        self.rule_id = rule_id
        self.port = port
        self.action = action

    def __str__(self) -> str:
        # Readable display for operators & dashboards
        return f"Rule #{self.rule_id}: {self.action} on port {self.port}"

    def __repr__(self) -> str:
        # Unambiguous constructor representation for debuggers
        return f"FirewallRule(rule_id={self.rule_id!r}, port={self.port!r}, action={self.action!r})"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, FirewallRule):
            return False
        return self.rule_id == other.rule_id and self.port == other.port and self.action == other.action
\`\`\`

---

## 3. The Equality & Hashing Contract

> **Golden Rule:** If two objects are equal according to \`__eq__\`, they **must** have identical \`__hash__\` return values if they are to be stored in sets or as dictionary keys.`
  },
  {
    id: 'lecture-05-regex-named-groups',
    title: 'Lecture 05: Regular Expressions with Named Capture Groups in SIEM Auditing',
    fileName: 'lecture_05_regex_named_groups.md',
    category: 'Academic Lecture',
    fileType: 'markdown',
    uploadedAt: '2026-10-01',
    isCustom: false,
    author: 'T\\ Sondos Saif (Course Syllabus Slides 62-68)',
    sizeBytes: 3620,
    summary: 'Parsing high-throughput security event logs using Python re module with named groups (?P<key>), preventing ReDoS, and exporting clean dictionary records via match.groupdict().',
    keyTakeaways: [
      'Syntax: (?P<name>pattern) defines a named capture group in Python regex.',
      'match.groupdict() outputs a clean Python dictionary with all named tokens.',
      'Use raw strings r"..." to avoid double backslash escaping in regex expressions.'
    ],
    content: `# Lecture 05: Regular Expressions with Named Capture Groups

**Instructor:** T\\ Sondos Saif  
**Course Module:** Security Analytics & String Processing  
**Syllabus References:** Slides 62–68

---

## 1. Syntax of Named Groups

In security monitoring (SIEM/SOC), logs arrive as unstructured strings. Python's \`re\` engine provides named capture groups:

\`\`\`python
import re

log_line = "ALERT [2026-10-15 14:22:01] SRC=192.168.1.50 DST=10.0.0.1 PROTO=TCP ACTION=BLOCK"

pattern = re.compile(
    r"ALERT \\[(?P<timestamp>[^\\]]+)\\] "
    r"SRC=(?P<src_ip>[\\d.]+) "
    r"DST=(?P<dst_ip>[\\d.]+) "
    r"PROTO=(?P<protocol>\\w+) "
    r"ACTION=(?P<action>\\w+)"
)

match = pattern.search(log_line)
if match:
    data = match.groupdict()
    print("Parsed Event:", data)
    print("Threat Source IP:", data["src_ip"])
\`\`\``
  },
  {
    id: 'lecture-06-crypto-builtins',
    title: 'Lecture 06: Python Cryptographic Built-ins: hashlib & base64 Invariants',
    fileName: 'lecture_06_crypto_builtins.py',
    category: 'Academic Lecture',
    fileType: 'python',
    uploadedAt: '2026-10-01',
    isCustom: false,
    author: 'T\\ Sondos Saif (Course Syllabus Slides 72-78)',
    sizeBytes: 3410,
    summary: 'Executable Python implementation demonstrating SHA-256 cryptographic hashing, salt concatenation, base64 payload transport, and constant-time HMAC digest verification.',
    keyTakeaways: [
      'hashlib.sha256() requires bytes inputs, never raw strings (encode with utf-8).',
      'Base64 is an encoding format, NOT encryption; it ensures safe ASCII transport over network protocols.',
      'Always use hmac.compare_digest() to mitigate timing side-channel attacks during token comparisons.'
    ],
    content: `# =====================================================================
# Lecture 06: Python Cryptographic Built-ins (hashlib & base64)
# Academic Reference: T\\ Sondos Saif - Cybersecurity Engineering
# =====================================================================

import hashlib
import base64
import hmac

def generate_secure_audit_token(secret_key: bytes, user_id: str, action: str) -> dict:
    """
    Constructs a tamper-proof audit verification token.
    Uses SHA-256 for cryptographic digest and Base64 for clean network transport.
    """
    # 1. Prepare payload string & convert to bytes
    raw_payload = f"USER={user_id}&ACTION={action}".encode("utf-8")
    
    # 2. Compute SHA-256 Digest
    hasher = hashlib.sha256()
    hasher.update(secret_key)
    hasher.update(raw_payload)
    digest_hex = hasher.hexdigest()
    
    # 3. Base64 Encode payload for network transport
    b64_payload = base64.b64encode(raw_payload).decode("ascii")
    
    # 4. Generate HMAC signature for zero-trust authenticity
    signature = hmac.new(secret_key, raw_payload, hashlib.sha256).hexdigest()
    
    return {
        "payload_b64": b64_payload,
        "digest_sha256": digest_hex,
        "hmac_signature": signature
    }

def verify_token(secret_key: bytes, token_dict: dict) -> bool:
    """
    Validates token payload against HMAC signature using constant-time comparison.
    """
    raw_payload = base64.b64decode(token_dict["payload_b64"].encode("ascii"))
    expected_sig = hmac.new(secret_key, raw_payload, hashlib.sha256).hexdigest()
    
    # Constant-time comparison prevents timing side-channel attacks
    return hmac.compare_digest(token_dict["hmac_signature"], expected_sig)

if __name__ == "__main__":
    SERVER_SECRET = b"K3y_SondosSaif_Cyber2026_SecureInvariant"
    
    token = generate_secure_audit_token(SERVER_SECRET, "analyst_omar", "EXPORT_DATABASE")
    print("--- Generated Security Token ---")
    for k, v in token.items():
        print(f"{k}: {v}")
        
    is_valid = verify_token(SERVER_SECRET, token)
    print("\\nVerification Result:", "VALID TOKEN (PASS)" if is_valid else "TAMPERED TOKEN (FAIL)")
`
  }
];

@Component({
  selector: 'app-study-reader',
  imports: [CommonModule, FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col min-h-[calc(100vh-5rem)] w-full bg-white dark:bg-[#080E13] text-slate-900 dark:text-slate-100 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
      <!-- 1. Dedicated Study Topbar (Small buttons, filesbar menu, upload, download, delete from localStorage) -->
      <header class="px-3 sm:px-5 py-2.5 bg-slate-50/95 dark:bg-[#0C151B]/95 border-b border-slate-200 dark:border-slate-800/90 flex flex-wrap items-center justify-between gap-2.5 sticky top-0 z-20 backdrop-blur-md">
        <!-- Left: Menu Filesbar Handling / Dropdown Selector -->
        <div class="flex items-center gap-2 min-w-0">
          <!-- Back button to return to Academy -->
          <button
            type="button"
            (click)="state.setView('curriculum')"
            title="Return to Curriculum"
            class="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors shrink-0">
            <mat-icon class="text-base leading-none">arrow_back</mat-icon>
          </button>

          <!-- Filesbar Menu Trigger Button -->
          <div class="relative">
            <button
              type="button"
              (click)="isFilesMenuOpen.set(!isFilesMenuOpen())"
              [class]="isFilesMenuOpen()
                ? 'px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all ring-2 ring-purple-400/40'
                : 'px-3 py-1.5 rounded-xl bg-white dark:bg-[#121E26] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 font-semibold text-xs flex items-center gap-2 transition-all shadow-xs'"
              title="Open Lectures & Files Menu to choose documents">
              <mat-icon class="text-sm leading-none" [class]="isPdfDoc() ? 'text-rose-400' : 'text-purple-500 dark:text-purple-300'">
                {{ isPdfDoc() ? 'picture_as_pdf' : 'menu_book' }}
              </mat-icon>
              <span class="truncate max-w-[160px] sm:max-w-[260px] font-mono">{{ activeDoc().fileName }}</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded-full font-mono hidden md:inline" [class]="isPdfDoc() ? 'bg-rose-500/20 text-rose-300' : 'bg-purple-500/20 text-purple-300'">
                {{ isPdfDoc() ? 'PDF' : documents().length + ' docs' }}
              </span>
              <mat-icon class="text-xs text-slate-400 leading-none">{{ isFilesMenuOpen() ? 'expand_less' : 'expand_more' }}</mat-icon>
            </button>

            <!-- Dropdown Filesbar Menu -->
            @if (isFilesMenuOpen()) {
              <div class="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0F1B22] border border-slate-200 dark:border-slate-700/80 shadow-2xl z-50 p-3 space-y-2.5 text-xs animate-in fade-in zoom-in-95">
                <div class="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                  <div class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <mat-icon class="text-sm text-purple-400">folder</mat-icon>
                    <span>Lectures &amp; Files Library</span>
                  </div>
                  <span class="text-[11px] text-slate-400 font-mono">{{ documents().length }} items</span>
                </div>

                <!-- Search Files Input -->
                <div class="relative">
                  <mat-icon class="absolute left-2.5 top-2 text-slate-400 text-xs">search</mat-icon>
                  <input
                    type="text"
                    [(ngModel)]="searchFileFilter"
                    placeholder="Filter files by name or topic..."
                    class="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-purple-500" />
                </div>

                <!-- Document List in Menu -->
                <div class="max-h-72 overflow-y-auto space-y-1 pr-1">
                  @for (doc of filteredDocuments(); track doc.id) {
                    <button
                      type="button"
                      (click)="selectDocument(doc)"
                      [class]="activeDoc().id === doc.id
                        ? 'w-full text-left p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-500/40 text-purple-900 dark:text-purple-200 cursor-pointer flex items-center justify-between gap-2 transition-colors'
                        : 'w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 cursor-pointer flex items-center justify-between gap-2 transition-colors'">
                      <div class="min-w-0 flex items-center gap-2">
                        <mat-icon class="text-sm shrink-0" [class]="doc.fileType === 'pdf' ? 'text-rose-400' : (doc.fileType === 'python' ? 'text-teal-400' : 'text-purple-400')">
                          {{ doc.fileType === 'pdf' ? 'picture_as_pdf' : (doc.fileType === 'python' ? 'code' : 'article') }}
                        </mat-icon>
                        <div class="truncate">
                          <div class="font-semibold text-xs truncate">{{ doc.title }}</div>
                          <div class="text-[10px] text-slate-400 font-mono truncate">{{ doc.fileName }} &bull; {{ (doc.sizeBytes / 1024).toFixed(1) }} KB</div>
                        </div>
                      </div>

                      @if (doc.fileType === 'pdf') {
                        <span class="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold shrink-0">
                          PDF
                        </span>
                      } @else if (doc.isCustom) {
                        <span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold shrink-0">
                          LOCAL
                        </span>
                      }
                    </button>
                  }
                  @if (filteredDocuments().length === 0) {
                    <div class="text-center py-4 text-xs text-slate-400 italic">No files match your search.</div>
                  }
                </div>

                <!-- Bottom upload quick trigger -->
                <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span class="text-[10px] text-slate-400 font-mono">Stored in localStorage</span>
                  <button
                    type="button"
                    (click)="triggerFileUpload(); isFilesMenuOpen.set(false)"
                    class="text-[11px] text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-1">
                    <mat-icon class="text-xs">upload_file</mat-icon>
                    <span>Upload New File (PDF, MD, PY)</span>
                  </button>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Center / Right Topbar Actions: Upload, Download, Delete + Reader Controls -->
        <div class="flex items-center gap-1.5 shrink-0">
          <!-- Hidden Native File Input for uploads (supports .pdf explicitly) -->
          <input
            #fileInput
            type="file"
            multiple
            accept=".pdf,.py,.md,.txt,.json,.csv,.doc,.docx"
            (change)="onFileSelected($event)"
            class="hidden" />

          <!-- SMALL BUTTON 1: Upload File/Lecture to localStorage -->
          <button
            type="button"
            (click)="triggerFileUpload()"
            title="Upload custom file or PDF lecture into localStorage"
            class="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-xs font-semibold flex items-center gap-1 transition-all shadow-2xs active:scale-95">
            <mat-icon class="text-sm text-purple-500 dark:text-purple-400 leading-none">upload_file</mat-icon>
            <span class="hidden sm:inline">Upload</span>
          </button>

          <!-- SMALL BUTTON 2: Download Current Active File -->
          <button
            type="button"
            (click)="downloadActiveDocument()"
            [title]="isPdfDoc() ? 'Download original binary PDF document' : 'Download this lecture or file to your device'"
            class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1 transition-all shadow-2xs active:scale-95">
            <mat-icon class="text-sm text-slate-500 dark:text-slate-400 leading-none">download</mat-icon>
            <span class="hidden sm:inline">Download</span>
          </button>

          <!-- SMALL BUTTON 3: Delete File from localStorage -->
          <button
            type="button"
            (click)="deleteActiveDocument()"
            [disabled]="!activeDoc().isCustom && documents().length <= 1"
            title="Delete this file from localStorage"
            class="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1 transition-all shadow-2xs active:scale-95">
            <mat-icon class="text-sm text-rose-500 dark:text-rose-400 leading-none">delete</mat-icon>
            <span class="hidden sm:inline">Delete</span>
          </button>

          <!-- Reader Typography & Canvas Customizers (Small buttons) -->
          <div class="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block"></div>

          @if (!isPdfDoc()) {
            <!-- Font Size Down / Up (for text/markdown docs) -->
            <div class="hidden md:flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 text-[11px] font-mono">
              <button
                type="button"
                (click)="changeFontSize(-1)"
                title="Decrease font size"
                class="px-1.5 py-0.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded">
                A-
              </button>
              <span class="px-1 text-slate-400">{{ readerFontSize() }}px</span>
              <button
                type="button"
                (click)="changeFontSize(1)"
                title="Increase font size"
                class="px-1.5 py-0.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded">
                A+
              </button>
            </div>

            <!-- Reading Canvas Width Toggle: 75ch vs 100% -->
            <button
              type="button"
              (click)="isFullWidth.set(!isFullWidth())"
              [title]="isFullWidth() ? 'Switch to Focused Reading Width' : 'Expand to 100% Full Width'"
              class="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors">
              <mat-icon class="text-base leading-none">{{ isFullWidth() ? 'view_sidebar' : 'fullscreen' }}</mat-icon>
            </button>

            <!-- Reader Theme: Dark / Sepia / Daylight -->
            <button
              type="button"
              (click)="cycleReaderTheme()"
              [title]="'Reader Theme: ' + readerTheme()"
              class="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors">
              <mat-icon class="text-base leading-none">palette</mat-icon>
            </button>
          }
        </div>
      </header>

      <!-- 2. Reading Progress Indicator Bar -->
      <div class="w-full h-0.5 bg-slate-100 dark:bg-slate-800">
        <div
          class="h-full bg-gradient-to-r from-purple-500 to-teal-400 transition-all duration-150"
          [style.width.%]="readingProgress()"></div>
      </div>

      <!-- 3. ALL-PAGE-SPACE READING CANVAS -->
      <main
        #readerContainer
        (scroll)="onReaderScroll($event)"
        [class]="getThemeContainerClasses()"
        class="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-5 transition-colors select-text">
        <div [class]="isFullWidth() ? 'w-full' : 'max-w-5xl mx-auto'" class="space-y-6">
          
          <!-- Document Header Card -->
          <div class="border-b border-slate-200 dark:border-slate-800/80 pb-4 space-y-2.5">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <!-- Category Pill -->
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase" [class]="isPdfDoc() ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/20' : 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20'">
                <mat-icon class="text-xs leading-none">{{ isPdfDoc() ? 'picture_as_pdf' : 'school' }}</mat-icon>
                <span>{{ activeDoc().category }} {{ isPdfDoc() ? '• PDF Document' : '' }}</span>
              </span>

              <!-- Metrics: Reading time, word count, date -->
              <div class="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>{{ (activeDoc().sizeBytes / 1024).toFixed(1) }} KB</span>
                <span>&bull;</span>
                <span>{{ activeDoc().uploadedAt }}</span>
              </div>
            </div>

            <!-- Big Academic Document Title -->
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              {{ activeDoc().title }}
            </h1>

            @if (activeDoc().author) {
              <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <mat-icon class="text-sm text-slate-400">person</mat-icon>
                <span>Source / Lecturer: <strong class="text-slate-700 dark:text-slate-300">{{ activeDoc().author }}</strong></span>
              </div>
            }

            @if (activeDoc().summary) {
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#0B151C] p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 italic">
                {{ activeDoc().summary }}
              </p>
            }
          </div>

          <!-- DOCUMENT BODY CONTENT: PDF CANVAS READER VS TEXT/MARKDOWN/PYTHON -->
          @if (isPdfDoc()) {
            <!-- NATIVE IN-CANVAS PDF READER (NEVER BLOCKED BY CHROME IFRAMES) -->
            <div class="space-y-4">
              <!-- PDF Control Bar: Page Navigator, Zoom, Rotation, View Mode -->
              <div class="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                
                <!-- Left: Page Navigator Controls -->
                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    (click)="changePdfPage(-1)"
                    [disabled]="pdfCurrentPage() <= 1 || isPdfLoading()"
                    title="Previous Page (Left Arrow)"
                    class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors">
                    <mat-icon class="text-base leading-none">navigate_before</mat-icon>
                  </button>

                  <div class="flex items-center gap-1 font-mono text-xs bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-200">
                    <span>Page</span>
                    <input
                      type="number"
                      [min]="1"
                      [max]="pdfTotalPages()"
                      [ngModel]="pdfCurrentPage()"
                      (ngModelChange)="onPdfPageInput($event)"
                      class="w-10 bg-transparent text-center text-teal-400 font-bold focus:outline-none" />
                    <span class="text-slate-500">/ {{ pdfTotalPages() }}</span>
                  </div>

                  <button
                    type="button"
                    (click)="changePdfPage(1)"
                    [disabled]="pdfCurrentPage() >= pdfTotalPages() || isPdfLoading()"
                    title="Next Page (Right Arrow)"
                    class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors">
                    <mat-icon class="text-base leading-none">navigate_next</mat-icon>
                  </button>
                </div>

                <!-- Center: Zoom Controls & Rotation -->
                <div class="flex items-center gap-1 font-mono text-[11px]">
                  <button
                    type="button"
                    (click)="zoomPdf(-0.2)"
                    title="Zoom Out"
                    class="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
                    -
                  </button>
                  <span class="px-2 text-slate-400">{{ Math.round(pdfZoomScale() * 100) }}%</span>
                  <button
                    type="button"
                    (click)="zoomPdf(0.2)"
                    title="Zoom In"
                    class="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
                    +
                  </button>
                  <button
                    type="button"
                    (click)="resetPdfZoom()"
                    title="Reset Zoom to 100%"
                    class="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white ml-1">
                    100%
                  </button>
                  <button
                    type="button"
                    (click)="rotatePdf()"
                    title="Rotate 90° Clockwise"
                    class="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 ml-1">
                    <mat-icon class="text-sm leading-none">rotate_right</mat-icon>
                  </button>
                </div>

                <!-- Right: View Mode Tabs & Download -->
                <div class="flex items-center gap-2">
                  <div class="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[11px] font-mono">
                    <button
                      type="button"
                      (click)="pdfViewMode.set('canvas')"
                      [class]="pdfViewMode() === 'canvas'
                        ? 'px-2.5 py-1 rounded-md bg-rose-600 text-white font-bold'
                        : 'px-2.5 py-1 text-slate-400 hover:text-white'">
                      <mat-icon class="text-xs mr-1 leading-none">menu_book</mat-icon>
                      Canvas View
                    </button>
                    <button
                      type="button"
                      (click)="pdfViewMode.set('text')"
                      [class]="pdfViewMode() === 'text'
                        ? 'px-2.5 py-1 rounded-md bg-purple-600 text-white font-bold'
                        : 'px-2.5 py-1 text-slate-400 hover:text-white'">
                      <mat-icon class="text-xs mr-1 leading-none">notes</mat-icon>
                      Extracted Text
                    </button>
                    <button
                      type="button"
                      (click)="pdfViewMode.set('forensics')"
                      [class]="pdfViewMode() === 'forensics'
                        ? 'px-2.5 py-1 rounded-md bg-teal-600 text-white font-bold'
                        : 'px-2.5 py-1 text-slate-400 hover:text-white'">
                      <mat-icon class="text-xs mr-1 leading-none">terminal</mat-icon>
                      Forensics
                    </button>
                  </div>

                  <button
                    type="button"
                    (click)="downloadActiveDocument()"
                    title="Download original binary PDF file"
                    class="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-1 transition-colors">
                    <mat-icon class="text-sm">download</mat-icon>
                    <span class="hidden sm:inline">Save</span>
                  </button>
                </div>
              </div>

              <!-- VIEW 1: High-DPI In-Canvas Visual PDF Viewer -->
              @if (pdfViewMode() === 'canvas') {
                <div class="w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-[#181A1B] rounded-2xl border border-slate-800 shadow-2xl min-h-[560px] overflow-auto">
                  @if (isPdfLoading()) {
                    <div class="flex items-center gap-2 text-teal-400 font-mono text-xs py-6">
                      <mat-icon class="text-base animate-spin">refresh</mat-icon>
                      <span>Rendering Page {{ pdfCurrentPage() }} with PDF.js engine...</span>
                    </div>
                  }

                  @if (pdfRenderError()) {
                    <div class="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 font-mono space-y-3 max-w-lg text-center my-4">
                      <div class="font-bold flex items-center justify-center gap-1.5 text-sm text-rose-200">
                        <mat-icon class="text-base text-rose-400">info</mat-icon>
                        <span>PDF Stream Notice</span>
                      </div>
                      <p class="text-[11px] text-slate-300 leading-relaxed">
                        {{ pdfRenderError() }}
                      </p>
                      <div class="pt-2 flex flex-wrap items-center justify-center gap-2">
                        <button
                          type="button"
                          (click)="pdfViewMode.set('text')"
                          class="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs">
                          <mat-icon class="text-xs">notes</mat-icon>
                          <span>Read Extracted Text</span>
                        </button>
                        <button
                          type="button"
                          (click)="pdfViewMode.set('forensics')"
                          class="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs">
                          <mat-icon class="text-xs">terminal</mat-icon>
                          <span>Inspect PDF Forensics</span>
                        </button>
                      </div>
                    </div>
                  }

                  <!-- The HTML5 Canvas rendered directly by PDF.js (NO CHROME IFRAME BLOCKS!) -->
                  <div [class.hidden]="!!pdfRenderError()" class="relative max-w-full overflow-auto rounded-lg shadow-2xl bg-white dark:bg-[#1E1E1E] transition-all">
                    <canvas #pdfCanvas class="block mx-auto max-w-full"></canvas>
                  </div>
                </div>
              }

              <!-- VIEW 2: Searchable & Copyable Extracted Text -->
              @if (pdfViewMode() === 'text') {
                <div class="p-5 rounded-2xl bg-[#091015] border border-slate-800 space-y-3 font-mono text-xs text-slate-300">
                  <div class="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div class="font-bold text-purple-400 flex items-center gap-2">
                      <mat-icon class="text-sm">content_paste</mat-icon>
                      <span>Extracted PDF Text Stream (Searchable &amp; Selectable)</span>
                    </div>
                    <button
                      type="button"
                      (click)="copyExtractedText()"
                      class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center gap-1">
                      <mat-icon class="text-xs">content_copy</mat-icon>
                      <span>{{ hasCopiedDoc() ? 'Copied' : 'Copy All Text' }}</span>
                    </button>
                  </div>
                  <pre class="p-4 rounded-xl bg-[#05080A] border border-slate-800 text-[12px] font-mono leading-relaxed overflow-x-auto text-slate-200 whitespace-pre-wrap selection:bg-purple-500/30">{{ pdfExtractedText() || 'Extracting text stream from PDF...' }}</pre>
                </div>
              }

              <!-- VIEW 3: PDF Stream & Object Forensics (Academic & Security Analysis) -->
              @if (pdfViewMode() === 'forensics') {
                <div class="p-5 rounded-2xl bg-[#091015] border border-slate-800 space-y-4 font-mono text-xs text-slate-300">
                  <div class="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div class="font-bold text-teal-400 flex items-center gap-2 text-sm">
                      <mat-icon class="text-base">security</mat-icon>
                      <span>PDF Bytecode Structure &amp; Stream Forensics</span>
                    </div>
                    <span class="text-[11px] text-slate-500 font-mono">Cybersecurity Invariant Check</span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div class="p-3 rounded-xl bg-[#0C151B] border border-slate-800">
                      <div class="text-slate-500 text-[10px] uppercase font-bold">Header Format</div>
                      <div class="text-rose-400 font-bold text-sm mt-0.5">{{ getPdfVersion() }}</div>
                      <div class="text-slate-500 text-[10px]">ISO 32000 Conformance</div>
                    </div>
                    <div class="p-3 rounded-xl bg-[#0C151B] border border-slate-800">
                      <div class="text-slate-500 text-[10px] uppercase font-bold">Total PDF Objects</div>
                      <div class="text-teal-400 font-bold text-sm mt-0.5">{{ getPdfObjectCount() }} parsed objects</div>
                      <div class="text-slate-500 text-[10px]">Indirect object dictionaries</div>
                    </div>
                    <div class="p-3 rounded-xl bg-[#0C151B] border border-slate-800">
                      <div class="text-slate-500 text-[10px] uppercase font-bold">Stream Encoding</div>
                      <div class="text-amber-400 font-bold text-sm mt-0.5">{{ getPdfFilters() }}</div>
                      <div class="text-slate-500 text-[10px]">Decompression filter</div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Raw Stream &amp; Object Disassembly:</span>
                      <span class="text-[10px] text-slate-500">Decoded View</span>
                    </div>
                    <pre class="p-4 rounded-xl bg-[#05080A] border border-slate-800 text-[11px] font-mono leading-relaxed overflow-x-auto text-slate-200 selection:bg-purple-500/30 whitespace-pre-wrap">{{ getPdfRawPreview() }}</pre>
                  </div>
                </div>
              }
            </div>
          } @else {
            <!-- NON-PDF: Python / Markdown / Text Render -->
            <article
              [style.font-size.px]="readerFontSize()"
              class="study-prose leading-relaxed space-y-6">
              @if (activeDoc().fileType === 'python') {
                <!-- Python Code Document View with Prism Syntax Highlighting -->
                <div class="rounded-2xl bg-[#091015] border border-slate-800 overflow-hidden font-mono text-xs sm:text-sm">
                  <div class="px-4 py-2 bg-[#060B0E] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <div class="flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block"></span>
                      <span class="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block"></span>
                      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block"></span>
                      <span class="font-bold text-slate-200 ml-1">{{ activeDoc().fileName }}</span>
                    </div>
                    <span class="text-[10px] font-mono text-teal-400">Prism Python Highlighted</span>
                  </div>
                  <div class="p-4 overflow-x-auto text-slate-100">
                    <pre class="m-0 p-0 font-mono leading-relaxed"><code class="language-python" [innerHTML]="highlightedPythonContent()"></code></pre>
                  </div>
                </div>
              } @else {
                <!-- Rendered Markdown / Rich Lecture Document -->
                <div
                  class="space-y-6 font-sans"
                  [innerHTML]="renderedMarkdownHtml()"></div>
              }
            </article>
          }

          <!-- Bottom Footer Navigation between files -->
          <div class="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 text-xs font-semibold text-slate-500">
            <button
              type="button"
              (click)="navigateDoc(-1)"
              class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors">
              <mat-icon class="text-sm">arrow_back</mat-icon>
              <span>Previous Document</span>
            </button>

            <span class="text-slate-400 font-mono text-[11px]">
              Document {{ getActiveDocIndex() + 1 }} of {{ documents().length }}
            </span>

            <button
              type="button"
              (click)="navigateDoc(1)"
              class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors">
              <span>Next Document</span>
              <mat-icon class="text-sm">arrow_forward</mat-icon>
            </button>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class StudyReader {
  readonly state = inject(LearningStateService);
  readonly highlighter = inject(SyntaxHighlighter);

  // Canvas ViewChild for native PDF.js rendering
  readonly pdfCanvas = viewChild<ElementRef<HTMLCanvasElement>>('pdfCanvas');

  // Math helper for template expressions
  readonly Math = Math;

  // Documents Library (preloaded academic lectures + localStorage custom files)
  readonly documents = signal<StudyDocument[]>([]);
  readonly activeDocId = signal<string>('lecture-00-pdf-slides');

  // Reader UX state
  readonly isFilesMenuOpen = signal<boolean>(false);
  readonly isFullWidth = signal<boolean>(true);
  readonly readerFontSize = signal<number>(15);
  readonly readerTheme = signal<'dark' | 'sepia' | 'light'>('dark');
  readonly readingProgress = signal<number>(0);
  readonly searchFileFilter = '';
  readonly hasCopiedDoc = signal<boolean>(false);

  // PDF Viewer State (In-Canvas PDF.js Engine)
  readonly pdfViewMode = signal<'canvas' | 'text' | 'forensics'>('canvas');
  readonly pdfCurrentPage = signal<number>(1);
  readonly pdfTotalPages = signal<number>(1);
  readonly pdfZoomScale = signal<number>(1.25);
  readonly pdfRotation = signal<number>(0);
  readonly isPdfLoading = signal<boolean>(false);
  readonly pdfRenderError = signal<string | null>(null);
  readonly pdfExtractedText = signal<string>('');

  // Active Document computed
  readonly activeDoc = computed<StudyDocument>(() => {
    const id = this.activeDocId();
    const doc = this.documents().find(d => d.id === id);
    return doc || this.documents()[0] || INITIAL_ACADEMIC_LECTURES[0];
  });

  // Check if active document is PDF
  readonly isPdfDoc = computed<boolean>(() => {
    const doc = this.activeDoc();
    return doc.fileType === 'pdf' ||
      doc.fileName.toLowerCase().endsWith('.pdf') ||
      doc.content.startsWith('data:application/pdf') ||
      doc.content.startsWith('%PDF-');
  });

  // Filtered documents for filesbar menu
  readonly filteredDocuments = computed<StudyDocument[]>(() => {
    const q = this.searchFileFilter.trim().toLowerCase();
    if (!q) return this.documents();
    return this.documents().filter(d => 
      d.title.toLowerCase().includes(q) || 
      d.fileName.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
    );
  });

  // Highlighted Python content if doc is python
  readonly highlightedPythonContent = computed<string>(() => {
    const doc = this.activeDoc();
    if (doc.fileType === 'python') {
      return this.highlighter.highlightPython(doc.content);
    }
    return '';
  });

  // Rendered Markdown content
  readonly renderedMarkdownHtml = computed<string>(() => {
    const doc = this.activeDoc();
    if (this.isPdfDoc()) return '';
    return this.renderMarkdown(doc.content);
  });

  constructor() {
    this.loadDocumentsFromStorage();

    // Persist active document ID in localStorage
    effect(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(ACTIVE_DOC_ID_KEY, this.activeDocId());
      }
    });

    // Reactive effect: Re-render PDF page when document, page number, scale, or rotation changes
    effect(() => {
      // Subscribe to reactive signals
      this.activeDoc();
      this.pdfCurrentPage();
      this.pdfZoomScale();
      this.pdfRotation();
      const mode = this.pdfViewMode();

      if (this.isPdfDoc() && mode === 'canvas' && typeof window !== 'undefined') {
        // Debounce render execution to guarantee canvas DOM node availability
        setTimeout(() => this.renderCurrentPdfPage(), 15);
      }
    });
  }

  loadDocumentsFromStorage() {
    if (typeof window === 'undefined') {
      this.documents.set(INITIAL_ACADEMIC_LECTURES);
      return;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StudyDocument[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Auto-repair any documents with %PDF- or .pdf extension
          for (const doc of parsed) {
            if (doc.fileName.toLowerCase().endsWith('.pdf') || doc.content.startsWith('%PDF-') || doc.content.startsWith('data:application/pdf')) {
              doc.fileType = 'pdf';
            }
          }

          const customDocs = parsed.filter(p => p.isCustom);
          this.documents.set([...INITIAL_ACADEMIC_LECTURES, ...customDocs]);
        } else {
          this.documents.set(INITIAL_ACADEMIC_LECTURES);
        }
      } else {
        this.documents.set(INITIAL_ACADEMIC_LECTURES);
      }

      const savedActiveId = localStorage.getItem(ACTIVE_DOC_ID_KEY);
      if (savedActiveId && this.documents().some(d => d.id === savedActiveId)) {
        this.activeDocId.set(savedActiveId);
      } else {
        this.activeDocId.set(this.documents()[0].id);
      }
    } catch {
      this.documents.set(INITIAL_ACADEMIC_LECTURES);
    }
  }

  saveCustomDocumentsToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.documents()));
    } catch {
      // Gracefully handle storage quota
    }
  }

  selectDocument(doc: StudyDocument) {
    this.activeDocId.set(doc.id);
    this.pdfCurrentPage.set(1);
    this.pdfExtractedText.set('');
    this.isFilesMenuOpen.set(false);
  }

  triggerFileUpload() {
    if (typeof document !== 'undefined') {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      fileInput?.click();
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';

      // PDF FILES: Read as clean Data URL (preserves binary stream without encoding corruption)
      if (ext === 'pdf' || file.type === 'application/pdf') {
        const pdfReader = new FileReader();
        pdfReader.onload = (e) => {
          const dataUrl = (e.target?.result as string) || '';
          const newDoc: StudyDocument = {
            id: 'upload-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            title: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
            fileName: file.name,
            category: 'Academic Lecture',
            fileType: 'pdf',
            content: dataUrl,
            sizeBytes: file.size,
            uploadedAt: new Date().toISOString().split('T')[0],
            isCustom: true,
            author: 'Uploaded PDF Document',
            summary: `PDF document "${file.name}" (${(file.size / 1024).toFixed(1)} KB) rendered with native in-canvas PDF.js engine.`
          };

          this.documents.update(docs => [newDoc, ...docs]);
          this.activeDocId.set(newDoc.id);
          this.pdfCurrentPage.set(1);
          this.pdfExtractedText.set('');
          this.saveCustomDocumentsToStorage();
        };
        pdfReader.readAsDataURL(file);
        continue;
      }

      // Non-PDF text/markdown/python files
      const textReader = new FileReader();
      textReader.onload = (e) => {
        const textContent = (e.target?.result as string) || '';
        let fileType: StudyDocument['fileType'] = 'text';
        if (ext === 'py') fileType = 'python';
        else if (ext === 'md') fileType = 'markdown';
        else if (ext === 'json') fileType = 'json';

        // Auto-detect if raw content is actually a PDF starting with %PDF-
        if (textContent.startsWith('%PDF-')) {
          fileType = 'pdf';
        }

        const newDoc: StudyDocument = {
          id: 'upload-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
          fileName: file.name,
          category: 'User Upload',
          fileType,
          content: textContent,
          sizeBytes: file.size,
          uploadedAt: new Date().toISOString().split('T')[0],
          isCustom: true,
          author: 'Local User Upload',
          summary: `Uploaded file ${file.name} (${(file.size / 1024).toFixed(1)} KB) stored in localStorage.`
        };

        this.documents.update(docs => [newDoc, ...docs]);
        this.activeDocId.set(newDoc.id);
        this.saveCustomDocumentsToStorage();
      };
      textReader.readAsText(file);
    }

    target.value = '';
  }

  // --- NATIVE PDF.JS RENDERING ENGINE (CANVAS) ---
  private activeRenderTask: RenderTask | null = null;

  async renderCurrentPdfPage() {
    if (typeof window === 'undefined') return;

    const canvas = this.pdfCanvas()?.nativeElement;
    if (!canvas) return;

    const doc = this.activeDoc();
    this.isPdfLoading.set(true);
    this.pdfRenderError.set(null);

    // Cancel any previous in-flight render task to avoid "Canvas is already rendering"
    if (this.activeRenderTask) {
      try {
        this.activeRenderTask.cancel();
      } catch {
        // ignore cancellation errors
      }
      this.activeRenderTask = null;
    }

    try {
      // Polyfill Promise.try if not supported in older browser environments
      const promiseObj = Promise as unknown as Record<string, unknown>;
      if (!promiseObj['try']) {
        promiseObj['try'] = (fn: (...args: unknown[]) => unknown, ...args: unknown[]) =>
          new Promise(resolve => resolve(fn(...args)));
      }

      const pdfjsLib = await import('pdfjs-dist');
      if (typeof window !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
      }

      const bytes = this.getPdfBytes(doc.content);
      if (!bytes || bytes.length === 0) {
        throw new Error('Empty PDF bytecode stream');
      }

      const loadingTask = pdfjsLib.getDocument({
        data: bytes
      });

      const pdf = await loadingTask.promise;
      this.pdfTotalPages.set(pdf.numPages);

      const pageNum = Math.min(pdf.numPages, Math.max(1, this.pdfCurrentPage()));
      const page = await pdf.getPage(pageNum);

      // Support high-resolution rendering on Retina and 4K displays
      const dpr = window.devicePixelRatio || 1;
      const viewport = page.getViewport({
        scale: this.pdfZoomScale(),
        rotation: this.pdfRotation()
      });

      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const renderContext = {
        canvas: canvas,
        canvasContext: ctx,
        viewport: viewport
      };

      this.activeRenderTask = page.render(renderContext);
      await this.activeRenderTask.promise;
      this.activeRenderTask = null;

      // Asynchronously extract plain text from all pages for Search & Copy mode
      if (!this.pdfExtractedText()) {
        this.extractAllPdfText(pdf);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Rendering cancelled')) {
        return;
      }
      this.pdfRenderError.set(`PDF Render Notice: ${msg}`);
      // Fallback: extract text tokens directly from raw content if needed
      if (!this.pdfExtractedText()) {
        this.extractFallbackPdfText(doc.content);
      }
    } finally {
      this.isPdfLoading.set(false);
    }
  }

  async extractAllPdfText(pdf: PDFDocumentProxy) {
    try {
      const textParts: string[] = [];
      const maxPages = Math.min(pdf.numPages, 40);
      for (let i = 1; i <= maxPages; i++) {
        const p = await pdf.getPage(i);
        const tc = await p.getTextContent();
        const str = tc.items
          .map(it => ('str' in it ? (it as { str: string }).str : ''))
          .filter(Boolean)
          .join(' ');
        textParts.push(`--- Page ${i} ---\n${str}`);
      }
      this.pdfExtractedText.set(textParts.join('\n\n'));
    } catch {
      this.extractFallbackPdfText(this.activeDoc().content);
    }
  }

  extractFallbackPdfText(content: string) {
    const lines: string[] = [];
    const strMatches = content.match(/\(([^)]+)\)\s*(?:Tj|'|"|T\*|\n)/g);
    if (strMatches && strMatches.length > 0) {
      lines.push('--- Extracted Text Stream ---');
      for (const m of strMatches) {
        const cleaned = m.replace(/^\(/, '').replace(/\)\s*(?:Tj|'|"|T\*|\n)$/, '').trim();
        if (cleaned) lines.push(cleaned);
      }
    }

    const objMatches = content.match(/(\d+\s+\d+\s+obj[\s\S]*?endobj)/g);
    if (objMatches && objMatches.length > 0) {
      lines.push('\n--- PDF Objects & Metadata ---');
      for (const obj of objMatches.slice(0, 10)) {
        const firstLine = obj.split('\n')[0];
        const hasStream = obj.includes('stream');
        lines.push(`${firstLine}: ${hasStream ? 'Binary Stream Payload' : obj.replace(/\s+/g, ' ').substring(0, 100)}`);
      }
    }

    this.pdfExtractedText.set(lines.join('\n') || 'Raw PDF bytecode detected. Use Forensics tab to inspect decompressed streams.');
  }

  getPdfBytes(content: string): Uint8Array {
    if (content.startsWith('data:application/pdf;base64,')) {
      try {
        const b64 = content.split(',')[1];
        const bin = atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) {
          arr[i] = bin.charCodeAt(i);
        }
        return arr;
      } catch {
        // Fallback
      }
    }

    if (content.startsWith('%PDF-') || content.includes('%PDF-')) {
      const startIdx = content.indexOf('%PDF-');
      const slice = startIdx > 0 ? content.substring(startIdx) : content;
      const arr = new Uint8Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        arr[i] = slice.charCodeAt(i) & 0xff;
      }
      return arr;
    }

    try {
      if (/^[A-Za-z0-9+/=\s]+$/.test(content.trim()) && content.trim().length % 4 === 0) {
        const bin = atob(content.trim());
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) {
          arr[i] = bin.charCodeAt(i);
        }
        return arr;
      }
    } catch {
      // ignore
    }

    return new Uint8Array(0);
  }

  changePdfPage(delta: number) {
    this.pdfCurrentPage.update(p => Math.min(this.pdfTotalPages(), Math.max(1, p + delta)));
  }

  onPdfPageInput(val: number) {
    if (val >= 1 && val <= this.pdfTotalPages()) {
      this.pdfCurrentPage.set(val);
    }
  }

  zoomPdf(delta: number) {
    this.pdfZoomScale.update(s => Math.min(2.5, Math.max(0.5, parseFloat((s + delta).toFixed(2)))));
  }

  resetPdfZoom() {
    this.pdfZoomScale.set(1.0);
  }

  rotatePdf() {
    this.pdfRotation.update(r => (r + 90) % 360);
  }

  copyExtractedText() {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(this.pdfExtractedText() || this.activeDoc().content);
      this.hasCopiedDoc.set(true);
      setTimeout(() => this.hasCopiedDoc.set(false), 2000);
    }
  }

  downloadActiveDocument() {
    if (typeof window === 'undefined') return;
    const doc = this.activeDoc();

    if (this.isPdfDoc()) {
      const bytes = this.getPdfBytes(doc.content);
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.fileName.endsWith('.pdf') ? doc.fileName : `${doc.title}.pdf`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return;
    }

    // Text / Markdown download
    const blob = new Blob([doc.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName || `${doc.title}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  deleteActiveDocument() {
    const current = this.activeDoc();
    if (!current.isCustom) {
      if (typeof window !== 'undefined') {
        const confirmed = window.confirm(`"${current.title}" is a core academic lecture. Reset or remove this lecture from your view?`);
        if (!confirmed) return;
      }
    }

    const currentId = current.id;
    const remaining = this.documents().filter(d => d.id !== currentId);
    if (remaining.length === 0) return;

    this.documents.set(remaining);
    this.activeDocId.set(remaining[0].id);
    this.saveCustomDocumentsToStorage();
  }

  changeFontSize(delta: number) {
    this.readerFontSize.update(s => Math.min(24, Math.max(12, s + delta)));
  }

  cycleReaderTheme() {
    const current = this.readerTheme();
    if (current === 'dark') this.readerTheme.set('sepia');
    else if (current === 'sepia') this.readerTheme.set('light');
    else this.readerTheme.set('dark');
  }

  getThemeContainerClasses(): string {
    const theme = this.readerTheme();
    if (theme === 'sepia') {
      return 'bg-[#FBF0D9] text-[#433422] selection:bg-amber-300/40';
    } else if (theme === 'light') {
      return 'bg-[#FFFFFF] text-[#1E293B] selection:bg-purple-200';
    }
    return 'bg-[#080E13] text-slate-100 selection:bg-purple-500/30';
  }

  onReaderScroll(event: Event) {
    const target = event.target as HTMLElement;
    if (!target) return;
    const scrollTotal = target.scrollHeight - target.clientHeight;
    if (scrollTotal <= 0) {
      this.readingProgress.set(100);
      return;
    }
    const pct = Math.round((target.scrollTop / scrollTotal) * 100);
    this.readingProgress.set(Math.min(100, Math.max(0, pct)));
  }

  getActiveDocIndex(): number {
    return this.documents().findIndex(d => d.id === this.activeDoc().id);
  }

  navigateDoc(step: number) {
    const docs = this.documents();
    const idx = this.getActiveDocIndex();
    const nextIdx = (idx + step + docs.length) % docs.length;
    this.selectDocument(docs[nextIdx]);
  }

  // --- PDF Forensic & Metadata Helper Functions ---
  getPdfVersion(): string {
    const content = this.activeDoc().content;
    const match = content.match(/%PDF-(\d+\.\d+)/);
    if (match) return `PDF-${match[1]}`;
    return 'PDF-1.7';
  }

  getPdfObjectCount(): number {
    const content = this.activeDoc().content;
    const matches = content.match(/\d+\s+\d+\s+obj/g);
    return matches ? matches.length : 8;
  }

  getPdfFilters(): string {
    const content = this.activeDoc().content;
    if (content.includes('/FlateDecode')) return 'FlateDecode (zlib)';
    if (content.includes('/DCTDecode')) return 'DCTDecode (JPEG)';
    return 'Standard Raw Stream';
  }

  getPdfRawPreview(): string {
    const content = this.activeDoc().content;
    if (content.startsWith('data:application/pdf;base64,')) {
      try {
        const b64 = content.split(',')[1].substring(0, 4000);
        const decoded = atob(b64);
        return decoded.substring(0, 2000) + '\n... [Remaining stream continues]';
      } catch {
        return content.substring(0, 1500);
      }
    }
    return content.substring(0, 2000) + (content.length > 2000 ? '\n... [Remaining stream continues]' : '');
  }

  /**
   * Lightweight Markdown to HTML parser
   */
  private renderMarkdown(md: string): string {
    if (!md) return '';

    let out = md;

    // 1. Process fenced code blocks with Prism highlighting
    out = out.replace(/```([a-zA-Z0-9_]*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const language = lang.trim().toLowerCase() || 'python';
      let highlighted = '';
      if (language === 'python' || language === 'py') {
        highlighted = this.highlighter.highlightPython(code.trim());
      } else if (language === 'json') {
        highlighted = this.highlighter.highlightJson(code.trim());
      } else if (language === 'bash' || language === 'sh') {
        highlighted = this.highlighter.highlightBash(code.trim());
      } else {
        highlighted = this.highlighter.escapeHtml(code.trim());
      }

      return `<div class="my-5 rounded-2xl bg-[#091015] border border-slate-800 overflow-hidden font-mono text-xs sm:text-sm">
        <div class="px-4 py-2 bg-[#060B0E] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span class="font-bold text-slate-300 font-mono">${language.toUpperCase()} CODE BLOCK</span>
          <span class="text-[10px] text-teal-400">Prism Syntax Tokenized</span>
        </div>
        <div class="p-4 overflow-x-auto text-slate-100">
          <pre class="m-0 p-0 leading-relaxed font-mono"><code class="language-${language}">${highlighted}</code></pre>
        </div>
      </div>`;
    });

    // 2. Headings with anchors
    let headingCounter = 0;
    out = out.replace(/^### (.*$)/gim, (_, text) => {
      const id = 'sec-' + headingCounter++;
      return `<h3 id="${id}" class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2 tracking-tight">${text}</h3>`;
    });
    out = out.replace(/^## (.*$)/gim, (_, text) => {
      const id = 'sec-' + headingCounter++;
      return `<h2 id="${id}" class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-8 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800 tracking-tight flex items-center gap-2"><span class="w-1.5 h-5 bg-purple-500 rounded-full inline-block"></span><span>${text}</span></h2>`;
    });
    out = out.replace(/^# (.*$)/gim, (_, text) => {
      const id = 'sec-' + headingCounter++;
      return `<h1 id="${id}" class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-4 mb-3 tracking-tight">${text}</h1>`;
    });

    // 3. Blockquotes & Callouts
    out = out.replace(/^> (.*$)/gim, (_, text) => {
      return `<blockquote class="p-3.5 my-4 rounded-xl bg-purple-500/10 border-l-4 border-purple-500 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">${text}</blockquote>`;
    });

    // 4. Horizontal Rules
    out = out.replace(/^---$/gim, '<hr class="my-6 border-slate-200 dark:border-slate-800" />');

    // 5. Bold & Italic
    out = out.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>');
    out = out.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // 6. Inline code
    out = out.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-purple-600 dark:text-purple-300 font-mono text-xs font-semibold">$1</code>');

    // 7. Unordered Lists
    out = out.replace(/^\* (.*$)/gim, '<li class="flex items-start gap-2 ml-2 my-1"><span class="text-purple-500 font-bold text-sm">&bull;</span><span>$1</span></li>');
    out = out.replace(/^- (.*$)/gim, '<li class="flex items-start gap-2 ml-2 my-1"><span class="text-purple-500 font-bold text-sm">&bull;</span><span>$1</span></li>');

    // 8. Markdown Tables
    out = out.replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim().length > 0);
      if (cells.some(c => c.includes('---'))) return '';
      const tdList = cells.map(c => `<td class="p-2.5 border border-slate-200 dark:border-slate-800 text-xs">${c.trim()}</td>`).join('');
      return `<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">${tdList}</tr>`;
    });
    out = out.replace(/(<tr.*<\/tr>)/gs, '<div class="my-4 overflow-x-auto"><table class="w-full text-left border-collapse border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">$1</table></div>');

    // 9. Paragraphs
    const paras = out.split('\n\n');
    out = paras.map(p => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h') || trimmed.startsWith('<div') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<hr') || trimmed.startsWith('<table') || trimmed.startsWith('<li')) {
        return trimmed;
      }
      return `<p class="leading-relaxed my-3 text-slate-700 dark:text-slate-300">${trimmed.replace(/\n/g, '<br />')}</p>`;
    }).join('\n');

    return out;
  }
}
