import {
  Anthology,
  AnthologyPubLevel,
  AnthologyStatus,
} from '../types/anthology';
import { Genre } from 'types/genre';

// both structures below are local to this file
enum GenreType {
  ADVICE,
  SCIENCE_FICTION,
  FANTASY,
  RECIPES,
  HUMOR,
  POETRY,
  SHORT_STORIES,
  FICTION,
  NON_FICTION,
  ESSAYS,
  CIVIC_ENGAGEMENT,
  POLITICS,
  SPEECHES,
}

const STATIC_GENRES: Record<GenreType, Genre> = {
  [GenreType.ADVICE]: { id: 2, name: 'Advice' },
  [GenreType.SCIENCE_FICTION]: { id: 3, name: 'Science Fiction' },
  [GenreType.FANTASY]: { id: 4, name: 'Fantasy' },
  [GenreType.RECIPES]: { id: 5, name: 'Recipes' },
  [GenreType.HUMOR]: { id: 6, name: 'Humor' },
  [GenreType.POETRY]: { id: 7, name: 'Poetry' },
  [GenreType.SHORT_STORIES]: { id: 8, name: 'Short Stories' },
  [GenreType.FICTION]: { id: 9, name: 'Fiction' },
  [GenreType.NON_FICTION]: { id: 10, name: 'Non-Fiction' },
  [GenreType.ESSAYS]: { id: 11, name: 'Essays' },
  [GenreType.CIVIC_ENGAGEMENT]: { id: 12, name: 'Fiction' },
  [GenreType.POLITICS]: { id: 13, name: 'Non-Fiction' },
  [GenreType.SPEECHES]: { id: 14, name: 'Essays' },
};

export const STATIC_ARCHIVED: Anthology[] = [
  new Anthology(
    /*id:*/ 1,
    /*title:*/ 'What if the World Needs You?',
    /*published_year:*/ 2024,
    /*status:*/ AnthologyStatus.ARCHIVED,
    /*stories:*/ [
      {
        id: 1,
        title: 'Lorem Ipsum',
        anthology_id: 1,
        authors: [
          {
            id: 1,
            name: '826 Boston Students',
          },
        ],
        genres: [
          STATIC_GENRES[GenreType.ADVICE],
          STATIC_GENRES[GenreType.SCIENCE_FICTION],
          STATIC_GENRES[GenreType.FANTASY],
          STATIC_GENRES[GenreType.RECIPES],
          STATIC_GENRES[GenreType.HUMOR],
          STATIC_GENRES[GenreType.POETRY],
          STATIC_GENRES[GenreType.SHORT_STORIES],
          STATIC_GENRES[GenreType.FICTION],
          STATIC_GENRES[GenreType.NON_FICTION],
          STATIC_GENRES[GenreType.ESSAYS],
        ],
        themes: [
          { id: 1, name: 'Creative Writing' },
          { id: 2, name: 'Short Stories' },
        ],
      },
    ],
    /*subtitle:*/ 'Advice and Life Lessons',
    /*byline:*/ 'from 826 Boston Students',
    /*description:*/
    "Discover a world where wisdom and whimsy collide in this captivating anthology from 826 Boston. Each story offers a unique piece of advice, from reimagined Greek myths to thought-provoking advice columns. Get ready to be challenged, moved, and inspired by these young voices' raw creativity and fearless storytelling!",
    /*updated_at:*/ 'Jan 1, 1960',
    /*authors: [],*/
    /*photo_url:*/ '/src/assets/images/covers/Whatiftheworld_2024.jpg',
    /*foreword_author:*/ 'Meredith Goldstein',
    /*praise_quotes:*/
    "\"I will cherish this collection by 826 Boston students who have crafted a range of work, from poetry to narratives to essays. Every piece is wisdom. Every short story, diary, comedy, and drama is embedded with advice, even if it's not obvious. Now, when I think, 'What should I do next?' I have a new place to turn.\" - Meredith Goldstein, author, longtime advice columnist, and associate editor at The Boston Globe",
    /*age_category:*/
    'Chapter Books (Ages 6–10), Early Reader Books (Ages 5–8), Middle Grade Books (Ages 8–13), Young Adult Books (Ages 13–18)',
    /*isbn:*/ '979-8-88694-056-5',
    /*shopify_url:*/ 'https://826boston.org',
    /*binding_type:*/ 'Perfect Bound',
    /*dimensions:*/ '11" x 8.5"',
    /*printing_cost:*/ '$8,548.28',
    /*print_run:*/ 600,
    /*weight:*/ '28.11 oz / 827 g',
    /*page_count:*/ 245,
    /*printed_by:*/ 'PaperGraphics',
    /*pub_level:*/ AnthologyPubLevel.SIGNATURE,
    /*publishing_permission:*/ 'All',
    /*programs:*/ ['YABP'],
    /*sponsors:*/ [
      'Boston Globe',
      'Grub Street',
      'Nosy Crow Inc.',
      'Tiny Tiger Foundation',
    ],
    /*number_of_students:*/ 91,
    /*inventory:*/ 313,
    /*inventory_locations:*/ [
      { id: 1, name: "BINcA Writers' Room", num_copies: 1 },
      { id: 2, name: 'Dev/Comms Office (1865 Columbus)', num_copies: 2 },
      { id: 3, name: "Holland Writers' Room", num_copies: 2 },
      { id: 4, name: 'Library', num_copies: 1 },
      { id: 5, name: 'The Hub (1989 Columbus)', num_copies: 250 },
      { id: 6, name: "O'Bryant Writers' Room", num_copies: 3 },
      { id: 7, name: "Muñiz Writers' Room", num_copies: 5 },
      { id: 8, name: "New Mission Writers' Room", num_copies: 32 },
      { id: 9, name: 'Tutoring Center (3035 Office)', num_copies: 313 },
    ],
  ),
  new Anthology(
    /*id:*/ 2,
    /*title:*/ 'I Was Meant For This',
    /*published_year:*/ 2022,
    /*status:*/ AnthologyStatus.ARCHIVED,
    /*stories:*/ [
      {
        id: 2,
        title: 'Story 1',
        anthology_id: 2,
        authors: [
          {
            id: 1,
            name: '826 Boston Students',
          },
        ],
        genres: [
          STATIC_GENRES[GenreType.CIVIC_ENGAGEMENT],
          STATIC_GENRES[GenreType.POLITICS],
          STATIC_GENRES[GenreType.SPEECHES],
        ],
        themes: [
          { id: 1, name: 'Leadership' },
          { id: 2, name: 'Neighborhood' },
          { id: 3, name: 'The Future' },
        ],
      },
    ],
    /*subtitle:*/ "Mayoral Speeches By Boston's Young Leaders",
    /*byline:*/ 'from 826 Boston Students',
    /*description:*/
    "Boston's 2021 mayoral election was a competitive race with more ethnically and racially diverse candidates than ever before. In I Was Meant for This students of all ages give their own inaugural addresses as Boston's mayor-elect. These speeches—simultaneously playful, imaginative, and keenly observed—speak to an evolving city, as told through the eyes of tomorrow's leaders.",
    /*updated_at:*/ 'Jan 1, 1960',
    /*photo_url:*/ '/src/assets/images/covers/IwasMeantforthis_2022.jpg',
    /*foreword_author:*/ 'Adrian Walker',
    /*praise_quotes:*/
    '"These are the speeches—and the voices—of young people who know that they matter, and that their thoughts and dreams matter. We should want that for all young people in every neighborhood of our city. I hope you enjoy their writing, and their thinking, as much as I did. We need their voices more than ever. And to our young mayoral candidates and essayists I say: Please keep writing. And please keep dreaming." - Adrian Walker, Columnist/Associate Editor, The Boston Globe',
    /*age_category:*/
    'Chapter Books (Ages 6–10), Middle Grade Books (Ages 8–13), Young Adult Books (Ages 13–18)',
    /*isbn:*/ '978-1-948644-89-1',
    /*shopify_url:*/ 'https://826boston.org/publications/i-was-meant-for-this/',
    /*binding_type:*/ 'Perfect Bound',
    /*dimensions:*/ '6" x 9.5"',
    /*printing_cost:*/ '$4,315.58',
    /*print_run:*/ 500,
    /*weight:*/ '10.8 oz / 306 g',
    /*page_count:*/ 146,
    /*printed_by:*/ 'PaperGraphics',
    /*pub_level:*/ AnthologyPubLevel.SIGNATURE,
    /*publishing_permission:*/ 'All',
    /*program:*/ ['YABP'],
    /*sponsors:*/ ['Richard K. Lubin Family Foundation'],
    /*number_of_students:*/ 40,
    /*inventory:*/ 62,
    /*inventory_locations:*/ [
      { id: 1, name: "BINcA Writers' Room", num_copies: 2 },
      { id: 2, name: 'Dev/Comms Office (1865 Columbus)', num_copies: 0 },
      { id: 3, name: "Holland Writers' Room", num_copies: 9 },
      { id: 4, name: 'Library', num_copies: 0 },
      { id: 5, name: 'The Hub (1989 Columbus)', num_copies: 54 },
      { id: 6, name: "O'Bryant Writers' Room", num_copies: 0 },
      { id: 7, name: "Muñiz Writers' Room", num_copies: 0 },
      { id: 8, name: "New Mission Writers' Room", num_copies: 1 },
      { id: 9, name: 'Tutoring Center (3035 Office)', num_copies: 16 },
    ],
  ),
  new Anthology(
    /*id:*/ 3,
    /*title:*/ 'Student Voices Vol. 1',
    /*published_year:*/ 2022,
    /*status:*/ AnthologyStatus.ARCHIVED,
    /*stories:*/ [
      {
        id: 2,
        title: 'Story 1',
        anthology_id: 2,
        authors: [
          {
            id: 2,
            name: 'A. Lee',
          },
        ],
        genres: [
          STATIC_GENRES[GenreType.ADVICE],
          STATIC_GENRES[GenreType.SCIENCE_FICTION],
          STATIC_GENRES[GenreType.FANTASY],
          STATIC_GENRES[GenreType.RECIPES],
          STATIC_GENRES[GenreType.HUMOR],
          STATIC_GENRES[GenreType.POETRY],
        ],
        themes: [
          { id: 1, name: 'Leadership' },
          { id: 2, name: 'Neighborhood' },
          { id: 3, name: 'The Future' },
        ],
      },
      {
        id: 3,
        title: 'Story 2',
        anthology_id: 2,
        authors: [
          {
            id: 3,
            name: 'M. Torres',
          },
        ],
        genres: [
          STATIC_GENRES[GenreType.SHORT_STORIES],
          STATIC_GENRES[GenreType.FICTION],
          STATIC_GENRES[GenreType.NON_FICTION],
          STATIC_GENRES[GenreType.ESSAYS],
        ],
        themes: [
          { id: 1, name: 'Leadership' },
          { id: 2, name: 'Neighborhood' },
          { id: 3, name: 'The Future' },
        ],
      },
    ],
  ),
  new Anthology(
    /*id:*/ 4,
    /*title:*/ '826 Boston Anthology 2023',
    /*published_year:*/ 2023,
    /*status:*/ AnthologyStatus.ARCHIVED,
  ),
  new Anthology(
    /*id:*/ 5,
    /*title:*/ 'Neighborhood Stories',
    /*published_year:*/ 2021,
    /*status:*/ AnthologyStatus.ARCHIVED,
    /*stories:*/ [
      {
        id: 3,
        title: 'Story 3',
        anthology_id: 5,
        authors: [
          {
            id: 2,
            name: 'A. Lee',
          },
        ],
        genres: [
          STATIC_GENRES[GenreType.ADVICE],
          STATIC_GENRES[GenreType.SCIENCE_FICTION],
          STATIC_GENRES[GenreType.FANTASY],
          STATIC_GENRES[GenreType.RECIPES],
          STATIC_GENRES[GenreType.HUMOR],
          STATIC_GENRES[GenreType.POETRY],
          STATIC_GENRES[GenreType.SHORT_STORIES],
          STATIC_GENRES[GenreType.FICTION],
          STATIC_GENRES[GenreType.NON_FICTION],
          STATIC_GENRES[GenreType.ESSAYS],
        ],
        themes: [
          { id: 1, name: 'Leadership' },
          { id: 2, name: 'Neighborhood' },
          { id: 3, name: 'The Future' },
        ],
      },
    ],
  ),
  new Anthology(
    /*id:*/ 6,
    /*title:*/ 'Poetry from the Classroom',
    /*published_year:*/ 2020,
    /*status:*/ AnthologyStatus.ARCHIVED,
    /*stories:*/ [
      {
        id: 4,
        title: 'Story 4',
        anthology_id: 6,
        authors: [
          {
            id: 4,
            name: 'Students Contributors',
          },
        ],
        genres: [
          STATIC_GENRES[GenreType.ADVICE],
          STATIC_GENRES[GenreType.SCIENCE_FICTION],
          STATIC_GENRES[GenreType.FANTASY],
          STATIC_GENRES[GenreType.RECIPES],
          STATIC_GENRES[GenreType.HUMOR],
          STATIC_GENRES[GenreType.POETRY],
          STATIC_GENRES[GenreType.SHORT_STORIES],
          STATIC_GENRES[GenreType.FICTION],
          STATIC_GENRES[GenreType.NON_FICTION],
          STATIC_GENRES[GenreType.ESSAYS],
        ],
        themes: [
          { id: 1, name: 'Leadership' },
          { id: 2, name: 'Neighborhood' },
          { id: 4, name: 'Lorem Ipsum' },
        ],
      },
    ],
  ),
  new Anthology(
    /*id:*/ 7,
    /*title:*/ 'Young Writers Showcase',
    /*published_year:*/ 2019,
    /*status:*/ AnthologyStatus.ARCHIVED,
    /*stories:*/ [
      {
        id: 4,
        title: 'Story 4',
        anthology_id: 7,
        authors: [
          {
            id: 4,
            name: 'R. Patel',
          },
        ],
        genres: [
          STATIC_GENRES[GenreType.ADVICE],
          STATIC_GENRES[GenreType.SCIENCE_FICTION],
          STATIC_GENRES[GenreType.FANTASY],
          STATIC_GENRES[GenreType.RECIPES],
        ],
        themes: [
          { id: 1, name: 'Leadership' },
          { id: 2, name: 'Neighborhood' },
          { id: 4, name: 'Lorem Ipsum' },
        ],
      },
      {
        id: 5,
        title: 'Story 5',
        anthology_id: 7,
        authors: [
          {
            id: 6,
            name: 'K. Chen',
          },
        ],
        genres: [
          STATIC_GENRES[GenreType.HUMOR],
          STATIC_GENRES[GenreType.POETRY],
          STATIC_GENRES[GenreType.SHORT_STORIES],
        ],
        themes: [
          { id: 1, name: 'Leadership' },
          { id: 2, name: 'Neighborhood' },
          { id: 4, name: 'Lorem Ipsum' },
        ],
      },
      {
        id: 6,
        title: 'Story 6',
        anthology_id: 7,
        authors: [
          {
            id: 7,
            name: 'S. Johnson',
          },
        ],
        genres: [
          STATIC_GENRES[GenreType.FICTION],
          STATIC_GENRES[GenreType.NON_FICTION],
          STATIC_GENRES[GenreType.ESSAYS],
        ],
        themes: [
          { id: 1, name: 'Leadership' },
          { id: 2, name: 'Neighborhood' },
          { id: 4, name: 'Lorem Ipsum' },
        ],
      },
    ],
  ),
  new Anthology(
    /*id:*/ 8,
    /*title:*/ 'Stories from Roxbury',
    /*published_year:*/ 2021,
    /*status:*/ AnthologyStatus.ARCHIVED,
    /*stories:*/ [
      {
        id: 8,
        title: 'Story 7',
        anthology_id: 8,
        authors: [
          {
            id: 8,
            name: 'Community Writers',
          },
        ],
        genres: [
          STATIC_GENRES[GenreType.ADVICE],
          STATIC_GENRES[GenreType.SCIENCE_FICTION],
          STATIC_GENRES[GenreType.FANTASY],
          STATIC_GENRES[GenreType.RECIPES],
          STATIC_GENRES[GenreType.HUMOR],
          STATIC_GENRES[GenreType.POETRY],
          STATIC_GENRES[GenreType.SHORT_STORIES],
          STATIC_GENRES[GenreType.FICTION],
          STATIC_GENRES[GenreType.NON_FICTION],
          STATIC_GENRES[GenreType.ESSAYS],
        ],
        themes: [
          { id: 1, name: 'Leadership' },
          { id: 2, name: 'Neighborhood' },
          { id: 4, name: 'Lorem Ipsum' },
        ],
      },
    ],
  ),
  new Anthology(
    /*id:*/ 9,
    /*title:*/ 'Creative Expressions 2022',
    /*published_year:*/ 2022,
    /*status:*/ AnthologyStatus.ARCHIVED,
    /*stories:*/ [
      {
        id: 8,
        title: 'Story 7',
        anthology_id: 9,
        authors: [
          {
            id: 9,
            name: 'D. Brown',
          },
        ],
        genres: [
          STATIC_GENRES[GenreType.ADVICE],
          STATIC_GENRES[GenreType.SCIENCE_FICTION],
          STATIC_GENRES[GenreType.FANTASY],
          STATIC_GENRES[GenreType.RECIPES],
          STATIC_GENRES[GenreType.HUMOR],
        ],
        themes: [
          { id: 1, name: 'Leadership' },
          { id: 2, name: 'Neighborhood' },
          { id: 4, name: 'Lorem Ipsum' },
        ],
      },
      {
        id: 8,
        title: 'Story 7',
        anthology_id: 9,
        authors: [
          {
            id: 8,
            name: 'M. Williams',
          },
          {
            id: 10,
            name: '826 Boston Students',
          },
        ],
        genres: [
          STATIC_GENRES[GenreType.POETRY],
          STATIC_GENRES[GenreType.SHORT_STORIES],
          STATIC_GENRES[GenreType.FICTION],
          STATIC_GENRES[GenreType.NON_FICTION],
          STATIC_GENRES[GenreType.ESSAYS],
        ],
        themes: [{ id: 4, name: 'Lorem Ipsum' }],
      },
    ],
  ),
  new Anthology(
    /*id:*/ 10,
    /*title:*/ 'Voices of Tomorrow',
    /*published_year:*/ 2023,
    /*status:*/ AnthologyStatus.ARCHIVED,
    /*stories:*/ [
      {
        id: 10,
        title: 'Story 10',
        anthology_id: 10,
        authors: [
          {
            id: 1,
            name: '826 Boston Students',
          },
        ],
        genres: [
          STATIC_GENRES[GenreType.ADVICE],
          STATIC_GENRES[GenreType.SCIENCE_FICTION],
          STATIC_GENRES[GenreType.FANTASY],
          STATIC_GENRES[GenreType.RECIPES],
          STATIC_GENRES[GenreType.HUMOR],
          STATIC_GENRES[GenreType.POETRY],
          STATIC_GENRES[GenreType.SHORT_STORIES],
          STATIC_GENRES[GenreType.FICTION],
          STATIC_GENRES[GenreType.NON_FICTION],
          STATIC_GENRES[GenreType.ESSAYS],
        ],
        themes: [{ id: 4, name: 'Lorem Ipsum' }],
      },
    ],
  ),
];

export const RECENTLY_EDITED: Anthology[] = [
  new Anthology(
    /*id:*/ 101,
    /*title:*/ 'Untitled Publication',
    /*published_year:*/ 2025,
    /*status:*/ AnthologyStatus.ARCHIVED,
  ),
  new Anthology(
    /*id:*/ 102,
    /*title:*/ 'Untitled Publication',
    /*published_year:*/ 2025,
    /*status:*/ AnthologyStatus.ARCHIVED,
  ),
  new Anthology(
    /*id:*/ 103,
    /*title:*/ 'Untitled Publication',
    /*published_year:*/ 2025,
    /*status:*/ AnthologyStatus.ARCHIVED,
  ),
];

export const MOCK_LAST_MODIFIED = 'October 15, 2025';
