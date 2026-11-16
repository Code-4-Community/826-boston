import React from 'react';
import { type StoryDocumentRow } from '../../api/apiClient';
import DocumentsTable from './documents-table';
import AddDocumentModal from './add-document-modal';

interface ApprovedDocumentsViewProps {
  anthologyId: number;
  onRowClick?: (row: StoryDocumentRow, reload: () => void) => void;
  // Adding a draft to the manuscript (Owner, Manager, Approver)
  canManageManuscript?: boolean;
  // Deleting a story and toggling consent (Owner, Manager, Helper)
  canEditDrafts?: boolean;
}

// Approved documents are story drafts with inManuscript = true
const ApprovedDocumentsView: React.FC<ApprovedDocumentsViewProps> = ({
  anthologyId,
  onRowClick,
  canManageManuscript = false,
  canEditDrafts = false,
}) => (
  <DocumentsTable
    anthologyId={anthologyId}
    inManuscript
    showFilters={false}
    onRowClick={onRowClick}
    canAdd={canManageManuscript}
    canEdit={canEditDrafts}
    renderAddModal={(onClose, onSaved) => (
      <AddDocumentModal
        anthologyId={anthologyId}
        onClose={onClose}
        onSaved={onSaved}
      />
    )}
  />
);

export default ApprovedDocumentsView;
