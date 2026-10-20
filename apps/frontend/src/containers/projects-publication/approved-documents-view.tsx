import React from 'react';
import { type StoryDocumentRow } from '../../api/apiClient';
import DocumentsTable from './documents-table';
import AddDocumentModal from './add-document-modal';

interface ApprovedDocumentsViewProps {
  anthologyId: number;
  onRowClick?: (row: StoryDocumentRow, reload: () => void) => void;
}

// Approved documents are story drafts with inManuscript = true
const ApprovedDocumentsView: React.FC<ApprovedDocumentsViewProps> = ({
  anthologyId,
  onRowClick,
}) => (
  <DocumentsTable
    anthologyId={anthologyId}
    inManuscript
    showFilters={false}
    onRowClick={onRowClick}
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
