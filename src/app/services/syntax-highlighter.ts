import { Injectable } from '@angular/core';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';

@Injectable({
  providedIn: 'root'
})
export class SyntaxHighlighter {
  /**
   * Highlights Python source code using Prism.js with python grammar.
   * Returns HTML string with syntax token classes.
   */
  highlightPython(code: string): string {
    if (!code) return '';
    try {
      const grammar = Prism.languages['python'] || Prism.languages['py'];
      if (grammar) {
        return Prism.highlight(code, grammar, 'python');
      }
    } catch {
      // Fallback to basic HTML escaping if Prism encounters any unexpected state
    }
    return this.escapeHtml(code);
  }

  /**
   * Highlights Bash / CLI commands using Prism.js.
   */
  highlightBash(code: string): string {
    if (!code) return '';
    try {
      const grammar = Prism.languages['bash'];
      if (grammar) {
        return Prism.highlight(code, grammar, 'bash');
      }
    } catch {
      // Fallback
    }
    return this.escapeHtml(code);
  }

  /**
   * Highlights JSON payloads using Prism.js.
   */
  highlightJson(code: string): string {
    if (!code) return '';
    try {
      const grammar = Prism.languages['json'];
      if (grammar) {
        return Prism.highlight(code, grammar, 'json');
      }
    } catch {
      // Fallback
    }
    return this.escapeHtml(code);
  }

  /**
   * Highlights single lines or expressions with Python syntax.
   */
  highlightPythonLine(line: string): string {
    if (!line) return '&nbsp;';
    return this.highlightPython(line);
  }

  /**
   * Breaks code into syntax-highlighted lines for line-numbered view.
   */
  highlightLines(code: string, language: 'python' | 'bash' | 'json' = 'python'): string[] {
    if (!code) return [];
    let highlighted: string;
    if (language === 'bash') {
      highlighted = this.highlightBash(code);
    } else if (language === 'json') {
      highlighted = this.highlightJson(code);
    } else {
      highlighted = this.highlightPython(code);
    }
    return highlighted.split('\n');
  }

  escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
