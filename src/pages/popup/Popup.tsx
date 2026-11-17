import { useState } from 'react'
import type { ExportConversation } from '../../lib/export'
import { buildExportFile, downloadFile } from '../../lib/export'
import MaterialIcon from "../../components/MaterialIcon";

export interface ConversationMetrics {
  messages: number
  codeBlocks: number
  tables: number
  recency: string
}

export interface ConversationInfo {
  title: string
  platform: string
  model: string
  metrics: ConversationMetrics
}

export interface PopupProps {
  navigateTo: (screen: string, conversation?: ConversationInfo) => void
  conversation?: ConversationInfo
  /** Full captured conversation (with messages) when running as an extension. */
  capturedConversation?: ExportConversation
}

/** Chrome Extension Popup Screen */
function Popup({ navigateTo, conversation, capturedConversation }: PopupProps) {
  const [quickExportState, setQuickExportState] = useState<'idle' | 'processing' | 'saved' | 'error'>('idle')
  const [format, setFormat] = useState<'pdf' | 'md'>('pdf')

  const metrics: ConversationMetrics = conversation?.metrics ?? {
    messages: 18,
    codeBlocks: 6,
    tables: 3,
    recency: '14m ago',
  }

  // Mock data for conversation
  const conv = conversation || {
    title: 'Deep Learning Architecture & Transformer Attention Mechanisms',
    platform: 'ChatGPT',
    model: 'ChatGPT 4o',
    metrics,
  }

  // What Quick Export actually writes: the captured conversation when the
  // extension has one, otherwise the demo conversation shown on screen
  // (with no messages — the file says so instead of inventing any).
  const exportSource: ExportConversation = capturedConversation ?? {
    title: conv.title,
    platform: conv.platform,
    model: conv.model,
    messages: [],
    metrics,
  }

  const handleQuickExport = () => {
    if (quickExportState !== 'idle') return
    setQuickExportState('processing')
    window.setTimeout(() => {
      try {
        const file = buildExportFile(exportSource, format)
        if (!downloadFile(file)) throw new Error('Download could not start.')
        setQuickExportState('saved')
      } catch {
        setQuickExportState('error')
      }
      window.setTimeout(() => {
        setQuickExportState('idle')
      }, 2200)
    }, 900)
  }

  return (
    <div className="min-h-screen bg-background text-primary-text">
      {/* Ambient Backdrop Layer */}
      <div className="absolute inset-0 bg-indigo-50 pointer-events-none">
        <div className="absolute -top-32 -left-20 w-96 h-96 rounded-2xl bg-indigo-100/20 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-2xl bg-violet-100/25 blur-3xl"></div>
        <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern height="28" id="diag-dots" patternUnits="userSpaceOnUse" width="28">
              <circle className="text-[var(--on-surface)]" cx="2" cy="2" fill="currentColor" r="1.5"></circle>
            </pattern>
            <rect fill="url(#diag-dots)" height="100%" width="100%"></rect>
          </defs>
          <rect fill="url(#diag-dots)" height="100%" width="100%"></rect>
        </svg>
      </div>

      {/* Main Chrome Browser Viewport Mockup */}
      <div className="w-full max-w-6xl mx-auto flex flex-col xl:flex-row items-center justify-center gap-8 overflow-hidden">
        {/* Simulated Active Conversation Surface */}
        <div className="w-full xl:w-7/12 flex flex-col bg-white rounded-xl overflow-hidden">
          {/* Mock Browser Chrome Header */}
          <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <div className="ml-2 flex items-center gap-2 px-4 py-1 bg-gray-50 rounded-lg shadow-sm">
                <MaterialIcon name="lock" className="text-[15px] text-tertiary" />
                <span className="font-code-inline text-code-inline text-on-surface-variant">chatgpt.com/c/67a998e1-attn</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-gray-100 text-tertiary font-code-inline text-[11px] font-medium">DOM Scanner: Hooked</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo">
                <MaterialIcon name="extension" className="text-[17px]" />
              </div>
            </div>
          </div>
          {/* Simulated Active Conversation Surface */}
          <div className="p-6 flex flex-col gap-4 bg-gray-50 backdrop-blur-sm max-h-[520px] overflow-hidden relative">
            {/* User Prompt */}
            <div className="flex gap-4 items-start max-w-2xl">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-900 flex items-center justify-center font-medium shrink-0">ME</div>
              <div className="bg-gray-200 p-4 rounded-xl text-gray-900 font-body-md text-body-md leading-relaxed">
                Synthesize the multi-head attention equation in modern Transformer models and outline the computational complexity along sequence length N.
              </div>
            </div>
            {/* Assistant Response Mock */}
            <div className="flex gap-4 items-start max-w-2xl pl-2">
              <div className="w-8 h-8 rounded-full bg-indigo flex items-center justify-center text-white shrink-0 shadow-sm">
                <MaterialIcon name="auto_awesome" className="text-[18px]" />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm font-headline-sm text-on-surface">ChatGPT 4o</span>
                  <span className="font-code-inline text-[11px] text-tertiary">Active Target Thread</span>
                </div>
                <p className="font-body-md text-body-md text-tertiary">
                  The scaled dot-product attention maps queries (Q) and key-value pairs (K, V) to outputs according to:
                </p>
                {/* Code block preview inside tab */}
                <div className="bg-gray-800 rounded-lg p-4 text-gray-100 font-code-inline text-code-inline flex flex-col gap-2 shadow-inner">
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="font-label-sm font-label-sm uppercase">Python / PyTorch Implementation</span>
                    <span className="text-[11px]">torch.nn.functional</span>
                  </div>
                  <code>scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(d_k)</code>
                  <code>attn_weights = F.softmax(scores, dim=-1)</code>
                  <code>output = torch.matmul(attn_weights, v)</code>
                </div>
                <div className="flex items-center gap-2 mt-1 text-tertiary font-body-sm text-body-sm">
                  <MaterialIcon name="check_circle" className="text-[16px] text-tertiary" />
                  <span>Context tokens: 14,280 | Streaming concluded.</span>
                </div>
              </div>
            </div>
            {/* Gradient Fade overlay */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none flex items-end justify-center pb-4">
              <span className="font-code-inline text-[11px] text-tertiary">Background Thread: Active DOM Parsed (18 turns)</span>
            </div>
          </div>
        </div>

        {/* Extension Popup Device Window (390px Width Floating Card) */}
        <div className="w-full sm:w-[390px] shrink-0 bg-white rounded-xl shadow-xl flex flex-col overflow-hidden relative transition-all">
          {/* Header */}
          <header className="px-6 py-4 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo flex items-center justify-center shadow-sm">
                <MaterialIcon name="download_for_offline" className="text-[18px]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-headline-sm font-headline-sm text-on-surface">Chat Saver</span>
                <span className="px-2 py-0.5 rounded bg-gray-100 font-code-inline text-[11px] text-indigo font-medium">v1.4.2</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-tertiary transition-colors" title="Settings & Presets">
                <MaterialIcon name="settings" className="text-[19px]" />
              </button>
              <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-tertiary transition-colors" title="Dismiss Popup">
                <MaterialIcon name="close" className="text-[19px]" />
              </button>
            </div>
          </header>

          {/* Body Content */}
          <div className="p-6 flex flex-col gap-4">
            {/* Active Target Engine Pill */}
            <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-gray-100">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
                </span>
                <span className="font-label-sm font-semibold text-gray-900">Connected to ChatGPT</span>
                <span className="font-code-inline text-[10px] text-indigo px-1.5 py-0.5 rounded bg-gray-900">Auto-detect</span>
              </div>
              {/* Detected Conversation Hero Card */}
              <div className="bg-gray-100 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-indigo font-bold">Detected Active Conversation</span>
                    <h3 className="font-headline-sm font-headline-sm text-gray-900 leading-snug line-clamp-2">
                      {conv.title}
                    </h3>
                  </div>
                  <span className="px-2 py-1 rounded bg-indigo-50 text-on-indigo font-label-sm text-[11px] font-semibold whitespace-nowrap">
                    {conv.model}
                  </span>
                </div>
                {/* Granular Metric Badges */}
                <div className="grid grid-cols-4 gap-2 pt-1 text-center font-code-inline text-[11px]">
                  <div className="bg-gray-50 py-1 px-1 rounded flex flex-col">
                    <span className="font-bold text-gray-900 text-[12px]">{conv.metrics.messages}</span>
                    <span className="text-tertiary text-[10px]">Messages</span>
                  </div>
                  <div className="bg-gray-50 py-1 px-1 rounded flex flex-col">
                    <span className="font-bold text-gray-900 text-[12px]">{conv.metrics.codeBlocks}</span>
                    <span className="text-tertiary text-[10px]">Code blocks</span>
                  </div>
                  <div className="bg-gray-50 py-1 px-1 rounded flex flex-col">
                    <span className="font-bold text-gray-900 text-[12px]">{conv.metrics.tables}</span>
                    <span className="text-tertiary text-[10px]">Tables</span>
                  </div>
                  <div className="bg-gray-50 py-1 px-1 rounded flex flex-col">
                    <span className="font-bold text-gray-900 text-[12px]">{conv.metrics.recency}</span>
                    <span className="text-tertiary text-[10px]">Recency</span>
                  </div>
                </div>
              </div>
              {/* Primary Actions */}
              <div className="flex flex-col gap-2">
                {/* Big Indigo Quick Export Button Group */}
                <div className="flex items-center rounded-xl bg-indigo-600 text-white shadow-sm overflow-hidden group">
                  <button className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 font-label-md font-semibold hover:bg-indigo-500 transition-colors ${quickExportState === 'processing' ? 'animate-pulse' : ''}`} id="quickExportBtn" onClick={() => handleQuickExport()}>
                    <MaterialIcon name="bolt" className="text-[18px]" />
                    <span>{quickExportState === 'processing' ? 'Exporting…' : quickExportState === 'saved' ? 'Export saved' : quickExportState === 'error' ? 'Export failed — try again' : 'Quick Export Full Conversation'}</span>
                  </button>
                  <div className="w-px h-6 bg-indigo-100/20"></div>
                  <button className="px-2.5 py-2.5 hover:bg-indigo-500 transition-colors flex items-center justify-center" id="formatDropdownToggle" title={format} onClick={() => setFormat(prev => prev === 'pdf' ? 'md' : 'pdf')}>
                    <MaterialIcon name="arrow_drop_down" className="text-[18px]" />
                  </button>
                </div>
                {/* Selective Export Secondary Button */}
                <button className="w-full py-2 px-4 rounded-xl bg-gray-100 hover:bg-gray-50 text-gray-900 font-label-md font-medium flex items-center justify-center gap-2 transition-colors" onClick={() => navigateTo('message-selection')}>
                  <MaterialIcon name="checklist_rtl" className="text-[18px] text-tertiary" />
                  <span>Selective Export (Choose Messages)</span>
                </button>
              </div>
              {/* Direct Format Export Tiles */}
              <div className="flex flex-col gap-2">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary font-semibold">Instant Format Direct Download</span>
                <div className="grid grid-cols-2 gap-2">
                  {/* PDF Card */}
                  <button className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-left flex flex-col gap-1 transition-all shadow-sm group" onClick={() => { setFormat('pdf'); handleQuickExport() }}>
                    <div className="flex items-center justify-between">
                      <div className="w-6 h-6 rounded-lg bg-red-100 text-red flex items-center justify-center">
                        <MaterialIcon name="picture_as_pdf" className="text-[16px]" />
                      </div>
                      <MaterialIcon name="download" className="text-[15px] text-tertiary group-hover:text-indigo transition-colors" />
                    </div>
                    <span className="font-headline-sm font-semibold text-gray-900 mt-1">Formatted PDF</span>
                    <span className="font-body-sm text-[11px] text-tertiary line-clamp-1">With syntax highlighting & tables</span>
                  </button>
                  {/* Markdown Card */}
                  <button className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-left flex flex-col gap-1 transition-all shadow-sm group" onClick={() => { setFormat('md'); handleQuickExport() }}>
                    <div className="flex items-center justify-between">
                      <div className="w-6 h-6 rounded-lg bg-gray-100 text-indigo flex items-center justify-center">
                        <MaterialIcon name="markdown" className="text-[16px]" />
                      </div>
                      <MaterialIcon name="download" className="text-[15px] text-tertiary group-hover:text-indigo transition-colors" />
                    </div>
                    <span className="font-headline-sm font-semibold text-gray-900 mt-1">Clean Markdown</span>
                    <span className="font-body-sm text-[11px] text-tertiary line-clamp-1">Obsidian & GitHub ready .md</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Extension Footer Bar & Security Assurance */}
            <footer className="p-6 bg-gray-50 flex flex-col gap-4">
              {/* Text Link to Full Library */}
              <div className="flex items-center justify-between">
                <a
                  className="font-label-md font-medium text-indigo flex items-center gap-1 hover:underline"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    navigateTo('library')
                  }}
                >
                  <span>Open Full Chat Library</span>
                  <MaterialIcon name="north_east" className="text-[16px]" />
                </a>
                <span className="font-code-inline text-[11px] text-tertiary">Storage: 4.2 MB</span>
              </div>
              {/* Privacy Indicator Banner */}
              <div className="p-3 rounded-lg bg-gray-50 flex items-center gap-2">
                <MaterialIcon name="shield" className="text-[16px] text-tertiary shrink-0" />
                <p className="font-body-sm text-[11px] text-tertiary leading-tight">
                  <strong className="text-gray-900 font-semibold">100% On-Device:</strong> Your conversations never leave your browser or touch cloud telemetry.
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup