import { useState } from 'react'
import MaterialIcon from "../../components/MaterialIcon";

export interface ConversationInfo {
  title: string
  platform: string
  model: string
  metrics: {
    messages: number
    codeBlocks: number
    tables: number
    recency: string
  }
}

export interface ExportConfigProps {
  navigateTo: (screen: string, conversation?: ConversationInfo) => void
  selectedConversation?: ConversationInfo
}

/** Export Configuration Screen */
export default function ExportConfig({ navigateTo, selectedConversation }: ExportConfigProps) {
  // State for export scope
  const [scope, setScope] = useState<'all' | 'custom' | 'prompts' | 'responses'>('all')
  const [customSelected, setCustomSelected] = useState(false)
  const [includeTimestamps, setIncludeTimestamps] = useState(true)
  const [includeCodeBlocks, setIncludeCodeBlocks] = useState(true)
  const [includeTables, setIncludeTables] = useState(true)
  const [includePlatformAttribution, setIncludePlatformAttribution] = useState(true)
  const [pdfTheme, setPdfTheme] = useState<'light' | 'dark' | 'minimal'>('light')
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4')
  const [filename, setFilename] = useState('{{platform}}-{{date}}-{{title_slug}}')
  const [progress, setProgress] = useState(0)
  const [format, setFormat] = useState<'pdf' | 'markdown' | 'text'>('pdf')
  const [anonymize, setAnonymize] = useState(false)
  const [includePageNumbers, setIncludePageNumbers] = useState(true)
  const [margins, setMargins] = useState<'standard' | 'compact'>('standard')

  // Mock conversation data
  const conv: ConversationInfo = selectedConversation || {
    title: 'Deep Learning Architecture & Transformer Attention Mechanisms',
    platform: 'ChatGPT',
    model: 'ChatGPT 4o',
    metrics: {
      messages: 18,
      codeBlocks: 6,
      tables: 3,
      recency: '14m ago',
    },
  }

  const handleScopeChange = (value: 'all' | 'custom' | 'prompts' | 'responses') => {
    setScope(value)
    if (value === 'custom') {
      setCustomSelected(true)
    } else {
      setCustomSelected(false)
    }
  }

  const handleGenerate = () => {
    setProgress(0)
    // Simulate export progression: five 20% ticks, then return to the library
    let step = 0
    const interval = setInterval(() => {
      step += 1
      setProgress(step * 20)
      if (step >= 5) {
        clearInterval(interval)
        navigateTo('library', conv)
      }
    }, 200)
  }

  const handleCancel = () => {
    navigateTo('library')
  }

  return (
    <div className="min-h-screen bg-background text-primary-text">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-code-inline text-code-inline px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 font-medium">STEP 03 // EXPORT ENGINE</span>
            <span className="text-tertiary text-[12px]">•</span>
            <span className="font-label-sm text-label-sm text-tertiary font-semibold flex items-center gap-1">
              <MaterialIcon name="verified_user" className="text-[15px]" /> Client-Side Execution Only
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Export Settings & Formatting Engine</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Configure document styling, content filtering, and metadata rules for local generation.</p>
        </div>
        {/* Pipeline Status */}
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl shadow-sm">
          <MaterialIcon name="memory" className="text-indigo text-[20px]" />
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Pipeline: <span className="text-on-surface font-semibold font-code-inline">V8-WASM Parser</span></span>
        </div>
      </div>

      {/* Top Summary Card */}
      <div className="relative overflow-hidden rounded-xl bg-gray-50 p-4 shadow-sm">
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-50/30 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo flex items-center justify-center shadow-md shrink-0">
              <MaterialIcon name="description" className="text-[24px]" />
            </div>
            <div>
              <div className="flex items-start gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-indigo-50 text-indigo-600 font-semibold">{conv.model}</span>
                <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-gray-50 text-tertiary">Archived Session</span>
                <span className="font-code-inline text-code-inline text-tertiary">ID: cx_894f29a</span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface mt-1">{conv.title}</h2>
            </div>
          </div>
          {/* Metrics Pills */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2 lg:pt-0">
            <div className="bg-gray-50 px-4 py-3 rounded-lg flex items-center gap-2">
              <MaterialIcon name="chat" className="text-indigo text-[20px]" />
              <div>
                <p className="font-headline-sm text-headline-sm text-on-surface leading-none">{conv.metrics.messages}</p>
                <p className="font-label-sm text-label-sm text-tertiary mt-0.5">Messages</p>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 rounded-lg flex items-center gap-2">
              <MaterialIcon name="terminal" className="text-secondary text-[20px]" />
              <div>
                <p className="font-headline-sm text-headline-sm text-on-surface leading-none">{conv.metrics.codeBlocks}</p>
                <p className="font-label-sm text-label-sm text-tertiary mt-0.5">Snippets</p>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 rounded-lg flex items-center gap-2">
              <MaterialIcon name="table_chart" className="text-tertiary text-[20px]" />
              <div>
                <p className="font-headline-sm text-headline-sm text-on-surface leading-none">{conv.metrics.tables}</p>
                <p className="font-label-sm text-label-sm text-tertiary mt-0.5">Tables</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Content & Filter Rules (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Filter Card */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MaterialIcon name="filter_list" className="text-indigo text-[22px]" />
                <h3 className="font-headline-md text-headline-md text-on-surface">Message Scope & Filtering</h3>
              </div>
              <span className="font-label-sm text-label-sm text-tertiary font-medium">Rule Engine 2.1</span>
            </div>

            {/* Radio Group Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="scope-selection-group">
              <label className={`relative flex flex-col p-3 rounded-lg cursor-pointer text-gray-900 transition-all ${scope === 'all' ? 'bg-indigo-50/25 shadow-sm' : 'bg-gray-50 hover:bg-gray-100'}`}>
                <input
                  checked={scope === 'all'}
                  className="sr-only peer"
                  name="message_scope"
                  type="radio"
                  value="all"
                  onChange={() => handleScopeChange('all')}
                />
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm font-headline-sm">Entire conversation</span>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center ${scope === 'all' ? 'bg-indigo' : 'bg-gray-200'}`}>
                    {scope === 'all' && <span className="w-1.5 h-1.5 rounded-full bg-indigo"></span>}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-tertiary mt-1">Full context (18 detected messages)</p>
              </label>
              <label className={`relative flex flex-col p-3 rounded-lg cursor-pointer text-gray-900 transition-all ${scope === 'custom' ? 'bg-indigo-50/25 shadow-sm' : 'bg-gray-50 hover:bg-gray-100'}`}>
                <input
                  checked={scope === 'custom'}
                  className="sr-only peer"
                  name="message_scope"
                  type="radio"
                  value="custom"
                  onChange={() => handleScopeChange('custom')}
                />
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm font-headline-sm">Custom selection</span>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center ${scope === 'custom' ? 'bg-indigo' : 'bg-gray-200'}`}>
                    {scope === 'custom' && <span className="w-1.5 h-1.5 rounded-full bg-indigo"></span>}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-tertiary mt-1">Manual slice (7 of 18 selected)</p>
              </label>
              <label className={`relative flex flex-col p-3 rounded-lg cursor-pointer text-gray-900 transition-all ${scope === 'prompts' ? 'bg-indigo-50/25 shadow-sm' : 'bg-gray-50 hover:bg-gray-100'}`}>
                <input
                  checked={scope === 'prompts'}
                  className="sr-only peer"
                  name="message_scope"
                  type="radio"
                  value="prompts"
                  onChange={() => handleScopeChange('prompts')}
                />
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm font-headline-sm">User prompts only</span>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center ${scope === 'prompts' ? 'bg-indigo' : 'bg-gray-200'}`}>
                    {scope === 'prompts' && <span className="w-1.5 h-1.5 rounded-full bg-indigo"></span>}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-tertiary mt-1">Export questions (9 queries)</p>
              </label>
              <label className={`relative flex flex-col p-3 rounded-lg cursor-pointer text-gray-900 transition-all ${scope === 'responses' ? 'bg-indigo-50/25 shadow-sm' : 'bg-gray-50 hover:bg-gray-100'}`}>
                <input
                  checked={scope === 'responses'}
                  className="sr-only peer"
                  name="message_scope"
                  type="radio"
                  value="responses"
                  onChange={() => handleScopeChange('responses')}
                />
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm font-headline-sm">AI responses only</span>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center ${scope === 'responses' ? 'bg-indigo' : 'bg-gray-200'}`}>
                    {scope === 'responses' && <span className="w-1.5 h-1.5 rounded-full bg-indigo"></span>}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-tertiary mt-1">Answers & code (9 replies)</p>
              </label>
            </div>
            {customSelected && (
              <button
                className="px-4 py-2.5 rounded-lg text-indigo-600 font-headline-sm text-headline-sm bg-indigo-50 hover:bg-indigo-100 transition-colors self-start"
                type="button"
                onClick={() => navigateTo('message-selection')}
              >
                Choose messages for this custom export
              </button>
            )}

            {/* Toggles using React state */}
            <div className="flex flex-col gap-2">
              {/* Toggle 1: Timestamps */}
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2">
                  <MaterialIcon name="schedule" className="text-tertiary text-[20px]" />
                  <div>
                    <p className="font-body-md text-body-md font-medium text-on-surface">Include timestamps on messages</p>
                    <p className="font-body-sm text-body-sm text-tertiary">Inject ISO/locale timestamps (e.g., 10:42 AM) at message head</p>
                  </div>
                </div>
                <button
                  aria-checked={includeTimestamps}
                  className={`w-11 h-6 rounded-full relative p-0.5 transition-colors focus:outline-none ${includeTimestamps ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  onClick={() => setIncludeTimestamps(prev => !prev)}
                  role="switch"
                  type="button"
                >
                  <span className={`block w-5 h-5 rounded-full bg-indigo-500 transform transition-transform shadow ${includeTimestamps ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>
              {/* Toggle 2: Code Blocks */}
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2">
                  <MaterialIcon name="code" className="text-tertiary text-[20px]" />
                  <div>
                    <p className="font-body-md text-body-md font-medium text-on-surface">Preserve syntax highlighting in code blocks</p>
                    <p className="font-body-sm text-body-sm text-tertiary">Embedded Prism token colors with monospaced line numbering</p>
                  </div>
                </div>
                <button
                  aria-checked={includeCodeBlocks}
                  className={`w-11 h-6 rounded-full relative p-0.5 transition-colors focus:outline-none ${includeCodeBlocks ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  onClick={() => setIncludeCodeBlocks(prev => !prev)}
                  role="switch"
                  type="button"
                >
                  <span className={`block w-5 h-5 rounded-full bg-indigo-500 transform transition-transform shadow ${includeCodeBlocks ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>
              {/* Toggle 3: Tables */}
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2">
                  <MaterialIcon name="data_table" className="text-tertiary text-[20px]" />
                  <div>
                    <p className="font-body-md text-body-md font-medium text-on-surface">Format data tables as styled markdown/PDF tables</p>
                    <p className="font-body-sm text-body-sm text-tertiary">Renders striped data grids with responsive horizontal scroll wrappers</p>
                  </div>
                </div>
                <button
                  aria-checked={includeTables}
                  className={`w-11 h-6 rounded-full relative p-0.5 transition-colors focus:outline-none ${includeTables ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  onClick={() => setIncludeTables(prev => !prev)}
                  role="switch"
                  type="button"
                >
                  <span className={`block w-5 h-5 rounded-full bg-indigo-500 transform transition-transform shadow ${includeTables ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>
              {/* Toggle 4: Platform Attribution */}
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2">
                  <MaterialIcon name="branding_watermark" className="text-tertiary text-[20px]" />
                  <div>
                    <p className="font-body-md text-body-md font-medium text-on-surface">Include platform attribution & model watermark</p>
                    <p className="font-body-sm text-body-sm text-tertiary">Appends OpenAI ChatGPT 4o metadata header badge on cover page</p>
                  </div>
                </div>
                <button
                  aria-checked={includePlatformAttribution}
                  className={`w-11 h-6 rounded-full relative p-0.5 transition-colors focus:outline-none ${includePlatformAttribution ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  onClick={() => setIncludePlatformAttribution(prev => !prev)}
                  role="switch"
                  type="button"
                >
                  <span className={`block w-5 h-5 rounded-full bg-indigo-500 transform transition-transform shadow ${includePlatformAttribution ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>
              {/* Toggle 5: Anonymize */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <MaterialIcon name="enhanced_encryption" className="text-error text-[20px]" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-body-md text-body-md font-medium text-on-surface">Anonymize personal info / scrub sensitive keys</p>
                      <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-error-container text-on-error-container font-semibold">Regex Guard</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-tertiary">Auto-detect emails, bearer tokens, API keys and replace with [REDACTED]</p>
                  </div>
                </div>
                <button
                  aria-checked={anonymize}
                  className={`w-11 h-6 rounded-full relative p-0.5 transition-colors focus:outline-none ${anonymize ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  onClick={() => setAnonymize(prev => !prev)}
                  role="switch"
                  type="button"
                >
                  <span className={`block w-5 h-5 rounded-full bg-indigo-500 transform transition-transform shadow ${anonymize ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>
            </div>
          </div>

          {/* Filename Pattern Builder */}
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <MaterialIcon name="edit_note" className="text-indigo text-[18px]" /> Filename Pattern Builder
              </label>
              <div className="flex gap-2">
                <span className="font-code-inline text-code-inline text-tertiary px-2 py-1 rounded bg-gray-900">Variables: " + platform + ", " + date + ", " + title_slug + "</span>
              </div>
            </div>
            <div className="relative">
              <input
                className="w-full bg-gray-900 text-gray-100 font-code-inline text-code-inline px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow-inner"
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
              />
              <div className="flex items-center justify-between pt-2 text-tertiary">
                <span className="font-label-sm text-label-sm flex items-center gap-2">
                  <MaterialIcon name="output" className="text-[16px] text-tertiary" /> Output Target:
                </span>
                <span className="font-code-inline text-code-inline font-medium bg-indigo-50/40 px-2 py-0.5 rounded">chatgpt-2025-05-14-deep-learning-architecture.pdf</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Document & Format Styling (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Output Format Picker */}
          <div className="bg-gray-50 rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-md text-headline-md text-on-surface">Export Format</h3>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-gray-100 text-tertiary font-medium">Vector & Text</span>
            </div>
            {/* Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-gray-100 p-2 rounded-xl">
              <button
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg font-headline-sm text-headline-sm transition-all ${format === 'pdf' ? 'bg-gray-50 text-indigo-600 shadow-sm' : 'text-tertiary hover:text-on-surface hover:bg-gray-100'}`}
                type="button"
                onClick={() => setFormat('pdf')}
              >
                <MaterialIcon name="picture_as_pdf" className="text-[20px] mb-1" />
                <span className="text-[13px]">PDF Doc</span>
              </button>
              <button
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg font-headline-sm text-headline-sm transition-all ${format === 'markdown' ? 'bg-gray-50 text-indigo-600 shadow-sm' : 'text-tertiary hover:text-on-surface hover:bg-gray-100'}`}
                type="button"
                onClick={() => setFormat('markdown')}
              >
                <MaterialIcon name="markdown" className="text-[20px] mb-1" />
                <span className="text-[13px]">Markdown</span>
              </button>
              <button
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg font-headline-sm text-headline-sm transition-all ${format === 'text' ? 'bg-gray-50 text-indigo-600 shadow-sm' : 'text-tertiary hover:text-on-surface hover:bg-gray-100'}`}
                type="button"
                onClick={() => setFormat('text')}
              >
                <MaterialIcon name="text_snippet" className="text-[20px] mb-1" />
                <span className="text-[13px]">Plain Text</span>
              </button>
            </div>
          </div>

          {/* PDF Theme Presets */}
          <div className="bg-gray-50 rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Document Theme</h3>
                <p className="font-body-sm text-body-sm text-tertiary">Select visual aesthetic for rendered typography</p>
              </div>
              <MaterialIcon name="palette" className="text-secondary text-[22px]" />
            </div>
            <div className="flex flex-col gap-2">
              {/* Light Theme (Active) */}
              <div
                className={`p-3 rounded-xl cursor-pointer flex items-center justify-between gap-2 ${pdfTheme === 'light' ? 'bg-indigo-50/20 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 transition-colors'}`}
                onClick={() => setPdfTheme('light')}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-900 shadow flex items-center justify-center text-indigo">
                    <MaterialIcon name="light_mode" className="text-[20px]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm font-headline-sm text-on-surface">Light Standard</span>
                      {pdfTheme === 'light' && <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-indigo text-on-primary">Active</span>}
                    </div>
                    <p className="font-body-sm text-body-sm text-tertiary mt-0.5">Clean white, high contrast, indigo code borders</p>
                  </div>
                </div>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-on-indigo ${pdfTheme === 'light' ? 'bg-indigo' : 'bg-gray-200'}`}>
                  {pdfTheme === 'light' && <MaterialIcon name="check" className="text-[14px]" />}
                </span>
              </div>
              {/* Dark Theme */}
              <div
                className={`p-3 rounded-xl cursor-pointer flex items-center justify-between gap-2 ${pdfTheme === 'dark' ? 'bg-indigo-50/20 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 transition-colors'}`}
                onClick={() => setPdfTheme('dark')}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-900 shadow flex items-center justify-center text-inverse-on-surface">
                    <MaterialIcon name="dark_mode" className="text-[20px]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm font-headline-sm text-on-surface">Developer Dark</span>
                      {pdfTheme === 'dark' && <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-indigo text-on-primary">Active</span>}
                    </div>
                    <p className="font-body-sm text-body-sm text-tertiary mt-0.5">Slate canvas, dimmed syntax, terminal palette</p>
                  </div>
                </div>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-on-indigo ${pdfTheme === 'dark' ? 'bg-indigo' : 'bg-gray-200'}`}>
                  {pdfTheme === 'dark' && <MaterialIcon name="check" className="text-[14px]" />}
                </span>
              </div>
              {/* Minimal Theme */}
              <div
                className={`p-3 rounded-xl cursor-pointer flex items-center justify-between gap-2 ${pdfTheme === 'minimal' ? 'bg-indigo-50/20 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 transition-colors'}`}
                onClick={() => setPdfTheme('minimal')}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-900 shadow flex items-center justify-center text-on-surface">
                    <MaterialIcon name="format_ink_highlighter" className="text-[20px]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm font-headline-sm text-on-surface">Print Minimalist</span>
                      {pdfTheme === 'minimal' && <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-indigo text-on-primary">Active</span>}
                    </div>
                    <p className="font-body-sm text-body-sm text-tertiary mt-0.5">Editorial serif, monochrome ink, ink-saving margins</p>
                  </div>
                </div>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-on-indigo ${pdfTheme === 'minimal' ? 'bg-indigo' : 'bg-gray-200'}`}>
                  {pdfTheme === 'minimal' && <MaterialIcon name="check" className="text-[14px]" />}
                </span>
              </div>
            </div>
          </div>

          {/* Page Setup */}
          <div className="bg-gray-50 rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <h3 className="font-headline-md text-headline-md text-on-surface">Print & Page Geometry</h3>
            {/* Page Size Switch */}
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider font-semibold">Page Size</label>
              <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-lg">
                <button className={`py-1.5 rounded-md font-headline-sm text-headline-sm text-center ${pageSize === 'a4' ? 'bg-gray-50 text-on-surface shadow-xs' : 'text-tertiary hover:text-on-surface'}`} type="button" onClick={() => setPageSize('a4')}>A4</button>
                <button className={`py-1.5 rounded-md font-headline-sm text-headline-sm text-center ${pageSize === 'letter' ? 'bg-gray-50 text-on-surface shadow-xs' : 'text-tertiary hover:text-on-surface'}`} type="button" onClick={() => setPageSize('letter')}>US Letter</button>
              </div>
            </div>
            {/* Margin Switch */}
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider font-semibold">Margins</label>
              <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-lg">
                <button className={`py-1.5 rounded-md font-headline-sm text-headline-sm text-center ${margins === 'standard' ? 'bg-gray-50 text-on-surface shadow-xs' : 'text-tertiary hover:text-on-surface'}`} type="button" onClick={() => setMargins('standard')}>20mm</button>
                <button className={`py-1.5 rounded-md font-headline-sm text-headline-sm text-center ${margins === 'compact' ? 'bg-gray-50 text-on-surface shadow-xs' : 'text-tertiary hover:text-on-surface'}`} type="button" onClick={() => setMargins('compact')}>Compact</button>
              </div>
            </div>
            {/* Page Numbering Toggle */}
            <div className="flex items-center justify-between rounded-lg bg-gray-100 p-3 mt-2">
              <div className="flex items-center gap-2">
                <MaterialIcon name="format_list_numbered" className="text-indigo text-[20px]" />
                <span className="font-body-md text-body-md font-medium text-on-surface">Page Numbering ("Page X of Y")</span>
              </div>
              <button
                aria-checked={includePageNumbers}
                className={`w-11 h-6 rounded-full relative p-0.5 transition-colors focus:outline-none ${includePageNumbers ? 'bg-indigo-600' : 'bg-gray-200'}`}
                onClick={() => setIncludePageNumbers(prev => !prev)}
                role="switch"
                type="button"
              >
                <span className={`block w-5 h-5 rounded-full bg-indigo-500 transform transition-transform shadow ${includePageNumbers ? 'translate-x-5' : 'translate-x-0'}`}></span>
              </button>
            </div>
            {/* Page Break Preview Mini Indicator */}
            <div className="p-3 rounded-lg bg-gray-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MaterialIcon name="layers" className="text-tertiary text-[20px]" />
                <span className="font-label-sm text-label-sm text-on-surface">Estimated output pagination</span>
              </div>
              <span className="font-code-inline text-code-inline font-semibold text-tertiary bg-gray-900 px-2 py-0.5 rounded shadow-xs">~ 4 Pages</span>
            </div>
          </div>
        </div>
      </div>

      {progress > 0 && (
        <div className="max-w-7xl mx-auto w-full px-6 pb-4" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="flex items-center justify-between font-label-sm text-label-sm text-tertiary mb-1">
            <span>Generating export…</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-0 left-0 right-0 z-40 bg-gray-50/95 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.05)] py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Info Text */}
          <div className="flex items-center gap-2 text-tertiary">
            <MaterialIcon name="lock" className="text-[20px]" />
            <span className="font-body-sm text-body-sm">Export renders via browser sandbox. Zero bytes transmitted to remote servers.</span>
          </div>
          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              className="px-4 py-2.5 rounded-lg text-on-surface font-headline-sm text-headline-sm bg-gray-100 hover:bg-gray-50 transition-colors"
              type="button"
              onClick={handleCancel}
            >
              Cancel & Return
            </button>
            <button
              className="px-4 py-2.5 rounded-lg text-indigo-600 font-headline-sm text-headline-sm bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
              type="button"
            >
              Preview Document
            </button>
            <button
              className="px-4 lg:px-6 py-2.5 rounded-lg text-on-indigo font-headline-sm text-headline-sm bg-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-md"
              type="button"
              onClick={handleGenerate}
            >
              <MaterialIcon name="download_for_offline" className="text-[20px]" />
              <span>Generate & Save {format === 'pdf' ? 'PDF' : format === 'markdown' ? 'Markdown' : 'Text'} (Local)</span>
            </button>
          </div>
        </div>
      </div>

      
    </div>
  )
}

