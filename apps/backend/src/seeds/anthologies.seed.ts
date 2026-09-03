import { AnthologyPubLevel, AnthologyStatus } from '../anthology/types';

export interface AnthologySeedItem {
  id?: number;
  title: string;
  byline: string;
  description: string;
  genres: string[];
  themes: string[];
  triggers: string[];
  publishedDate?: Date;
  programs: string[];
  sponsors: string[];
  status: AnthologyStatus;
  pubLevel: AnthologyPubLevel;
  photoUrl?: string;
  isbn?: string;
  shopifyUrl?: string;
  subtitle?: string;
  productionInfoId?: number;
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
  },
  {
    title: 'Snapshots at 3AM',
    byline: 'Written by the Youth Literary Advisory Board',
    description:
      'The city never fully sleeps, and neither do its teenagers. Snapshots at 3AM is a collection of poetry and flash fiction exploring those quiet, strange hours between midnight and morning — the thoughts that surface when the world goes still and the mind speeds up.',
    genres: ['Fiction', 'Poetry', 'Prose'],
    themes: ['Loneliness', 'Late Night', 'The City', 'Insomnia'],
    triggers: [],
    sponsors: [],
    publishedDate: new Date('2025-03-20'),
    programs: ['YLAB'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.PERFECT_BOUND,
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
    sponsors: [],
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
    sponsors: [],
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
    sponsors: [],
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
    sponsors: [],
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
    sponsors: [],
  },
  {
    title: 'Walk a Mile in Our Shoes',
    byline: 'Personal Narrative by 9th Grade Students at Boston International',
    description:
      'Writing this book was fun and helpful for us, as we are happy to read about other students at BINcA. Getting to know their experiences and walk a mile in their shoes makes us feel important, like we are part of something great.',
    genres: ['Nonfiction', 'Personal Narratives', 'Prose'],
    themes: [
      'Culture',
      'Family',
      'Identity',
      'The Future',
      'Goals',
      'Immigration',
      'Tradition',
    ],
    triggers: ['Profanity', 'Physical or Verbal Abuse'],
    publishedDate: new Date('2025-12-17'),
    programs: ['BINcA'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.CHAPBOOK,
    photoUrl:
      'https://c4c-826boston-dev.s3.us-east-1.amazonaws.com/images/walk_a_mile.webp',
    sponsors: [],
  },
  {
    title: 'Utopia vs. Dystopia',
    byline:
      'Written by 10th-grade students in Ms. Shin’s English class at the John D. O’Bryant School of Mathematics and Science.',
    description:
      "'Through our stories, we want to explore what it feels to be human and how society sometimes forgets what humanity actually is.' Utopia vs. Dystopia: The Future We're Heading Toward is a collection of dystopian flash fiction stories written by 10th-grade students in Ms. Shin's English class at the John D. O'Bryant School of Mathematics and Science.",
    genres: ['Fiction', 'Flash Fiction'],
    themes: ['Dystopia/Utopia'],
    triggers: [],
    publishedDate: new Date('2025-06-30'),
    programs: ['OB'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.CHAPBOOK,
    photoUrl:
      'https://c4c-826boston-dev.s3.us-east-1.amazonaws.com/images/UtopiaDystopia.webp',
    sponsors: [],
  },
  {
    title: "I'll Light Up My Own Sky",
    byline: 'Written by Boston Graduates, 2021-2025',
    description:
      'A seemingly ordinary conversation, a personal failure, or a fleeting moment of doubt—when examined through the lens of reflection—can become the foundation of powerful storytelling.' +
      'I’ll Light Up My Own Sky is a collection of college essays written by graduates from 2021-2025. While their stories explore common themes, each essay remains infused with the distinct voice of its author.' +
      'In this collection, readers will come across nuanced perspectives on home, obstacles large and small, the value of building relationships with mentors, and young people reckoning with the age-old question: Who am I now, and who might I become?' +
      'As they navigate the next chapter of their lives, students remind readers to remain open-minded in the face of newness, resilient in the face of struggle, self-empowered in the face of negativity, and hopeful even when it seems impossible.',
    genres: [
      'College Essays',
      'Personal Narratives',
      'Essays',
      'Multilingual',
      'Identity',
    ],
    themes: ['College Essay', 'Identity'],
    triggers: [],
    publishedDate: new Date('2025-06-30'),
    programs: ['In-School'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.PERFECT_BOUND,
    photoUrl:
      'https://c4c-826boston-dev.s3.us-east-1.amazonaws.com/images/Ill_Light_Up_My_Own_Sky.webp',
    sponsors: [],
  },
  {
    title: 'To The People Like Us',
    byline:
      'Written by the Youth Literary Advisory Board at 826 Boston' +
      'Produced and staged by White Snake Projects',
    description:
      'In To The People Like Us, teen activist Constanza, aided by her vacillating friend Malakai, organizes her neighborhood against the Sirleaf Corporation, who intends to build a new development by razing their apartments and bodega. Indigo, a newcomer to the neighborhood, attempts to make friends with them and joins their protest group. Sparks fly when Constanza makes a discovery about Indigo that changes all of their relationships with each other. ',
    genres: [
      'Civic Engagement',
      'Multilingual',
      'Opera',
      'Performance Art',
      'Scriptwriting',
    ],
    themes: [
      'Climate Change',
      'Culture',
      'Freedom of Expression',
      'Gentrification',
      'Identity',
      'Neighborhood',
      'Oppression',
      'Power',
    ],
    triggers: [],
    publishedDate: new Date('2025-06-28'),
    programs: ['YABP', 'YLAB'],
    status: AnthologyStatus.DRAFT,
    pubLevel: AnthologyPubLevel.SIGNATURE,
    photoUrl:
      'https://c4c-826boston-dev.s3.us-east-1.amazonaws.com/images/people_like_us.webp',
    sponsors: [],
  },
  {
    title: 'I Am Bravery Itself',
    byline:
      'By the Dr. Albert D. Holland High School of Technology’s Exploration Academy',
    description:
      'The middle school cohort at the Dr. Albert D. Holland High School of Technology’s is named the Exploration Academy. Aptly, in this collection, the Exploration Academy students take a deep dive into selfhood, using class projects ranging from portraits to poetry as inspiration.',
    genres: ['Multilingual', 'Personal Narratives', 'Poetry', 'Prose'],
    themes: ['Identity', 'The Future'],
    triggers: [],
    publishedDate: new Date('2025-06-01'),
    programs: ['Holland (Burke)'],
    status: AnthologyStatus.DRAFT,
    pubLevel: AnthologyPubLevel.CHAPBOOK,
    photoUrl:
      'https://c4c-826boston-dev.s3.us-east-1.amazonaws.com/images/I_Am_Bravery_Itself.webp',
    sponsors: [],
  },
  {
    title: 'In Everday Things',
    byline: 'Written by the Youth Literary Advisory Board at 826 Boston',
    description:
      '“The simplest things can be the greatest gifts; the smallest of moments can be the most memorable; the most consequential.”' +
      'In Everyday Things is a collection of stories, memories, and poetry from the brilliant minds of the Youth Literary Advisory Board at 826 Boston. From the gift of life to the gift of friendship, each story illuminates how event the smallest acts of kindness can change a life forever. ' +
      '"Our objective in making this anthology was to explore and celebrate the gifts that shape us…We sought to create a collection that reflects the diversity of our experience as young writers.” — Letter from the Youth Literary Advisory Board',
    genres: ['Fiction', 'Nonfiction', 'Poetry', 'Prose', 'Short Stories'],
    themes: ['Identity', 'gifts'],
    triggers: [],
    publishedDate: new Date('2025-05-30'),
    programs: ['YLAB'],
    status: AnthologyStatus.DRAFT,
    pubLevel: AnthologyPubLevel.PERFECT_BOUND,
    photoUrl:
      'https://c4c-826boston-dev.s3.us-east-1.amazonaws.com/images/in_everyday_things.webp',
    sponsors: [],
  },
  {
    title: 'Nothing Suspicious Was Going On',
    byline: 'Written by the Youth Literary Advisory Board at 826 Boston',
    description:
      'Nothing out of the ordinary here. No missing notebooks, or mysterious scratches, and definitely' +
      'no secret spies. Just a regular collection of stories...right?' +
      'Written by After-School and Evening Tutoring students at 826 Boston, Nothing Suspicious Was Going On is a thrilling collection of bite-sized mysteries. Whether it’s a missing dog or a mistaken identity, the stories in this chapbook promise clever twists, endless detectives, and plenty of mischief. But don’t be fooled. Something suspicious is definitely going on…',
    genres: ['Fiction', 'Mystery'],
    themes: ['Creative Writing', 'Mystery', 'Short Stories'],
    triggers: [],
    publishedDate: new Date('2025-05-22'),
    programs: ['After-School Tutoring', 'OOST'],
    status: AnthologyStatus.IN_PRODUCTION,
    pubLevel: AnthologyPubLevel.CHAPBOOK,
    photoUrl:
      'https://c4c-826boston-dev.s3.us-east-1.amazonaws.com/images/nothing_suspicious.webp',
    sponsors: [],
  },
  {
    title: 'Who Are You?',
    byline: '11-grade students from the Margarita Muñiz Academy',
    description:
      'Join students from the Margarita Muñiz Academy as they explore identity through vibrant, personal artwork. More than just an art collection, Who Are You? is a testament to the power of creative expression. In just three weeks, these young creators transformed personal memories, cultural experiences, and individual dreams into visual stories that invite you to see the world differently. Each artwork is a reflection of a young person’s experience and understanding of themselves. These students aren’t just making art; they’re discovering themselves. ',
    genres: ['Visual Art'],
    themes: ['Culture', 'Identity'],
    triggers: [],
    publishedDate: new Date('2025-04-01'),
    programs: ['Muniz'],
    status: AnthologyStatus.IN_PRODUCTION,
    pubLevel: AnthologyPubLevel.PERFECT_BOUND,
    photoUrl:
      'https://c4c-826boston-dev.s3.us-east-1.amazonaws.com/images/WhoAreYoucoverfinal.webp',
    sponsors: [],
  },
  {
    title: 'The Great Cost of Freedom',
    byline:
      'written by 9th-grade students at Boston International Newcomers Academy',
    description:
      'We pay a great cost for our freedom. Join young authors from Boston International Newcomers Academy as they investigate what it meant to resist oppression throughout history. From the colonization of North America, to the Haitian Revolution, to the battles we fight in the present day, The Great Cost of Freedom explores themes of freedom through essays, poetry, artwork, and graphic design.',
    genres: ['Essays', 'Nonfiction', 'Personal Narratives', 'Visual Art'],
    themes: ['Oppression', 'Overcoming', 'Power'],
    triggers: [],
    publishedDate: new Date('2024-10-31'),
    programs: ['BINcA'],
    status: AnthologyStatus.IN_PRODUCTION,
    pubLevel: AnthologyPubLevel.PERFECT_BOUND,
    photoUrl:
      'https://c4c-826boston-dev.s3.us-east-1.amazonaws.com/images/WhoAreYoucoverfinal.webp',
    sponsors: [],
  },
  {
    title: 'Us, From the Inside and Out',
    byline:
      'Written by Tenth Grade Students from Edward M. Kennedy Academy for Health Careers',
    description:
      'Trilingual Poetry Written by Tenth Grade Students from Edward M. Kennedy Academy for Health Careers',
    genres: ['Poetry', 'Multilingual'],
    themes: [],
    triggers: [],
    publishedDate: new Date('2024-06-01'),
    programs: ['EMK'],
    status: AnthologyStatus.IN_REVISION,
    pubLevel: AnthologyPubLevel.CHAPBOOK,
    photoUrl:
      'https://c4c-826boston-dev.s3.us-east-1.amazonaws.com/images/UsFromtheInsideandOut.webp',
    sponsors: [],
  },
  {
    title: 'Rubix Literay Magazine #12 - Futures',
    byline:
      'students from the John D. O’Bryant School of Mathematics and Science',
    description:
      'Annual literary magazine publication, featuring poems, essays, and art around the theme "Futures”',
    genres: [
      'Nonfiiction',
      'Poetry',
      'Prose',
      'Essays',
      'Visual Art',
      'Personal Narratives',
    ],
    themes: ['The Future'],
    triggers: [],
    publishedDate: new Date('2024-05-30'),
    programs: ['OB'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.ZINE,
    photoUrl:
      'https://c4c-826boston-dev.s3.us-east-1.amazonaws.com/images/RUBIX.webp',
    sponsors: [],
  },
];
