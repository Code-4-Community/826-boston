import { useEffect, useState } from 'react';
import { Navigate, NavLink, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import './styles.css';
import apiClient from '../../api/apiClient';
import { type FilterSortAnthologyBody } from '../../api/apiClient';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import {
  Anthology,
  AnthologyStatus,
  FilterState,
  DEFAULT_FILTER_STATE,
  SortOption,
  TrackerFilterState,
  DEFAULT_TRACKER_FILTER_STATE,
} from '../../types';
import FilterModal from './filter-modal/FilterModal';
import TrackerFilterModal from './filter-modal/TrackerFilterModal';

import SearchIcon from '../../assets/icons/search.svg';
import FilterIcon from '../../assets/icons/filter.svg';
import MenuDotsIcon from '../../assets/icons/menu-dots.svg';
import BookmarkIcon from '../../assets/icons/bookmark.svg';
import CreatePublicationModal from '@containers/create-publication-modal';

type PublicationsPageMode = 'archive' | 'tracker';
type ArchiveTab = 'published' | 'archived';

const ARCHIVE_TAB_STATUS: Record<ArchiveTab, AnthologyStatus> = {
  published: AnthologyStatus.CAN_BE_SHARED,
  archived: AnthologyStatus.ARCHIVED,
};

interface TrackerTab {
  slug: string;
  label: string;
  /** Omitted for the All tab, which shows every publication. */
  status?: AnthologyStatus;
}

const TRACKER_TABS: TrackerTab[] = [
  { slug: 'all', label: 'All' },
  {
    slug: 'not-started',
    label: 'Not Started',
    status: AnthologyStatus.NOT_STARTED,
  },
  { slug: 'drafting', label: 'Drafting', status: AnthologyStatus.DRAFTING },
  {
    slug: 'awaiting-review',
    label: 'Awaiting Review',
    status: AnthologyStatus.AWAITING_REVIEW,
  },
  {
    slug: 'can-be-shared',
    label: 'Can be Shared',
    status: AnthologyStatus.CAN_BE_SHARED,
  },
  { slug: 'archived', label: 'Archive', status: AnthologyStatus.ARCHIVED },
];

const SEARCH_MAX_LENGTH = 100;
const SEARCH_DEBOUNCE_MS = 300;

interface PublicationsPageProps {
  mode?: PublicationsPageMode;
}

const SORT_OPTION_TO_BACKEND: Partial<Record<SortOption, string>> = {
  [SortOption.TITLE_ASC]: 'title-asc',
  [SortOption.AUTHOR_ASC]: 'byline-asc',
  [SortOption.DATE_NEWEST]: 'date-recent',
  [SortOption.DATE_OLDEST]: 'date-oldest',
};

function buildFilterSortBody(filters: FilterState): FilterSortAnthologyBody {
  const body: FilterSortAnthologyBody = {};

  const backendSort = SORT_OPTION_TO_BACKEND[filters.sortBy];
  if (backendSort) {
    body.sortBy = backendSort;
  }

  if (filters.pubDateStart || filters.pubDateEnd) {
    body.pubDateRange = {
      start: filters.pubDateStart
        ? `${filters.pubDateStart}-01-01`
        : '1900-01-01',
      end: filters.pubDateEnd ? `${filters.pubDateEnd}-12-31` : '2100-12-31',
    };
  }

  if (filters.pubLevels.length > 0) {
    body.pubLevels = [...filters.pubLevels];
  }

  if (filters.programs.length > 0) {
    body.programs = [...filters.programs];
  }

  if (filters.genres.length > 0) {
    body.genres = [...filters.genres];
  }

  return body;
}

function buildTrackerBody(
  search: string,
  filters: TrackerFilterState,
): FilterSortAnthologyBody {
  const body: FilterSortAnthologyBody = { sortBy: filters.sortBy };

  if (search) {
    body.search = search;
  }

  if (filters.programs.length > 0) {
    body.programs = [...filters.programs];
  }

  if (filters.staffIds.length > 0) {
    body.staffIds = [...filters.staffIds];
  }

  return body;
}

// each picked program and staff member counts, plus one for a non-default sort
function countActiveTrackerFilters(filters: TrackerFilterState): number {
  return (
    filters.programs.length +
    filters.staffIds.length +
    (filters.sortBy !== DEFAULT_TRACKER_FILTER_STATE.sortBy ? 1 : 0)
  );
}

function applyLocalFilters(
  pubs: Anthology[],
  search: string,
  filters: FilterState,
): Anthology[] {
  let result = [...pubs];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter((p) => p.title.toLowerCase().includes(q));
  }

  if (filters.inventoryMin) {
    const min = parseInt(filters.inventoryMin, 10);
    if (!Number.isNaN(min)) {
      result = result.filter((p) => (p.inventory ?? 0) >= min);
    }
  }

  if (filters.inventoryMax) {
    const max = parseInt(filters.inventoryMax, 10);
    if (!Number.isNaN(max)) {
      result = result.filter((p) => (p.inventory ?? Infinity) <= max);
    }
  }

  return result;
}

function isArchiveTab(value: string | undefined): value is ArchiveTab {
  return value === 'published' || value === 'archived';
}

export default function ArchivedPublications({
  mode = 'archive',
}: PublicationsPageProps) {
  const [publications, setPublications] = useState<Anthology[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(DEFAULT_FILTER_STATE);
  const [trackerFilters, setTrackerFilters] = useState<TrackerFilterState>(
    DEFAULT_TRACKER_FILTER_STATE,
  );
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [createPubModalOpen, setCreatePubModalOpen] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { tab } = useParams<{ tab?: string }>();

  const activeArchiveTab: ArchiveTab = isArchiveTab(tab) ? tab : 'published';
  const activeTrackerTab = TRACKER_TABS.find((t) => t.slug === tab);

  const debouncedSearch = useDebouncedValue(
    searchQuery.trim(),
    SEARCH_DEBOUNCE_MS,
  );

  // the Tracker searches, filters and sorts on the server; status tabs filter the
  // result below, so switching tabs doesn't refetch
  const trackerQuery = useQuery({
    queryKey: ['tracker', debouncedSearch, trackerFilters],
    queryFn: () =>
      apiClient.filterSortAnthologies(
        buildTrackerBody(debouncedSearch, trackerFilters),
      ),
    enabled: mode === 'tracker' && !!activeTrackerTab,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (mode !== 'archive') return;

    const body = buildFilterSortBody(appliedFilters);

    apiClient
      .filterSortAnthologies(body)
      .then((data) => {
        if (Array.isArray(data)) {
          setPublications(data as Anthology[]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [mode, appliedFilters]);

  if (mode === 'tracker' && !activeTrackerTab) {
    return <Navigate to="/tracker/all" replace />;
  }

  const filteredPublications =
    mode === 'tracker'
      ? (trackerQuery.data ?? []).filter(
          (pub) =>
            !activeTrackerTab?.status || pub.status === activeTrackerTab.status,
        )
      : applyLocalFilters(
          publications.filter(
            (pub) => pub.status === ARCHIVE_TAB_STATUS[activeArchiveTab],
          ),
          searchQuery,
          appliedFilters,
        );

  const activeTrackerFilterCount = countActiveTrackerFilters(trackerFilters);

  const hasTrackerSearchOrFilters =
    !!debouncedSearch ||
    trackerFilters.programs.length > 0 ||
    trackerFilters.staffIds.length > 0;

  const renderTrackerMessage = (): string | null => {
    if (trackerQuery.isError) {
      return "Couldn't load publications. Try again.";
    }
    if (trackerQuery.isIdle || trackerQuery.isLoading) {
      return 'Loading publications...';
    }
    if (
      trackerQuery.isSuccess &&
      filteredPublications.length === 0 &&
      hasTrackerSearchOrFilters
    ) {
      return 'No publications match these filters';
    }
    return null;
  };

  const gridMessage = mode === 'tracker' ? renderTrackerMessage() : null;

  return (
    <div className="archive-wrapper">
      <section className="all-publications-section">
        <div className="all-publications-content">
          <div className="publication-search-header">
            <h2 className="publication-search-title">Publications</h2>

            <div className="publication-search-controls">
              <div className="publication-search-input-wrapper">
                <div className="publication-search-input-content">
                  <input
                    type="text"
                    className="publication-search-input"
                    placeholder="Search for a title..."
                    value={searchQuery}
                    maxLength={SEARCH_MAX_LENGTH}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <img
                    src={SearchIcon}
                    alt=""
                    className="publication-search-icon"
                  />
                </div>
              </div>

              <button
                type="button"
                className="publication-filter-btn publication-filter-btn--text"
                onClick={() => setIsFilterModalOpen(true)}
                aria-label={
                  mode === 'tracker' && activeTrackerFilterCount > 0
                    ? `Open sort and filter, ${activeTrackerFilterCount} active`
                    : 'Open sort and filter'
                }
              >
                <img
                  src={FilterIcon}
                  alt=""
                  className="publication-filter-icon"
                />
                <span>Filters</span>
                {mode === 'tracker' && activeTrackerFilterCount > 0 && (
                  <span className="publication-filter-badge" aria-hidden="true">
                    {activeTrackerFilterCount}
                  </span>
                )}
              </button>

              {mode === 'tracker' && (
                <button
                  type="button"
                  className="publication-create-btn"
                  aria-label="Create new publication"
                  onClick={() => setCreatePubModalOpen(true)}
                >
                  New Publication
                </button>
              )}
            </div>
          </div>

          {mode === 'archive' && (
            <div className="publication-tabs">
              <NavLink
                to="/library/published"
                className={({ isActive }) =>
                  `publication-tab ${isActive ? 'publication-tab--active' : ''}`
                }
              >
                Published
              </NavLink>
              <NavLink
                to="/library/archived"
                className={({ isActive }) =>
                  `publication-tab ${isActive ? 'publication-tab--active' : ''}`
                }
              >
                Archived
              </NavLink>
            </div>
          )}

          {mode === 'tracker' && (
            <div className="publication-tabs">
              {TRACKER_TABS.map(({ slug, label }) => (
                <NavLink
                  key={slug}
                  to={`/tracker/${slug}`}
                  className={({ isActive }) =>
                    `publication-tab ${
                      isActive ? 'publication-tab--active' : ''
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          )}

          {gridMessage ? (
            <p className="publication-grid-message" role="status">
              {gridMessage}
            </p>
          ) : (
            <div className="publication-cards-grid">
              {filteredPublications.map((pub) => (
                <button
                  key={pub.id}
                  type="button"
                  className="publication-card"
                  onClick={() =>
                    navigate(
                      mode === 'tracker'
                        ? `/tracker/publication/${pub.id}`
                        : `/library/publication/${pub.id}`,
                    )
                  }
                >
                  <div className="publication-card-image">
                    <img
                      src={
                        pub.photo_url ||
                        pub.photoUrl ||
                        '/src/assets/images/covers/booktemp.avif'
                      }
                      alt={pub.title}
                      className="publication-card-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          '/src/assets/images/covers/booktemp.avif';
                      }}
                    />
                    <img
                      src={BookmarkIcon}
                      alt=""
                      className="publication-card-bookmark"
                    />
                  </div>

                  <div className="publication-card-info">
                    <div className="publication-card-details">
                      <h3 className="publication-card-title">{pub.title}</h3>
                      <div className="publication-card-meta">
                        <span className="publication-card-modified">
                          {pub.published_year
                            ? `Last modified ${pub.published_year}`
                            : ''}
                        </span>
                        <img
                          src={MenuDotsIcon}
                          alt=""
                          className="publication-card-menu"
                        />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {isFilterModalOpen && mode === 'archive' && (
        <FilterModal
          initialFilters={appliedFilters}
          onApply={(filters) => setAppliedFilters(filters)}
          onClose={() => setIsFilterModalOpen(false)}
        />
      )}
      {isFilterModalOpen && mode === 'tracker' && (
        <TrackerFilterModal
          initialFilters={trackerFilters}
          onApply={(filters) => setTrackerFilters(filters)}
          onClose={() => setIsFilterModalOpen(false)}
        />
      )}
      {createPubModalOpen && (
        <CreatePublicationModal
          onCreated={() => queryClient.invalidateQueries(['tracker'])}
          onClose={() => setCreatePubModalOpen(false)}
          onSave={() => {
            setCreatePubModalOpen(false);
          }}
          teamMembers={[]}
        />
      )}
    </div>
  );
}
