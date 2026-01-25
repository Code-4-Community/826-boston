import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import { STATIC_ARCHIVED } from '@utils/mock-data';
import {
  Anthology,
  AnthologyStatus,
  AnthologyPubLevel,
} from '../../../types/anthology';
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

const mockAnthology: Anthology = new Anthology(
  /* id: */ 0,
  /* title: */ 'Untitled Publication (Mock)',
  /* published_year: */ 2025,
  /* status: */ AnthologyStatus.CAN_BE_SHARED,
  /* stories: */ [],
  /* subtitle: */ 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  /* byline: */ 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  /* description: */
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  /* updated_at: */ 'Jan 2, 1960',
  /* photo_url: */ undefined,
  /* foreword_author: */ 'Agnes Ugoji',
  /* praise_quotes: */
  '"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."',
  /* age_category: */ '9-12',
  /* isbn: */ '979-8-88694-087-9',
  /* shopify_url: */ 'https://example.com',
  /* binding_type: */ 'Perfect Bound',
  /* dimensions: */ '7" x 7"',
  /* printing_cost: */ '$2,906.40',
  /* print_run: */ 500,
  /* weight: */ '6.2 oz / 176 g',
  /* page_count: */ 132,
  /* printed_by: */ 'Marquis',
  /* pub_level: */ AnthologyPubLevel.PERFECT_BOUND,
  /* publishing_permission:*/ 'All',
  /* programs: */ ['YLAB'],
  /*sponsors:*/ ['Richard K. Lubin Family Foundation'],
  /* number_of_students: */ 53,
  /* total_inventory: */ 79,
  /* inventory_locations: */ [
    { id: 1, name: 'Devs/Comms Office (1865 Columbus)', num_copies: 79 },
    { id: 2, name: 'The Hub (1989 Columbus)', num_copies: 400 },
    { id: 3, name: 'Tutoring Center (3035 Office)', num_copies: 0 },
    { id: 4, name: 'Archived', num_copies: 3 },
  ],
);

const PublicationView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('publications');
  const [isExpanded, setIsExpanded] = useState(false);
  const [anthology, setAnthology] = useState<Anthology | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      apiClient
        .getAnthology(id)
        .then((data) => {
          if (data) {
            setAnthology(data);
          } else {
            // Fallback to mock if ID exists but no data returned (unlikely with current API structure but safe)
            setAnthology(mockAnthology);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          // Fallback to mock data based on ID
          const mockPub = STATIC_ARCHIVED.find(
            (pub) => pub.id === parseInt(id || '0'),
          );
          if (mockPub) {
            setAnthology(mockPub as Anthology);
          } else {
            setAnthology(mockAnthology);
          }
          setLoading(false);
        });
    } else {
      // Fallback for development if no ID is present
      const mockPub = STATIC_ARCHIVED.find(
        (pub) => pub.id === parseInt(id || '0'),
      );
      console.log('Using mock anthology (no ID)');
      setAnthology(mockPub ? (mockPub as Anthology) : mockAnthology);
      setLoading(false);
    }
  }, [id]);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  if (loading) return <div className="publication-view">Loading...</div>;
  if (!anthology)
    return <div className="publication-view">No anthology found</div>;

  const fullDescription = anthology.description || 'No description available.';

  // Helper to parse comma separated strings or arrays
  const parseTags = (value?: string | string[]) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return value.split(',').map((s) => s.trim());
    return [];
  };

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

  const genreTags = parseTags(anthology.getGenres().map((g) => g.name)).map(
    (g) => ({
      label: g,
      className: getTagClass(g),
    }),
  );
  const themeTags = parseTags(anthology.getThemes().map((t) => t.name)).map(
    (t) => ({
      label: t,
      className: 'tag-neutral',
    }),
  );
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
      label: anthology.getThemes().length === 1 ? 'Theme' : 'Themes',
      value:
        anthology
          .getThemes()
          .map((t) => t.name)
          .join(', ') || 'Empty',
    },
    {
      label: 'Praise/Pull Quotes',
      value: anthology.praise_quotes || 'Empty',
    },
  ];

  const productionDetails = [
    { label: 'Foreword Author', value: anthology.foreword_author || 'Empty' },
    { label: 'Age Category', value: anthology.age_category || 'Empty' },
    { label: 'Pub Level', value: anthology.pub_level || 'Empty' },
    {
      label: 'Pub Date',
      value: anthology.published_year?.toString() || 'Empty',
    },
    { label: 'ISBN', value: anthology.isbn || 'Empty' },
    { label: 'Dimensions', value: anthology.dimensions || 'Empty' },
    { label: 'Binding Type', value: anthology.binding_type || 'Empty' },
    { label: 'Page Count', value: anthology.page_count?.toString() || 'Empty' },
    { label: 'Print Run', value: anthology.print_run?.toString() || 'Empty' },
    { label: 'Printed By', value: anthology.printed_by || 'Empty' },
    {
      label: 'Number of Students',
      value: anthology.number_of_students?.toString() || 'Empty',
    },
    { label: 'Printing Cost', value: anthology.printing_cost || 'Empty' },
    { label: 'Weight', value: anthology.weight || 'Empty' },
  ];

  const inventoryItems = [
    {
      label: 'Total Inventory',
      value:
        anthology.inventory_locations
          ?.map((i) => i.num_copies)
          .reduce((total, current) => total + current, 0)
          .toString() || '0',
    },
    ...(anthology.inventory_locations ?? []).map((location) => ({
      label: location.name,
      value: (location.num_copies ?? 0).toString(),
    })),
  ];

  return (
    <div className="publication-view">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-header">
        <a href="library/publication/archived" className="breadcrumb-link">
          Archive
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
              <p className="publication-author">
                {anthology
                  .getAuthors()
                  .map((a) => a.name)
                  .join(', ') || 'Author Name'}
              </p>
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
          <TabButton
            id="production-details"
            label="Production Details"
            activeTab={activeTab}
            onClick={setActiveTab}
          />
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

        {activeTab === 'production-details' && (
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
        )}

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
