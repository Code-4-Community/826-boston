import React, { useState, useEffect, useCallback } from 'react';
import apiClient, { type StoryDocumentRow } from '../../api/apiClient';
import NewStoryDraftModal from './new-story-draft-modal';
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

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const loadDocuments = useCallback(
    async (pageToLoad: number) => {
      try {
        const result = await apiClient.getStoryDocuments(
          anthologyId,
          pageToLoad,
          PAGE_SIZE,
        );
        setDocuments(result.data);
        setTotal(result.total);
        setPage(result.page);
      } catch {
        // Documents will remain as-is on fetch failure
      }
    },
    [anthologyId],
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
    } catch {
      setConsent(row.consent);
    }
  };

  const handleDelete = (row: StoryDocumentRow) => {
    // TODO: open the delete confirmation modal once it is built
    console.log('delete requested for story', row.storyId);
  };

  return (
    <>
      <div className="documents-toolbar">
        {/* TODO: open the filter modal once it is built */}
        <button type="button" className="documents-filter-btn">
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
    </>
  );
};

export default DocumentsTable;
