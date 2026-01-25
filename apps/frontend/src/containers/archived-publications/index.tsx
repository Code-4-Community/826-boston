import { useEffect, useState } from 'react';
import './styles.css';
import {
  STATIC_ARCHIVED,
  RECENTLY_EDITED,
  MOCK_LAST_MODIFIED,
} from '@utils/mock-data';
import { Anthology, AnthologyStatus } from '../../types/anthology';

// Import SVG icons
import DocumentIcon from '../../assets/icons/document.svg';
import SearchIcon from '../../assets/icons/search.svg';
import ListIcon from '../../assets/icons/list.svg';
import FilterIcon from '../../assets/icons/filter.svg';
import MenuDotsIcon from '../../assets/icons/menu-dots.svg';
import BookmarkIcon from '../../assets/icons/bookmark.svg';

export default function ArchivedPublications() {
  const [archived, setArchived] = useState<Anthology[]>(STATIC_ARCHIVED);
  // const [selected, setSelected] = useState<Anthology | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/anthologies')
      .then((res) => res.json())
      .then((data) => {
        const archivedOnly = (data as Anthology[]).filter(
          (item) => item.status === AnthologyStatus.ARCHIVED,
        );
        if (archivedOnly.length > 0) {
          setArchived(archivedOnly);
        }
      })
      .catch(() => {
        setArchived(STATIC_ARCHIVED);
      });
  }, []);

  const filteredPublications = archived.filter((pub) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = pub.title.toLowerCase().includes(query);
    const authors = pub.getAuthors() || [];
    const authorMatch = authors.some((a) =>
      a.name.toLowerCase().includes(query),
    );
    return titleMatch || authorMatch;
  });

  return (
    <div className="archive-wrapper">
      {/* Recently Edited Section */}
      <section className="recently-edited-section">
        <div className="recently-edited-content">
          <h2 className="recently-edited-title">Recently Edited</h2>
          <div className="recently-edited-list">
            {RECENTLY_EDITED.map((pub) => (
              <div
                key={pub.id}
                className="publication-list-item"
                // onClick={() => setSelected(pub)}
              >
                <div className="publication-list-item-content">
                  <div className="publication-list-item-left">
                    <img
                      src={DocumentIcon}
                      alt=""
                      className="publication-list-icon"
                    />
                    <span className="publication-list-title">{pub.title}</span>
                  </div>
                  <div className="publication-list-item-right">
                    <span className="publication-list-modified">
                      Last modified 1 hour ago
                    </span>
                    <img
                      src={MenuDotsIcon}
                      alt=""
                      className="publication-list-menu"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Publications Section */}
      <section className="all-publications-section">
        <div className="all-publications-content">
          {/* Search Header */}
          <div className="publication-search-header">
            <h2 className="publication-search-title">All Publications</h2>
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
              <button type="button" className="publication-filter-btn">
                <img
                  src={ListIcon}
                  alt=""
                  className="publication-filter-icon"
                />
              </button>
              <button type="button" className="publication-filter-btn">
                <img
                  src={FilterIcon}
                  alt=""
                  className="publication-filter-icon"
                />
              </button>
            </div>
          </div>

          {/* Publication Cards Grid */}
          <div className="publication-cards-grid">
            {filteredPublications.map((pub) => (
              <button
                key={pub.id}
                type="button"
                className="publication-card"
                onClick={() =>
                  (window.location.href = `/publication/${pub.id}`)
                }
              >
                <div className="publication-card-image">
                  <img
                    src={
                      pub.photo_url || 'src/assets/images/covers/booktemp.avif'
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
                    <p className="publication-card-author">
                      {pub
                        .getAuthors()
                        .map((a) => a.name)
                        .join(', ') || 'Author Name'}
                    </p>
                    <div className="publication-card-meta">
                      <span className="publication-card-modified">
                        Last modified{' '}
                        {pub.updated_at
                          ? new Date(pub.updated_at).toLocaleDateString(
                              'en-US',
                              {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              },
                            )
                          : MOCK_LAST_MODIFIED}
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

      {/* Modal */}
      {/* {selected && (
        <div
          className="archive-modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <div className="archive-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="archive-modal-title">{selected.title}</h2>
            <div className="archive-modal-content">
              <p>
                <strong>Year:</strong> {selected.published_year ?? '—'}
              </p>

              <p>
                <strong>Status:</strong> {selected.status}
              </p>

              {selected.authors && selected.authors.length > 0 && (
                <p>
                  <strong>Author(s):</strong> {selected.authors.join(', ')}
                </p>
              )}

              <p>
                This is a placeholder pop-up interaction. Additional details and
                actions will be added in future tickets.
              </p>
            </div>
            <button
              type="button"
              className="archive-modal-close"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}
