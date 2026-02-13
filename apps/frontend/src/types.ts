export enum AnthologyStatus {
  ARCHIVED = 'Archived',
  NOT_STARTED = 'NotStarted',
  DRAFTING = 'Drafting',
  CAN_BE_SHARED = 'CanBeShared',
}

export enum AnthologyPubLevel {
  ZINE = 'Zine',
  CHAPBOOK = 'Chapbook',
  PERFECT_BOUND = 'PerfectBound',
  SIGNATURE = 'Signature',
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
  genre?: string;
  theme?: string;
  isbn?: string;
  shopify_url?: string;

  // Missing from backend
  subtitle?: string;
  byline?: string;
  praise_quotes?: string;
  foreword_author?: string;
  age_category?: string;
  dimensions?: string;
  binding_type?: string;
  page_count?: number;
  print_run?: number;
  printed_by?: string;
  number_of_students?: number;
  printing_cost?: string;
  weight?: string;
  // Inventory breakdown locations
  inventory_locations?: Record<string, number>;
}

export interface Story {
  id: number;
  title: string;
  author: string;
  anthology_id: number;
}
