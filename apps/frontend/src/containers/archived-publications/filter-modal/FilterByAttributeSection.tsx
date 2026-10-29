import { FilterState } from '../../../types';
import RangeFilterRow from './RangeFilterRow';
import SearchableMultiSelectRow from './SearchableMultiSelectRow';

interface FilterByAttributeSectionProps {
  draft: FilterState;
  update: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  genres: string[];
  themes: string[];
  programs: string[];
  inventoryLocations: string[];
}

export default function FilterByAttributeSection({
  draft,
  update,
  genres,
  themes,
  programs,
  inventoryLocations,
}: FilterByAttributeSectionProps) {
  return (
    <section className="filter-modal-section">
      <h3 className="filter-modal-section-title">Filter By Attribute</h3>

      <SearchableMultiSelectRow
        label="Programs(s)"
        placeholder="Search for a program..."
        options={programs}
        selected={draft.programs}
        onChange={(value) => update('programs', value)}
      />

      <SearchableMultiSelectRow
        label="Location(s)"
        placeholder="Search for a location..."
        options={inventoryLocations}
        selected={draft.inventoryLocations}
        onChange={(value) => update('inventoryLocations', value)}
      />

      <RangeFilterRow
        label="Publication Date"
        minValue={draft.pubDateStart}
        maxValue={draft.pubDateEnd}
        minPlaceholder="mm/dd/yyyy"
        maxPlaceholder="mm/dd/yyyy"
        inputType="text"
        onMinChange={(v) => update('pubDateStart', v)}
        onMaxChange={(v) => update('pubDateEnd', v)}
      />

      <SearchableMultiSelectRow
        label="Theme(s)"
        placeholder="Search for a theme..."
        options={themes}
        selected={draft.themes}
        onChange={(value) => update('themes', value)}
      />

      <SearchableMultiSelectRow
        label="Genre(s)"
        placeholder="Search for a genre..."
        options={genres}
        selected={draft.genres}
        onChange={(value) => update('genres', value)}
      />
    </section>
  );
}
