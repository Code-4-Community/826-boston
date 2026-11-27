import { useMemo } from 'react';
import { useQuery } from 'react-query';
import apiClient from '../../../api/apiClient';
import { FilterState } from '../../../types';
import SearchableMultiSelect from '@components/SearchableMultiSelect';
import DateRangeFilterRow from './DateRangeFilterRow';
import { collectDistinctValues } from './filterOptions';
import { DATE_RANGE_ERROR, isDateRangeInverted } from './dateRange';

interface FilterByAttributeSectionProps {
  draft: FilterState;
  update: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
}

const toOptions = (values: string[]) =>
  values.map((value) => ({ value, label: value }));

export default function FilterByAttributeSection({
  draft,
  update,
}: FilterByAttributeSectionProps) {
  const anthologiesQuery = useQuery({
    queryKey: ['anthologies'],
    queryFn: () => apiClient.getAnthologies(),
  });
  const inventoriesQuery = useQuery({
    queryKey: ['inventories'],
    queryFn: () => apiClient.getInventories(),
  });

  // options come from what publications actually use, so every choice can match something
  const programOptions = useMemo(
    () =>
      toOptions(collectDistinctValues(anthologiesQuery.data ?? [], 'programs')),
    [anthologiesQuery.data],
  );
  const themeOptions = useMemo(
    () =>
      toOptions(collectDistinctValues(anthologiesQuery.data ?? [], 'themes')),
    [anthologiesQuery.data],
  );
  const genreOptions = useMemo(
    () =>
      toOptions(collectDistinctValues(anthologiesQuery.data ?? [], 'genres')),
    [anthologiesQuery.data],
  );
  const locationOptions = useMemo(
    () =>
      (inventoriesQuery.data ?? [])
        .map((inventory) => ({ value: inventory.id, label: inventory.name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [inventoriesQuery.data],
  );

  return (
    <section className="filter-modal-section">
      <h3 className="filter-modal-section-title">Filter By Attribute</h3>

      <div className="filter-rows">
        <div className="filter-select-row">
          <span className="filter-select-label">Program(s)</span>
          <SearchableMultiSelect
            options={programOptions}
            selected={draft.programs}
            onChange={(values) => update('programs', values)}
            placeholder="Search for a program..."
            selectionDisplay="pills"
          />
        </div>

        <div className="filter-select-row">
          <span className="filter-select-label">Location(s)</span>
          <SearchableMultiSelect
            options={locationOptions}
            selected={draft.locationIds}
            onChange={(values) => update('locationIds', values)}
            placeholder="Search for a location..."
            selectionDisplay="pills"
          />
        </div>

        <DateRangeFilterRow
          label="Publication Date"
          startValue={draft.pubDateStart}
          endValue={draft.pubDateEnd}
          onStartChange={(iso) => update('pubDateStart', iso)}
          onEndChange={(iso) => update('pubDateEnd', iso)}
          errorMessage={
            isDateRangeInverted(draft.pubDateStart, draft.pubDateEnd)
              ? DATE_RANGE_ERROR
              : undefined
          }
        />

        <div className="filter-select-row">
          <span className="filter-select-label">Theme(s)</span>
          <SearchableMultiSelect
            options={themeOptions}
            selected={draft.themes}
            onChange={(values) => update('themes', values)}
            placeholder="Search for a theme..."
            selectionDisplay="pills"
          />
        </div>

        <div className="filter-select-row">
          <span className="filter-select-label">Genre(s)</span>
          <SearchableMultiSelect
            options={genreOptions}
            selected={draft.genres}
            onChange={(values) => update('genres', values)}
            placeholder="Search for a genre..."
            selectionDisplay="pills"
          />
        </div>
      </div>
    </section>
  );
}
