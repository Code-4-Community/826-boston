import { Anthology } from '../../../types';

type AnthologyListField = 'programs' | 'genres' | 'themes';

// Themes are still stored as comma-separated text whose default is the literal '[]', so
// a publication with no themes reads back as the one-item list ['[]']. That is a
// placeholder, not a theme, and must not show up as a choice.
const EMPTY_LIST_PLACEHOLDER = '[]';

// every distinct value of a list field across all publications, sorted A-Z
export function collectDistinctValues(
  anthologies: Anthology[],
  field: AnthologyListField,
): string[] {
  const found = new Set<string>();
  for (const anthology of anthologies) {
    const raw = anthology[field];
    const values = typeof raw === 'string' ? raw.split(',') : raw ?? [];
    for (const value of values) {
      const trimmed = value.trim();
      if (trimmed && trimmed !== EMPTY_LIST_PLACEHOLDER) found.add(trimmed);
    }
  }
  return [...found].sort((a, b) => a.localeCompare(b));
}
