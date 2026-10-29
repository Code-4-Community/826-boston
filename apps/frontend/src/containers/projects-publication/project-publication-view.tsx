import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient, { type StoryDocumentRow } from '../../api/apiClient';
import { Anthology } from '../../types';
import DocumentsTable from './documents-table';
import StoryDraftDetailPanel, {
  StoryDraftDetail,
} from './story-draft-detail-panel';
import OmchaiView from './omchai-view';
import ProductionInfoView from './production-info-view';
import ApprovedDocumentsView from './approved-documents-view';
import PublicationDetailsView from './publication-details-view';
import useAuth from '../../hooks/useAuth';
import './project-publication-view.css';

type Tab =
  | 'publication-details'
  | 'omchai'
  | 'documents'
  | 'approved-documents'
  | 'tasks'
  | 'production-info';

const ProjectPublicationView: React.FC = () => {
  const [, , currentUser] = useAuth();
  const { id } = useParams<{ id: string }>();
  const [anthology, setAnthology] = useState<Anthology | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('publication-details');
  // Draft open in the detail panel, plus a reload for the table it came from
  const [selectedDraft, setSelectedDraft] = useState<{
    draft: StoryDraftDetail;
    reload: () => void;
  } | null>(null);

  // Table rows lack bio, name in book and checkpoints, so fetch the full draft
  const openDraftDetail = async (row: StoryDocumentRow, reload: () => void) => {
    if (row.storyDraftId === null || !anthology) return;
    try {
      const drafts = await apiClient.getStoryDrafts(anthology.id);
      const draft = drafts.find((d) => d.id === row.storyDraftId);
      if (!draft) return;
      const author = draft.story?.author;

      setSelectedDraft({
        draft: {
          storyDraftId: draft.id,
          authorId: row.authorId,
          firstName: row.firstName,
          lastName: row.lastName,
          bio: author?.bio ?? '',
          grade: author?.grade ?? null,
          nameInBook: author?.nameInBook ?? '',
          studentConsent: draft.studentConsent,
          docLink: draft.docLink,
          checkpoints: draft.checkpoints ?? {},
        },
        reload,
      });
    } catch {
      // Panel stays closed on fetch failure
    }
  };

  useEffect(() => {
    if (id) {
      apiClient
        .getAnthology(id)
        .then((data) => {
          setAnthology(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="ppv-wrapper">Loading...</div>;
  if (!anthology)
    return <div className="ppv-wrapper">No publication found.</div>;

  return (
    <div className="ppv-wrapper">
      <div className="ppv-breadcrumb">
        <a href="/projects/drafts" className="ppv-breadcrumb-link">
          Projects
        </a>
        <span className="ppv-breadcrumb-sep">›</span>
        <span>{anthology.title}</span>
      </div>

      <div className="ppv-content">
        <div className="publication-tabs">
          <button
            type="button"
            className={`publication-tab${
              activeTab === 'publication-details'
                ? ' publication-tab--active'
                : ''
            }`}
            onClick={() => setActiveTab('publication-details')}
          >
            Publication Details
          </button>
          <button
            type="button"
            className={`publication-tab${
              activeTab === 'omchai' ? ' publication-tab--active' : ''
            }`}
            onClick={() => setActiveTab('omchai')}
          >
            OMCHAI
          </button>
          <button
            type="button"
            className={`publication-tab${
              activeTab === 'tasks' ? ' publication-tab--active' : ''
            }`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
          <button
            type="button"
            className={`publication-tab${
              activeTab === 'documents' ? ' publication-tab--active' : ''
            }`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
          <button
            type="button"
            className={`publication-tab${
              activeTab === 'approved-documents'
                ? ' publication-tab--active'
                : ''
            }`}
            onClick={() => setActiveTab('approved-documents')}
          >
            Approved Documents
          </button>
          <button
            type="button"
            className={`publication-tab${
              activeTab === 'production-info' ? ' publication-tab--active' : ''
            }`}
            onClick={() => setActiveTab('production-info')}
          >
            Production & Distribution
          </button>
        </div>

        {activeTab === 'publication-details' && (
          <div className="ppv-tab-content">
            <PublicationDetailsView
              anthology={anthology}
              anthologyId={anthology.id}
              currentUser={currentUser}
              onChange={setAnthology}
            />
          </div>
        )}

        {activeTab === 'omchai' && (
          <div className="ppv-tab-content">
            <OmchaiView anthologyId={anthology.id} />
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="ppv-tab-content">
            <DocumentsTable
              anthologyId={anthology.id}
              onRowClick={openDraftDetail}
            />
          </div>
        )}

        {activeTab === 'approved-documents' && (
          <div className="ppv-tab-content">
            <ApprovedDocumentsView
              anthologyId={anthology.id}
              onRowClick={openDraftDetail}
            />
          </div>
        )}

        {activeTab === 'production-info' && (
          <div className="ppv-tab-content">
            <ProductionInfoView
              anthologyId={anthology.id}
              shopifyUrl={anthology.shopify_url || anthology.shopifyUrl}
              isbn={anthology.isbn}
            />
          </div>
        )}
        {activeTab === 'tasks' && <div className="ppv-tab-content">Tasks</div>}
      </div>

      {selectedDraft && (
        <StoryDraftDetailPanel
          key={selectedDraft.draft.storyDraftId}
          draft={selectedDraft.draft}
          onClose={() => setSelectedDraft(null)}
          onSaved={selectedDraft.reload}
        />
      )}
    </div>
  );
};

export default ProjectPublicationView;
