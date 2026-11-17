import { useState } from 'react'
import type { ConversationInfo } from '../popup/Popup'
import { MessageList } from './components/MessageList'
import { SelectionToolbar } from './components/SelectionToolbar'
import MaterialIcon from "../../components/MaterialIcon";

export interface Message {
  id: string
  type: 'prompt' | 'response'
  content: string
  timestamp: string
  author: 'User' | 'ChatGPT'
  hasCode: boolean
  codeLanguage?: string
}

export type MessageFilter = 'all' | 'prompts' | 'responses' | 'code'

export interface MessageSelectionProps {
  navigateTo: (screen: string, conversation?: ConversationInfo) => void
}

/** Message Selection Interface Screen */
function MessageSelection({ navigateTo }: MessageSelectionProps) {
  // Mock conversation data - 18 messages
  const messages: Message[] = [
    {
      id: '1',
      type: 'prompt',
      content: 'Can you explain multi-head self-attention with a PyTorch code implementation and compare it with FlashAttention in a table?',
      timestamp: '10:14 AM',
      author: 'User',
      hasCode: true,
      codeLanguage: 'Python',
    },
    {
      id: '2',
      type: 'response',
      content: 'Multi-head attention projects Queries (Q), Keys (K), and Values (V) into h distinct subspaces, computes scaled dot-product attention in parallel, and concatenates the results: Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) * V',
      timestamp: '10:15 AM',
      author: 'ChatGPT',
      hasCode: true,
      codeLanguage: 'Python (PyTorch)',
    },
    {
      id: '3',
      type: 'prompt',
      content: 'What is the memory complexity differences when sequence length grows to 32k tokens?',
      timestamp: '10:19 AM',
      author: 'User',
      hasCode: false,
    },
    {
      id: '4',
      type: 'response',
      content: 'For naive self-attention, the intermediate attention matrix size scales with sequence length N as O(N^2) elements per layer per head. At N = 32,768, a float16 tensor requires 2.14 GB per layer.',
      timestamp: '10:20 AM',
      author: 'ChatGPT',
      hasCode: false,
    },
    {
      id: '5',
      type: 'prompt',
      content: 'Provide the export ready benchmark table and summarize best deployment parameters for NVIDIA H100 SXM5 GPUs.',
      timestamp: '10:23 AM',
      author: 'User',
      hasCode: false,
    },
    {
      id: '6',
      type: 'response',
      content: 'Response 6 content',
      timestamp: '10:25 AM',
      author: 'ChatGPT',
      hasCode: false,
    },
    {
      id: '7',
      type: 'prompt',
      content: 'Prompt 7 content',
      timestamp: '10:28 AM',
      author: 'User',
      hasCode: false,
    },
    {
      id: '8',
      type: 'response',
      content: 'Response 8 content',
      timestamp: '10:30 AM',
      author: 'ChatGPT',
      hasCode: false,
    },
    {
      id: '9',
      type: 'prompt',
      content: 'Prompt 9 content',
      timestamp: '10:33 AM',
      author: 'User',
      hasCode: false,
    },
    {
      id: '10',
      type: 'response',
      content: 'Response 10 content',
      timestamp: '10:35 AM',
      author: 'ChatGPT',
      hasCode: false,
    },
    {
      id: '11',
      type: 'prompt',
      content: 'Prompt 11 content',
      timestamp: '10:38 AM',
      author: 'User',
      hasCode: false,
    },
    {
      id: '12',
      type: 'response',
      content: 'Response 12 content',
      timestamp: '10:40 AM',
      author: 'ChatGPT',
      hasCode: false,
    },
    {
      id: '13',
      type: 'prompt',
      content: 'Prompt 13 content',
      timestamp: '10:43 AM',
      author: 'User',
      hasCode: false,
    },
    {
      id: '14',
      type: 'response',
      content: 'Response 14 content',
      timestamp: '10:45 AM',
      author: 'ChatGPT',
      hasCode: false,
    },
    {
      id: '15',
      type: 'prompt',
      content: 'Prompt 15 content',
      timestamp: '10:48 AM',
      author: 'User',
      hasCode: false,
    },
    {
      id: '16',
      type: 'response',
      content: 'Response 16 content',
      timestamp: '10:50 AM',
      author: 'ChatGPT',
      hasCode: false,
    },
    {
      id: '17',
      type: 'prompt',
      content: 'Prompt 17 content',
      timestamp: '10:53 AM',
      author: 'User',
      hasCode: false,
    },
    {
      id: '18',
      type: 'response',
      content: 'Response 18 content',
      timestamp: '10:55 AM',
      author: 'ChatGPT',
      hasCode: false,
    },
  ]

  const [selectionState, setSelectionState] = useState<{
    selectedCount: number
    promptCount: number
    responseCount: number
    selectedIds: Set<string>
  }>({
    selectedCount: 0,
    promptCount: 0,
    responseCount: 0,
    selectedIds: new Set<string>(),
  })

  const [filter, setFilter] = useState<MessageFilter>('all')

  const totalCount = messages.length
  const promptTotal = messages.filter((m) => m.type === 'prompt').length
  const responseTotal = messages.filter((m) => m.type === 'response').length
  const codeTotal = messages.filter((m) => m.hasCode).length

  const visibleMessages: Message[] =
    filter === 'prompts'
      ? messages.filter((m) => m.type === 'prompt')
      : filter === 'responses'
        ? messages.filter((m) => m.type === 'response')
        : filter === 'code'
          ? messages.filter((m) => m.hasCode)
          : messages

  const countSelection = (selectedIds: Set<string>) => {
    const selectedMessages = messages.filter((m) => selectedIds.has(m.id))
    return {
      selectedCount: selectedIds.size,
      promptCount: selectedMessages.filter((m) => m.type === 'prompt').length,
      responseCount: selectedMessages.filter((m) => m.type === 'response').length,
      selectedIds,
    }
  }

  const toggleSelectAll = () => {
    const allSelected = selectionState.selectedCount === messages.length
    const newSelection = allSelected ? new Set<string>() : new Set<string>(messages.map((m) => m.id))
    setSelectionState(countSelection(newSelection))
  }

  const toggleMessage = (messageId: string) => {
    setSelectionState((prev) => {
      const newSelected = new Set<string>(prev.selectedIds)
      if (newSelected.has(messageId)) {
        newSelected.delete(messageId)
      } else {
        newSelected.add(messageId)
      }
      return countSelection(newSelected)
    })
  }

  const clearSelection = () => {
    setSelectionState({
      selectedCount: 0,
      promptCount: 0,
      responseCount: 0,
      selectedIds: new Set<string>(),
    })
  }

  const exportSelected = () => {
    if (selectionState.selectedCount === 0) {
      return
    }
    const selectedMessages = messages.filter((m) => selectionState.selectedIds.has(m.id))
    navigateTo('library', {
      title: 'Selected Messages Export',
      platform: 'ChatGPT',
      model: 'ChatGPT 4o',
      metrics: {
        messages: selectedMessages.length,
        codeBlocks: selectedMessages.filter((m) => m.hasCode).length,
        tables: 0,
        recency: 'just now',
      },
    })
  }

  return (
    <div className="min-h-screen bg-background text-primary-text">
      <section className="bg-gray-500 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-2 min-w-0">
            <a
              className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-tertiary flex items-center justify-center transition-colors"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                navigateTo('library')
              }}
            >
              <MaterialIcon name="arrow_back" className="text-[20px]" />
            </a>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 font-label-sm text-label-sm uppercase tracking-wide">Source Chat</span>
                <span className="flex items-center gap-1 text-tertiary font-label-sm text-label-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  ChatGPT 4o (Latest)
                </span>
                <span className="text-tertiary font-label-sm text-label-sm">• Captured Today, 10:14 AM</span>
              </div>
              <h1 className="font-headline-md text-headline-md text-on-surface truncate mt-0.5">
                Deep Learning Architecture & Transformer Attention Mechanisms
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 md:self-auto shrink-0">
            <div className="hidden xl:flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-100 text-tertiary font-label-sm text-label-sm">
              <MaterialIcon name="lock" className="text-[16px] text-tertiary" />
              <span>100% In-Memory Parsing</span>
            </div>
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-headline-sm text-headline-sm shadow-sm transition-all"
              id="topExportBtn"
              disabled={selectionState.selectedCount === 0}
              onClick={exportSelected}
            >
              <span>
                {selectionState.selectedCount === 0
                  ? 'Export Selected Messages'
                  : `Export ${selectionState.selectedCount} Selected Message${selectionState.selectedCount === 1 ? '' : 's'}`}
              </span>
              <MaterialIcon name="arrow_forward" className="text-[18px]" />
            </button>
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-30 w-full bg-gray-50/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <SelectionToolbar
            selectionState={{
              selectedCount: selectionState.selectedCount,
              toggleSelectAll,
            }}
            totalCount={totalCount}
            counts={{ total: totalCount, prompts: promptTotal, responses: responseTotal, code: codeTotal }}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>
      </div>

      <MessageList
        messages={visibleMessages}
        totalCount={totalCount}
        filter={filter}
        selectionState={{
          selectedIds: selectionState.selectedIds,
          toggleMessage,
        }}
        onExportSelected={exportSelected}
        onClearSelection={clearSelection}
      />
    </div>
  )
}

export default MessageSelection
