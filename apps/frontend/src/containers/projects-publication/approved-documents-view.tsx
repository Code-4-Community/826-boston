import React from 'react';
import DocumentsTable from './documents-table';
import AddDocumentModal from './add-document-modal';

interface ApprovedDocumentsViewProps {
  anthologyId: number;
}

// Approved documents are story drafts with inManuscript = true
const ApprovedDocumentsView: React.FC<ApprovedDocumentsViewProps> = ({
  anthologyId,
}) => (
  <DocumentsTable
    anthologyId={anthologyId}
    inManuscript
    showFilters={false}
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
