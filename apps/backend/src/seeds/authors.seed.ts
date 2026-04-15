interface AuthorSeedItem {
  name: string;
  classPeriod: string;
  nameInBook?: string;
  bio?: string;
  grade?: number;
}

export const AuthorsSeed: AuthorSeedItem[] = [
  {
    name: 'Abdullah Syed Abid',
    classPeriod: 'Block A',
    nameInBook: 'Abdullah',
    grade: 9,
    bio: '9th-grade student at Riverside International High School. He came to Boston from Karachi, Pakistan in 2023.',
  },
  {
    name: 'Sylvestre Ahday',
    classPeriod: 'Block A',
    grade: 9,
  },
  {
    name: 'Marcus Chen',
    classPeriod: 'Block B',
    grade: 10,
    bio: "10th-grade student at O'Bryant School of Mathematics and Science with a passion for bilingual poetry.",
  },
  {
    name: 'Fatima Al-Rashid',
    classPeriod: 'Block C',
    grade: 9,
    bio: '9th-grade student at Margarita Muñiz Academy. She has been writing since she was seven.',
  },
  {
    name: 'Diego Ramirez',
    classPeriod: 'Block D',
    nameInBook: 'Diego',
    grade: 10,
    bio: '10th-grade bilingual student and Youth Literary Advisory Board member.',
  },
  {
    name: 'Amara Osei',
    classPeriod: 'Block E',
    grade: 11,
    bio: '11th-grade student and member of the Youth Literary Advisory Board.',
  },
  {
    name: 'Elena Kowalski',
    classPeriod: 'Block F',
    grade: 9,
    bio: '9th-grade student at Eastfield Academy.',
  },
  {
    name: 'Jamal Washington',
    classPeriod: 'Block G',
    nameInBook: 'Jay',
    grade: 12,
    bio: '12th-grade student, aspiring playwright, and Youth Arts & Books Program alumnus.',
  },
];
