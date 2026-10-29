import {
  AnthologyGenre,
  AnthologyProgram,
  AnthologyPubLevel,
  FilterState,
} from '../../../types';
import TabFilterRow from './TabFilterRow';
import RangeFilterRow from './RangeFilterRow';
import { PUB_LEVEL_OPTIONS, PROGRAM_OPTIONS, GENRE_OPTIONS } from './constants';

interface FilterByAttributeSectionProps {
  draft: FilterState;
  update: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
}

export default function FilterByAttributeSection({
  draft,
  update,
}: FilterByAttributeSectionProps) {
  return (
    <section className="filter-modal-section">
      <h3 className="filter-modal-section-title">Filter By Attribute</h3>

      <RangeFilterRow
        label="Inventory"
        minValue={draft.inventoryMin}
        maxValue={draft.inventoryMax}
        minPlaceholder="Min Copies"
        maxPlaceholder="Max Copies"
        onMinChange={(v) => update('inventoryMin', v)}
        onMaxChange={(v) => update('inventoryMax', v)}
      />

      <TabFilterRow
        label="Publication Level"
        options={PUB_LEVEL_OPTIONS}
        multiSelect={true}
        selected={draft.pubLevels}
        onChange={(value) => update('pubLevels', value as AnthologyPubLevel[])}
        allowDeselect={true}
      />

      <RangeFilterRow
        label="Publication Date"
        minValue={draft.pubDateStart}
        maxValue={draft.pubDateEnd}
        minPlaceholder="Start Year"
        maxPlaceholder="End Year"
        onMinChange={(v) => update('pubDateStart', v)}
        onMaxChange={(v) => update('pubDateEnd', v)}
      />

      <TabFilterRow
        label="Program"
        options={PROGRAM_OPTIONS}
        multiSelect={true}
        selected={draft.programs}
        onChange={(value) => update('programs', value as AnthologyProgram[])}
        allowDeselect={true}
      />

      <TabFilterRow
        label="Genre"
        options={GENRE_OPTIONS}
        multiSelect={true}
        selected={draft.genres}
        onChange={(values) => update('genres', values as AnthologyGenre[])}
      />
    </section>
  );
}
