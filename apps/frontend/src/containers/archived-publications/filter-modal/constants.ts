import {
  SortOption,
  TrackerSortOption,
  AnthologyProgram,
} from '../../../types';

export const TRACKER_SORT_OPTIONS: {
  value: TrackerSortOption;
  displayLabel: string;
}[] = [
  { value: TrackerSortOption.TITLE_ASC, displayLabel: 'By Title (A-Z)' },
  { value: TrackerSortOption.TITLE_DESC, displayLabel: 'By Title (Z-A)' },
  { value: TrackerSortOption.BYLINE_ASC, displayLabel: 'By Author (A-Z)' },
  { value: TrackerSortOption.BYLINE_DESC, displayLabel: 'By Author (Z-A)' },
  {
    value: TrackerSortOption.DATE_RECENT,
    displayLabel: 'By Publication Date (Most Recent First)',
  },
  {
    value: TrackerSortOption.DATE_OLDEST,
    displayLabel: 'By Publication Date (Oldest First)',
  },
];

export const SORT_OPTIONS: { value: SortOption; displayLabel: string }[] = [
  { value: SortOption.TITLE_ASC, displayLabel: 'By Title (A-Z)' },
  { value: SortOption.TITLE_DESC, displayLabel: 'By Title (Z-A)' },
  { value: SortOption.AUTHOR_ASC, displayLabel: 'By Author (A-Z)' },
  { value: SortOption.AUTHOR_DESC, displayLabel: 'By Author (Z-A)' },
  {
    value: SortOption.DATE_NEWEST,
    displayLabel: 'By Publication Date (Most Recent First)',
  },
  {
    value: SortOption.DATE_OLDEST,
    displayLabel: 'By Publication Date (Oldest First)',
  },
];

export const PROGRAM_OPTIONS: {
  value: AnthologyProgram;
  displayLabel: string;
}[] = [
  { value: AnthologyProgram.TUTORING, displayLabel: 'Tutoring' },
  { value: AnthologyProgram.WRITERS_ROOM, displayLabel: "Writer's Room" },
  { value: AnthologyProgram.STEM_LITERACY, displayLabel: 'STEM Literacy' },
  {
    value: AnthologyProgram.SCHOOL_PARTNERSHIP,
    displayLabel: 'School Partnership',
  },
  { value: AnthologyProgram.YOUNG_AUTHORS, displayLabel: 'Young Authors' },
];
