import type { MessageFilter } from '../MessageSelection'
import MaterialIcon from "../../../components/MaterialIcon";

export interface SelectionToolbarProps {
  selectionState: {
    selectedCount: number
    toggleSelectAll: () => void
  }
  totalCount: number
  counts: {
    total: number
    prompts: number
    responses: number
    code: number
  }
  filter: MessageFilter
  onFilterChange: (filter: MessageFilter) => void
}

export function SelectionToolbar({
  selectionState,
  totalCount,
  counts,
  filter,
  onFilterChange,
}: SelectionToolbarProps) {
  const { selectedCount, toggleSelectAll } = selectionState
  const allSelected = totalCount > 0 && selectedCount === totalCount

  const chipClass = (active: boolean) =>
    active
      ? 'filter-chip active flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-500 text-on-indigo font-label-sm text-label-sm font-semibold transition-all'
      : 'filter-chip flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 hover:bg-gray-100 text-tertiary font-label-sm text-label-sm transition-all'

  const chipCountClass = (active: boolean) =>
    active
      ? 'px-1.5 py-0.2 rounded-full bg-indigo text-on-indigo text-[10px]'
      : 'px-1.5 py-0.2 rounded-full bg-gray-100 text-tertiary text-[10px]'

  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2 cursor-pointer select-none py-1">
        <input
          checked={allSelected}
          className="w-4 h-4 rounded text-indigo-500 focus:ring-indigo-500 accent-indigo-500 cursor-pointer"
          type="checkbox"
          id="masterSelectAll"
          onChange={() => toggleSelectAll()}
        />
        <span className="font-body-sm text-body-sm text-on-surface font-semibold">
          Select All ({selectedCount})
        </span>
      </label>
      <div className="h-4 w-px bg-gray-100 hidden sm:block"></div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          className={chipClass(filter === 'all')}
          onClick={() => onFilterChange('all')}
        >
          <span>All</span>
          <span className={chipCountClass(filter === 'all')}>{counts.total}</span>
        </button>
        <button
          className={chipClass(filter === 'prompts')}
          onClick={() => onFilterChange('prompts')}
        >
          <span>Prompts</span>
          <span className={chipCountClass(filter === 'prompts')}>{counts.prompts}</span>
        </button>
        <button
          className={chipClass(filter === 'responses')}
          onClick={() => onFilterChange('responses')}
        >
          <span>AI Responses</span>
          <span className={chipCountClass(filter === 'responses')}>{counts.responses}</span>
        </button>
        <button
          className={chipClass(filter === 'code')}
          onClick={() => onFilterChange('code')}
        >
          <MaterialIcon name="code" className="text-[13px]" />
          <span>Contains Code</span>
          <span className={chipCountClass(filter === 'code')}>{counts.code}</span>
        </button>
      </div>
    </div>
  )
}
