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

export interface ConversationCard {
  id: string
  title: string
  platform: string
  tags: string[]
  messages: number
  codeBlocks: number
  tables: number
  date: string
  format: string
  favorite: boolean
  exported: boolean
}

export interface LibraryFilters {
  platform: string
  tag: string
  search: string
  format: string
  collection: 'all' | 'favorites' | 'archived'
}

export interface LibraryProps {
  navigateTo: (screen: string, conversation?: ConversationInfo) => void
  selectedConversation?: ConversationInfo
}

/** Chat Library Dashboard Screen */
export default function Library({ navigateTo, selectedConversation }: LibraryProps) {
  const [filters, setFilters] = useState<LibraryFilters>({
    platform: 'all',
    tag: '',
    search: '',
    format: 'all',
    collection: 'all',
  })

  const [view, setView] = useState<'grid' | 'list'>('grid')

  // Mock data - conversations
  const conversations: ConversationCard[] = [
    {
      id: '1',
      title: 'Transformer Self-Attention Visualizer',
      platform: 'ChatGPT',
      tags: ['#Engineering', '#CodeSnippets'],
      messages: 24,
      codeBlocks: 8,
      tables: 0,
      date: '2 hrs ago',
      format: 'pdf',
      favorite: false,
      exported: true,
    },
    {
      id: '2',
      title: 'Gemini 1.5 Pro Context Window Benchmark',
      platform: 'Google Gemini',
      tags: ['#Research', '#PromptDesign'],
      messages: 14,
      codeBlocks: 0,
      tables: 3,
      date: 'Yesterday',
      format: 'pdf',
      favorite: true,
      exported: true,
    },
    {
      id: '3',
      title: 'Full-Stack Rust & WebAssembly Microservice',
      platform: 'ChatGPT',
      tags: ['#Engineering', '#CodeSnippets'],
      messages: 32,
      codeBlocks: 12,
      tables: 0,
      date: '3 days ago',
      format: 'md',
      favorite: false,
      exported: true,
    },
    {
      id: '4',
      title: 'UX Research Plan & User Interview Script',
      platform: 'Google Gemini',
      tags: ['#Research', '#PromptDesign'],
      messages: 16,
      codeBlocks: 0,
      tables: 2,
      date: '5 days ago',
      format: 'pdf',
      favorite: true,
      exported: true,
    },
  ]

  const allTags = [...new Set(conversations.flatMap((c) => c.tags))]

  const toConversationInfo = (convo: ConversationCard): ConversationInfo => ({
    title: convo.title,
    platform: convo.platform,
    model: convo.platform === 'ChatGPT' ? 'ChatGPT 4o' : 'Gemini 1.5 Pro',
    metrics: {
      messages: convo.messages,
      codeBlocks: convo.codeBlocks,
      tables: convo.tables,
      recency: convo.date,
    },
  })

  const filteredConvos = conversations.filter((convo) => {
    const matchesPlatform = filters.platform === 'all' || convo.platform === filters.platform
    const matchesTag = !filters.tag || convo.tags.includes(filters.tag)
    const matchesSearch = convo.title.toLowerCase().includes(filters.search.toLowerCase())
    const matchesFormat = filters.format === 'all' || convo.format === filters.format
    const matchesCollection =
      filters.collection === 'all' ||
      (filters.collection === 'favorites' && convo.favorite) ||
      (filters.collection === 'archived' && !convo.exported)
    return matchesPlatform && matchesTag && matchesSearch && matchesFormat && matchesCollection
  })

  const setFilter = <K extends keyof LibraryFilters>(key: K, value: LibraryFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({ platform: 'all', tag: '', search: '', format: 'all', collection: 'all' })
  }

  const collectionButtonClass = (active: boolean) =>
    active
      ? 'w-full justify-between px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 font-medium transition-all'
      : 'w-full justify-between px-3 py-2 rounded-lg text-tertiary hover:bg-gray-50 transition-all'

  return (
    <div className="min-h-screen bg-background text-primary-text">
      <div className="w-full bg-gray-500 py-4 px-6">
        <div className="flex items-center justify-between">
          <MaterialIcon name="forum" className="text-indigo text-[20px]" />
          <span className="font-semibold text-on-surface">Chat Library</span>
          <span className="text-tertiary font-medium">/ Index of Local Archives</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-tertiary font-code-inline text-code-inline ml-2">42 Records</span>
        </div>
      </div>

      {selectedConversation && (
        <div className="w-full px-6 pt-4">
          <div className="bg-indigo-50 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-label-sm text-label-sm uppercase tracking-wider text-indigo font-bold">Selected for export</p>
              <p className="font-semibold text-on-surface">{selectedConversation.title}</p>
              <p className="text-tertiary text-sm">
                {selectedConversation.metrics.messages} messages • {selectedConversation.metrics.codeBlocks} code blocks • {selectedConversation.platform}
              </p>
            </div>
            <button
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-headline-sm text-headline-sm shadow-sm transition-all shrink-0"
              type="button"
              onClick={() => navigateTo('export-config', selectedConversation)}
            >
              Configure export
            </button>
          </div>
        </div>
      )}

      <div className="w-full px-6 pt-4">
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row gap-3 md:items-end">
          <label className="flex-1 flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-tertiary font-semibold">Search</span>
            <input
              className="w-full px-3 py-2 rounded-lg bg-gray-50 text-on-surface focus:outline-none focus:ring-2 focus:ring-indigo-200"
              type="search"
              placeholder="Search conversations…"
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-tertiary font-semibold">Platform</span>
            <select
              className="px-3 py-2 rounded-lg bg-gray-50 text-on-surface focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={filters.platform}
              onChange={(e) => setFilter('platform', e.target.value)}
            >
              <option value="all">All platforms</option>
              <option value="ChatGPT">ChatGPT</option>
              <option value="Google Gemini">Google Gemini</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-tertiary font-semibold">Tag</span>
            <select
              className="px-3 py-2 rounded-lg bg-gray-50 text-on-surface focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={filters.tag}
              onChange={(e) => setFilter('tag', e.target.value)}
            >
              <option value="">All tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-tertiary font-semibold">Format</span>
            <select
              className="px-3 py-2 rounded-lg bg-gray-50 text-on-surface focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={filters.format}
              onChange={(e) => setFilter('format', e.target.value)}
            >
              <option value="all">All formats</option>
              <option value="pdf">PDF</option>
              <option value="md">Markdown</option>
            </select>
          </label>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              className={`px-3 py-1.5 rounded-md font-headline-sm text-headline-sm ${view === 'grid' ? 'bg-white text-on-surface shadow-xs' : 'text-tertiary'}`}
              type="button"
              onClick={() => setView('grid')}
            >
              Grid
            </button>
            <button
              className={`px-3 py-1.5 rounded-md font-headline-sm text-headline-sm ${view === 'list' ? 'bg-white text-on-surface shadow-xs' : 'text-tertiary'}`}
              type="button"
              onClick={() => setView('list')}
            >
              List
            </button>
          </div>
          <button
            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-50 text-on-surface font-headline-sm text-headline-sm transition-colors"
            type="button"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        </div>
        <p className="text-tertiary text-sm pt-2">
          Showing {filteredConvos.length} of {conversations.length} conversations
        </p>
      </div>

      <div className="w-full px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-medium text-on-surface mb-2">Collections</h3>
            <div className="space-y-1">
              <button className={collectionButtonClass(filters.collection === 'all')} data-filter="all" onClick={() => setFilter('collection', 'all')}>
                All Saved Chats <span className="font-code-inline">42</span>
              </button>
              <button className={collectionButtonClass(filters.collection === 'favorites')} data-filter="favorites" onClick={() => setFilter('collection', 'favorites')}>
                Favorites <span className="font-code-inline">8</span>
              </button>
              <button className={collectionButtonClass(filters.collection === 'archived')} data-filter="archived" onClick={() => setFilter('collection', 'archived')}>
                Archived <span className="font-code-inline">14</span>
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-medium text-on-surface mb-2">Platform Source</h3>
            <button className={`w-full justify-between px-3 py-2 rounded-lg transition-all ${filters.platform === 'ChatGPT' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-on-surface hover:bg-gray-50'}`} data-platform="ChatGPT" onClick={() => setFilter('platform', filters.platform === 'ChatGPT' ? 'all' : 'ChatGPT')}>
              ChatGPT <span className="font-code-inline">28</span>
            </button>
            <button className={`w-full justify-between px-3 py-2 rounded-lg transition-all ${filters.platform === 'Google Gemini' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-on-surface hover:bg-gray-50'}`} data-platform="Google Gemini" onClick={() => setFilter('platform', filters.platform === 'Google Gemini' ? 'all' : 'Google Gemini')}>
              Google Gemini <span className="font-code-inline">12</span>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-6 pb-8">
        {filteredConvos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="font-semibold text-on-surface">No conversations match these filters</p>
            <p className="text-tertiary text-sm mt-1">Try a different search term or clear the filters.</p>
            <button
              className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-headline-sm text-headline-sm transition-all"
              type="button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'flex flex-col gap-4'}>
            {filteredConvos.map((convo) => (
              <div
                key={convo.id}
                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigateTo('export-config', toConversationInfo(convo))}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-on-surface">{convo.title}</h3>
                    <p className="text-tertiary text-sm line-clamp-2">
                      {convo.platform === 'ChatGPT'
                        ? 'Explored mathematical derivation of scaled dot-product attention in PyTorch with interactive TensorBoard heatmap graphing.'
                        : 'Archived conversation content'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-tertiary">
                    <MaterialIcon name="star" />
                    <span className="text-sm">{convo.favorite ? 'Saved' : 'Unsaved'}</span>
                  </div>
                </div>
                <p className="text-tertiary text-xs mt-1">• {convo.messages} msgs • {convo.codeBlocks} code</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {convo.tags.map((tag) => (
                    <button
                      key={tag}
                      className="px-2 py-0.5 rounded bg-gray-100 text-tertiary font-label-sm text-label-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFilter('tag', tag)
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                  <span className="ml-auto flex gap-2">
                    <button
                      className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-50 text-on-surface font-headline-sm text-headline-sm transition-colors"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigateTo('message-selection')
                      }}
                    >
                      Select messages
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-headline-sm text-headline-sm transition-colors"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigateTo('export-config', toConversationInfo(convo))
                      }}
                    >
                      Export settings
                    </button>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
