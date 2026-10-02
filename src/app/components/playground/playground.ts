import { ChangeDetectionStrategy, Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LearningStateService } from '../../services/learning-state.service';
import { PythonRunnerService, ExecutionResult } from '../../services/python-runner.service';

@Component({
  selector: 'app-playground',
  imports: [CommonModule, FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 max-w-7xl mx-auto">
      <!-- Top Lab Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
            <mat-icon class="text-base leading-none">terminal</mat-icon>
            <span>INTERACTIVE PYTHON OOP LAB</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {{ activeLesson()?.title || 'Interactive Code Playground' }}
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {{ activeLesson()?.summary || 'Run Python code with in-browser execution.' }}
          </p>
        </div>

        <!-- Quick Switch Preset Selector -->
        <div class="flex items-center gap-2">
          <label for="topic-select" class="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">Topic:</label>
          <select
            id="topic-select"
            [ngModel]="selectedSnippetKey()"
            (ngModelChange)="onSnippetChange($event)"
            class="px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#11232B] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-teal-500 shadow-xs max-w-xs truncate">
            <option value="diamond-mro">01. C3 MRO &amp; Diamond Inheritance (super())</option>
            <option value="seek-binary">02. Stream Seek Pointers &amp; tell() in 'rb'</option>
            <option value="composition-suite">03. SecuritySuite Composition (HAS-A)</option>
            <option value="json-custom">04. Custom OOP JSON Serialization (__dict__)</option>
            <option value="regex-named">05. Regex Named Groups (?P&lt;year&gt;...)</option>
            <option value="polymorphism-abc">06. Abstract Base Classes &amp; Duck Typing</option>
            <option value="var-args">07. Positional, *args &amp; **kwargs Combined</option>
            <option value="dunder-rules">08. Dunder Methods (__str__, __repr__, ==)</option>
            <option value="crypto-hash">09. Security Built-ins: hashlib &amp; base64</option>
          </select>
        </div>
      </div>

      <!-- Main Editor & Terminal Split Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <!-- Editor Column (7 cols) -->
        <div class="lg:col-span-7 bg-[#0b1419] rounded-2xl border border-slate-800 shadow-md flex flex-col overflow-hidden">
          <!-- Editor Toolbar -->
          <div class="px-4 py-3 bg-[#080e12] border-b border-slate-800/80 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span class="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span class="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span class="font-mono text-slate-400 font-medium ml-2 text-[11px]">main.py</span>
            </div>

            <div class="flex items-center gap-2">
              <!-- Engine indicator -->
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950/80 text-teal-400 border border-teal-500/30">
                {{ runner.isWasmReady() ? 'CPython 3.12 WASM' : 'Instant Sandbox' }}
              </span>

              <button
                (click)="resetCode()"
                title="Reset code"
                class="px-2.5 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors text-xs flex items-center gap-1">
                <mat-icon class="text-sm">refresh</mat-icon>
                <span class="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          <!-- Code Textarea -->
          <div class="relative flex-1 min-h-[360px] p-4 font-mono leading-relaxed text-emerald-300 bg-[#0b1419]">
            <textarea
              [(ngModel)]="currentCode"
              spellcheck="false"
              [style.font-size.px]="state.editorFontSize()"
              class="w-full h-full min-h-[340px] bg-transparent text-slate-100 font-mono focus:outline-none resize-none leading-relaxed selection:bg-teal-500/30"
              placeholder="# Write your Python code here..."></textarea>
          </div>

          <!-- Editor Actions Bar -->
          <div class="p-3 bg-[#080e12] border-t border-slate-800/80 flex items-center justify-between">
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <mat-icon class="text-base text-teal-400">tips_and_updates</mat-icon>
              <span class="hidden sm:inline">Tip: Press Run or modify variables freely</span>
            </div>

            <div class="flex items-center gap-2">
              <button
                (click)="copyCode()"
                class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-all">
                <mat-icon class="text-sm">content_copy</mat-icon>
                <span>{{ hasCopied() ? 'Copied!' : 'Copy' }}</span>
              </button>

              <button
                (click)="executeCode()"
                [disabled]="isRunning()"
                class="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-teal-500/20 active:scale-95">
                <mat-icon class="text-base leading-none">{{ isRunning() ? 'hourglass_top' : 'play_arrow' }}</mat-icon>
                <span>{{ isRunning() ? 'Running...' : 'Run Code' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Terminal & Output Column (5 cols) -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <!-- Terminal Output Card -->
          <div class="bg-[#0b1419] rounded-2xl border border-slate-800 shadow-md flex flex-col flex-1 overflow-hidden">
            <div class="px-4 py-3 bg-[#080e12] border-b border-slate-800/80 flex items-center justify-between text-xs">
              <div class="flex items-center gap-2 text-slate-300 font-semibold font-mono">
                <mat-icon class="text-sm text-teal-400">keyboard_arrow_right</mat-icon>
                <span>Console Output</span>
              </div>
              @if (executionResult()) {
                <span class="text-[11px] font-mono text-slate-400 tabular-nums">
                  {{ executionResult()?.durationMs }}ms
                </span>
              }
            </div>

            <div class="p-4 flex-1 font-mono text-xs sm:text-sm overflow-y-auto min-h-[220px] max-h-[300px] space-y-2">
              @if (isRunning()) {
                <div class="flex items-center gap-2 text-teal-400 py-4">
                  <span class="animate-spin text-base font-bold">&cir;</span>
                  <span>Executing Python runtime...</span>
                </div>
              } @else if (executionResult()) {
                @if (executionResult()?.stdout) {
                  <pre class="text-emerald-400 whitespace-pre-wrap leading-relaxed">{{ executionResult()?.stdout }}</pre>
                }
                @if (executionResult()?.stderr) {
                  <pre class="text-rose-400 whitespace-pre-wrap leading-relaxed">{{ executionResult()?.stderr }}</pre>
                }
              } @else {
                <div class="text-slate-500 italic py-6 text-center">
                  Press "Run Code" to view stdout execution trace.
                </div>
              }
            </div>

            <!-- Virtual File System Drawer -->
            <div class="p-3 bg-[#080e12] border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span class="font-mono text-[11px]">Virtual Files: sample.txt, config.txt, user.json</span>
              <button
                (click)="toggleVfsView()"
                class="text-teal-400 hover:underline text-[11px] font-medium">
                {{ showVfs() ? 'Hide Files' : 'Inspect Files' }}
              </button>
            </div>

            @if (showVfs()) {
              <div class="p-3 bg-[#0d181e] border-t border-slate-800 text-xs font-mono text-slate-300 space-y-1.5 animate-in fade-in">
                <div class="text-teal-400 text-[11px] font-bold">VFS STORAGE:</div>
                @for (file of runner.getVirtualFilesList(); track file.name) {
                  <div class="flex items-center justify-between text-[11px] text-slate-400 py-0.5">
                    <span>{{ file.name }}</span>
                    <span>{{ file.size }} bytes</span>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Interactive Lesson Quiz Card -->
          @if (activeLesson()?.quiz; as q) {
            <div class="bg-white dark:bg-[#11232B] rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
              <div class="flex items-center justify-between">
                <div class="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  QUICK CHECK
                </div>
                <span class="text-xs font-semibold text-slate-500">1 question</span>
              </div>

              <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {{ q.question }}
              </h4>

              <div class="space-y-1.5 pt-1">
                @for (opt of q.options; track opt; let idx = $index) {
                  <button
                    (click)="submitQuiz(idx)"
                    [class]="selectedQuizAnswer() === idx
                      ? (idx === q.answerIndex
                        ? 'w-full text-left p-2.5 rounded-xl border border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-xs font-medium transition-all'
                        : 'w-full text-left p-2.5 rounded-xl border border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 text-xs font-medium transition-all')
                      : 'w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 text-xs transition-all'">
                    <span class="font-bold mr-1">{{ ['A', 'B', 'C', 'D'][idx] }}.</span>
                    {{ opt }}
                  </button>
                }
              </div>

              @if (quizFeedback()) {
                <div
                  [class]="isQuizCorrect()
                    ? 'p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300'
                    : 'p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-800 dark:text-rose-300'">
                  <div class="font-bold mb-0.5">{{ isQuizCorrect() ? 'Correct!' : 'Incorrect' }}</div>
                  <p class="leading-relaxed">{{ q.explanation }}</p>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class PlaygroundComponent {
  readonly state = inject(LearningStateService);
  readonly runner = inject(PythonRunnerService);

  readonly selectedSnippetKey = signal<string>('diamond-mro');
  readonly isRunning = signal<boolean>(false);
  readonly executionResult = signal<ExecutionResult | null>(null);
  readonly hasCopied = signal<boolean>(false);
  readonly showVfs = signal<boolean>(false);

  // Quiz state
  readonly selectedQuizAnswer = signal<number | null>(null);
  readonly quizFeedback = signal<string | null>(null);
  readonly isQuizCorrect = signal<boolean>(false);

  currentCode = '';

  readonly activeLesson = this.state.activeLesson;

  private presetMap: Record<string, { code: string; lessonId: string; moduleId: string }> = {
    'diamond-mro': {
      moduleId: 'diamond-problem-mro',
      lessonId: 'c3-mro-linearization',
      code: `# The Diamond Problem & C3 MRO (Sondos Saif's slides 42-46)
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
d.say()`
    },
    'seek-binary': {
      moduleId: 'file-handling-modes',
      lessonId: 'file-seek-tell',
      code: `# Byte Pointer Navigation with seek() and tell()
with open("sample.txt", "w") as f:
    f.write("Hello, this is a test file.\\nSecond line.\\n")

# 1. Seek from beginning (whence=0)
with open("sample.txt", "r") as f:
    f.seek(7) # Move to index 7 ("this is...")
    print("Offset 7 output:", f.read(11))
    print("Current pointer tell():", f.tell())

# 2. Binary mode end-relative seek (whence=2)
with open("sample.txt", "rb") as f:
    f.seek(-7, 2) # Move 7 bytes before end
    print("End-relative read (-7, 2):", f.read())`
    },
    'composition-suite': {
      moduleId: 'composition-over-inheritance',
      lessonId: 'security-suite-composition',
      code: `# Composition Over Inheritance: SecuritySuite
class PortScanner:
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
print("\\nAfter component swap:", suite.full_scan())`
    },
    'json-custom': {
      moduleId: 'json-csv-serialization',
      lessonId: 'json-custom-objects',
      code: `import json

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
print(f"p2.name = {p2.name}, p2.age = {p2.age}")`
    },
    'regex-named': {
      moduleId: 'regex-engine',
      lessonId: 'regex-groups',
      code: `import re

# ISO Date string extraction
date_string = "Incident logged: Date: 2026-10-15 Status: Resolved"

# Named group pattern (?P<key>)
pattern = r"Date:\\s*(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})"
match = re.search(pattern, date_string)

if match:
    print("Extracted Full Match:", match.group(0))
    print("Year :", match.group("year"))
    print("Month:", match.group("month"))
    print("Day  :", match.group("day"))
    print("Full Dict:", match.groupdict())`
    },
    'polymorphism-abc': {
      moduleId: 'polymorphism-interfaces',
      lessonId: 'polymorphic-security-tools',
      code: `from abc import ABC, abstractmethod

class SecurityTool(ABC):
    @abstractmethod
    def analyze(self):
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

tools = [PortScanner(), MalwareScanner(), PacketSniffer()]

print("--- Running Unified Security Pipeline ---")
for tool in tools:
    print(tool.analyze())`
    },
    'var-args': {
      moduleId: 'functions-args-signatures',
      lessonId: 'var-length-args',
      code: `def profile(role, *skills, **metadata):
    print("Role  :", role)
    print("Skills (*args tuple):", skills)
    print("Metadata (**kwargs dict):", metadata)

profile("Security Engineer", "Python", "Networking", "Cryptography",
        level="Senior", remote=True, clearance="Level-3")`
    },
    'dunder-rules': {
      moduleId: 'dunder-magic-methods',
      lessonId: 'dunder-methods-deepdive',
      code: `class FirewallRule:
    def __init__(self, rule_id, port, description):
        self.rule_id = rule_id
        self.port = port
        self.description = description

    def __str__(self):
        return f"Firewall Rule #{self.rule_id}: Port {self.port} ({self.description})"

    def __repr__(self):
        return f"FirewallRule(rule_id={self.rule_id!r}, port={self.port}, description={self.description!r})"

    def __eq__(self, other):
        if not isinstance(other, FirewallRule):
            return False
        return self.port == other.port and self.rule_id == other.rule_id

r1 = FirewallRule(1, 443, "Allow HTTPS")
r2 = FirewallRule(1, 443, "Allow HTTPS")

print("str(r1)  :", str(r1))
print("repr(r1) :", repr(r1))
print("r1 == r2 :", r1 == r2)`
    },
    'crypto-hash': {
      moduleId: 'security-crypto-builtins',
      lessonId: 'crypto-builtins',
      code: `import hashlib
import base64

# 1. SHA-256 Hashing
secret_payload = b"admin_pass_2026"
hash_obj = hashlib.sha256(secret_payload)
print("SHA-256 Digest:", hash_obj.hexdigest())

# 2. Base64 Encoding and Decoding
raw_bytes = b"Cybersecurity Invariant Check OK"
encoded_b64 = base64.b64encode(raw_bytes)
print("Base64 Encoded:", encoded_b64.decode('utf-8'))

decoded_bytes = base64.b64decode(encoded_b64)
print("Decoded String:", decoded_bytes.decode('utf-8'))`
    }
  };

  constructor() {
    effect(() => {
      const activeLes = this.state.activeLesson();
      if (activeLes) {
        this.currentCode = activeLes.codeSnippet;
        this.selectedQuizAnswer.set(null);
        this.quizFeedback.set(null);
      }
    });

    // Default snippet load
    this.currentCode = this.presetMap['diamond-mro'].code;
  }

  onSnippetChange(key: string) {
    this.selectedSnippetKey.set(key);
    const preset = this.presetMap[key];
    if (preset) {
      this.currentCode = preset.code;
      this.state.selectLesson(preset.moduleId, preset.lessonId);
      this.selectedQuizAnswer.set(null);
      this.quizFeedback.set(null);
      this.executionResult.set(null);
    }
  }

  async executeCode() {
    this.isRunning.set(true);
    try {
      const res = await this.runner.runCode(this.currentCode);
      this.executionResult.set(res);
      // If active lesson exists, mark completed
      const mod = this.state.activeModule();
      const les = this.state.activeLesson();
      if (mod && les) {
        this.state.markLessonCompleted(mod.id, les.id);
      }
    } finally {
      this.isRunning.set(false);
    }
  }

  resetCode() {
    const les = this.state.activeLesson();
    if (les) {
      this.currentCode = les.codeSnippet;
    } else {
      this.currentCode = this.presetMap[this.selectedSnippetKey()].code;
    }
    this.executionResult.set(null);
  }

  copyCode() {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(this.currentCode);
      this.hasCopied.set(true);
      setTimeout(() => this.hasCopied.set(false), 2000);
    }
  }

  toggleVfsView() {
    this.showVfs.update(v => !v);
  }

  submitQuiz(index: number) {
    this.selectedQuizAnswer.set(index);
    const q = this.activeLesson()?.quiz;
    if (q) {
      const correct = index === q.answerIndex;
      this.isQuizCorrect.set(correct);
      this.quizFeedback.set(correct ? 'Excellent! You understood this core principle.' : 'Not quite. Check the explanation below.');
    }
  }
}
