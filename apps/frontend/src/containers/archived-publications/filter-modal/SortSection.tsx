import { SortOption } from '../../../types';
import TabFilterRow from './TabFilterRow';
import { SORT_OPTIONS } from './constants';

interface SortSectionProps {
  /** null means no sort is chosen. */
  sortBy: SortOption | null;
  onChange: (value: SortOption | null) => void;
}

export default function SortSection({ sortBy, onChange }: SortSectionProps) {
  return (
    <section className="filter-modal-section">
      <h3 className="filter-modal-section-title">Sort</h3>
      {/* At most one sort at a time; clicking the chosen one again clears it. */}
      <TabFilterRow
        options={SORT_OPTIONS}
        selected={sortBy}
        onChange={onChange}
        allowDeselect={true}
      />
    </section>
  );
}
