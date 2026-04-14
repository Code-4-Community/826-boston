import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { Anthology, Author, SubmissionRound, EditRound } from '../../types';
import NewStoryDraftModal from './new-story-draft-modal';
import EditStoryDraftModal, {
  EditableStoryDraft,
} from './edit-story-draft-modal';
import OmchaiView from './omchai-view';
import './project-publication-view.css';

type Tab = 'omchai' | 'document-tracker';

interface StoryDraftRow {
  storyDraftId: number;
  authorId: number;
  firstName: string;
  lastName: string;
  nameInBook: string;
  classPeriod: string;
  docLink: string;
  submissionRound: SubmissionRound;
  studentConsent: boolean;
  inManuscript: boolean;
  editRound: EditRound;
  proofread: boolean;
  notes: string[];
}

const ProjectPublicationView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anthology, setAnthology] = useState<Anthology | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('omchai');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState<StoryDraftRow | null>(null);
  const [storyDrafts, setStoryDrafts] = useState<StoryDraftRow[]>([]);

  const loadStoryDrafts = useCallback(async () => {
    if (!id) return;
    try {
      const [drafts, authors] = await Promise.all([
        apiClient.getStoryDrafts(Number(id)),
        apiClient.getAuthors(),
      ]);

      const authorMap = new Map<number, Author>();
      for (const author of authors) {
        authorMap.set(author.id, author);
      }

      setStoryDrafts(
        drafts.map((draft) => {
          const author = authorMap.get(draft.authorId);
          const nameParts = author?.name?.split(' ') ?? [];
          return {
            storyDraftId: draft.id,
            authorId: draft.authorId,
            firstName: nameParts[0] ?? '',
            lastName: nameParts.slice(1).join(' '),
            nameInBook: author?.nameInBook ?? '',
            classPeriod: author?.classPeriod ?? '',
            docLink: draft.docLink,
            submissionRound: draft.submissionRound,
            studentConsent: draft.studentConsent,
            inManuscript: draft.inManuscript,
            editRound: draft.editRound,
            proofread: draft.proofread,
            notes: draft.notes,
          };
        }),
      );
    } catch {
      // Story drafts will remain as-is on fetch failure
    }
  }, [id]);

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

  useEffect(() => {
    if (activeTab === 'document-tracker') {
      loadStoryDrafts();
    }
  }, [activeTab, loadStoryDrafts]);

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
        <h1 className="ppv-title">{anthology.title}</h1>

        <div className="publication-tabs">
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
              activeTab === 'document-tracker' ? ' publication-tab--active' : ''
            }`}
            onClick={() => setActiveTab('document-tracker')}
          >
            Document Tracker
          </button>
        </div>

        {activeTab === 'omchai' && (
          <div className="ppv-tab-content">
            <OmchaiView anthologyId={anthology.id} />
          </div>
        )}

        {activeTab === 'document-tracker' && (
          <div className="ppv-tab-content">
            <div className="document-tracker-header">
              <button
                type="button"
                className="publication-create-btn"
                onClick={() => setIsModalOpen(true)}
              >
                New Story Draft
              </button>
            </div>

            <table className="document-tracker-table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Name in Book</th>
                  <th>Class Period</th>
                  <th>Document Link</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {storyDrafts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign: 'center',
                        color: 'var(--neutral-400)',
                        padding: '24px',
                      }}
                    >
                      No story drafts yet.
                    </td>
                  </tr>
                ) : (
                  storyDrafts.map((draft) => (
                    <tr key={draft.storyDraftId}>
                      <td>{draft.firstName}</td>
                      <td>{draft.lastName}</td>
                      <td>{draft.nameInBook}</td>
                      <td>{draft.classPeriod}</td>
                      <td>
                        <a
                          href={draft.docLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open
                        </a>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="document-tracker-edit-btn"
                          onClick={() => setEditingDraft(draft)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <NewStoryDraftModal
          anthologyId={anthology.id}
          onClose={() => setIsModalOpen(false)}
          onSaved={loadStoryDrafts}
        />
      )}

      {editingDraft && (
        <EditStoryDraftModal
          draft={editingDraft as EditableStoryDraft}
          onClose={() => setEditingDraft(null)}
          onSaved={loadStoryDrafts}
        />
      )}
    </div>
  );
};

export default ProjectPublicationView;
