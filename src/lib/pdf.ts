// Chat Saver — minimal dependency-free PDF writer (PDF 1.4).
// One built-in font (Helvetica), A4 pages, word-wrapped text, page numbers.
// Text is sanitised to WinAnsi (printable ASCII) because the built-in font
// has no other glyphs; smart punctuation is mapped to ASCII equivalents
// first, anything else becomes '?'. Wrapping uses the real Helvetica AFM
// widths, so lines never overflow the page.
import type { ExportConversation } from './export'
import { roleLabel } from './export'

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const MARGIN = 48
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

const TITLE_SIZE = 18
const META_SIZE = 10
const HEADING_SIZE = 13
const BODY_SIZE = 11
const BODY_LEADING = 15
const FOOTER_SIZE = 9

const INDIGO: [number, number, number] = [0.31, 0.275, 0.898]
const GRAY: [number, number, number] = [0.4, 0.4, 0.4]
const BLACK: [number, number, number] = [0, 0, 0]

// Helvetica AFM widths (units per 1000 em) for printable ASCII.
const HELVETICA_WIDTHS: Record<string, number> = {
  ' ': 278, '!': 278, '"': 355, '#': 556, '$': 556, '%': 889, '&': 667, "'": 191,
  '(': 333, ')': 333, '*': 389, '+': 584, ',': 278, '-': 333, '.': 278, '/': 278,
  '0': 556, '1': 556, '2': 556, '3': 556, '4': 556, '5': 556, '6': 556, '7': 556,
  '8': 556, '9': 556, ':': 278, ';': 278, '<': 584, '=': 584, '>': 584, '?': 556,
  '@': 1015, A: 667, B: 667, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722,
  I: 278, J: 500, K: 667, L: 556, M: 833, N: 722, O: 778, P: 667, Q: 778,
  R: 722, S: 667, T: 611, U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611,
  '[': 278, '\\': 278, ']': 278, '^': 469, '_': 556, '`': 333, a: 556, b: 556,
  c: 500, d: 556, e: 556, f: 278, g: 556, h: 556, i: 222, j: 222, k: 500,
  l: 222, m: 833, n: 556, o: 556, p: 556, q: 556, r: 333, s: 500, t: 278,
  u: 556, v: 500, w: 722, x: 500, y: 500, z: 500, '{': 334, '|': 260,
  '}': 334, '~': 584,
}

const REPLACEMENTS: Record<string, string> = {
  '—': '-', '–': '-', '―': '-', '“': '"', '”': '"', '‘': "'", '’': "'",
  '…': '...', '•': '-', '·': '-', '→': '->', '←': '<-', '✓': 'v', '×': 'x',
  ' ': ' ',
}

function sanitize(text: string): string {
  return [...text]
    .map((ch) => {
      if (ch === '\t') return '    '
      if (ch === '\r' || ch === '\n') return ch
      const code = ch.codePointAt(0) ?? 0
      if (code >= 32 && code <= 126) return ch
      return REPLACEMENTS[ch] ?? '?'
    })
    .join('')
}

function escapePdf(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

function textWidth(text: string, size: number): number {
  let total = 0
  for (const ch of text) total += HELVETICA_WIDTHS[ch] ?? 556
  return (total / 1000) * size
}

function wrapLine(line: string, size: number, maxWidth: number): string[] {
  const words = line.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (textWidth(candidate, size) <= maxWidth) {
      current = candidate
      continue
    }
    if (current) lines.push(current)
    // A single over-long word is hard-split by measured width.
    let rest = word
    while (textWidth(rest, size) > maxWidth && rest.length > 1) {
      let cut = rest.length
      while (cut > 1 && textWidth(rest.slice(0, cut), size) > maxWidth) cut -= 1
      lines.push(rest.slice(0, cut))
      rest = rest.slice(cut)
    }
    current = rest
  }
  if (current) lines.push(current)
  return lines
}

export function buildPdf(conversation: ExportConversation): Uint8Array<ArrayBuffer> {
  const pages: string[] = []
  let ops: string[] = []
  let y = PAGE_HEIGHT - MARGIN
  let pageNumber = 1

  const closePage = (): void => {
    const footer = `Page ${pageNumber}`
    const footerX = (PAGE_WIDTH - textWidth(footer, FOOTER_SIZE)) / 2
    ops.push(`0.400 0.400 0.400 rg`)
    ops.push(`BT /F1 ${FOOTER_SIZE} Tf ${footerX.toFixed(2)} 32 Td (${footer}) Tj ET`)
    pages.push(ops.join('\n'))
    ops = []
    y = PAGE_HEIGHT - MARGIN
    pageNumber += 1
  }

  const ensureSpace = (needed: number): void => {
    if (y - needed < MARGIN + 24) closePage()
  }

  const drawLine = (text: string, size: number, leading: number, color: [number, number, number]): void => {
    ensureSpace(leading)
    const [r, g, b] = color
    ops.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`)
    ops.push(`BT /F1 ${size} Tf ${MARGIN} ${y.toFixed(2)} Td (${escapePdf(text)}) Tj ET`)
    y -= leading
  }

  const drawWrapped = (text: string, size: number, leading: number, color: [number, number, number]): void => {
    for (const paragraph of sanitize(text).split('\n')) {
      const wrapped = wrapLine(paragraph, size, CONTENT_WIDTH)
      if (wrapped.length === 0) {
        y -= leading / 2
        continue
      }
      for (const line of wrapped) drawLine(line, size, leading, color)
    }
  }

  // Title
  drawWrapped(conversation.title, TITLE_SIZE, TITLE_SIZE + 8, INDIGO)
  y -= 4

  // Metadata
  const meta: string[] = [
    `Platform: ${conversation.platform}`,
    `Model: ${conversation.model}`,
  ]
  if (conversation.url) meta.push(`Source: ${conversation.url}`)
  if (conversation.capturedAt) meta.push(`Captured: ${conversation.capturedAt}`)
  meta.push(
    `Messages: ${conversation.metrics.messages} · Code blocks: ${conversation.metrics.codeBlocks} · Tables: ${conversation.metrics.tables}`,
  )
  for (const line of meta) drawWrapped(line, META_SIZE, META_SIZE + 5, GRAY)
  y -= 6

  // Rule under the header
  ensureSpace(8)
  ops.push(`0.850 0.870 0.960 RG 0.75 w ${MARGIN} ${y.toFixed(2)} m ${(PAGE_WIDTH - MARGIN).toFixed(2)} ${y.toFixed(2)} l S`)
  y -= 18

  // Messages
  if (conversation.messages.length === 0) {
    drawWrapped(
      'No messages captured yet. Open an AI chat conversation, tap "Save this chat" on the page, then export again.',
      BODY_SIZE,
      BODY_LEADING,
      GRAY,
    )
  } else {
    for (const message of conversation.messages) {
      drawWrapped(roleLabel(message.role, conversation.platform), HEADING_SIZE, HEADING_SIZE + 8, INDIGO)
      drawWrapped(message.text, BODY_SIZE, BODY_LEADING, BLACK)
      y -= 10
    }
  }

  closePage()

  // Assemble the PDF. Every string here is ASCII by construction, so
  // string length equals byte length for the xref offsets.
  const pageEntries: { pageId: number; contentId: number }[] = []
  let nextId = 4
  for (let i = 0; i < pages.length; i += 1) {
    pageEntries.push({ pageId: nextId, contentId: nextId + 1 })
    nextId += 2
  }
  const objects: string[] = []
  objects[1] = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj'
  objects[2] =
    `2 0 obj\n<< /Type /Pages /Kids [${pageEntries.map((entry) => `${entry.pageId} 0 R`).join(' ')}] /Count ${pageEntries.length} >>\nendobj`
  objects[3] = '3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj'
  for (let i = 0; i < pages.length; i += 1) {
    const { pageId, contentId } = pageEntries[i]
    const stream = pages[i]
    objects[pageId] =
      `${pageId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
      `/Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>\nendobj`
    objects[contentId] = `${contentId} 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`
  }

  let pdf = '%PDF-1.4\n'
  const offsets: number[] = [0]
  for (let id = 1; id < nextId; id += 1) {
    offsets[id] = pdf.length
    pdf += `${objects[id]}\n`
  }
  const xrefPosition = pdf.length
  pdf += `xref\n0 ${nextId}\n`
  pdf += '0000000000 65535 f \n'
  for (let id = 1; id < nextId; id += 1) {
    pdf += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${nextId} /Root 1 0 R >>\nstartxref\n${xrefPosition}\n%%EOF\n`
  // Copy into a fresh Uint8Array<ArrayBuffer> so the result is a BlobPart
  // under the project's TypeScript lib definitions.
  const encoded = new TextEncoder().encode(pdf)
  const bytes = new Uint8Array(encoded.byteLength)
  bytes.set(encoded)
  return bytes
}
