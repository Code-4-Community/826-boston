import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import './styles.css';
import apiClient from '../../api/apiClient';
import { type FilterSortAnthologyBody } from '../../api/apiClient';
import { MOCK_LAST_MODIFIED } from '@utils/mock-data';
import {
  Anthology,
  AnthologyStatus,
  FilterState,
  DEFAULT_FILTER_STATE,
  SortOption,
} from '../../types';
import FilterModal from './filter-modal/FilterModal';

import SearchIcon from '../../assets/icons/search.svg';
import FilterIcon from '../../assets/icons/filter.svg';
import MenuDotsIcon from '../../assets/icons/menu-dots.svg';
import BookmarkIcon from '../../assets/icons/bookmark.svg';

type PublicationsPageMode = 'archive' | 'projects';
type ArchiveTab = 'published' | 'archived';
type ProjectTab =
  | 'all'
  | 'drafts'
  | 'in-revision'
  | 'in-production'
  | 'published'
  | 'archived';

interface PublicationsPageProps {
  mode?: PublicationsPageMode;
  onOpenCreatePublicationModal?: () => void;
}

const SORT_OPTION_TO_BACKEND: Partial<Record<SortOption, string>> = {
  [SortOption.TITLE_ASC]: 'title-asc',
  [SortOption.AUTHOR_ASC]: 'title-asc',
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

function isProjectTab(value: string | undefined): value is ProjectTab {
  return (
    value === 'all' ||
    value === 'drafts' ||
    value === 'in-revision' ||
    value === 'in-production' ||
    value === 'published' ||
    value === 'archived'
  );
}

export default function ArchivedPublications({
  mode = 'archive',
  onOpenCreatePublicationModal,
}: PublicationsPageProps) {
  const [publications, setPublications] = useState<Anthology[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(DEFAULT_FILTER_STATE);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();

  const activeArchiveTab: ArchiveTab = isArchiveTab(tab) ? tab : 'published';
  const activeProjectTab: ProjectTab = isProjectTab(tab) ? tab : 'all';

  useEffect(() => {
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
  }, [appliedFilters]);

  const statusFilteredPublications = publications.filter((pub) => {
    const status = String(pub.status);

    if (mode === 'archive') {
      if (activeArchiveTab === 'published') {
        return (
          status === AnthologyStatus.CAN_BE_SHARED || status === 'Published'
        );
      }

      return status === AnthologyStatus.ARCHIVED;
    }

    if (activeProjectTab === 'all') {
      return true;
    }

    if (activeProjectTab === 'drafts') {
      return (
        pub.status === AnthologyStatus.NOT_STARTED ||
        status === 'Draft' ||
        status === 'NotStarted'
      );
    }

    if (activeProjectTab === 'in-revision') {
      return (
        pub.status === AnthologyStatus.DRAFTING || status === 'In Revision'
      );
    }

    if (activeProjectTab === 'in-production') {
      return status === 'InProduction' || status === 'In Production';
    }

    if (activeProjectTab === 'published') {
      return status === AnthologyStatus.CAN_BE_SHARED || status === 'Published';
    }

    if (activeProjectTab === 'archived') {
      return status === AnthologyStatus.ARCHIVED;
    }

    return false;
  });

  const filteredPublications = applyLocalFilters(
    statusFilteredPublications,
    searchQuery,
    appliedFilters,
  );

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
                aria-label="Open sort and filter"
              >
                <img
                  src={FilterIcon}
                  alt=""
                  className="publication-filter-icon"
                />
                <span>Filters</span>
              </button>

              {mode === 'projects' && (
                <button
                  type="button"
                  className="publication-create-btn"
                  aria-label="Create new publication"
                  onClick={onOpenCreatePublicationModal}
                >
                  New Publication
                </button>
              )}
            </div>
          </div>

          {mode === 'archive' && (
            <div className="publication-tabs">
              <NavLink
                to="/archive/published"
                className={({ isActive }) =>
                  `publication-tab ${isActive ? 'publication-tab--active' : ''}`
                }
              >
                Published
              </NavLink>
              <NavLink
                to="/archive/archived"
                className={({ isActive }) =>
                  `publication-tab ${isActive ? 'publication-tab--active' : ''}`
                }
              >
                Archived
              </NavLink>
            </div>
          )}

          {mode === 'projects' && (
            <div className="publication-tabs">
              <NavLink
                to="/projects/all"
                className={({ isActive }) =>
                  `publication-tab ${isActive ? 'publication-tab--active' : ''}`
                }
              >
                All
              </NavLink>
              <NavLink
                to="/projects/drafts"
                className={({ isActive }) =>
                  `publication-tab ${isActive ? 'publication-tab--active' : ''}`
                }
              >
                Drafts
              </NavLink>
              <NavLink
                to="/projects/in-revision"
                className={({ isActive }) =>
                  `publication-tab ${isActive ? 'publication-tab--active' : ''}`
                }
              >
                In Revision
              </NavLink>
              <NavLink
                to="/projects/in-production"
                className={({ isActive }) =>
                  `publication-tab ${isActive ? 'publication-tab--active' : ''}`
                }
              >
                In Production
              </NavLink>
              <NavLink
                to="/projects/published"
                className={({ isActive }) =>
                  `publication-tab ${isActive ? 'publication-tab--active' : ''}`
                }
              >
                Published
              </NavLink>
              <NavLink
                to="/projects/archived"
                className={({ isActive }) =>
                  `publication-tab ${isActive ? 'publication-tab--active' : ''}`
                }
              >
                Archived
              </NavLink>
            </div>
          )}

          <div className="publication-cards-grid">
            {filteredPublications.map((pub) => (
              <button
                key={pub.id}
                type="button"
                className="publication-card"
                onClick={() =>
                  navigate(
                    mode === 'projects'
                      ? `/projects/publication/${pub.id}`
                      : `/archive/publication/${pub.id}`,
                  )
                }
              >
                <div className="publication-card-image">
                  <img
                    src={
                      pub.photo_url || '/src/assets/images/covers/booktemp.avif'
                    }
                    alt={pub.title}
                    className="publication-card-cover"
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
                        Last modified {MOCK_LAST_MODIFIED}
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
        </div>
      </section>

      {isFilterModalOpen && (
        <FilterModal
          initialFilters={appliedFilters}
          onApply={(filters) => setAppliedFilters(filters)}
          onClose={() => setIsFilterModalOpen(false)}
        />
      )}
    </div>
  );
}
