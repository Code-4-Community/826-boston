import { useMemo } from 'react';
import { useQuery } from 'react-query';
import apiClient from '../../../api/apiClient';
import { FilterState } from '../../../types';
import SearchableFilterSelect from './SearchableFilterSelect';
import DateRangeFilterRow from './DateRangeFilterRow';
import { collectDistinctValues } from './filterOptions';
import { DATE_RANGE_ERROR, isDateRangeInverted } from './dateRange';
import SearchFilterIcon from '../../../assets/icons/search-filter.svg';

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

  const publicationsError = anthologiesQuery.isError;

  return (
    <section className="filter-modal-section">
      <h3 className="filter-modal-section-title">Filter By Attribute</h3>

      <div className="filter-rows">
        <SearchableFilterSelect
          label="Program(s)"
          options={programOptions}
          selected={draft.programs}
          onChange={(values) => update('programs', values)}
          placeholder="Search for a program..."
          tagDisplay="pills"
          searchIconSrc={SearchFilterIcon}
          isLoading={anthologiesQuery.isLoading}
          errorMessage={
            publicationsError ? "Couldn't load programs. Try again." : undefined
          }
        />

        <SearchableFilterSelect
          label="Location(s)"
          options={locationOptions}
          selected={draft.locationIds}
          onChange={(values) => update('locationIds', values)}
          placeholder="Search for a location..."
          tagDisplay="pills"
          searchIconSrc={SearchFilterIcon}
          isLoading={inventoriesQuery.isLoading}
          errorMessage={
            inventoriesQuery.isError
              ? "Couldn't load locations. Try again."
              : undefined
          }
        />

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

        <SearchableFilterSelect
          label="Theme(s)"
          options={themeOptions}
          selected={draft.themes}
          onChange={(values) => update('themes', values)}
          placeholder="Search for a theme..."
          tagDisplay="pills"
          searchIconSrc={SearchFilterIcon}
          isLoading={anthologiesQuery.isLoading}
          errorMessage={
            publicationsError ? "Couldn't load themes. Try again." : undefined
          }
        />

        <SearchableFilterSelect
          label="Genre(s)"
          options={genreOptions}
          selected={draft.genres}
          onChange={(values) => update('genres', values)}
          placeholder="Search for a genre..."
          tagDisplay="pills"
          searchIconSrc={SearchFilterIcon}
          isLoading={anthologiesQuery.isLoading}
          errorMessage={
            publicationsError ? "Couldn't load genres. Try again." : undefined
          }
        />
      </div>
    </section>
  );
}
