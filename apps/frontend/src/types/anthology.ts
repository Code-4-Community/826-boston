import { Author } from './author';
import { Genre } from './genre';
import { InventoryLocation } from './inventory-location';
import { Theme } from './theme';
import { Story } from './story';

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

export class Anthology {
  constructor(
    public id: number,
    public title: string,
    public published_year: number,
    public status: AnthologyStatus,
    public stories?: Story[],
    public subtitle?: string,
    public byline?: string,
    public description?: string,
    public updated_at?: string,
    public photo_url?: string,

    // Additional fields from metadata
    public foreword_author?: string,
    public praise_quotes?: string,
    public age_category?: string,
    public isbn?: string,
    public shopify_url?: string,
    public binding_type?: string,
    public dimensions?: string,
    public printing_cost?: string,
    public print_run?: number,
    public weight?: string,
    public page_count?: number,
    public printed_by?: string,
    public pub_level?: AnthologyPubLevel,
    public publishing_permission?: string,
    public programs?: string[],
    public sponsors?: string[],
    public number_of_students?: number,
    public total_inventory?: number,
    public inventory_locations?: InventoryLocation[],

    // cached aggregated data from stories
    private _authors?: Author[],
    private _genres?: Genre[],
    private _themes?: Theme[],
  ) {}

  getAuthors(): Author[] {
    if (this._authors !== undefined) {
      return this._authors;
    }

    const authors = this.stories?.flatMap((story) => story.authors) ?? [];
    this._authors = authors;
    return authors;
  }

  getGenres(): Genre[] {
    if (this._genres !== undefined) {
      return this._genres;
    }

    const genres = this.stories?.flatMap((story) => story.genres ?? []) ?? [];
    this._genres = genres;
    return genres;
  }

  getThemes(): Theme[] {
    if (this._themes !== undefined) {
      return this._themes;
    }

    const themes = this.stories?.flatMap((story) => story.themes ?? []) ?? [];
    this._themes = themes;
    return themes;
  }
}
