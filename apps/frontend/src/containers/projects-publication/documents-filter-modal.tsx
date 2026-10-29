import { useEffect, useRef, useState } from 'react';
import {
  type DocumentCheckpoint,
  type StoryDocumentsFilters,
} from '../../api/apiClient';

interface DocumentsFilterModalProps {
  initialFilters: StoryDocumentsFilters;
  onApply: (filters: StoryDocumentsFilters) => void;
  onClose: () => void;
}

const GRADE_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);

const CHECKPOINTS: { value: DocumentCheckpoint; label: string }[] = [
  { value: 'draft1', label: 'Draft 1' },
  { value: 'draft2', label: 'Draft 2' },
  { value: 'draft3', label: 'Draft 3' },
  { value: 'consent', label: 'Consent on file' },
  { value: 'authorApproval', label: 'Author Approval' },
  { value: 'copyedit', label: 'Copyedit' },
  { value: 'proofread', label: 'Proofread' },
];

const CHECKPOINT_COLUMNS = [CHECKPOINTS.slice(0, 4), CHECKPOINTS.slice(4)];

function formatGrade(grade: number): string {
  if (grade % 100 >= 11 && grade % 100 <= 13) return `${grade}th`;
  if (grade % 10 === 1) return `${grade}st`;
  if (grade % 10 === 2) return `${grade}nd`;
  if (grade % 10 === 3) return `${grade}rd`;
  return `${grade}th`;
}

export default function DocumentsFilterModal({
  initialFilters,
  onApply,
  onClose,
}: DocumentsFilterModalProps) {
  const [draft, setDraft] = useState<StoryDocumentsFilters>({
    grades: [...initialFilters.grades],
    checkpoints: [...initialFilters.checkpoints],
  });
  const [isGradeMenuOpen, setIsGradeMenuOpen] = useState(false);
  const gradeSelectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDocumentMouseDown = (event: MouseEvent) => {
      if (
        gradeSelectRef.current &&
        event.target instanceof Node &&
        !gradeSelectRef.current.contains(event.target)
      ) {
        setIsGradeMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentMouseDown);
    return () =>
      document.removeEventListener('mousedown', handleDocumentMouseDown);
  }, []);

  const toggleGrade = (grade: number) => {
    setDraft((current) => ({
      ...current,
      grades: current.grades.includes(grade)
        ? current.grades.filter((value) => value !== grade)
        : [...current.grades, grade].sort((a, b) => a - b),
    }));
  };

  const toggleCheckpoint = (checkpoint: DocumentCheckpoint) => {
    setDraft((current) => ({
      ...current,
      checkpoints: current.checkpoints.includes(checkpoint)
        ? current.checkpoints.filter((value) => value !== checkpoint)
        : [...current.checkpoints, checkpoint],
    }));
  };

  return (
    <div
      className="documents-filter-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="documents-filter-title"
      onClick={onClose}
    >
      <div
        className="documents-filter-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="documents-filter-header">
          <h2 id="documents-filter-title">Sort and Filter Results</h2>
          <button
            type="button"
            className="documents-filter-close"
            aria-label="Close filter modal"
            onClick={onClose}
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

        <div className="documents-filter-body">
          <div className="documents-grade-filter">
            <label htmlFor="documents-grade-select">Grade</label>
            <div
              ref={gradeSelectRef}
              className="documents-grade-select-wrapper"
            >
              <button
                id="documents-grade-select"
                type="button"
                className="documents-grade-select"
                aria-haspopup="listbox"
                aria-expanded={isGradeMenuOpen}
                onClick={() => setIsGradeMenuOpen((open) => !open)}
              >
                <span className="documents-grade-select-value">
                  {draft.grades.length === 0
                    ? 'Select a grade...'
                    : draft.grades.map((grade) => (
                        <span key={grade} className="documents-grade-chip">
                          <span>{formatGrade(grade)}</span>
                          <span
                            role="button"
                            tabIndex={0}
                            className="documents-grade-chip-remove"
                            aria-label={`Remove ${formatGrade(
                              grade,
                            )} grade filter`}
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleGrade(grade);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                event.stopPropagation();
                                toggleGrade(grade);
                              }
                            }}
                          >
                            <svg
                              width="9"
                              height="9"
                              viewBox="0 0 9 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                d="M7.70703 0.707031L0.707031 7.70703"
                                strokeLinecap="square"
                                strokeLinejoin="round"
                                stroke="#858585"
                              />
                              <path
                                d="M0.707031 0.707031L7.70703 7.70703"
                                strokeLinecap="square"
                                strokeLinejoin="round"
                                stroke="#858585"
                              />
                            </svg>
                          </span>
                        </span>
                      ))}
                </span>
                <svg
                  width="15"
                  height="9"
                  viewBox="0 0 15 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M1.41406 1.41406L7.41406 7.41406L13.4141 1.41406"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                    stroke="#938B88"
                  />
                </svg>
              </button>
              {isGradeMenuOpen && (
                <div
                  className="documents-grade-options"
                  role="listbox"
                  aria-label="Grades"
                  aria-multiselectable="true"
                >
                  {GRADE_OPTIONS.map((grade) => (
                    <label key={grade} className="documents-grade-option">
                      <input
                        type="checkbox"
                        checked={draft.grades.includes(grade)}
                        onChange={() => toggleGrade(grade)}
                      />
                      {formatGrade(grade)}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="documents-checkpoint-grid">
            {CHECKPOINT_COLUMNS.map((column, columnIndex) => (
              <div key={columnIndex} className="documents-checkpoint-column">
                {column.map((checkpoint) => (
                  <label
                    key={checkpoint.value}
                    className="documents-checkpoint-option"
                  >
                    <span>{checkpoint.label}</span>
                    <input
                      type="checkbox"
                      checked={draft.checkpoints.includes(checkpoint.value)}
                      onChange={() => toggleCheckpoint(checkpoint.value)}
                    />
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="documents-filter-footer">
          <button
            type="button"
            className="documents-filter-reset"
            onClick={() => setDraft({ grades: [], checkpoints: [] })}
          >
            Reset filters
          </button>
          <button
            type="button"
            className="documents-filter-apply"
            onClick={() => onApply(draft)}
          >
            Save and Apply
          </button>
        </div>
      </div>
    </div>
  );
}
