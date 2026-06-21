export interface StorySeedItem {
  id?: number;
  title: string;
  description?: string;
  studentBio?: string;
  theme?: string;
  anthology_id: number;
  author_id: number;
  story_draft_id?: number;
}

export const StoriesSeed: StorySeedItem[] = [
  {
    title: 'Standing at the Threshold',
    description:
      'A reflection on crossing borders — geographic, cultural, and emotional — and what it means to build a new home while carrying the old one.',
    studentBio:
      'Abdullah is a 9th-grade student at Riverside International High School. He came to Boston from Karachi, Pakistan in 2023.',
    theme: 'Immigration and Belonging',
    anthology_id: 1,
    author_id: 1,
    story_draft_id: 1,
  },
  {
    title: 'Saturday Mornings',
    description:
      'A fictional account of a perfect Saturday morning, from the smell of breakfast to the last light of afternoon.',
    studentBio: 'Sylvestre is an 8th-grade student at Westbrook Middle School.',
    theme: 'Childhood and Joy',
    anthology_id: 2,
    author_id: 2,
    story_draft_id: 2,
  },
  {
    title: 'The River Remembers',
    description:
      'A bilingual poem exploring the relationship between a river in Ecuador and one in Boston, connected by memory and longing.',
    studentBio:
      'Marcus is a 10th-grade student with a passion for bilingual poetry.',
    theme: 'Heritage and Water',
    anthology_id: 3,
    author_id: 3,
    story_draft_id: 3,
  },
  {
    title: 'Borrowed Words',
    description:
      'An essay exploring the ethics of cultural borrowing in music, fashion, and language — where does inspiration end and appropriation begin?',
    studentBio:
      'Fatima is a 9th-grade student who has been writing since she was seven.',
    theme: 'Culture and Ownership',
    anthology_id: 4,
    author_id: 4,
  },
  {
    title: '3:17 AM',
    description:
      'Flash fiction about the strange clarity that comes at 3AM when the world is quiet and the mind is loudest.',
    studentBio: 'Diego is a 10th-grade YLAB member from Muñiz Academy.',
    theme: 'Insomnia and Clarity',
    anthology_id: 5,
    author_id: 5,
  },
  {
    title: 'The Strategic Seat',
    description:
      'A humorous survival guide to navigating the cafeteria seating chart — a delicate social ecosystem with its own unwritten laws.',
    studentBio:
      'Amara is an 11th-grade student who once survived a catastrophic seating incident.',
    theme: 'Social Dynamics',
    anthology_id: 6,
    author_id: 6,
  },
  {
    title: 'Dear Nobody',
    description:
      'A letter to the version of herself she had to leave behind when her grandmother passed away.',
    studentBio: 'Elena is a 9th-grade student at Eastfield Academy.',
    theme: 'Grief and Healing',
    anthology_id: 7,
    author_id: 7,
    story_draft_id: 1,
  },
  {
    title: 'After the Flood',
    description:
      'A scene from a devised theater piece about four teenagers navigating the aftermath of a catastrophic flood in their fictional coastal city.',
    studentBio:
      'Jamal is a 12th-grade playwright and Youth Arts & Books Program alumnus.',
    theme: 'Community and Resilience',
    anthology_id: 8,
    author_id: 8,
    story_draft_id: 2,
  },
  {
    title: 'The Beat of Memory',
    description:
      'An essay pairing a family playlist with a memoir — each song a chapter in a life told through sound.',
    studentBio:
      'Abdullah expanded his writing practice from personal narrative to music criticism this year.',
    theme: 'Music and Identity',
    anthology_id: 9,
    author_id: 1,
    story_draft_id: 3,
  },
  {
    title: 'Weather Report: 2075',
    description:
      'A speculative flash fiction piece formatted as a weather forecast for an emotional climate fifty years in the future.',
    studentBio:
      'Sylvestre is fascinated by speculative fiction and climate futures.',
    theme: 'The Future and Prediction',
    anthology_id: 10,
    author_id: 2,
  },
];
