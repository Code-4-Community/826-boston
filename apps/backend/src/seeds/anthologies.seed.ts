import { Anthology } from '../anthology/anthology.entity';
import {
  AgeCategory,
  AnthologyPubLevel,
  AnthologyStatus,
} from '../anthology/types';
import { DeepPartial } from 'typeorm';

export const AnthologiesSeed: DeepPartial<Anthology>[] = [
  {
    id: 1,
    title: 'Walk A Mile in Our Shoes',
    byline:
      'Personal Narrative by 9th Grade Students at Boston International Newcomers Academy',
    genres: ['Personal Narratives', 'Prose', 'Nonfiction'],
    themes: [
      'Culture',
      'Identity',
      'Immigration',
      'Tradition',
      'Family',
      'The Future',
      'Goals',
    ],
    description:
      '“Writing this book was fun and helpful for us, as we are happy to read about other students at BINcA. Getting to know their experiences and walk a mile in their shoes makes us feel important, like we are part of something great.',
    triggers: ['Profanity', 'Physical or Verbal Abuse'],
    publishedDate: new Date('2025-12-17'),

    programs: ['BINcA'],

    status: AnthologyStatus.ARCHIVED,
    // partners ?
    ageCategory: AgeCategory.YA,

    pubLevel: AnthologyPubLevel.CHAPBOOK,

    photoUrl:
      'https://c4c-826boston-dev.s3.us-east-1.amazonaws.com/images/walk_a_mile_in_our_shoes_pub_cover.jpg',

    isbn: '979-8-88694-119-7',
  },

  {
    id: 2,
    title: 'Utopia vs. Dystopia',
    byline:
      'Personal Narrative by 9th Grade Students at Boston International Newcomers Academy',
    genres: ['Fiction', 'Flash Fiction'],
    themes: ['Dystopia/Utopia'],
    description:
      "Through our stories, we want to explore what it feels to be human and how society sometimes forgets what humanity actually is. Utopia vs. Dystopia: The Future We're Heading Toward is a collection of dystopian flash fiction stories written by 10th-grade students in Ms. Shin's English class at the John D. O'Bryant School of Mathematics and Science.",
    publishedDate: new Date('2025-06-30'),

    programs: ['OB'],

    status: AnthologyStatus.DRAFT,
    // partners ?
    ageCategory: AgeCategory.YA,

    pubLevel: AnthologyPubLevel.CHAPBOOK,

    isbn: '979-8-88694-093-0',
  },

  {
    id: 3,
    title: "I'll Light Up My Own Sky",
    byline: 'Written by Boston Graduates, 2021-2025',
    genres: [
      'College Essay',
      'Personal Narratives',
      'Essays',
      'Multilingual',
      'Identity',
    ],
    themes: ['Identity', 'College Essay'],
    description:
      'A seemingly ordinary conversation, a personal failure, or a fleeting moment of doubt—when examined through the lens of reflection—can become the foundation of powerful storytelling. ' +
      'I’ll Light Up My Own Sky is a collection of college essays written by graduates from 2021-2025. ' +
      'While their stories explore common themes, each essay remains infused with the distinct voice of its author. ' +
      'In this collection, readers will come across nuanced perspectives on home, obstacles large and small, the value of building relationships with mentors, and young people reckoning with the age-old question: Who am I now, and who might I become? ' +
      'As they navigate the next chapter of their lives, students remind readers to remain open-minded in the face of newness, resilient in the face of struggle, self-empowered in the face of negativity, and hopeful even when it seems impossible.',
    publishedDate: new Date('2025-06-30'),

    programs: ['Holland (Burke)', 'In-School'],
    sponsors: [
      'Northeastern University Office of City and Community Engagement',
      'Suffolk University',
    ],

    status: AnthologyStatus.IN_PRODUCTION,

    pubLevel: AnthologyPubLevel.PERFECT_BOUND,

    isbn: '979-8-88694-087-9',
  },

  {
    id: 4,
    title: 'Archived Anthology',
    byline: 'Written by Boston Graduates, 2021-2025',
    genres: ['College Essay'],
    themes: ['Identity', 'College Essay'],
    description: 'This is an archived anthology',
    publishedDate: new Date('2025-06-30'),

    programs: ['Holland (Burke)', 'In-School'],
    sponsors: [
      'Northeastern University Office of City and Community Engagement',
      'Suffolk University',
    ],

    status: AnthologyStatus.IN_REVISION,

    pubLevel: AnthologyPubLevel.PERFECT_BOUND,

    isbn: '979-8-88694-087-9',
  },
  {
    id: 5,
    title: 'New and Beautiful Places',
    byline:
      '10th-grade students from the Boston International Newcomers Academy',
    genres: ['Nonfiction', 'Personal Narratives', 'Multicultural'],
    themes: [],
    description: '',
    publishedDate: new Date('2025-06-30'),
    programs: ['BINcA'],
    sponsors: [],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.CHAPBOOK,
    isbn: '',
  },
];
