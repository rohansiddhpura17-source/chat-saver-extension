
import type { Message } from '../MessageSelection'
import MaterialIcon from "../../../components/MaterialIcon";

export interface MessageItemProps {
  msg: Message
  selectionState: {
    selectedIds: Set<string>
    toggleMessage: (messageId: string) => void
  }
  className?: string
}

export function MessageItem({ msg, selectionState, className }: MessageItemProps) {
  const { selectedIds, toggleMessage } = selectionState

  return (
    <article
      key={msg.id}
      className={`message-card group bg-gray-50 rounded-xl p-4 shadow-sm transition-all hover:shadow-md ${className ?? ''}`}
      style={{
        backgroundColor: selectedIds.has(msg.id) ? '#f3f4f6' : '#f9fafb',
      }}
      data-has-code={msg.hasCode.toString()}
      data-type={msg.type}
    >
      <div className="flex items-start gap-3">
        <div className="pt-1 shrink-0">
          <input
            checked={selectedIds.has(msg.id)}
            className="w-4 h-4 rounded text-indigo-500 focus:ring-indigo-500 accent-indigo-500 cursor-pointer"
            type="checkbox"
            onChange={() => toggleMessage(msg.id)}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-900 flex items-center justify-center font-sm font-bold">
                {msg.author === 'User' ? 'U' : 'A'}
              </div>
              <span className="font-headline-sm font-headline-sm text-on-surface">{msg.author}</span>
              <span className="font-code-inline text-code-inline text-tertiary">• {msg.timestamp}</span>
              <span className="px-2 py-0.5 rounded bg-gray-100 text-tertiary font-label-sm text-[10px] uppercase tracking-wide">Prompt #{msg.id}</span>
            </div>
            <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
              <button className="p-1 rounded hover:bg-gray-100 text-tertiary" title="Copy Message Text">
                <MaterialIcon name="content_copy" className="text-[16px]" />
              </button>
            </div>
          </div>
          <div className="font-body-md text-body-md text-on-surface">
            {msg.content}
          </div>
        </div>
      </div>
    </article>
  )
}