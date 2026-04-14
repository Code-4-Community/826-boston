import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import './styles.css';
import apiClient from '../../api/apiClient';
import { MOCK_LAST_MODIFIED } from '@utils/mock-data';
import {
  Anthology,
  AnthologyStatus,
  FilterState,
  DEFAULT_FILTER_STATE,
  SortOption,
} from '../../types';
import FilterModal from './filter-modal/FilterModal';

// Import SVG icons
import SearchIcon from '../../assets/icons/search.svg';
import FilterIcon from '../../assets/icons/filter.svg';
import MenuDotsIcon from '../../assets/icons/menu-dots.svg';
import BookmarkIcon from '../../assets/icons/bookmark.svg';

type PublicationsPageMode = 'archive' | 'projects';
type ArchiveTab = 'published' | 'archived';
type ProjectTab =
  | 'drafts'
  | 'in-revision'
  | 'in-production'
  | 'published'
  | 'archived';

interface PublicationsPageProps {
  mode?: PublicationsPageMode;
}

/**
 * Applies search, filters, and sort to the publication list.
 * Returns a new sorted+filtered array without mutating the original.
 */
function applyFiltersAndSort(
  pubs: Anthology[],
  search: string,
  filters: FilterState,
): Anthology[] {
  let result = [...pubs];

  // Search by title
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((p) => p.title.toLowerCase().includes(q));
  }

  // Publication date year range
  if (filters.pubDateStart) {
    const start = parseInt(filters.pubDateStart, 10);
    if (!isNaN(start)) {
      result = result.filter((p) => p.published_year >= start);
    }
  }
  if (filters.pubDateEnd) {
    const end = parseInt(filters.pubDateEnd, 10);
    if (!isNaN(end)) {
      result = result.filter((p) => p.published_year <= end);
    }
  }

  if (filters.pubLevels.length > 0) {
    result = result.filter((p) =>
      filters.pubLevels.some((l) => p.pubLevel === l),
    );
  }

  // Inventory range
  if (filters.inventoryMin) {
    const min = parseInt(filters.inventoryMin, 10);
    if (!isNaN(min)) {
      result = result.filter((p) => (p.inventory ?? 0) >= min);
    }
  }
  if (filters.inventoryMax) {
    const max = parseInt(filters.inventoryMax, 10);
    if (!isNaN(max)) {
      result = result.filter((p) => (p.inventory ?? Infinity) <= max);
    }
  }

  // Program — normalize programs to array for comparison
  // Note: original entries 1–2 use 'YABP' and will not match any enum value
  if (filters.programs.length > 0) {
    result = result.filter((p) =>
      filters.programs.some((g) => p.programs?.includes(g)),
    );
  }

  if (filters.genres.length > 0) {
    result = result.filter((p) =>
      filters.genres.some((g) => p.genres?.includes(g)),
    );
  }

  // Sort
  result.sort((a, b) => {
    switch (filters.sortBy) {
      case SortOption.TITLE_ASC:
        return a.title.localeCompare(b.title);
      case SortOption.AUTHOR_ASC:
        return a.title.localeCompare(b.title);
      case SortOption.DATE_NEWEST:
        return b.published_year - a.published_year;
      case SortOption.DATE_OLDEST:
        return a.published_year - b.published_year;
      default:
        return 0;
    }
  });

  return result;
}

function isArchiveTab(value: string | undefined): value is ArchiveTab {
  return value === 'published' || value === 'archived';
}

function isProjectTab(value: string | undefined): value is ProjectTab {
  return (
    value === 'drafts' ||
    value === 'in-revision' ||
    value === 'in-production' ||
    value === 'published' ||
    value === 'archived'
  );
}

export default function ArchivedPublications({
  mode = 'archive',
}: PublicationsPageProps) {
  const [publications, setPublications] = useState<Anthology[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(DEFAULT_FILTER_STATE);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const navigate = useNavigate();
  const { tab } = useParams<{ tab: string }>();

  const activeArchiveTab: ArchiveTab = isArchiveTab(tab) ? tab : 'published';
  const activeProjectTab: ProjectTab = isProjectTab(tab) ? tab : 'drafts';

  useEffect(() => {
    apiClient
      .getAnthologies()
      .then((data) => {
        if (Array.isArray(data)) {
          setPublications(data as Anthology[]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    console.log(publications)
  }, [publications]);

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

    if (activeProjectTab === 'drafts') {
      return pub.status === AnthologyStatus.NOT_STARTED;
    }

    if (activeProjectTab === 'in-revision') {
      return pub.status === AnthologyStatus.DRAFTING;
    }

    if (activeProjectTab === 'in-production') {
      return status === 'InProduction';
    }

    if (activeProjectTab === 'published') {
      return status === AnthologyStatus.CAN_BE_SHARED || status === 'Published';
    }

    if (activeProjectTab === 'archived') {
      return status === AnthologyStatus.ARCHIVED;
    }

    return false;
  });

  const filteredPublications = applyFiltersAndSort(
    statusFilteredPublications,
    searchQuery,
    appliedFilters,
  );

  return (
    <div className="archive-wrapper">
      {/* All Publications Section */}
      <section className="all-publications-section">
        <div className="all-publications-content">
          {/* Search Header */}
          <div className="publication-search-header">
            <h2 className="publication-search-title">
              {mode === 'projects' ? 'Publication Tracker' : 'Library'}
            </h2>
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
                  aria-label="Create project"
                >
                  Create Project
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

          {/* Publication Cards Grid */}
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

      {/* Sort & Filter Modal */}
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
