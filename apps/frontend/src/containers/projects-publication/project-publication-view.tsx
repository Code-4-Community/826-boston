import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { Anthology, Author, SubmissionRound, EditRound } from '../../types';
import imgFrame69 from '../../assets/images/frame-69.png';
import NewStoryDraftModal from './new-story-draft-modal';
import EditStoryDraftModal, {
  EditableStoryDraft,
} from './edit-story-draft-modal';
import OmchaiView from './omchai-view';
import useAuth from '../../hooks/useAuth';
import Role from '../../api/dtos/role';
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
  const [, , currentUser] = useAuth();
  const canChangeCover = currentUser?.role === Role.ADMIN;
  const { id } = useParams<{ id: string }>();
  const [anthology, setAnthology] = useState<Anthology | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('omchai');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState<StoryDraftRow | null>(null);
  const [storyDrafts, setStoryDrafts] = useState<StoryDraftRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setUploadError('Only JPEG, PNG, GIF, and WebP images are accepted.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File size must be under 5 MB.');
      return;
    }

    setUploadError(null);
    setUploading(true);
    try {
      const updated = await apiClient.uploadAnthologyCoverImage(
        Number(id),
        file,
      );
      setAnthology((prev) =>
        prev
          ? { ...prev, photo_url: updated.photo_url ?? updated.photoUrl }
          : prev,
      );
    } catch {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const loadStoryDrafts = useCallback(async () => {
    if (!id) return;
    try {
      const drafts = await apiClient.getStoryDrafts(Number(id));

      setStoryDrafts(
        drafts.map((draft) => {
          const author = draft.story?.author;
          const nameParts = author?.name?.split(' ') ?? [];

          return {
            storyDraftId: draft.id,
            authorId: author?.id ?? 0,
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
            notes: draft.notes ?? [],
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
        <div className="ppv-header">
          <div className="ppv-cover-image">
            <img
              src={anthology.photo_url || anthology.photoUrl || imgFrame69}
              alt="Publication cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = imgFrame69;
              }}
            />
            {canChangeCover && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="ppv-cover-upload-input"
                  onChange={handleCoverUpload}
                />
                <button
                  type="button"
                  className="ppv-cover-upload-btn"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? 'Uploading...' : 'Change Cover'}
                </button>
                {uploadError && (
                  <p className="ppv-cover-upload-error">{uploadError}</p>
                )}
              </>
            )}
          </div>
          <h1 className="ppv-title">{anthology.title}</h1>
        </div>

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
