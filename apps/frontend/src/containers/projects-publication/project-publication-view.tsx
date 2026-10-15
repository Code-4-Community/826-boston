import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { Anthology } from '../../types';
import imgFrame69 from '../../assets/images/frame-69.png';
import DocumentsTable from './documents-table';
import OmchaiView from './omchai-view';
import ProductionInfoView from './production-info-view';
import useAuth from '../../hooks/useAuth';
import Role from '../../api/dtos/role';
import './project-publication-view.css';

type Tab = 'omchai' | 'documents' | 'production-info';

const ProjectPublicationView: React.FC = () => {
  const [, , currentUser] = useAuth();
  const canChangeCover = currentUser?.role === Role.ADMIN;
  const { id } = useParams<{ id: string }>();
  const [anthology, setAnthology] = useState<Anthology | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('omchai');
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
              activeTab === 'documents' ? ' publication-tab--active' : ''
            }`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
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

        {activeTab === 'omchai' && (
          <div className="ppv-tab-content">
            <OmchaiView anthologyId={anthology.id} />
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="ppv-tab-content">
            <DocumentsTable anthologyId={anthology.id} />
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
      </div>
    </div>
  );
};

export default ProjectPublicationView;
