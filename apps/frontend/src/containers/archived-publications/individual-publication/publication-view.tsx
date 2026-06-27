import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import { Anthology, Story } from '../../../types';
import './publication-view.css';

import imgFrame69 from '../../../assets/images/frame-69.png';
import imgFluentIosArrow24Filled from '../../../assets/images/fluent-ios-arrow-24-filled.svg';
import imgVector3 from '../../../assets/images/vector-3.svg';

type TabType = 'publications' | 'assets' | 'production-details' | 'inventory';

interface MetadataRowProps {
  label: string;
  tags: { label: string; className: string }[];
}

const MetadataRow: React.FC<MetadataRowProps> = ({ label, tags }) => (
  <div className="metadata-row">
    <p className="metadata-label">{label}</p>
    <div className="tag-group">
      {tags.map((tag, index) => (
        <div key={index} className={`tag ${tag.className}`}>
          {tag.label}
        </div>
      ))}
    </div>
  </div>
);

interface MetadataRowSingleProps {
  label: string;
  value: string;
}

const MetadataRowSingle: React.FC<MetadataRowSingleProps> = ({
  label,
  value,
}) => (
  <div className="metadata-row-single">
    <p className="metadata-label">{label}</p>
    <p className="metadata-value">{value}</p>
  </div>
);

// --- Data ---
// Assets hardcoded for now as backend doesn't provide them yet

const PublicationView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>('publications');
  const [isExpanded, setIsExpanded] = useState(false);
  const [anthology, setAnthology] = useState<Anthology | null>(null);
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState<string[]>([]);
  const [isAuthorsExpanded, setIsAuthorsExpanded] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      apiClient
        .getAnthology(id)
        .then((data) => {
          setAnthology(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setAnthology(null);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (anthology?.id) {
      apiClient
        .getStoriesByAnthology(anthology.id)
        .then((stories: Story[]) => {
          const authorNames = [
            ...new Set(stories.map((s) => s.author?.name).filter(Boolean)),
          ] as string[];
          setAuthors(authorNames);
        })
        .catch(() => {
          setAuthors([]);
        });
    }
  }, [anthology?.id]);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleAuthorsExpanded = () => {
    setIsAuthorsExpanded(!isAuthorsExpanded);
  };

  if (loading) return <div className="publication-view">Loading...</div>;
  if (!anthology)
    return <div className="publication-view">No anthology found</div>;

  const fullDescription = anthology.description || 'No description available.';

  const getTagClass = (label: string) => {
    switch (label) {
      case 'Fantasy':
        return 'tag-fantasy';
      case 'Science Fiction':
        return 'tag-science-fiction';
      case 'Mystery':
        return 'tag-mystery';
      default:
        return 'tag-neutral';
    }
  };

  const genreTags = (anthology.genres ?? []).map((g) => ({
    label: g,
    className: getTagClass(g),
  }));
  const themeTags = (anthology.themes ?? []).map((t) => ({
    label: t,
    className: 'tag-neutral',
  }));
  const programValue = Array.isArray(anthology.programs)
    ? anthology.programs.join(', ')
    : anthology.programs || 'Empty';

  const isProjectsView = location.pathname.startsWith('/projects/');
  const breadcrumbHref = isProjectsView
    ? '/projects/drafts'
    : '/library/published';
  const breadcrumbLabel = isProjectsView ? 'Projects' : 'Library';

  return (
    <div className="publication-view">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-header">
        <a href={breadcrumbHref} className="breadcrumb-link">
          {breadcrumbLabel}
        </a>
        <div className="breadcrumb-separator">
          <img src={imgVector3} alt="" />
        </div>
        <p className="breadcrumb-current">{anthology.title}</p>
      </div>

      {/* Main Content */}
      <div className="publication-content">
        {/* Publication Header Section */}
        <div className="publication-header">
          <div className="publication-image">
            <img
              src={anthology.photo_url || anthology.photoUrl || imgFrame69}
              alt="Publication cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = imgFrame69;
              }}
            />
          </div>
          <div className="publication-info">
            <div className="publication-title-section">
              <h1 className="publication-title">{anthology.title}</h1>
              <div className="publication-authors">
                {authors.length > 0 ? (
                  <>
                    <p className="publication-author">
                      {isAuthorsExpanded
                        ? authors.join(', ')
                        : authors.slice(0, 3).join(', ') +
                          (authors.length > 3 ? '...' : '')}
                    </p>
                    {authors.length > 3 && (
                      <div
                        className="read-more-link"
                        onClick={toggleAuthorsExpanded}
                      >
                        <p>
                          {isAuthorsExpanded
                            ? 'See Less'
                            : `See All ${authors.length} Authors`}
                        </p>
                        <div
                          className="read-more-arrow"
                          style={{
                            transform: isAuthorsExpanded
                              ? 'rotate(90deg)'
                              : 'rotate(270deg)',
                          }}
                        >
                          <img src={imgFluentIosArrow24Filled} alt="" />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="publication-author">No authors available</p>
                )}
              </div>
              <div className="publication-description">
                <p className="description-text">
                  {isExpanded
                    ? fullDescription
                    : `${fullDescription.slice(0, 153)}...`}
                </p>
                <div className="read-more-link" onClick={toggleReadMore}>
                  <p>{isExpanded ? 'Read Less' : 'Read More'}</p>
                  <div
                    className="read-more-arrow"
                    style={{
                      transform: isExpanded
                        ? 'rotate(90deg)'
                        : 'rotate(270deg)',
                    }}
                  >
                    <img src={imgFluentIosArrow24Filled} alt="" />
                  </div>
                </div>
              </div>
            </div>

            <MetadataRow
              label="Genre"
              tags={
                genreTags.length > 0
                  ? genreTags
                  : [{ label: 'Empty', className: 'tag-neutral' }]
              }
            />

            <MetadataRow
              label="Theme"
              tags={
                themeTags.length > 0
                  ? themeTags
                  : [{ label: 'Empty', className: 'tag-neutral' }]
              }
            />

            <MetadataRowSingle label="Program" value={programValue} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationView;
