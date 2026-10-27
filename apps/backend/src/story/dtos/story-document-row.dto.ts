export interface StoryDocumentRow {
  storyId: number;
  storyDraftId: number | null;
  authorId: number;
  consent: boolean;
  firstName: string;
  lastName: string;
  grade: number | null;
  nameInBook: string | null;
  description: string | null;
  docLink: string | null;
}

export interface PaginatedStoryDocuments {
  data: StoryDocumentRow[];
  total: number;
  page: number;
}

export type DocumentCheckpoint =
  | 'draft1'
  | 'draft2'
  | 'draft3'
  | 'consent'
  | 'authorApproval'
  | 'copyedit'
  | 'proofread';

export interface StoryDocumentsFilters {
  grades?: number[];
  // Only stories whose draft has this inManuscript value
  inManuscript?: boolean;
  checkpoints?: DocumentCheckpoint[];
}
