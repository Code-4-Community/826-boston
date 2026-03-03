import { useEffect, useState } from 'react';
import './styles.css';
import {
  STATIC_ARCHIVED,
  RECENTLY_EDITED,
  MOCK_LAST_MODIFIED,
  Anthology,
} from '@utils/mock-data';

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
          (item) => item.status === 'archived',
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
    const authors = pub.authors || [];
    const authorMatch = authors.some((a) => a.toLowerCase().includes(query));
    return titleMatch || authorMatch;
  });

  return (
    <div className="archive-wrapper">
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
                      {pub.authors?.join(', ') || 'Author Name'}
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


    </div>
  );
}
