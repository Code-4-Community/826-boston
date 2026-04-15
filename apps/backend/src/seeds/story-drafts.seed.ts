import { EditRound, SubmissionRound } from '../story-draft/types';

export interface StoryDraftSeedItem {
  storyTitle: string;
  anthologyTitle: string;
  authorId: number;
  docLink: string;
  submissionRound: SubmissionRound;
  studentConsent: boolean;
  inManuscript: boolean;
  editRound: EditRound;
  proofread: boolean;
  notes: string[];
}

export const StoryDraftsSeed: StoryDraftSeedItem[] = [
  {
    storyTitle: 'Standing at the Threshold',
    authorId: 1,
    anthologyTitle: 'Voices From the Threshold',
    docLink: 'https://docs.google.com/document/d/1aStandingAtTheThreshold',
    submissionRound: SubmissionRound.ONE,
    studentConsent: true,
    inManuscript: true,
    editRound: EditRound.TWO,
    proofread: true,
    notes: [],
  },
  {
    storyTitle: 'Saturday Mornings',
    anthologyTitle: 'The Color of Saturday',
    authorId: 2,
    docLink: 'https://docs.google.com/document/d/2aSaturdayMornings',
    submissionRound: SubmissionRound.TWO,
    studentConsent: true,
    inManuscript: true,
    editRound: EditRound.ONE,
    proofread: false,
    notes: ['Needs formatting review', 'Check dialogue punctuation'],
  },
  {
    storyTitle: 'The River Remembers',
    anthologyTitle: '',
    authorId: 3,
    docLink: 'https://docs.google.com/document/d/3aTheRiverRemembers',
    submissionRound: SubmissionRound.ONE,
    studentConsent: true,
    inManuscript: true,
    editRound: EditRound.TWO,
    proofread: true,
    notes: [],
  },
  {
    storyTitle: 'Borrowed Words',
    anthologyTitle: 'What the River Carries',
    authorId: 4,
    docLink: 'https://docs.google.com/document/d/4aBorrowedWords',
    submissionRound: SubmissionRound.THREE,
    studentConsent: false,
    inManuscript: false,
    editRound: EditRound.ONE,
    proofread: false,
    notes: ['Awaiting parental consent form'],
  },
  {
    storyTitle: '3:17 AM',
    anthologyTitle: 'What the River Carries',
    authorId: 5,
    docLink: 'https://docs.google.com/document/d/5a317AM',
    submissionRound: SubmissionRound.TWO,
    studentConsent: true,
    inManuscript: true,
    editRound: EditRound.TWO,
    proofread: true,
    notes: ['Final version approved by author'],
  },
];
