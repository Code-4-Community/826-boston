import { AnthologyPubLevel, AnthologyStatus } from '../anthology/types';

export interface AnthologySeedItem {
  title: string;
  byline: string;
  description: string;
  genres: string[];
  themes: string[];
  triggers: string[];
  publishedDate: Date;
  programs?: string[];
  sponsors?: string[];
  status: AnthologyStatus;
  pubLevel: AnthologyPubLevel;
  photoUrl?: string;
  isbn?: string;
  shopifyUrl?: string;
  subtitle?: 'A College Essay Anthology';
}

export const AnthologiesSeed: AnthologySeedItem[] = [
  {
    title: 'Voices From the Threshold',
    byline:
      'Written by 10th-Grade Students at Riverside International High School',
    description:
      'What does it mean to stand at the threshold between two worlds? In Voices From the Threshold, newcomer students write with striking honesty about the experience of leaving one home and building another. Their words carry the weight of long journeys and the brightness of new beginnings.',
    genres: ['Personal Narratives', 'Poetry', 'Prose'],
    themes: ['Identity', 'Immigration', 'Belonging'],
    triggers: [],
    publishedDate: new Date('2025-06-15'),
    programs: ['BINcA'],
    sponsors: ['Ms. Alvarez', 'Mr. Osei'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.CHAPBOOK,
    photoUrl: 'publications/covers/voices-from-the-threshold.png',
  },
  {
    title: 'The Color of Saturday',
    byline: 'Written by 8th-Grade Students at Westbrook Middle School',
    description:
      'Saturdays smell like pancakes, sound like cartoons, and feel like possibility. The young writers behind The Color of Saturday capture the small, glorious moments of a day with no school and no rules — told through fiction that is funny, tender, and deeply true.',
    genres: ['Fiction', 'Short Stories'],
    themes: ['Childhood', 'Memory', 'Joy', 'Coming of Age'],
    triggers: [],
    publishedDate: new Date('2025-05-30'),
    programs: ['OB'],
    sponsors: ['Ms. Jeong'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.CHAPBOOK,
    photoUrl: 'publications/covers/color-of-saturday.png',
    shopifyUrl: 'https://writingcenter.org/publications/color-of-saturday',
  },
  {
    title: 'What the River Carries',
    byline:
      'Written by 9th and 10th-Grade Students at Margarita Muñiz Academy, in English and Spanish',
    description:
      'Rivers carry more than water. They carry memory, grief, and celebration. In this bilingual collection of poems and short reflections, students explore their relationships with natural waterways — from rivers in their homelands to the harbor visible from their classroom windows.',
    genres: ['Multilingual', 'Poetry', 'Nonfiction'],
    themes: ['Nature', 'Heritage', 'Environment', 'Water'],
    triggers: [],
    publishedDate: new Date('2025-06-28'),
    programs: ['Muñiz'],
    sponsors: ['Mr. Fuentes', 'Ms. Delacroix'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.CHAPBOOK,
    photoUrl: 'publications/covers/what-the-river-carries.png',
    shopifyUrl: 'https://writingcenter.org/publications/what-the-river-carries',
  },
  {
    title: 'Prism Literary Magazine #14: Borrowed and Stolen',
    byline:
      "From the Writers' Room at Northside High School of Math and Science",
    description:
      "Each year, Prism Literary Magazine gathers student voices around a single theme. This year, writers and artists ask: What does it mean to take something that isn't yours? And what happens when something that is yours gets taken? Issue #14 wrestles with cultural ownership, artistic inspiration, and the fine line between borrowing and stealing.",
    genres: ['Essays', 'Poetry', 'Short Stories', 'Visual Art'],
    themes: ['Culture', 'Appropriation', 'Ownership', 'Identity'],
    triggers: [],
    publishedDate: new Date('2025-06-30'),
    programs: ['OB'],
    sponsors: ['Prism Club'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.PERFECT_BOUND,
    photoUrl: 'publications/covers/rubix-14-front.png',
    shopifyUrl: 'https://writingcenter.org/publications/rubix-14',
  },
  {
    title: 'Snapshots at 3AM',
    byline: 'Written by the Youth Literary Advisory Board',
    description:
      'The city never fully sleeps, and neither do its teenagers. Snapshots at 3AM is a collection of poetry and flash fiction exploring those quiet, strange hours between midnight and morning — the thoughts that surface when the world goes still and the mind speeds up.',
    genres: ['Fiction', 'Poetry', 'Prose'],
    themes: ['Loneliness', 'Late Night', 'The City', 'Insomnia'],
    triggers: [],
    publishedDate: new Date('2025-03-20'),
    programs: ['YLAB'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.PERFECT_BOUND,
    photoUrl: 'publications/covers/snapshots-3am.png',
    shopifyUrl: 'https://writingcenter.org/publications/snapshots-3am',
  },
  {
    title: 'How to Survive a Cafeteria',
    byline: 'A Field Guide by After-School Students',
    description:
      'An indispensable field guide for the modern middle schooler. Inside: how to identify the five species of lunch table, the art of the strategic seat, and what to do when someone takes your fries. Written with extreme authority by students who have survived the cafeteria firsthand.',
    genres: ['Humor', 'Short Stories'],
    themes: ['School', 'Friendship', 'Social Dynamics', 'Survival Guides'],
    triggers: [],
    publishedDate: new Date('2025-04-10'),
    programs: ['After-School Tutoring', 'OOST'],
    status: AnthologyStatus.ARCHIVED,
    pubLevel: AnthologyPubLevel.CHAPBOOK,
    photoUrl: 'publications/covers/how-to-survive-cafeteria.png',
  },
  {
    title: 'Letters to Nobody',
    byline: "By the Tech Writers' Room at Eastfield Academy",
    description:
      'Some letters are never meant to be sent. They are written for the writer — to process, to release, to say the unsayable. Letters to Nobody is an intimate collection from students who wrote to someone they missed, something they lost, or a version of themselves they were learning to let go.',
    genres: ['Personal Narratives', 'Essays', 'Poetry'],
    themes: ['Grief', 'Loss', 'Healing', 'Unsent Words'],
    triggers: ['Grief and Loss'],
    publishedDate: new Date('2025-02-14'),
    programs: ['Holland (Burke)'],
    sponsors: ['Ms. Washington'],
    status: AnthologyStatus.IN_REVISION,
    pubLevel: AnthologyPubLevel.CHAPBOOK,
    photoUrl: 'publications/covers/letters-to-nobody.png',
  },
  {
    title: 'Aftershock',
    byline:
      'Written by the Youth Literary Advisory Board and Youth Arts & Books Program at 826 Boston',
    description:
      'When a series of floods devastates a fictional coastal city, four teenagers must navigate bureaucracy, broken infrastructure, and fractured friendships. Aftershock is a devised theater piece written and performed by teen writers, exploring how communities fracture — and how they heal.',
    genres: ['Civic Engagement', 'Scriptwriting', 'Performance Art'],
    themes: ['Climate Change', 'Disaster', 'Community', 'Resilience'],
    triggers: [],
    publishedDate: new Date('2025-01-31'),
    programs: ['YABP', 'YLAB'],
    sponsors: ['Coastal Arts Collaborative'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.SIGNATURE,
    photoUrl: 'publications/covers/aftershock-cover.png',
    shopifyUrl: 'https://writingcenter.org/publications/aftershock',
  },
  {
    title: 'Bright Noise',
    byline: 'From the Art and Writing Club at Eastside High School',
    description:
      "Music is everywhere — in headphones, in hallways, in memory. Bright Noise is Eastside High's interdisciplinary literary magazine, pairing student poems and essays with original illustrations. This year's contributors explore the songs that raised them and the sounds they're making on their own.",
    genres: ['Poetry', 'Visual Art', 'Essays'],
    themes: ['Music', 'Sound', 'Culture', 'Self-Expression'],
    triggers: [],
    publishedDate: new Date('2025-05-15'),
    programs: ['OB'],
    sponsors: ['Art & Writing Club'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.PERFECT_BOUND,
    photoUrl: 'publications/covers/bright-noise-cover.png',
    shopifyUrl: 'https://writingcenter.org/publications/bright-noise',
  },
  {
    title: "Tomorrow's Almanac",
    byline: 'Written by the Youth Literary Advisory Board',
    description:
      "What if the future had a forecast? Tomorrow's Almanac imagines daily life fifty years from now — weather reports for emotional climates, horoscopes calibrated to algorithms, and maps of cities that don't exist yet. A playful and searching collection from student writers.",
    genres: ['Fiction', 'Flash Fiction'],
    themes: ['The Future', 'Prediction', 'Hope', 'Anxiety', 'Technology'],
    triggers: [],
    publishedDate: new Date('2025-03-05'),
    programs: ['YLAB'],
    status: AnthologyStatus.IN_PRODUCTION,
    pubLevel: AnthologyPubLevel.PERFECT_BOUND,
    photoUrl: 'publications/covers/tomorrows-almanac.png',
    shopifyUrl: 'https://writingcenter.org/publications/tomorrows-almanac',
  },
  {
    title: 'Prism Literary Magazine #15: Memory Palace',
    byline:
      "From the Writers' Room at Northside High School of Math and Science",
    description:
      "Issue #15 of Prism Literary Magazine invites students to build a memory palace — one room at a time. Contributors construct their essays and poems around physical spaces charged with meaning: childhood bedrooms, corner stores, grandmother's kitchens, and the school hallways where everything happened.",
    genres: ['Essays', 'Photography', 'Poetry', 'Short Stories'],
    themes: ['Memory', 'Place', 'Nostalgia', 'Architecture'],
    triggers: [],
    publishedDate: new Date('2026-06-28'),
    programs: ['OB'],
    sponsors: ['Prism Club'],
    status: AnthologyStatus.DRAFT,
    pubLevel: AnthologyPubLevel.PERFECT_BOUND,
    photoUrl: 'publications/covers/rubix-15-front.png',
    shopifyUrl: 'https://writingcenter.org/publications/rubix-15',
  },
  {
    title: 'Not Guilty',
    byline:
      'Written by the Youth Literary Advisory Board and Youth Arts & Books Program',
    description:
      "Four teenagers are called as witnesses in a trial they didn't expect to testify in. As the courtroom drama unfolds, they must decide what truth means when the system doesn't seem built to hear it. Not Guilty is a devised theater piece written by student playwrights exploring youth and the justice system.",
    genres: ['Civic Engagement', 'Scriptwriting'],
    themes: ['Criminal Justice', 'Youth', 'Power', 'Advocacy'],
    triggers: [],
    publishedDate: new Date('2025-05-05'),
    programs: ['YABP', 'YLAB'],
    sponsors: ['Justice Arts Network'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.SIGNATURE,
    photoUrl: 'publications/covers/not-guilty-cover.png',
    shopifyUrl: 'https://writingcenter.org/publications/not-guilty',
  },
  {
    title: 'Unlocked',
    byline: 'Written by Boston-Area Seniors Applying to College',
    subtitle: 'A College Essay Anthology',
    description:
      'Every student who applies to college must answer the same question: Who are you? Unlocked is a collection of college essays written by seniors who answered that question with radical honesty, surprising humor, and voices entirely their own.',
    genres: ['College Essay', 'Essays', 'Personal Narratives'],
    themes: ['Identity', 'Growth', 'College', 'The Future'],
    triggers: [],
    publishedDate: new Date('2025-06-01'),
    programs: ['In-School'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.PERFECT_BOUND,
    photoUrl: 'publications/covers/unlocked-cover.png',
    shopifyUrl: 'https://writingcenter.org/publications/unlocked',
  },
  {
    title: 'Burn and Bloom',
    byline:
      'Written by the Youth Literary Advisory Board and Youth Arts & Books Program',
    description:
      'After fire, flowers grow. Burn and Bloom is a collection of poems and personal essays from teen writers who have experienced loss, disruption, or failure — and found a way to keep growing. Raw, honest, and ultimately hopeful.',
    genres: ['Poetry', 'Personal Narratives'],
    themes: ['Resilience', 'Transformation', 'Trauma', 'Growth'],
    triggers: ['Trauma', 'Loss'],
    publishedDate: new Date('2025-04-15'),
    programs: ['YABP', 'YLAB'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.SIGNATURE,
    photoUrl: 'publications/covers/burn-and-bloom-cover.png',
    shopifyUrl: 'https://writingcenter.org/publications/burn-and-bloom',
  },
  {
    title: 'Civic Creatures',
    byline:
      'Written by the Youth Literary Advisory Board and Youth Arts & Books Program',
    description:
      "They can't vote yet. But they have opinions about everything. Civic Creatures is a hybrid publication — part essay collection, part script — in which teen writers grapple with the paradox of being young in a democracy that hasn't let them in yet.",
    genres: ['Civic Engagement', 'Essays', 'Scriptwriting'],
    themes: ['Democracy', 'Voting', 'Youth Voice', 'Activism'],
    triggers: [],
    publishedDate: new Date('2025-04-08'),
    programs: ['YABP', 'YLAB'],
    sponsors: ['Civic Action Lab'],
    status: AnthologyStatus.IN_REVISION,
    pubLevel: AnthologyPubLevel.SIGNATURE,
    photoUrl: 'publications/covers/civic-creatures-cover.png',
    shopifyUrl: 'https://writingcenter.org/publications/civic-creatures',
  },
  {
    title: 'The Weight of a Suitcase',
    byline:
      'Personal Narratives by 9th-Grade Students at Riverside International High School',
    description:
      'What do you carry when you can only carry one bag? Students at Riverside International High School reflect on the objects they brought with them when they left their home countries — each item a portal to another time and place.',
    genres: ['Nonfiction', 'Personal Narratives'],
    themes: ['Immigration', 'Objects', 'Memory', 'Home'],
    triggers: [],
    publishedDate: new Date('2024-12-12'),
    programs: ['BINcA'],
    sponsors: ['Ms. Torres'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.CHAPBOOK,
    photoUrl: 'publications/covers/weight-of-suitcase.png',
  },
  {
    title: 'Every Map Lies',
    byline: 'Written by 10th-Grade Students',
    description:
      'Maps tell stories — but whose? In Every Map Lies, students examine the maps they grew up with and ask what was left out, who drew the borders, and what a more honest map of their world might look like.',
    genres: ['Civic Engagement', 'Essays', 'Nonfiction'],
    themes: ['Geography', 'History', 'Power', 'Cartography', 'Colonialism'],
    triggers: [],
    publishedDate: new Date('2025-06-05'),
    programs: ['In-School'],
    sponsors: ['Mr. Chen'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.PERFECT_BOUND,
    photoUrl: 'publications/covers/every-map-lies.png',
    shopifyUrl: 'https://writingcenter.org/publications/every-map-lies',
  },
  {
    title: 'The Night Kitchen',
    byline:
      'Written by 9th and 10th-Grade Students at Margarita Muñiz Academy, in English and Spanish',
    description:
      'The best food is made after midnight. In The Night Kitchen, students document late-night family recipes alongside the stories behind them — the grandmother who added the extra spice, the uncle who burned it every single time, and the meals that taste like belonging.',
    genres: ['Multilingual', 'Nonfiction', 'Recipes', 'Personal Narratives'],
    themes: ['Food', 'Family', 'Culture', 'Memory', 'Community'],
    triggers: [],
    publishedDate: new Date('2025-02-20'),
    programs: ['Muñiz'],
    sponsors: ['Ms. Salazar'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.CHAPBOOK,
    photoUrl: 'publications/covers/night-kitchen.png',
    shopifyUrl: 'https://writingcenter.org/publications/night-kitchen',
  },
  {
    title: 'Hard Pivot',
    byline: 'College Essays by Graduating Seniors',
    subtitle: 'A College Essay Anthology',
    description:
      'The best college essays are not about achievements. They are about the moments when everything went wrong and what the writer did next. Hard Pivot is a collection of essays from students who wrote about failure, change, and the hard work of becoming someone new.',
    genres: ['College Essay', 'Personal Narratives'],
    themes: ['Failure', 'Reinvention', 'Resilience', 'College'],
    triggers: [],
    publishedDate: new Date('2025-05-18'),
    programs: ['OB'],
    sponsors: ['Ms. Clarke', 'Mr. Hassan'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.PERFECT_BOUND,
    photoUrl: 'publications/covers/hard-pivot.png',
    shopifyUrl: 'https://writingcenter.org/publications/hard-pivot',
  },
  {
    title: 'The Space Between Languages',
    byline:
      'Written by 10th and 11th-Grade Students at Margarita Muñiz Academy',
    description:
      'What do you call the feeling of having no word for it in either language? In The Space Between Languages, bilingual and multilingual students explore code-switching, translation, and the emotional terrain that lives between tongues.',
    genres: ['Essays', 'Multilingual', 'Personal Narratives'],
    themes: ['Language', 'Code-Switching', 'Identity', 'Translation'],
    triggers: [],
    publishedDate: new Date('2025-05-08'),
    programs: ['Muñiz'],
    sponsors: ['Mr. Espinoza'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.CHAPBOOK,
    photoUrl: 'publications/covers/space-between-languages.png',
    shopifyUrl:
      'https://writingcenter.org/publications/space-between-languages',
  },
  {
    title: 'Hallway Dispatches',
    byline: 'Written by Students in the Out-of-School Time Program',
    description:
      'Quick dispatches from the hallways, stairwells, and lunch lines of high school — tiny poems and observations scrawled between classes. Hallway Dispatches is a zine made fast and meant to be passed around.',
    genres: ['Poetry', 'Flash Fiction'],
    themes: ['School Life', 'Everyday Moments', 'Observation'],
    triggers: [],
    publishedDate: new Date('2025-09-12'),
    programs: ['OB'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.ZINE,
    photoUrl: 'publications/covers/hallway-dispatches.png',
  },
  {
    title: 'Field Notes From the T',
    byline: 'Observations by the Youth Literary Advisory Board',
    description:
      "Boston's subway is full of strangers with stories. Field Notes From the T is a zine of flash nonfiction and sketches gathered by student writers riding the Green, Orange, and Red Lines — a document of a city always in motion.",
    genres: ['Nonfiction', 'Personal Narratives'],
    themes: ['The City', 'Transit', 'Observation', 'Community'],
    triggers: [],
    publishedDate: new Date('2025-10-01'),
    programs: ['YLAB'],
    status: AnthologyStatus.IN_PRODUCTION,
    pubLevel: AnthologyPubLevel.ZINE,
    photoUrl: 'publications/covers/field-notes-from-the-t.png',
  },
];
