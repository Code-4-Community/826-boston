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
  {
    title: 'I Closed My Eyes and Imagined',
    byline:
      'Graduating Student Leaders from The Rafael Hernández School and Margarita Muñiz Academy',
    subtitle: 'Visions for a Better Boston',
    description:
      '“I take inspiration—and comfort—in the fact that your generation is taking hold of the mic, taking hold of the pen, and already writing op-eds to express your ideas and beliefs. There is a tremendous sense of power in taking up space on the page and in reclaiming a story that doesn’t include you…yet.” Jennifer De Leon, professor, speaker, and author of Don’t Ask Me Where I’m From (2020).',
    genres: ['Civic Engagement', 'Nonfiction', 'Opinion', 'Politics'],
    themes: [
      'City',
      'Environment',
      'Family',
      'Neighborhood',
      'School',
      'Work/Career',
    ],
    triggers: [],
    publishedDate: new Date('2021-05-01'),
    programs: ['YABP'],
    sponsors: ['Mass Cultural Council', 'The Spark Foundation'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.SIGNATURE,
    isbn: '978-1-948644-81-5',
  },
  {
    title: 'All Kinds of Flavor',
    byline: 'Sixth-Grade Students from the Boston Teachers Union School',
    subtitle: 'A World of Recipes with a Dash of Math',
    description:
      'Stories, Poems, and Word Problems Written by Sixth-Grade Students from the Boston Teachers Union School ”Within these food stories and recipes are glimpses of culture and tradition that are oftentimes lost or misunderstood or overlooked—from a food perspective they have certainly been devalued in academia for most of history.” —Jerrelle Guy, Author of “Black Girl Baking: Wholesome Recipes Inspired by a Soulful Upbringing”',
    genres: ['Fiction', 'Multicultural', 'Recipes'],
    themes: ['Creative Writing', 'Recipes'],
    triggers: [],
    publishedDate: new Date('2018-06-30'),
    programs: ['BTU'],
    sponsors: [],
    status: AnthologyStatus.ARCHIVED,
    pubLevel: AnthologyPubLevel.SIGNATURE,
    isbn: '978-1-948644-17-4',
  },
  {
    title: 'It’s Not The Stone That Brings You Strength',
    byline:
      'Written by 11th Grade Students at the John D. O’Bryant School of Mathematics and Science',
    subtitle: 'Myths Discovered, Unraveled, and Retold',
    description:
      'Thank you, dear writers, for setting your fingers to the keyboard or your pen to the paper, for issuing me a license to fly, and for providing me a map and destination. — Gregory Maguire, bestselling author of Wicked: The Life and Times of the Wicked Witch of the West',
    genres: ['Identity', 'Multicultural', 'Personal Narratives'],
    themes: ['Cultural Myths', 'Culture'],
    triggers: [],
    publishedDate: new Date('2014-06-30'),
    programs: ['OB'],
    sponsors: ['National Endowment for the Arts'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.SIGNATURE,
    isbn: '978-1-934750-51-3',
  },
  {
    title: 'Like the Sun in Dark Spaces',
    byline:
      'Written by 12th graders from Boston International Newcomers Academy',
    subtitle: 'Narratives Across Generations and Continents',
    description:
      '“We learn from these pieces what it means to leave an entire life behind in one country, a life sweetened by the pungent aromas of particular food and particular ways of being. We learn what it is to have to remake a life in a new country. We learn of the sacrifices parents make for children, and the choices one must make for oneself.” Danielle Legros Georges Poet Laureate of the City of Boston',
    genres: [
      'Civic Engagement',
      'Essays',
      'Identity',
      'Multicultural',
      'Multilingual',
      'Personal Narratives',
      'Politics',
    ],
    themes: ['Culture', 'Hopes', 'Identity', 'Overcoming', 'Short Stories'],
    triggers: [],
    publishedDate: new Date('2018-06-30'),
    programs: ['BINcA'],
    sponsors: [
      'Eastern Bank Foundation',
      'Friends and Family of Caitlin M. Warde',
      'Mass Cultural Council',
    ],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.SIGNATURE,
    isbn: '978-1-948644-08-2',
  },
  {
    title: 'With a Crunch and a Slurp',
    byline:
      'Tenth-Grade Students from the John D. O’Bryant School of Mathematics and Science',
    subtitle: 'Our Favorite Recipes, Remixed',
    description:
      'One of my favorite concepts is that food is both life and community, and reading the work from the students drives both of these points home in a manner that is both entertaining and inspiring.',
    genres: ['Nonfiction', 'Recipes'],
    themes: ['Diaries', 'Food', 'Recipes'],
    triggers: [],
    publishedDate: new Date('2016-08-12'),
    programs: ['OB'],
    sponsors: [],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.SIGNATURE,
    isbn: '978-1-948644-16-7',
  },
  {
    title: 'A Long Walk To Healthy',
    byline:
      'Written by Eleventh and Twelfth-Grade Students at the Jeremiah E. Burke High School',
    subtitle: 'Why Access to Nutritious Food Matters',
    description:
      '“826 Boston student authors bring questions and insight to one of the most foundational aspects of our health and cultural identity: food. They’re calling out those responsible for breaking our food system and they offer their take on how to build it back up to nurture the health of their communities.” —Josh Trautwein, Fresh Truck Co-Founder & Executive Director',
    genres: [
      'Civic Engagement',
      'Essays',
      'Informational',
      'Journalism',
      'News',
      'Nonfiction',
      'Opinion',
      'Politics',
    ],
    themes: ['Culture', 'Food', 'Healthy Foods', 'Recipes'],
    triggers: [],
    publishedDate: new Date('2018-06-30'),
    programs: ['Holland (Burke)'],
    sponsors: ['Anonymous through 826 National', 'Mass Cultural Council'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.PERFECT_BOUND,
    isbn: '978-1-948644-09-9',
  },
  {
    title: 'Before This Place Filled with Zombies',
    byline:
      'Ninth-Grade Students From Edward M. Kennedy Academy for Health Careers',
    subtitle:
      'Ninth-Grade Students From Edward M. Kennedy Academy for Health Careers Take a Fictional Look at the Legacy of Isabella Stewart Gardner',
    description:
      '“It is such pleasure to realize that these young writers from Kennedy Academy had done the same thing—imagined the stories hidden behind a work of art—that had so intrigued me both as a child and much later as a grown-up writer. They looked at something. Look at it carefully. Studied it and saw the layered story within the flat surface of a piece of art.” -Lois Lowry',
    genres: ['Fantasy', 'Fiction', 'Horror', 'Short Stories'],
    themes: [
      'Coming of Age',
      'Dreams',
      'Family',
      'Mystery',
      'Nightmares',
      'Short Stories',
      'Spooky Stories',
      'The Future',
    ],
    triggers: [],
    publishedDate: new Date('2013-06-30'),
    programs: ['EMK'],
    sponsors: [],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.SIGNATURE,
    isbn: '978-1-934750-44-5',
  },
  {
    title: 'I’m a Flame You Can’t Put Out',
    byline:
      'Poems in English and Spanish by 5th Graders from the Rafael Hernández School',
    subtitle: 'Soy Una Llama Que No Puedes Apagar',
    description:
      '“To know two languages is to understand the world in two distinct ways. Dive into this collection and enjoy these young, robust voices with twice the character, twice the spirit, twice the joy.” — Richard Blanco, 5th inaugural poet of the United States',
    genres: ['Multicultural', 'Multilingual', 'Poetry'],
    themes: ['Creative Writing', 'Culture', 'Identity', 'Neighborhood'],
    triggers: [],
    publishedDate: new Date('2014-06-30'),
    programs: ['Hernández'],
    sponsors: ['Boston Cultural Council', 'Mass Cultural Council'],
    status: AnthologyStatus.ARCHIVED,
    pubLevel: AnthologyPubLevel.SIGNATURE,
    isbn: '978-1-934750-47-6',
  },
  {
    title: 'My Generation Can',
    byline:
      'Written by 12th Graders at the E. M. Kennedy Academy for Health Careers Foreword by Sonia Chang-Díaz, Massachusetts State Senator',
    subtitle: 'Public Narratives for Community Change',
    description:
      '“This book is a powerful ode to the power, intelligence, and capacity of young people around us. May their word sre-center us to the foundational commitments we owe to one another—and ignite in all of us the courage to turn our ideals into action today.” Sonia Chang-Díaz Massachusetts State Senator',
    genres: ['Civic Engagement', 'Essays', 'Opinion', 'Personal Narratives'],
    themes: [
      'City',
      'Health and Wellness',
      'Marginalization',
      'Policing and Gun Violence',
    ],
    triggers: [],
    publishedDate: new Date('2019-06-30'),
    programs: ['EMK'],
    sponsors: ['Mass Cultural Council'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.PERFECT_BOUND,
    isbn: '978-1-948644-35-8',
  },
  {
    title: 'What if the World Needs You?',
    byline: 'From 826 Boston Students',
    subtitle: 'Advice and Life Lessons from 826 Boston Students',
    description:
      'Discover a world where wisdom and whimsy collide in this captivating anthology from 826 Boston. Each story offers a unique piece of advice, from reimagined Greek myths to thought-provoking advice columns. Get ready to be challenged, moved, and inspired by these young voices’ raw creativity and fearless storytelling!',
    genres: ['Advice'],
    themes: ['Creative Writing', 'Short Stories'],
    triggers: [],
    publishedDate: new Date('2024-05-31'),
    programs: ['YABP'],
    sponsors: ['Tiny Tiger Foundation'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.SIGNATURE,
    isbn: '979-8-88694-056-5',
  },
  {
    title: '85 Cents Might Not Sound Like a Lot',
    byline:
      'Students from the Jeremiah E. Burke and John D. O’Bryant High Schools',
    subtitle: 'Our Vision for the Future of the Transportation System',
    description:
      'Using science, math, and writing, these students are shaping up to be leaders in transportation and effective advocates for more prosperous, sustainable, and equitable communities.',
    genres: ['Civic Engagement', 'Fiction', 'Nonfiction'],
    themes: ['Transportation'],
    triggers: [],
    publishedDate: new Date('2017-06-30'),
    programs: ['Holland (Burke)', 'OB'],
    sponsors: [],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.SIGNATURE,
    isbn: '978-1-934750-92-6',
  },
  {
    title: 'I Was Meant For This',
    byline: 'By Boston’s Young Leaders',
    subtitle: 'Mayoral Speeches',
    description:
      'Boston’s 2021 mayoral election was a competitive race with more ethnically and racially diverse candidates than ever before. In I Was Meant for This students of all ages give their own inaugural addresses as Boston’s mayor-elect. These speeches—simultaneously playful, imaginative, and keenly observed—speak to an evolving city, as told through the eyes of tomorrow’s leaders. ”These are the speeches—and the voices—of young people who know that they matter, and that their thoughts and dreams matter. We should want that for all young people in every neighborhood of our city. I hope you enjoy their writing, and their thinking, as much as I did. We need their voices more than ever. And to our young mayoral candidates and essayists I say: Please keep writing. And please keep dreaming.” Adrian Walker Columnist/Associate Editor, The Boston Globe',
    genres: ['Civic Engagement', 'Politics', 'Speeches'],
    themes: ['Leadership', 'Neighborhood', 'The Future'],
    triggers: [],
    publishedDate: new Date('2022-02-28'),
    programs: ['YABP'],
    sponsors: [
      'Mass Cultural Council',
      'New England Foundation for the Arts',
      'Richard K. Lubin Family Foundation',
    ],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.SIGNATURE,
    isbn: '978-1-948644-89-1',
  },
  {
    title: 'We Think You’re Old Enough to Know',
    byline:
      'By the students of the John D. O’Bryant High School of Mathematics and Science',
    subtitle:
      'Coming-of-age stories by the students of the John D. O’Bryant High School of Mathematics and Science in collaboration with 826 Boston',
    description:
      'Open This Book & Behold! 61 Stories (in full color!) of Belonging/Defiance/Family/Sorrow/Relationships By the Talented Students from the John D. O’Bryant High School in Roxbury, Massachusetts, USA. Read tales of: pink shoe fetishes; troublesome kids; diners of doom; feeling out of place; poor costume choices; tough neighborhoods; forbidden romance; leaving home for good; first kisses; & much more! Steve Carell says… This smart, honest, touching collection by talented teen writers addresses the universal yearning to belong, to feel proud of the ones we love, and to love ourselves. You would think these things would come naturally, but really, they don’t. Especially not in high school.',
    genres: ['Fiction', 'Nonfiction', 'Short Stories'],
    themes: [
      'Belonging',
      'Coming of Age',
      'Defiance',
      'Family',
      'Relationships',
      'Sorrow',
    ],
    triggers: ['Death or Dying', 'Self-Harm and/or Suicide'],
    publishedDate: new Date('2011-06-30'),
    programs: ['OB'],
    sponsors: [
      'Artco Printing',
      'Continuum',
      'Local Motion',
      'Sappi Paper & the Ideas that Matter Program',
    ],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.PERFECT_BOUND,
    isbn: '978-1-934750-23-0',
  },
  {
    title: 'We Turned Back to See Where We Came From',
    byline: 'By the Students of Greater Egleston High School',
    subtitle: 'Snapshots, Vignettes, and Stories',
    description:
      '“When you trust that inner voice as a voice of power, then you let it take you where the story needs to go…That is the kind of honesty I see in the writings of these student authors. Visceral. Honest. Gut powerful and gut wrenching.” - Maria Hinojosa, Senior correspondent for NOW on PBS and author of Crews and Raising Raul',
    genres: ['Photography', 'Poetry', 'Prose', 'Short Stories', 'Visual Art'],
    themes: ['Culture', 'Family', 'Identity', 'Neighborhood'],
    triggers: [],
    publishedDate: new Date('2010-06-30'),
    programs: ['After-School Tutoring', 'OOST'],
    sponsors: ['Boston Cultural Council', 'Ludcke Foundation'],
    status: AnthologyStatus.ARCHIVED,
    pubLevel: AnthologyPubLevel.SIGNATURE,
    isbn: '978-1-934750-16-2',
  },
  {
    title: 'I Rate Today a -1,000',
    byline:
      'Written by the students of 826 Boston’s Grove Hall and Egleston Square after-school tutoring programs',
    subtitle: 'Diary Entries About Days Good & Bad From Across Time & Space',
    description:
      '“Growing up, the most magical words I ever heard an adult say were, “When I was a kid…” Because when I heard those words, I knew a story was coming… In the pages of this wonderful book you’ll find the stories of kids who are learning to tell their own truths. They’re capturing their childhoods in these miniature time capsules made up of words and pictures.” — Jeff Kinney, author of Diary of a Wimpy Kid Here you are: sixty-nine diary entries collected from the farthest reaches of this universe (and many others). Inside you’ll find mega-famous celebrities, exciting superheroes, cool kids, three generations of cryptozoologists, Abraham Lincoln, and a sun-loving pinky.',
    genres: [
      'Fantasy',
      'Fiction',
      'Humor',
      'Letters',
      'Personal Narratives',
      'Short Stories',
    ],
    themes: ['Diaries'],
    triggers: [],
    publishedDate: new Date('2015-06-30'),
    programs: ['After-School Tutoring', 'OOST'],
    sponsors: ['Jeff Kinney', 'Julie Kinney'],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.SIGNATURE,
    isbn: '978-1-934750-62-9',
  },
  {
    title: 'Invincible: Book 1',
    byline:
      'By the students of 826 Boston’s Egleston Square After-School Writing and Tutoring Program',
    subtitle: 'Original Writing About Heroes and Villains',
    description:
      'Original hero-and-villain-themed stories and poems written by the students of 826 Boston’s Egleston Square after-school tutoring program. Spring 2019.',
    genres: [
      'Fantasy',
      'Fiction',
      'Heroes and Villains',
      'Poetry',
      'Prose',
      'Short Stories',
    ],
    themes: ['Adventure', 'Superheroes'],
    triggers: [],
    publishedDate: new Date('2019-06-30'),
    programs: ['After-School Tutoring', 'OOST'],
    sponsors: [],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.CHAPBOOK,
  },
  {
    title: 'Oh My Chocolate',
    byline:
      'Written in the Spring of 2012 by 826 Boston’s After-School Students',
    subtitle:
      'Original Bite-Sized Gourmet Stories from a World Made of Chocolate',
    description:
      "826 Boston's after-school students are proud to present their sugary sweet stories, filled with chocolate sicknesses, chocolate disasters, and, of course, the dreaded Chocopocalypse. Nutrition facts: Contains 11.9 g of battles, 2.12 mg of rainbows, 13.33 g of total monsters, and your daily recommended value of happy endings. Net Weight 16.3 Pieces Nutrition Facts Serving Size: 16.3 stories Brownie Points 201 Total Monsters 13.33 g Good Monsters 4.78 g Bad Monsters 8.55 g Brains 7.41 mg Plot Twists 7.41 mg Dramatic Soundtracks 7.12 mg Sugar 63.4 g Battles 11.9 g Rainbows 2.12 mg Happy Endings 6.17 g INGREDIENTS: Marcel, Nadia, Adriana, Saul, Persia, Kelly, Chris, Cole, Jaden, Dalhaysy, Samsam, Ashley, Kevin, Sumaya, Alejandro *Whipped up in a facility that also processes peninsulas, prime factors, proper nouns, protons, and publishers’ proddings. May contain nuts.",
    genres: ['Letters', 'Poetry', 'Short Stories'],
    themes: ['Creative Writing', 'Food'],
    triggers: [],
    publishedDate: new Date('2012-06-30'),
    programs: ['After-School Tutoring', 'OOST'],
    sponsors: [],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.CHAPBOOK,
  },
  {
    title: 'Wait, Whaaa? Where Am I?',
    byline:
      'By the students of 826 Boston’s Egleston Square After-School Writing and Tutoring Program',
    description: 'Original writing about dreams, nightmares, and more',
    genres: ['Fiction', 'Humor', 'Short Stories'],
    themes: ['Creative Writing', 'Dreams', 'Nightmares'],
    triggers: [],
    publishedDate: new Date('2022-06-30'),
    programs: ['After-School Tutoring', 'OOST'],
    sponsors: [],
    status: AnthologyStatus.DRAFT,
    pubLevel: AnthologyPubLevel.CHAPBOOK,
  },
  {
    title: 'Small Things Can Grow Tall',
    byline:
      'From the 11th Grade Students at the English High School in conjunction with 826 Boston',
    subtitle: 'Words from the Underestimated',
    description:
      'A Collection of Essays and Stories ”These stories…feel like miracles, too. I love the energy and the humor, and the sadness and pain. I love how my story, broken into segments that simply enabled me to write past one page, lends the same sort of energy to these young writers.” - Sherman Alexie',
    genres: ['Essays', 'Short Stories'],
    themes: ['Connections', 'Culture', 'Family', 'Identity'],
    triggers: [],
    publishedDate: new Date('2010-06-30'),
    programs: ['EHS'],
    sponsors: [],
    status: AnthologyStatus.ARCHIVED,
    pubLevel: AnthologyPubLevel.CHAPBOOK,
  },
  {
    title: 'Rubix Literary Magazine #9: The Connections Issue',
    byline:
      'Students of the John D. O’Bryant School of Mathematics and Science',
    subtitle: 'Connections',
    description:
      'A literary magazine from the 826 Boston Writers’ Room at the John D. O’Bryant School of Math and Science',
    genres: [
      'Civic Engagement',
      'Fiction',
      'Multicultural',
      'Personal Narratives',
      'Prose',
    ],
    themes: ['Connections'],
    triggers: [],
    publishedDate: new Date('2021-08-12'),
    programs: ['OB'],
    sponsors: [],
    status: AnthologyStatus.PUBLISHED,
    pubLevel: AnthologyPubLevel.PERFECT_BOUND,
  },
];
