import type { Message, MessageFilter } from '../MessageSelection'
import { MessageItem } from './MessageItem'
import MaterialIcon from "../../../components/MaterialIcon";

export interface MessageListProps {
  messages: Message[]
  totalCount: number
  filter: MessageFilter
  selectionState: {
    selectedIds: Set<string>
    toggleMessage: (messageId: string) => void
  }
  onExportSelected: () => void
  onClearSelection: () => void
}

export function MessageList({
  messages,
  totalCount,
  filter,
  selectionState,
  onExportSelected,
  onClearSelection,
}: MessageListProps) {
  const { selectedIds, toggleMessage } = selectionState

  return (
    <div className="px-4 pb-32 flex flex-col gap-3">
      <div className="space-y-2">
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            msg={msg}
            selectionState={{
              selectedIds: selectedIds,
              toggleMessage,
            }}
          />
        ))}
      </div>
      {messages.length === 0 && (
        <div className="py-8 text-center font-body-md text-body-md text-tertiary">
          No messages match this filter.
        </div>
      )}
      {filter === 'all' && messages.length > 5 && (
        <div key="divider" className="flex items-center gap-3 py-2 opacity-60">
          <div className="h-px bg-gray-100 flex-1"></div>
          <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider">
            Remaining {messages.length - 5} Messages in Thread
          </span>
          <div className="h-px bg-gray-100 flex-1"></div>
        </div>
      )}
      <aside className="fixed bottom-4 left-64 right-0 px-4 z-40 pointer-events-none">
        <div className="max-w-4xl mx-auto w-full pointer-events-auto">
          <div className="bg-gray-900 text-gray-100 rounded-xl shadow-xl px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gray-500/15 flex items-center justify-center shrink-0">
                <MaterialIcon name="bookmark_check" className="text-[24px] text-indigo-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm font-headline-sm text-indigo-100 font-semibold" id="bottomSelectedTitle">
                    {selectedIds.size} of {totalCount} messages selected
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span className="font-code-inline text-code-inline text-indigo-100">~1,420 words</span>
                </div>
                <span className="font-body-sm text-body-sm text-tertiary truncate">
                  Includes code snippets and benchmark tables
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                className="px-3 py-2 rounded-lg bg-gray-500/10 hover:bg-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-tertiary font-headline-sm text-body-md transition-colors"
                id="clearSelectionBtn"
                disabled={selectedIds.size === 0}
                onClick={onClearSelection}
              >
                Clear selection
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-headline-sm text-headline-sm shadow-md transition-all"
                disabled={selectedIds.size === 0}
                onClick={onExportSelected}
              >
                <MaterialIcon name="download" className="text-[18px]" />
                <span>Export Selected</span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-50/30 font-code-inline text-[11px] text-on-indigo">PDF/MD</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
