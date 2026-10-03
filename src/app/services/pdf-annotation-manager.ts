import { Injectable, signal, computed } from '@angular/core';

export type AnnotationTool = 'view' | 'highlight' | 'note' | 'eraser';
export type AnnotationColor = 'yellow' | 'emerald' | 'cyan' | 'purple' | 'rose';

export interface AnnotationColorDef {
  name: AnnotationColor;
  label: string;
  hex: string;
  bgClass: string;
  borderClass: string;
}

export interface PdfAnnotation {
  id: string;
  docId: string;
  pageNumber: number;
  type: 'highlight' | 'sticky_note';
  xPct: number;
  yPct: number;
  widthPct?: number;
  heightPct?: number;
  color: AnnotationColor;
  colorHex: string;
  text: string;
  author: string;
  createdAt: string;
  isOpen?: boolean;
}

export const ANNOTATION_COLORS: AnnotationColorDef[] = [
  { name: 'yellow', label: 'Amber', hex: '#fbbf24', bgClass: 'bg-amber-400', borderClass: 'border-amber-400' },
  { name: 'emerald', label: 'Emerald', hex: '#34d399', bgClass: 'bg-emerald-400', borderClass: 'border-emerald-400' },
  { name: 'cyan', label: 'Cyan', hex: '#38bdf8', bgClass: 'bg-cyan-400', borderClass: 'border-cyan-400' },
  { name: 'purple', label: 'Purple', hex: '#c084fc', bgClass: 'bg-purple-400', borderClass: 'border-purple-400' },
  { name: 'rose', label: 'Coral', hex: '#fb7185', bgClass: 'bg-rose-400', borderClass: 'border-rose-400' }
];

export const ANNOTATIONS_STORAGE_KEY = 'pyadvance_pdf_annotations_v1';

export const INITIAL_ACADEMIC_ANNOTATIONS: PdfAnnotation[] = [
  {
    id: 'ann-init-mro',
    docId: 'lecture-00-pdf-slides',
    pageNumber: 1,
    type: 'sticky_note',
    xPct: 78,
    yPct: 24,
    color: 'yellow',
    colorHex: '#fbbf24',
    text: 'Exam Focus: C3 MRO Linearization guarantees Local Precedence Order and Monotonicity across cooperative super() calls.',
    author: 'Cybersecurity Student',
    createdAt: '2026-10-02',
    isOpen: false
  },
  {
    id: 'ann-init-stream',
    docId: 'lecture-00-pdf-slides',
    pageNumber: 1,
    type: 'highlight',
    xPct: 6,
    yPct: 54,
    widthPct: 88,
    heightPct: 7,
    color: 'emerald',
    colorHex: '#34d399',
    text: 'Key Invariant: Binary Stream Pointer Navigation seek(0, 2) and tell()',
    author: 'Cybersecurity Student',
    createdAt: '2026-10-02'
  }
];

@Injectable({
  providedIn: 'root'
})
export class PdfAnnotationManager {
  readonly colors = ANNOTATION_COLORS;

  // Primary state signals
  readonly annotations = signal<PdfAnnotation[]>([]);
  readonly activeTool = signal<AnnotationTool>('view');
  readonly activeColor = signal<AnnotationColor>('yellow');
  readonly isDrawerOpen = signal<boolean>(false);
  readonly isFloatingToolbarVisible = signal<boolean>(true);
  readonly filterMode = signal<'page' | 'all'>('page');

  // Dragging state for highlight boxes
  readonly isDraggingHighlight = signal<boolean>(false);
  readonly currentDragRect = signal<{ xPct: number; yPct: number; widthPct: number; heightPct: number } | null>(null);

  // Total annotations count
  readonly totalCount = computed<number>(() => this.annotations().length);

  constructor() {
    this.loadAnnotations();
  }

  /**
   * Load annotations from localStorage
   */
  loadAnnotations(): void {
    if (typeof window === 'undefined') {
      this.annotations.set(INITIAL_ACADEMIC_ANNOTATIONS);
      return;
    }
    try {
      const raw = localStorage.getItem(ANNOTATIONS_STORAGE_KEY);
      if (raw) {
        const parsed: PdfAnnotation[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.annotations.set(parsed);
          return;
        }
      }
      this.annotations.set(INITIAL_ACADEMIC_ANNOTATIONS);
      this.saveAnnotations();
    } catch {
      this.annotations.set(INITIAL_ACADEMIC_ANNOTATIONS);
    }
  }

  /**
   * Save annotations into localStorage
   */
  saveAnnotations(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ANNOTATIONS_STORAGE_KEY, JSON.stringify(this.annotations()));
    } catch {
      // Non-blocking fallback
    }
  }

  /**
   * Get all annotations for a document
   */
  getDocAnnotations(docId: string): PdfAnnotation[] {
    return this.annotations().filter(a => a.docId === docId);
  }

  /**
   * Get annotations for a specific document page
   */
  getPageAnnotations(docId: string, pageNumber: number): PdfAnnotation[] {
    return this.annotations().filter(a => a.docId === docId && a.pageNumber === pageNumber);
  }

  /**
   * Add a sticky note annotation
   */
  addStickyNote(docId: string, pageNumber: number, xPct: number, yPct: number, text = ''): PdfAnnotation {
    const color = this.activeColor();
    const newAnn: PdfAnnotation = {
      id: 'ann-note-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      docId,
      pageNumber,
      type: 'sticky_note',
      xPct: Math.max(0, Math.min(100, xPct)),
      yPct: Math.max(0, Math.min(100, yPct)),
      color,
      colorHex: this.getHighlightBorderColor(color),
      text,
      author: 'Cybersecurity Student',
      createdAt: new Date().toISOString().split('T')[0],
      isOpen: true
    };

    this.annotations.update(list => [...list, newAnn]);
    this.saveAnnotations();
    return newAnn;
  }

  /**
   * Add a highlight rectangle annotation
   */
  addHighlight(
    docId: string,
    pageNumber: number,
    xPct: number,
    yPct: number,
    widthPct: number,
    heightPct: number,
    text = 'Highlighted Section'
  ): PdfAnnotation {
    const color = this.activeColor();
    const newAnn: PdfAnnotation = {
      id: 'ann-hl-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      docId,
      pageNumber,
      type: 'highlight',
      xPct: Math.max(0, Math.min(100, xPct)),
      yPct: Math.max(0, Math.min(100, yPct)),
      widthPct: Math.max(2, Math.min(100, widthPct)),
      heightPct: Math.max(2, Math.min(100, heightPct)),
      color,
      colorHex: this.getHighlightBorderColor(color),
      text,
      author: 'Cybersecurity Student',
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.annotations.update(list => [...list, newAnn]);
    this.saveAnnotations();
    return newAnn;
  }

  /**
   * Update an existing annotation
   */
  updateAnnotation(id: string, partial: Partial<PdfAnnotation>): void {
    this.annotations.update(list =>
      list.map(a => {
        if (a.id === id) {
          const updated = { ...a, ...partial };
          if (partial.color) {
            updated.colorHex = this.getHighlightBorderColor(partial.color);
          }
          return updated;
        }
        return a;
      })
    );
    this.saveAnnotations();
  }

  /**
   * Set color of a specific annotation
   */
  setAnnotationColor(id: string, color: AnnotationColor): void {
    this.updateAnnotation(id, { color, colorHex: this.getHighlightBorderColor(color) });
  }

  /**
   * Toggle expanded state of a sticky note card
   */
  toggleNoteOpen(id: string): void {
    this.annotations.update(list =>
      list.map(a => (a.id === id ? { ...a, isOpen: !a.isOpen } : a))
    );
    this.saveAnnotations();
  }

  /**
   * Close a sticky note card
   */
  closeNote(id: string): void {
    this.annotations.update(list =>
      list.map(a => (a.id === id ? { ...a, isOpen: false } : a))
    );
    this.saveAnnotations();
  }

  /**
   * Delete an annotation by ID
   */
  deleteAnnotation(id: string): void {
    this.annotations.update(list => list.filter(a => a.id !== id));
    this.saveAnnotations();
  }

  /**
   * Clear all annotations for a document
   */
  clearDocAnnotations(docId: string): void {
    this.annotations.update(list => list.filter(a => a.docId !== docId));
    this.saveAnnotations();
  }

  /**
   * Select active tool
   */
  setTool(tool: AnnotationTool): void {
    this.activeTool.set(tool);
  }

  /**
   * Select active color
   */
  setColor(color: AnnotationColor): void {
    this.activeColor.set(color);
  }

  /**
   * Toggle notes drawer
   */
  toggleDrawer(): void {
    this.isDrawerOpen.update(v => !v);
  }

  /**
   * Format annotations into a Markdown study sheet
   */
  exportToMarkdown(docTitle: string, docFileName: string, docId: string): string {
    const docAnns = this.getDocAnnotations(docId);
    if (docAnns.length === 0) return '';

    const lines: string[] = [];
    lines.push(`# Study Notes & Annotations: ${docTitle}`);
    lines.push(`Document: ${docFileName} | Total Annotations: ${docAnns.length}`);
    lines.push(`Generated on: ${new Date().toISOString().split('T')[0]}\n`);

    const sorted = [...docAnns].sort((a, b) => a.pageNumber - b.pageNumber);
    for (const ann of sorted) {
      const typeLabel = ann.type === 'sticky_note' ? '📝 Sticky Note' : '✏️ Highlight';
      lines.push(`### [Page ${ann.pageNumber}] ${typeLabel} (${ann.color})`);
      lines.push(`> ${ann.text || '(No text content)'}`);
      lines.push(`*Created on ${ann.createdAt} by ${ann.author}*\n`);
    }

    return lines.join('\n');
  }

  // --- Style & Color Helper Functions ---
  getHighlightBgColor(color: AnnotationColor): string {
    switch (color) {
      case 'yellow': return 'rgba(251, 191, 36, 0.35)';
      case 'emerald': return 'rgba(52, 211, 153, 0.35)';
      case 'cyan': return 'rgba(56, 189, 248, 0.35)';
      case 'purple': return 'rgba(192, 132, 252, 0.35)';
      case 'rose': return 'rgba(251, 113, 133, 0.35)';
    }
  }

  getHighlightBorderColor(color: AnnotationColor): string {
    switch (color) {
      case 'yellow': return '#fbbf24';
      case 'emerald': return '#34d399';
      case 'cyan': return '#38bdf8';
      case 'purple': return '#c084fc';
      case 'rose': return '#fb7185';
    }
  }

  getStickyNotePinClasses(color: AnnotationColor): string {
    switch (color) {
      case 'yellow': return 'bg-amber-400 shadow-amber-500/30';
      case 'emerald': return 'bg-emerald-400 shadow-emerald-500/30';
      case 'cyan': return 'bg-cyan-400 shadow-cyan-500/30';
      case 'purple': return 'bg-purple-400 shadow-purple-500/30';
      case 'rose': return 'bg-rose-400 shadow-rose-500/30';
    }
  }

  getStickyNoteBorderColor(color: AnnotationColor): string {
    return this.getHighlightBorderColor(color);
  }

  getOverlayCursorClass(): string {
    const tool = this.activeTool();
    if (tool === 'note') return 'cursor-copy';
    if (tool === 'highlight') return 'cursor-crosshair';
    if (tool === 'eraser') return 'cursor-not-allowed';
    return 'cursor-default pointer-events-auto';
  }
}
