//import { PUB_LEVEL_OPTIONS } from '@containers/archived-publications/filter-modal/constants';

export enum AnthologyStatus {
  NOT_STARTED = 'Not Started',
  DRAFTING = 'Drafting',
  AWAITING_REVIEW = 'Awaiting Review',
  CAN_BE_SHARED = 'Can Be Shared',
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
  /** Keyed by checkpoint id - see STORY_DRAFT_CHECKPOINTS. */
  checkpoints?: Record<string, boolean>;
  /**
   * Attached by GET /stories/anthology/:id/story-drafts, which returns each
   * draft alongside a trimmed version of its parent story.
   */
  story?: Pick<Story, 'id' | 'title'> & { author?: Author };
}

export interface Story {
  id: number;
  title: string;
  description?: string;
  studentBio?: string;
  genre?: string;
  theme?: string;
  anthologyId: number;
  anthology?: Anthology;
  authorId: number;
  author?: Author;
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
  TITLE_DESC = 'title-desc',
  AUTHOR_ASC = 'author-asc',
  AUTHOR_DESC = 'author-desc',
  DATE_NEWEST = 'date-newest',
  DATE_OLDEST = 'date-oldest',
}

export interface FilterState {
  /** null means no sort is chosen. */
  sortBy: SortOption | null;
  /** yyyy-mm-dd, or '' when no bound is set. */
  pubDateStart: string;
  pubDateEnd: string;
  programs: string[];
  /** Inventory location ids. */
  locationIds: number[];
  themes: string[];
  genres: string[];
}

export const DEFAULT_FILTER_STATE: FilterState = {
  sortBy: null,
  pubDateStart: '',
  pubDateEnd: '',
  programs: [],
  locationIds: [],
  themes: [],
  genres: [],
};

/** Values match the backend's AnthologySortOption, so they're sent as-is. */
export enum TrackerSortOption {
  TITLE_ASC = 'title-asc',
  TITLE_DESC = 'title-desc',
  BYLINE_ASC = 'byline-asc',
  BYLINE_DESC = 'byline-desc',
  DATE_RECENT = 'date-recent',
  DATE_OLDEST = 'date-oldest',
}

export interface TrackerFilterState {
  sortBy: TrackerSortOption;
  programs: string[];
  staffIds: number[];
}

export const DEFAULT_TRACKER_FILTER_STATE: TrackerFilterState = {
  sortBy: TrackerSortOption.TITLE_ASC,
  programs: [],
  staffIds: [],
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
  anthology?: Anthology;
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
  shopifyUrl?: string;
  subtitle?: string;
  byline?: string;
  /** camelCase fields as returned by the backend anthology endpoints. */
  pubLevel?: AnthologyPubLevel;
  publishedDate?: string;
  sponsors?: string[];
  triggers?: string[];
  ageCategories?: string[];
  stories?: Story[];
}

export enum AreaOfWork {
  PLANNING = 'PLANNING',
  PROGRAMMING = 'PROGRAMMING',
  CHECKPOINT = 'CHECKPOINT',
  PRODUCTION = 'PRODUCTION',
}

export enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETE = 'COMPLETE',
}

/** A task, from GET /anthologies/:anthologyId/tasks. */
export interface Task {
  id: number;
  name: string;
  areaOfWork?: AreaOfWork | null;
  status: TaskStatus;
  /** Postgres date columns, returned as YYYY-MM-DD strings. */
  timeFrame: string;
  dueBy: string;
  personInCharge: { id: number; firstName: string; lastName: string } | null;
  attachments: { id: number; fileName: string; fileUrl: string }[];
}

/** Production metadata for an anthology, from GET /production-info/:anthologyId. */
export interface ProductionInfo {
  id: number;
  design_files_link?: string | null;
  cover_image_file_link?: string | null;
  binding_type?: string | null;
  dimensions?: string | null;
  printing_cost?: number | null;
  print_run?: number | null;
  weight_in_grams?: number | null;
  page_count?: number | null;
  printed_by?: string | null;
  foreword_author?: string | null;
  number_of_students?: number | null;
}

/** A place that holds copies of publications (e.g. a warehouse or office). */
export interface Inventory {
  id: number;
  name: string;
}

export interface AnthologyInventoryLocation {
  inventoryId: number;
  name: string;
  /** 0 when the location holds no copies of this anthology. */
  numCopies: number;
}

export interface AnthologyInventory {
  anthology: Anthology;
  locations: AnthologyInventoryLocation[];
  totalCopies: number;
}

export interface CreateAnthologyDto {
  title: string;
  pub_level: AnthologyPubLevel;
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
