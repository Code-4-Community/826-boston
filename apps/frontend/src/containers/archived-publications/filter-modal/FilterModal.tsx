import { useState } from 'react';
import { FilterState, DEFAULT_FILTER_STATE } from '../../../types';
import FilterModalHeader from './FilterModalHeader';
import SortSection from './SortSection';
import FilterByAttributeSection from './FilterByAttributeSection';
import FilterModalFooter from './FilterModalFooter';
import './filter-modal.css';
import apiClient from '../../../api/apiClient';
import { useEffect } from 'react';

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
  const [genres, setGenres] = useState<string[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [programs, setPrograms] = useState<string[]>([]);
  const [inventoryLocations, setInventoryLocations] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      apiClient.getGenres(),
      apiClient.getInventoryLocations(),
      apiClient.getThemes(),
      apiClient.getPrograms(),
    ])
      .then(([genreOptions, locationOptions, themeOptions, programOptions]) => {
        setGenres(genreOptions);
        setInventoryLocations(locationOptions);
        setThemes(themeOptions);
        setPrograms(programOptions);
      })
      .catch((error) => {
        console.error('Unable to load filter options', error);
      });
  }, []);

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
      aria-label="Sort and Filter"
    >
      <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
        <FilterModalHeader onClose={onClose} />

        {/* Body */}
        <div className="filter-modal-body">
          <SortSection
            sortBy={draft.sortBy}
            onChange={(value) => update('sortBy', value)}
          />
          <FilterByAttributeSection
            draft={draft}
            update={update}
            genres={genres}
            themes={themes}
            programs={programs}
            inventoryLocations={inventoryLocations}
          />
        </div>

        <FilterModalFooter
          onApply={() => {
            onApply(draft);
            onClose();
          }}
          onClear={() => setDraft(DEFAULT_FILTER_STATE)}
        />
      </div>
    </div>
  );
}
