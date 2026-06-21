//import { PUB_LEVEL_OPTIONS } from '@containers/archived-publications/filter-modal/constants';

export enum AnthologyStatus {
  DRAFT = 'Draft',
  IN_REVISION = 'In Revision',
  IN_PRODUCTION = 'In Production',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
}

export enum AnthologyPubLevel {
  ZINE = 'Zine',
  CHAPBOOK = 'Chapbook',
  PERFECT_BOUND = 'PerfectBound',
  SIGNATURE = 'Signature',
}

export interface Author {
  id: number;
  name: string;
  nameInBook?: string;
  classPeriod?: string;
  bio?: string;
  grade?: number;
}

export enum SubmissionRound {
  ONE = 0,
  TWO = 1,
  THREE = 2,
}

export enum EditRound {
  ONE = 0,
  TWO = 1,
}

export interface StoryDraft {
  id: number;
  authorId: number;
  docLink: string;
  submissionRound: SubmissionRound;
  studentConsent: boolean;
  inManuscript: boolean;
  editRound: EditRound;
  proofread: boolean;
  notes: string[];
}

export interface StoryWithStoryDraft extends Story {
  storyDraft: StoryDraft;
  author: Author;
}

export interface Story {
  id: number;
  title: string;
  description?: string;
  anthology_id: number;
  author_id: number;
  story_draft_id?: number;
}

export enum AnthologyProgram {
  TUTORING = 'Tutoring',
  WRITERS_ROOM = "Writer's Room",
  STEM_LITERACY = 'STEM Literacy',
  SCHOOL_PARTNERSHIP = 'School Partnership',
  YOUNG_AUTHORS = 'Young Authors',
}

export enum AnthologyGenre {
  MYSTERY = 'Mystery',
  FANTASY = 'Fantasy',
  HISTORICAL_FICTION = 'Historical Fiction',
  ROMANCE = 'Romance',
  COMEDY = 'Comedy',
  POETRY = 'Poetry',
}

export enum SortOption {
  TITLE_ASC = 'title-asc',
  AUTHOR_ASC = 'author-asc',
  DATE_NEWEST = 'date-newest',
  DATE_OLDEST = 'date-oldest',
}

export interface FilterState {
  sortBy: SortOption;
  pubDateStart: string;
  pubDateEnd: string;
  pubLevels: AnthologyPubLevel[];
  programs: AnthologyProgram[];
  genres: AnthologyGenre[];
  inventoryMin: string;
  inventoryMax: string;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  sortBy: SortOption.TITLE_ASC,
  pubDateStart: '',
  pubDateEnd: '',
  pubLevels: [],
  programs: [],
  genres: [],
  inventoryMin: '',
  inventoryMax: '',
};

export enum OmchaiRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  CONSULTED = 'CONSULTED',
  HELPER = 'HELPER',
  APPROVER = 'APPROVER',
  INFORMED = 'INFORMED',
}

export interface OmchaiUser {
  id: number;
  firstName: string;
  lastName: string;
  title?: string;
}

export interface OmchaiEntry {
  id: number;
  anthologyId: number;
  userId: number;
  role: OmchaiRole;
  datetimeAssigned: string;
  user: OmchaiUser;
}

export interface Anthology {
  id: number;
  title: string;
  description: string;
  published_year: number;
  programs?: string[] | string;
  inventory?: number;
  status: AnthologyStatus;
  pub_level: AnthologyPubLevel;
  photo_url?: string;
  photoUrl?: string;
  genres?: string[];
  themes?: string[];
  isbn?: string;
  shopify_url?: string;
  subtitle?: string;
  byline?: string;
}

export interface CreateAnthologyDto {
  title: string;
  pub_level: AnthologyPubLevel;
  status: AnthologyStatus;
  themes: string[];
  genres: string[];
  publicationDate: string;
  description: string;
  programs: string[];
  photoUrl?: string;
  isbn: string;
  shopifyUrl?: string;
  inventory?: number;
}

export interface CreateBatchOmchaiAssignmentsDto {
  anthology_id: number;
  datetime_assigned: string;
  owners: number[];
  managers: number[];
  consulted: number[];
  helpers: number[];
  approvers: number[];
  informers: number[];
}
