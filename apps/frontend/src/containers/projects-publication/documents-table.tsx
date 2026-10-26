import React, { useState, useEffect, useCallback } from 'react';
import apiClient, {
  type StoryDocumentRow,
  type StoryDocumentsFilters,
} from '../../api/apiClient';
import NewStoryDraftModal from './new-story-draft-modal';
import DocumentsFilterModal from './documents-filter-modal';
import './documents-table.css';

const PAGE_SIZE = 14;

function formatGrade(grade: number | null): string {
  if (grade === null) return '';
  const lastTwo = grade % 100;
  const lastOne = grade % 10;
  if (lastTwo >= 11 && lastTwo <= 13) return `${grade}th`;
  if (lastOne === 1) return `${grade}st`;
  if (lastOne === 2) return `${grade}nd`;
  if (lastOne === 3) return `${grade}rd`;
  return `${grade}th`;
}

// Page numbers to show, with null standing in for an ellipsis,
// e.g. 1 2 3 … 5
function getPageItems(current: number, totalPages: number): (number | null)[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = new Set([1, totalPages, current - 1, current, current + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);
  const items: (number | null)[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) items.push(null);
    items.push(p);
  });
  return items;
}

interface DocumentsTableProps {
  anthologyId: number;
  onRowClick?: (row: StoryDocumentRow) => void;
}

const DocumentsTable: React.FC<DocumentsTableProps> = ({
  anthologyId,
  onRowClick,
}) => {
  const [documents, setDocuments] = useState<StoryDocumentRow[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<StoryDocumentsFilters>({
    grades: [],
    checkpoints: [],
  });
  const [deleteRow, setDeleteRow] = useState<StoryDocumentRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const loadDocuments = useCallback(
    async (
      pageToLoad: number,
      filters: StoryDocumentsFilters = appliedFilters,
    ) => {
      try {
        let result = await apiClient.getStoryDocuments(
          anthologyId,
          pageToLoad,
          PAGE_SIZE,
          filters,
        );
        // The requested page can be past the end once rows drop out of the
        // filtered set, so fall back to the last page that has rows.
        const lastPage = Math.max(1, Math.ceil(result.total / PAGE_SIZE));
        if (pageToLoad > lastPage) {
          result = await apiClient.getStoryDocuments(
            anthologyId,
            lastPage,
            PAGE_SIZE,
            filters,
          );
        }
        setDocuments(result.data);
        setTotal(result.total);
        setPage(result.page);
      } catch {
        // Documents will remain as-is on fetch failure
      }
    },
    [anthologyId, appliedFilters],
  );

  useEffect(() => {
    loadDocuments(1);
  }, [loadDocuments]);

  const handleConsentToggle = async (row: StoryDocumentRow) => {
    if (row.storyDraftId === null) return;
    const consent = !row.consent;
    const setConsent = (value: boolean) =>
      setDocuments((prev) =>
        prev.map((d) =>
          d.storyId === row.storyId ? { ...d, consent: value } : d,
        ),
      );

    setConsent(consent);
    try {
      await apiClient.updateStoryDraft(row.storyDraftId, {
        studentConsent: consent,
      });
      // The row may no longer match the "Consent on file" filter, so refetch
      // to keep the rows, total and pagination in line with it.
      if (appliedFilters.checkpoints.includes('consent')) {
        await loadDocuments(page);
      }
    } catch {
      setConsent(row.consent);
    }
  };

  const handleDelete = (row: StoryDocumentRow) => {
    setDeleteRow(row);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!deleteRow) return;

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await apiClient.deleteStory(deleteRow.storyId);
      setDocuments((prev) =>
        prev.filter((document) => document.storyId !== deleteRow.storyId),
      );
      setTotal((prev) => Math.max(0, prev - 1));
      setDeleteRow(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Failed to delete document.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const activeFilterCount =
    appliedFilters.grades.length + appliedFilters.checkpoints.length;

  const applyFilters = (filters: StoryDocumentsFilters) => {
    setAppliedFilters(filters);
    setIsFilterModalOpen(false);
  };

  return (
    <>
      <div className="documents-toolbar">
        <button
          type="button"
          className="documents-filter-btn"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <svg
            className="documents-filter-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
          </svg>
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="documents-filter-count">{activeFilterCount}</span>
          )}
        </button>
      </div>

      <table className="document-tracker-table">
        <thead>
          <tr>
            <th>
              <div className="documents-consent-head">
                <button
                  type="button"
                  className="documents-add-btn"
                  aria-label="Add story draft"
                  onClick={() => setIsModalOpen(true)}
                >
                  +
                </button>
                Consent
              </div>
            </th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Grade</th>
            <th className="documents-doc-col">Document</th>
          </tr>
        </thead>
        <tbody>
          {documents.length === 0 ? (
            <tr>
              <td colSpan={5} className="documents-empty">
                No documents yet.
              </td>
            </tr>
          ) : (
            documents.map((row) => (
              <tr
                key={row.storyId}
                className="documents-row"
                onClick={() => onRowClick?.(row)}
              >
                <td>
                  <div className="documents-consent-cell">
                    <button
                      type="button"
                      className="documents-delete-btn"
                      aria-label={`Delete document for ${row.firstName} ${row.lastName}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(row);
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                      </svg>
                    </button>
                    <input
                      type="checkbox"
                      checked={row.consent}
                      disabled={row.storyDraftId === null}
                      aria-label={`Consent for ${row.firstName} ${row.lastName}`}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => handleConsentToggle(row)}
                    />
                  </div>
                </td>
                <td>{row.firstName}</td>
                <td>{row.lastName}</td>
                <td>{formatGrade(row.grade)}</td>
                <td className="documents-doc-col">
                  {row.docLink ? (
                    <a
                      href={row.docLink}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {row.docLink}
                    </a>
                  ) : (
                    <span className="documents-no-link">—</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <nav className="documents-pagination" aria-label="Pagination">
          <button
            type="button"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => loadDocuments(page - 1)}
          >
            ‹
          </button>
          {getPageItems(page, totalPages).map((item, i) =>
            item === null ? (
              <span key={`gap-${i}`}>…</span>
            ) : (
              <button
                key={item}
                type="button"
                className={item === page ? 'documents-page--active' : undefined}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => loadDocuments(item)}
              >
                {item}
              </button>
            ),
          )}
          <button
            type="button"
            aria-label="Next page"
            disabled={page >= totalPages}
            onClick={() => loadDocuments(page + 1)}
          >
            ›
          </button>
        </nav>
      )}

      {isModalOpen && (
        <NewStoryDraftModal
          anthologyId={anthologyId}
          onClose={() => setIsModalOpen(false)}
          onSaved={() => loadDocuments(page)}
        />
      )}

      {isFilterModalOpen && (
        <DocumentsFilterModal
          initialFilters={appliedFilters}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={applyFilters}
        />
      )}

      {deleteRow && (
        <div className="documents-modal-overlay">
          <div
            className="documents-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="documents-delete-title"
          >
            <div className="documents-delete-modal-header">
              <h2 id="documents-delete-title">Confirm deletion</h2>
              <button
                type="button"
                className="documents-delete-modal-close"
                aria-label="Close confirmation modal"
                onClick={() => setDeleteRow(null)}
                disabled={isDeleting}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"
                    fill="#1C1B1F"
                  />
                </svg>
              </button>
            </div>
            <p className="documents-delete-modal-message">
              Are you sure you want to delete this document? This action cannot
              be undone.
            </p>
            <div className="documents-delete-student">
              <h3>
                {deleteRow.lastName}, {deleteRow.firstName}
              </h3>
              <p className="documents-delete-description">
                {deleteRow.description || 'No description available.'}
              </p>
              <dl>
                <div>
                  <dt>Grade</dt>
                  <dd>{formatGrade(deleteRow.grade) || '—'}</dd>
                </div>
                <div>
                  <dt>Name in Book</dt>
                  <dd>{deleteRow.nameInBook || '—'}</dd>
                </div>
                <div>
                  <dt>Consent on file</dt>
                  <dd>{deleteRow.consent ? 'Yes' : 'No'}</dd>
                </div>
                <div>
                  <dt>Document</dt>
                  <dd>
                    {deleteRow.docLink ? (
                      <a
                        href={deleteRow.docLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {deleteRow.docLink}
                      </a>
                    ) : (
                      '—'
                    )}
                  </dd>
                </div>
              </dl>
            </div>
            {deleteError && (
              <p className="documents-delete-error" role="alert">
                {deleteError}
              </p>
            )}
            <div className="documents-delete-modal-footer">
              <button
                type="button"
                className="documents-delete-cancel"
                onClick={() => setDeleteRow(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="documents-delete-confirm"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentsTable;
