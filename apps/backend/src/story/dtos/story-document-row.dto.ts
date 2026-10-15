export interface StoryDocumentRow {
  storyId: number;
  storyDraftId: number | null;
  authorId: number;
  consent: boolean;
  firstName: string;
  lastName: string;
  grade: number | null;
  docLink: string | null;
}

export interface PaginatedStoryDocuments {
  data: StoryDocumentRow[];
  total: number;
  page: number;
}
