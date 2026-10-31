import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import {
  Anthology,
  AnthologyInventoryLocation,
  AnthologyPubLevel,
  AnthologyStatus,
  ProductionInfo,
  Story,
} from '../../../types';
import './publication-view.css';

import imgFrame69 from '../../../assets/images/frame-69.png';
import imgFluentIosArrow24Filled from '../../../assets/images/fluent-ios-arrow-24-filled.svg';
import imgVector3 from '../../../assets/images/vector-3.svg';
import imgOuiPopout from '../../../assets/images/oui-popout.svg';
import imgFluentMdl2SortUp from '../../../assets/images/fluent-mdl2-sort-up.svg';

type TabType = 'publications' | 'assets' | 'production-details' | 'inventory';

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

interface DetailRowStatusProps {
  status: string;
}

const DetailRowStatus: React.FC<DetailRowStatusProps> = ({ status }) => (
  <div className="detail-row detail-row-special">
    <p className="detail-label">Status</p>
    <div className="status-badge-container">
      <div className="status-badge">
        <span>{status}</span>
      </div>
    </div>
  </div>
);

interface DetailRowSponsorsProps {
  sponsors: string[];
}

const DetailRowSponsors: React.FC<DetailRowSponsorsProps> = ({ sponsors }) => (
  <div className="detail-row detail-row-special">
    <p className="detail-label">Sponsors</p>
    {sponsors.length > 0 ? (
      <div className="sponsor-tags">
        {sponsors.map((sponsor) => (
          <div key={sponsor} className="sponsor-tag">
            {sponsor}
          </div>
        ))}
      </div>
    ) : (
      <p className="detail-value detail-value-empty">Empty</p>
    )}
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
// No backend provides assets yet, so the Assets tab renders the designed
// filters and table header with an empty body rather than placeholder rows.
const assets: AssetRowProps[] = [];

const ASSET_FILTERS = ['Program Files', 'Design Files'];

/** The spreadsheet's wording for each status, which is what the designs show. */
const STATUS_LABELS: Record<AnthologyStatus, string> = {
  [AnthologyStatus.NOT_STARTED]: 'Not started',
  [AnthologyStatus.DRAFTING]: 'Drafting',
  [AnthologyStatus.AWAITING_REVIEW]: 'Awaiting review',
  [AnthologyStatus.CAN_BE_SHARED]: 'Can be shared',
  [AnthologyStatus.ARCHIVED]: 'Archived / Out of Circulation',
};

/** Pub levels render as the spreadsheet's "Level N" wording. */
const PUB_LEVEL_LABELS: Record<AnthologyPubLevel, string> = {
  [AnthologyPubLevel.ZINE]: 'Level 0',
  [AnthologyPubLevel.CHAPBOOK]: 'Level 1',
  [AnthologyPubLevel.PERFECT_BOUND]: 'Level 2',
  [AnthologyPubLevel.SIGNATURE]: 'Level 3',
};

const EMPTY = 'Empty';

// publishedDate is a plain calendar date, so format it in UTC — otherwise the
// local timezone shifts it a day backwards.
const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      })
    : EMPTY;

const formatCost = (value?: number | null) =>
  typeof value === 'number'
    ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : EMPTY;

/** Grams are what we store; the designs show ounces alongside them. */
const formatWeight = (grams?: number | null) =>
  typeof grams === 'number'
    ? `${(grams * 0.03527396).toFixed(1)} oz / ${grams} g`
    : EMPTY;

const formatCount = (value?: number | null) =>
  typeof value === 'number' ? value.toString() : EMPTY;

const PublicationView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>('publications');
  const [isExpanded, setIsExpanded] = useState(false);
  const [anthology, setAnthology] = useState<Anthology | null>(null);
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState<string[]>([]);
  const [isAuthorsExpanded, setIsAuthorsExpanded] = useState(false);
  const [inventoryLocations, setInventoryLocations] = useState<
    AnthologyInventoryLocation[]
  >([]);
  const [totalCopies, setTotalCopies] = useState(0);
  const [productionInfo, setProductionInfo] = useState<ProductionInfo | null>(
    null,
  );
  const [activeAssetFilter, setActiveAssetFilter] = useState(ASSET_FILTERS[0]);

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

  useEffect(() => {
    if (id) {
      apiClient
        .getAnthologyInventory(id)
        .then((data) => {
          setInventoryLocations(data.locations ?? []);
          setTotalCopies(data.totalCopies ?? 0);
        })
        .catch((err) => {
          console.error(err);
          setInventoryLocations([]);
          setTotalCopies(0);
        });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      apiClient.getProductionInfo(id).then(setProductionInfo);
    }
  }, [id]);

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

  const genreTags = (anthology.genres ?? []).map((g) => ({
    label: g,
    className: 'tag-accent',
  }));
  const themeTags = (anthology.themes ?? []).map((t) => ({
    label: t,
    className: 'tag-accent',
  }));
  const programValue = Array.isArray(anthology.programs)
    ? anthology.programs.join(', ')
    : anthology.programs || 'Empty';

  const publicationDetails = [
    { label: 'Subtitle', value: anthology.subtitle || 'Empty' },
    { label: 'Byline', value: anthology.byline || 'Empty' },
    { label: 'Theme', value: anthology.themes?.join(', ') || 'Empty' },
    { label: 'Genre', value: anthology.genres?.join(', ') || 'Empty' },
  ];

  const productionDetails = [
    {
      label: 'Foreword Author',
      value: productionInfo?.foreword_author || EMPTY,
    },
    {
      label: 'Age Category',
      value: anthology.ageCategories?.join(', ') || EMPTY,
    },
    {
      label: 'Pub Level',
      value: anthology.pubLevel
        ? PUB_LEVEL_LABELS[anthology.pubLevel] ?? anthology.pubLevel
        : EMPTY,
    },
    { label: 'Pub Date', value: formatDate(anthology.publishedDate) },
    { label: 'ISBN', value: anthology.isbn || EMPTY },
    { label: 'Dimensions', value: productionInfo?.dimensions || EMPTY },
    { label: 'Binding Type', value: productionInfo?.binding_type || EMPTY },
    { label: 'Page Count', value: formatCount(productionInfo?.page_count) },
    { label: 'Print Run', value: formatCount(productionInfo?.print_run) },
    { label: 'Printed By', value: productionInfo?.printed_by || EMPTY },
    {
      label: 'Number of Students',
      value: formatCount(productionInfo?.number_of_students),
    },
    {
      label: 'Printing Cost',
      value: formatCost(productionInfo?.printing_cost),
    },
    {
      label: 'Weight',
      value: formatWeight(productionInfo?.weight_in_grams),
    },
  ];

  // Every inventory location comes from the API, including those holding no
  // copies — those render as a muted "Empty" rather than being omitted.
  const inventoryItems = [
    { label: 'Total Inventory', value: totalCopies.toString() },
    ...inventoryLocations.map((inventoryLocation) => ({
      label: inventoryLocation.name,
      value:
        inventoryLocation.numCopies > 0
          ? inventoryLocation.numCopies.toString()
          : 'Empty',
    })),
  ];

  const isTrackerView = location.pathname.startsWith('/tracker/');
  const breadcrumbHref = isTrackerView ? '/tracker/all' : '/library/published';
  const breadcrumbLabel = isTrackerView ? 'Tracker' : 'Library';

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

        {/* Publication Actions */}
        <div className="publication-actions">
          <a
            className="publication-action publication-action-primary"
            href={anthology.shopify_url || undefined}
            target="_blank"
            rel="noreferrer"
          >
            Purchase
            <span
              className="publication-action-icon"
              style={{
                maskImage: `url(${imgOuiPopout})`,
                WebkitMaskImage: `url(${imgOuiPopout})`,
              }}
            />
          </a>
          <a
            className="publication-action publication-action-secondary"
            href={productionInfo?.design_files_link ?? undefined}
            target="_blank"
            rel="noreferrer"
          >
            View Manuscript
            <span
              className="publication-action-icon"
              style={{
                maskImage: `url(${imgOuiPopout})`,
                WebkitMaskImage: `url(${imgOuiPopout})`,
              }}
            />
          </a>
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
            {publicationDetails.map((detail) => (
              <DetailRow
                key={detail.label}
                label={detail.label}
                value={detail.value}
              />
            ))}
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="assets-content">
            <div className="assets-filters">
              {ASSET_FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveAssetFilter(filter)}
                  className={`filter-badge ${
                    activeAssetFilter === filter ? 'filter-active' : ''
                  }`}
                >
                  {filter}
                </button>
              ))}
              <a
                className="filter-badge"
                href={productionInfo?.design_files_link ?? undefined}
                target="_blank"
                rel="noreferrer"
              >
                OMCHAI + Tracker
                <img src={imgOuiPopout} alt="" className="filter-icon" />
              </a>
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
                {assets.length > 0 ? (
                  assets.map((asset, index) => (
                    <AssetRow
                      key={index}
                      name={asset.name}
                      type={asset.type}
                      size={asset.size}
                    />
                  ))
                ) : (
                  <div className="assets-table-row">
                    <span className="table-row-name detail-value-empty">
                      Empty
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'production-details' && (
          <div className="tab-content">
            <DetailRowStatus
              status={STATUS_LABELS[anthology.status] ?? anthology.status}
            />
            <DetailRowSponsors sponsors={anthology.sponsors ?? []} />
            {productionDetails.map((detail) => (
              <DetailRow
                key={detail.label}
                label={detail.label}
                value={detail.value}
              />
            ))}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="tab-content tab-content-inventory">
            {inventoryItems.map((item) => (
              <DetailRow
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationView;
