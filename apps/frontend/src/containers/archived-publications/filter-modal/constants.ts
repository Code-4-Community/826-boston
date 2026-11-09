import {
  SortOption,
  AnthologyPubLevel,
  AnthologyProgram,
} from '../../../types';

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

export const PUB_LEVEL_OPTIONS: {
  value: AnthologyPubLevel;
  displayLabel: string;
}[] = [
  { value: AnthologyPubLevel.ZINE, displayLabel: 'Zines' },
  { value: AnthologyPubLevel.CHAPBOOK, displayLabel: 'Chapbooks' },
  { value: AnthologyPubLevel.PERFECT_BOUND, displayLabel: 'Perfect Bound' },
  { value: AnthologyPubLevel.SIGNATURE, displayLabel: 'Signature Publication' },
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
