// Chat Saver — export engine, shared by Quick Export (Popup) and,
// later, Export Config. No dependencies: Markdown is plain text, PDF is
// built by ./pdf.ts, and downloads use a Blob + anchor click, which works
// in the extension popup and in a normal browser tab. Nothing is uploaded
// anywhere — files are generated on-device from the captured conversation.
import { buildPdf } from './pdf'
import type { ConversationMetrics } from '../pages/popup/Popup'

export type ExportRole = 'user' | 'assistant' | 'unknown'

export interface ExportMessage {
  role: ExportRole
  text: string
  hasCode: boolean
  hasTable: boolean
}

export interface ExportConversation {
  title: string
  platform: string
  model: string
  url?: string
  capturedAt?: string
  messages: ExportMessage[]
  metrics: ConversationMetrics
}

export type ExportFormat = 'pdf' | 'md'

/** Runtime guard: never trust a stored value without checking its shape. */
export function isExportConversation(value: unknown): value is ExportConversation {
  if (value === null || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  const metrics = candidate.metrics
  if (metrics === null || typeof metrics !== 'object') return false
  const metricValues = metrics as Record<string, unknown>
  if (
    typeof candidate.title !== 'string' ||
    typeof candidate.platform !== 'string' ||
    typeof candidate.model !== 'string' ||
    typeof metricValues.messages !== 'number' ||
    typeof metricValues.codeBlocks !== 'number' ||
    typeof metricValues.tables !== 'number' ||
    typeof metricValues.recency !== 'string' ||
    !Array.isArray(candidate.messages)
  ) {
    return false
  }
  return (candidate.messages as unknown[]).every((item) => {
    if (item === null || typeof item !== 'object') return false
    const message = item as Record<string, unknown>
    return (
      (message.role === 'user' || message.role === 'assistant' || message.role === 'unknown') &&
      typeof message.text === 'string' &&
      typeof message.hasCode === 'boolean' &&
      typeof message.hasTable === 'boolean'
    )
  })
}

export function roleLabel(role: ExportRole, platform: string): string {
  if (role === 'user') return 'You'
  if (role === 'assistant') return platform
  return 'Message'
}

export function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'conversation'
  )
}

export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function captureDate(conversation: ExportConversation): Date {
  if (!conversation.capturedAt) return new Date()
  const parsed = new Date(conversation.capturedAt)
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed
}

/**
 * Fills the app's filename pattern, e.g. {{platform}}-{{date}}-{{title_slug}}
 * -> chatgpt-2026-11-10-attention-mechanisms.md
 */
export function exportFilename(
  conversation: ExportConversation,
  format: ExportFormat,
  pattern = '{{platform}}-{{date}}-{{title_slug}}',
): string {
  const filled = pattern
    .replaceAll('{{platform}}', slugify(conversation.platform))
    .replaceAll('{{date}}', formatDate(captureDate(conversation)))
    .replaceAll('{{title_slug}}', slugify(conversation.title))
    .replaceAll('{{title}}', slugify(conversation.title))
  const base = filled.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'conversation'
  return `${base}.${format}`
}

export function buildMarkdown(conversation: ExportConversation): string {
  const lines: string[] = []
  lines.push(`# ${conversation.title}`)
  lines.push('')
  lines.push(`- Platform: ${conversation.platform}`)
  lines.push(`- Model: ${conversation.model}`)
  if (conversation.url) lines.push(`- Source: ${conversation.url}`)
  if (conversation.capturedAt) lines.push(`- Captured: ${conversation.capturedAt}`)
  lines.push(
    `- Messages: ${conversation.metrics.messages} · Code blocks: ${conversation.metrics.codeBlocks} · Tables: ${conversation.metrics.tables}`,
  )
  lines.push('')
  if (conversation.messages.length === 0) {
    lines.push(
      '> No messages captured yet. Open an AI chat conversation, tap “Save this chat” on the page, then export again.',
    )
    lines.push('')
  } else {
    for (const message of conversation.messages) {
      lines.push(`## ${roleLabel(message.role, conversation.platform)}`)
      lines.push('')
      lines.push(message.text)
      lines.push('')
    }
  }
  lines.push('---')
  lines.push('')
  lines.push('Exported with Chat Saver (on-device).')
  return lines.join('\n')
}

export interface ExportFile {
  filename: string
  blob: Blob
  mimeType: string
}

export function buildExportFile(conversation: ExportConversation, format: ExportFormat): ExportFile {
  if (format === 'md') {
    return {
      filename: exportFilename(conversation, 'md'),
      blob: new Blob([buildMarkdown(conversation)], { type: 'text/markdown;charset=utf-8' }),
      mimeType: 'text/markdown',
    }
  }
  return {
    filename: exportFilename(conversation, 'pdf'),
    blob: new Blob([buildPdf(conversation)], { type: 'application/pdf' }),
    mimeType: 'application/pdf',
  }
}

/** Triggers a real browser download. Returns false when the download cannot start. */
export function downloadFile(file: ExportFile): boolean {
  try {
    const url = URL.createObjectURL(file.blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = file.filename
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    return true
  } catch {
    return false
  }
}
