import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import apiClient from '../../../api/apiClient';
import {
  TrackerFilterState,
  DEFAULT_TRACKER_FILTER_STATE,
} from '../../../types';
import FilterModalHeader from './FilterModalHeader';
import FilterModalFooter from './FilterModalFooter';
import TabFilterRow from './TabFilterRow';
import SearchableFilterSelect from './SearchableFilterSelect';
import { TRACKER_SORT_OPTIONS } from './constants';
import { collectDistinctValues } from './filterOptions';
import CloseIcon from '../../../assets/icons/close.svg';
import SearchFilterIcon from '../../../assets/icons/search-filter.svg';
import './filter-modal.css';

interface TrackerFilterModalProps {
  initialFilters: TrackerFilterState;
  onApply: (filters: TrackerFilterState) => void;
  onClose: () => void;
}

export default function TrackerFilterModal({
  initialFilters,
  onApply,
  onClose,
}: TrackerFilterModalProps) {
  const [draft, setDraft] = useState<TrackerFilterState>(initialFilters);

  const update = <K extends keyof TrackerFilterState>(
    key: K,
    value: TrackerFilterState[K],
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.getUsers(),
  });
  const anthologiesQuery = useQuery({
    queryKey: ['anthologies'],
    queryFn: () => apiClient.getAnthologies(),
  });

  const programOptions = useMemo(
    () =>
      collectDistinctValues(anthologiesQuery.data ?? [], 'programs').map(
        (program) => ({
          value: program,
          label: program,
        }),
      ),
    [anthologiesQuery.data],
  );
  const staffOptions = useMemo(
    () =>
      (usersQuery.data ?? []).map((user) => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName}`,
      })),
    [usersQuery.data],
  );

  return (
    <div
      className="filter-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Sort and Filter Results"
    >
      <div
        className="filter-modal filter-modal--results"
        onClick={(e) => e.stopPropagation()}
      >
        <FilterModalHeader
          onClose={onClose}
          title="Sort and Filter Results"
          closeIconSrc={CloseIcon}
        />

        <div className="filter-modal-body">
          <section className="filter-modal-section">
            <h3 className="filter-modal-section-title">Sort</h3>
            {/* At most one sort at a time; clicking the chosen one again clears it. */}
            <TabFilterRow
              options={TRACKER_SORT_OPTIONS}
              selected={draft.sortBy}
              onChange={(value) => update('sortBy', value)}
              allowDeselect={true}
            />
          </section>

          <section className="filter-modal-section">
            <h3 className="filter-modal-section-title">Filter By Attribute</h3>
            <SearchableFilterSelect
              label="Program(s)"
              options={programOptions}
              selected={draft.programs}
              onChange={(values) => update('programs', values)}
              placeholder="Search for a program..."
              searchIconSrc={SearchFilterIcon}
              isLoading={anthologiesQuery.isLoading}
              errorMessage={
                anthologiesQuery.isError
                  ? "Couldn't load programs. Try again."
                  : undefined
              }
            />
            <SearchableFilterSelect
              label="Staff"
              options={staffOptions}
              selected={draft.staffIds}
              onChange={(values) => update('staffIds', values)}
              placeholder="Search for a staff member..."
              searchIconSrc={SearchFilterIcon}
              showAvatar
              isLoading={usersQuery.isLoading}
              errorMessage={
                usersQuery.isError
                  ? "Couldn't load staff. Try again."
                  : undefined
              }
            />
          </section>
        </div>

        <FilterModalFooter
          onApply={() => {
            onApply(draft);
            onClose();
          }}
          // reset applies right away so the full list for the current tab comes back
          onClear={() => {
            onApply(DEFAULT_TRACKER_FILTER_STATE);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
