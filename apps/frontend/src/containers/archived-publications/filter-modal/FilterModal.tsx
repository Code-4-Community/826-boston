import { useState } from 'react';
import { FilterState, DEFAULT_FILTER_STATE } from '../../../types';
import FilterModalHeader from './FilterModalHeader';
import SortSection from './SortSection';
import FilterByAttributeSection from './FilterByAttributeSection';
import FilterModalFooter from './FilterModalFooter';
import { isDateRangeInverted } from './dateRange';
import CloseIcon from '../../../assets/icons/close.svg';
import './filter-modal.css';

interface FilterModalProps {
  initialFilters: FilterState;
  onApply: (filters: FilterState) => void;
  onClose: () => void;
}

export default function FilterModal({
  initialFilters,
  onApply,
  onClose,
}: FilterModalProps) {
  const [draft, setDraft] = useState<FilterState>(initialFilters);

  const update = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className="filter-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Sort and Filter Results"
    >
      <div
        className="filter-modal filter-modal--results filter-modal--library"
        onClick={(e) => e.stopPropagation()}
      >
        <FilterModalHeader
          onClose={onClose}
          title="Sort and Filter Results"
          closeIconSrc={CloseIcon}
        />

        {/* Body */}
        <div className="filter-modal-body">
          <SortSection
            sortBy={draft.sortBy}
            onChange={(value) => update('sortBy', value)}
          />
          <FilterByAttributeSection draft={draft} update={update} />
        </div>

        <FilterModalFooter
          onApply={() => {
            onApply(draft);
            onClose();
          }}
          onClear={() => setDraft(DEFAULT_FILTER_STATE)}
          // a backwards date range matches nothing, so it can't be applied
          applyDisabled={isDateRangeInverted(
            draft.pubDateStart,
            draft.pubDateEnd,
          )}
        />
      </div>
    </div>
  );
}
