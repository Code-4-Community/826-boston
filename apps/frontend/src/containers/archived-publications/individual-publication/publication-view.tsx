import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import { Anthology, Story } from '../../../types';
import './publication-view.css';

import imgFrame69 from '../../../assets/images/frame-69.png';
import imgFluentIosArrow24Filled from '../../../assets/images/fluent-ios-arrow-24-filled.svg';
import imgVector3 from '../../../assets/images/vector-3.svg';
import imgOuiPopout from '../../../assets/images/oui-popout.svg';
import imgFluentMdl2SortUp from '../../../assets/images/fluent-mdl2-sort-up.svg';
import imgVector4 from '../../../assets/images/vector-4.svg';

type TabType = 'publications' | 'assets' | 'production-details' | 'inventory';

// --- Components ---

interface TabButtonProps {
  id: TabType;
  label: string;
  activeTab: TabType;
  onClick: (id: TabType) => void;
}

const TabButton: React.FC<TabButtonProps> = ({
  id,
  label,
  activeTab,
  onClick,
}) => (
  <button
    onClick={() => onClick(id)}
    className={`tab-item ${activeTab === id ? 'tab-active' : ''}`}
  >
    {label}
  </button>
);

interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <div className="detail-row">
    <p className="detail-label">{label}</p>
    <p
      className={`detail-value ${
        value === 'Empty' ? 'detail-value-empty' : ''
      }`}
    >
      {value}
    </p>
  </div>
);

interface DetailRowLinkProps {
  label: string;
  linkText: string;
}

const DetailRowLink: React.FC<DetailRowLinkProps> = ({ label, linkText }) => (
  <div className="detail-row detail-row-link">
    <p className="detail-label">{label}</p>
    <button type="button" className="detail-link">
      <span className="detail-link-text">{linkText}</span>
      <div
        className="link-icon"
        style={{
          maskImage: `url(${imgOuiPopout})`,
          WebkitMaskImage: `url(${imgOuiPopout})`,
        }}
      />
    </button>
  </div>
);

const DetailRowStatus: React.FC = () => (
  <div className="detail-row detail-row-special">
    <p className="detail-label">Status</p>
    <div className="status-badge-container">
      <div className="status-badge">
        <div className="status-icon">
          <img src={imgVector4} alt="" />
        </div>
        <span>Can Be Shared</span>
      </div>
    </div>
  </div>
);

const DetailRowSponsors: React.FC = () => (
  <div className="detail-row detail-row-special">
    <p className="detail-label">Sponsors</p>
    <div className="sponsor-tags">
      <div className="sponsor-tag">
        Northeastern University Office of City and Community Engagement
      </div>
      <div className="sponsor-tag">Suffolk University</div>
    </div>
  </div>
);

interface AssetRowProps {
  name: string;
  type: string;
  size: string;
}

const AssetRow: React.FC<AssetRowProps> = ({ name, type, size }) => (
  <div className="assets-table-row">
    <span className="table-row-name">{name}</span>
    <div className="table-row-right">
      <span className="table-row-type">{type}</span>
      <span className="table-row-size">{size}</span>
    </div>
  </div>
);

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
const assets = [
  { name: 'name_of_file', type: 'PDF', size: '6.2 MB' },
  { name: 'name_of_file', type: 'PDF', size: '6.2 MB' },
  { name: 'name_of_file', type: 'PDF', size: '6.2 MB' },
];

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

  const publicationDetails = [
    {
      label: 'Subtitle',
      value: anthology.subtitle || 'Empty',
    },
    {
      label: 'Byline',
      value: anthology.byline || 'Empty',
    },
    {
      label: 'Theme',
      value: anthology.themes?.join(', ') || 'Empty',
    },
    {
      label: 'Praise/Pull Quotes',
      value: anthology.praise_quotes || 'Empty',
    },
  ];

  // const productionDetails = [
  //   { label: 'Foreword Author', value: anthology.foreword_author || 'Empty' },
  //   { label: 'Age Category', value: anthology.age_category || 'Empty' },
  //   { label: 'Pub Level', value: anthology.pub_level || 'Empty' },
  //   {
  //     label: 'Pub Date',
  //     value: anthology.published_year?.toString() || 'Empty',
  //   },
  //   { label: 'ISBN', value: anthology.isbn || 'Empty' },
  //   { label: 'Dimensions', value: anthology.dimensions || 'Empty' },
  //   { label: 'Binding Type', value: anthology.binding_type || 'Empty' },
  //   { label: 'Page Count', value: anthology.page_count?.toString() || 'Empty' },
  //   { label: 'Print Run', value: anthology.print_run?.toString() || 'Empty' },
  //   { label: 'Printed By', value: anthology.printed_by || 'Empty' },
  //   {
  //     label: 'Number of Students',
  //     value: anthology.number_of_students?.toString() || 'Empty',
  //   },
  //   { label: 'Printing Cost', value: anthology.printing_cost || 'Empty' },
  //   { label: 'Weight', value: anthology.weight || 'Empty' },
  // ];

  const inventoryItems = [
    { label: 'Total Inventory', value: anthology.inventory?.toString() || '0' },
    ...Object.entries(anthology.inventory_locations || {}).map(
      ([location, count]) => ({
        label: location,
        value: count.toString(),
      }),
    ),
  ];

  const isProjectsView = location.pathname.startsWith('/projects/');
  const breadcrumbHref = isProjectsView
    ? '/projects/drafts'
    : '/archive/published';
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
              src={anthology.photo_url || imgFrame69}
              alt="Publication cover"
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
            <MetadataRowSingle label="Publishing Permission" value="All" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <TabButton
            id="publications"
            label="Publications"
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          <TabButton
            id="assets"
            label="Assets"
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          {/* <TabButton
            id="production-details"
            label="Production Details"
            activeTab={activeTab}
            onClick={setActiveTab}
          /> */}
          <TabButton
            id="inventory"
            label="Inventory"
            activeTab={activeTab}
            onClick={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'publications' && (
          <div className="tab-content">
            {publicationDetails.map((detail, index) => (
              <DetailRow
                key={index}
                label={detail.label}
                value={detail.value}
              />
            ))}
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="assets-content">
            <div className="assets-filters">
              <div className="filter-badge filter-active">Program Files</div>
              <div className="filter-badge">Design Files</div>
              <div className="filter-badge">
                OMCHAI + Tracker
                <img src={imgOuiPopout} alt="" className="filter-icon" />
              </div>
            </div>
            <div className="assets-table">
              <div className="assets-table-header">
                <div className="table-header-left">
                  <span>Name</span>
                  <img src={imgFluentMdl2SortUp} alt="" className="sort-icon" />
                </div>
                <div className="table-header-right">
                  <span>File Type</span>
                  <span>Size</span>
                </div>
              </div>
              <div className="assets-table-body">
                {assets.map((asset, index) => (
                  <AssetRow
                    key={index}
                    name={asset.name}
                    type={asset.type}
                    size={asset.size}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* {activeTab === 'production-details' && (
          <div className="tab-content">
            <DetailRowStatus />
            <DetailRowSponsors />
            {productionDetails.map((detail, index) => (
              <DetailRow
                key={index}
                label={detail.label}
                value={detail.value}
              />
            ))}
          </div>
        )} */}

        {activeTab === 'inventory' && (
          <div className="tab-content">
            {inventoryItems.map((item, index) => (
              <DetailRow key={index} label={item.label} value={item.value} />
            ))}
            <DetailRowLink
              label="Projects"
              linkText="FY25 Publications Archived"
            />
            <DetailRow label="Individual Pieces" value="Empty" />
            <DetailRow label="Place" value="Empty" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationView;
