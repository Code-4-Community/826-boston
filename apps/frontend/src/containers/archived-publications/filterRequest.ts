import { type FilterSortAnthologyBody } from '../../api/apiClient';
import { FilterState, SortOption } from '../../types';

const SORT_OPTION_TO_BACKEND: Record<SortOption, string> = {
  [SortOption.TITLE_ASC]: 'title-asc',
  [SortOption.TITLE_DESC]: 'title-desc',
  [SortOption.AUTHOR_ASC]: 'byline-asc',
  [SortOption.AUTHOR_DESC]: 'byline-desc',
  [SortOption.DATE_NEWEST]: 'date-recent',
  [SortOption.DATE_OLDEST]: 'date-oldest',
};

// turns the Library's Sort and Filter choices into the filter-sort request body;
// anything left unset is left out of the body
export function buildFilterSortBody(
  filters: FilterState,
): FilterSortAnthologyBody {
  const body: FilterSortAnthologyBody = {};

  // no sort chosen: leave sortBy out so the server doesn't sort by any field
  if (filters.sortBy) {
    body.sortBy = SORT_OPTION_TO_BACKEND[filters.sortBy];
  }

  // either end can be left open; the dates are already yyyy-mm-dd
  if (filters.pubDateStart || filters.pubDateEnd) {
    body.pubDateRange = {
      start: filters.pubDateStart || '1900-01-01',
      end: filters.pubDateEnd || '2100-12-31',
    };
  }

  if (filters.programs.length > 0) {
    body.programs = [...filters.programs];
  }

  if (filters.locationIds.length > 0) {
    body.locationIds = [...filters.locationIds];
  }

  if (filters.themes.length > 0) {
    body.themes = [...filters.themes];
  }

  if (filters.genres.length > 0) {
    body.genres = [...filters.genres];
  }

  return body;
}
