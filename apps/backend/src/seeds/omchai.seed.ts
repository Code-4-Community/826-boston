import { OmchaiRole } from '../omchai/omchai.entity';

export interface OmchaiSeedItem {
  anthologyTitle: string;
  userId: number;
  role: OmchaiRole;
  datetimeAssigned: Date;
}

export const OmchaiSeed: OmchaiSeedItem[] = [
  // Anthology 1 (Voices From the Threshold) — all 6 roles
  {
    anthologyTitle: 'Voices From the Threshold',
    userId: 1,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-01-15'),
  },
  {
    anthologyTitle: 'Voices From the Threshold',
    userId: 2,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-01-15'),
  },
  {
    anthologyTitle: 'Voices From the Threshold',
    userId: 3,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-01-15'),
  },
  {
    anthologyTitle: 'Voices From the Threshold',
    userId: 4,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-01-15'),
  },
  {
    anthologyTitle: 'Voices From the Threshold',
    userId: 5,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2025-01-15'),
  },
  {
    anthologyTitle: 'Voices From the Threshold',
    userId: 6,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-01-15'),
  },

  // Anthology 2 (The Color of Saturday) — all 6 roles
  {
    anthologyTitle: 'The Color of Saturday',
    userId: 2,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyTitle: 'The Color of Saturday',
    userId: 1,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyTitle: 'The Color of Saturday',
    userId: 6,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyTitle: 'The Color of Saturday',
    userId: 7,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyTitle: 'The Color of Saturday',
    userId: 3,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyTitle: 'The Color of Saturday',
    userId: 8,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-02-01'),
  },

  // Anthology 3 (What the River Carries) — all 6 roles
  {
    anthologyTitle: 'What the River Carries',
    userId: 3,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-02-15'),
  },
  {
    anthologyTitle: 'What the River Carries',
    userId: 1,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-02-15'),
  },
  {
    anthologyTitle: 'What the River Carries',
    userId: 2,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-02-15'),
  },
  {
    anthologyTitle: 'What the River Carries',
    userId: 9,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-02-15'),
  },
  {
    anthologyTitle: 'What the River Carries',
    userId: 4,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2025-02-15'),
  },
  {
    anthologyTitle: 'What the River Carries',
    userId: 10,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-02-15'),
  },

  // Anthology 4 (Prism Literary Magazine #14) — all 6 roles
  {
    anthologyTitle: 'Prism Literary Magazine #14: Borrowed and Stolen',
    userId: 1,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-03-01'),
  },
  {
    anthologyTitle: 'Prism Literary Magazine #14: Borrowed and Stolen',
    userId: 4,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-03-01'),
  },
  {
    anthologyTitle: 'Prism Literary Magazine #14: Borrowed and Stolen',
    userId: 5,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-03-01'),
  },
  {
    anthologyTitle: 'Prism Literary Magazine #14: Borrowed and Stolen',
    userId: 6,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-03-01'),
  },
  {
    anthologyTitle: 'Prism Literary Magazine #14: Borrowed and Stolen',
    userId: 7,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2025-03-01'),
  },
  {
    anthologyTitle: 'Prism Literary Magazine #14: Borrowed and Stolen',
    userId: 2,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-03-01'),
  },

  // Anthology 5 (Snapshots at 3AM) — partial
  {
    anthologyTitle: 'Snapshots at 3AM',
    userId: 2,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-10-01'),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userId: 3,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-10-01'),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userId: 8,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2024-10-01'),
  },

  // Anthology 8 (Aftershock) — all 6 roles
  {
    anthologyTitle: 'Aftershock',
    userId: 1,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthologyTitle: 'Aftershock',
    userId: 2,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthologyTitle: 'Aftershock',
    userId: 3,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthologyTitle: 'Aftershock',
    userId: 9,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthologyTitle: 'Aftershock',
    userId: 5,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthologyTitle: 'Aftershock',
    userId: 10,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2024-09-01'),
  },

  // Anthology 9 (Bright Noise) — partial
  {
    anthologyTitle: 'Bright Noise',
    userId: 4,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-01-10'),
  },
  {
    anthologyTitle: 'Bright Noise',
    userId: 1,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-01-10'),
  },
  {
    anthologyTitle: 'Bright Noise',
    userId: 9,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-01-10'),
  },

  // Anthology 12 (Not Guilty) — partial
  {
    anthologyTitle: 'Not Guilty',
    userId: 5,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-11-01'),
  },
  {
    anthologyTitle: 'Not Guilty',
    userId: 1,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-11-01'),
  },
  {
    anthologyTitle: 'Not Guilty',
    userId: 2,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2024-11-01'),
  },
  {
    anthologyTitle: 'Not Guilty',
    userId: 6,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2024-11-01'),
  },

  // Anthology 13 (Unlocked) — partial
  {
    anthologyTitle: 'Unlocked',
    userId: 6,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-01-20'),
  },
  {
    anthologyTitle: 'Unlocked',
    userId: 7,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-01-20'),
  },
  {
    anthologyTitle: 'Unlocked',
    userId: 1,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-01-20'),
  },

  // Anthology 14 (Burn and Bloom) — partial
  {
    anthologyTitle: 'Burn and Bloom',
    userId: 1,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-10-15'),
  },
  {
    anthologyTitle: 'Burn and Bloom',
    userId: 8,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-10-15'),
  },
  {
    anthologyTitle: 'Burn and Bloom',
    userId: 2,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2024-10-15'),
  },

  // Anthology 6 (How to Survive a Cafeteria)
  {
    anthologyTitle: 'How to Survive a Cafeteria',
    userId: 3,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyTitle: 'How to Survive a Cafeteria',
    userId: 7,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyTitle: 'How to Survive a Cafeteria',
    userId: 10,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-02-01'),
  },

  // Anthology 7 (Letters to Nobody)
  {
    anthologyTitle: 'Letters to Nobody',
    userId: 7,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-11-15'),
  },
  {
    anthologyTitle: 'Letters to Nobody',
    userId: 2,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-11-15'),
  },
  {
    anthologyTitle: 'Letters to Nobody',
    userId: 5,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2024-11-15'),
  },

  // Anthology 10 (Tomorrow's Almanac)
  {
    anthologyTitle: "Tomorrow's Almanac",
    userId: 4,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-12-01'),
  },
  {
    anthologyTitle: "Tomorrow's Almanac",
    userId: 8,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2024-12-01'),
  },
  {
    anthologyTitle: "Tomorrow's Almanac",
    userId: 2,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2024-12-01'),
  },

  // Anthology 11 (Prism Literary Magazine #15: Memory Palace)
  {
    anthologyTitle: 'Prism Literary Magazine #15: Memory Palace',
    userId: 5,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-09-01'),
  },
  {
    anthologyTitle: 'Prism Literary Magazine #15: Memory Palace',
    userId: 6,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-09-01'),
  },
  {
    anthologyTitle: 'Prism Literary Magazine #15: Memory Palace',
    userId: 3,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-09-01'),
  },

  // Anthology 15 (Civic Creatures)
  {
    anthologyTitle: 'Civic Creatures',
    userId: 8,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-12-10'),
  },
  {
    anthologyTitle: 'Civic Creatures',
    userId: 4,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2024-12-10'),
  },
  {
    anthologyTitle: 'Civic Creatures',
    userId: 7,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2024-12-10'),
  },

  // Anthology 16 (The Weight of a Suitcase)
  {
    anthologyTitle: 'The Weight of a Suitcase',
    userId: 9,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-08-01'),
  },
  {
    anthologyTitle: 'The Weight of a Suitcase',
    userId: 1,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-08-01'),
  },
  {
    anthologyTitle: 'The Weight of a Suitcase',
    userId: 6,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2024-08-01'),
  },

  // Anthology 17 (Every Map Lies)
  {
    anthologyTitle: 'Every Map Lies',
    userId: 10,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-01-05'),
  },
  {
    anthologyTitle: 'Every Map Lies',
    userId: 7,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-01-05'),
  },
  {
    anthologyTitle: 'Every Map Lies',
    userId: 3,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-01-05'),
  },

  // Anthology 18 (The Night Kitchen)
  {
    anthologyTitle: 'The Night Kitchen',
    userId: 6,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-10-20'),
  },
  {
    anthologyTitle: 'The Night Kitchen',
    userId: 9,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2024-10-20'),
  },
  {
    anthologyTitle: 'The Night Kitchen',
    userId: 4,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2024-10-20'),
  },

  // Anthology 19 (Hard Pivot)
  {
    anthologyTitle: 'Hard Pivot',
    userId: 7,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-01-08'),
  },
  {
    anthologyTitle: 'Hard Pivot',
    userId: 5,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-01-08'),
  },
  {
    anthologyTitle: 'Hard Pivot',
    userId: 8,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-01-08'),
  },

  // Anthology 20 (The Space Between Languages)
  {
    anthologyTitle: 'The Space Between Languages',
    userId: 3,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-02-10'),
  },
  {
    anthologyTitle: 'The Space Between Languages',
    userId: 10,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-02-10'),
  },
  {
    anthologyTitle: 'The Space Between Languages',
    userId: 2,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2025-02-10'),
  },

  // Anthology 21 (Hallway Dispatches) — new ZINE
  {
    anthologyTitle: 'Hallway Dispatches',
    userId: 2,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-07-01'),
  },
  {
    anthologyTitle: 'Hallway Dispatches',
    userId: 9,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-07-01'),
  },

  // Anthology 22 (Field Notes From the T) — new ZINE
  {
    anthologyTitle: 'Field Notes From the T',
    userId: 4,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-07-15'),
  },
  {
    anthologyTitle: 'Field Notes From the T',
    userId: 3,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-07-15'),
  },

  // Anthology 5 — full set of roles with multi-user entries
  {
    anthologyTitle: 'Snapshots at 3AM',
    userId: 1,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userId: 3,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userId: 6,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userId: 4,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date(),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userId: 5,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date(),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userId: 7,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userId: 6,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userId: 2,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userId: 5,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date(),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userId: 1,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date(),
  },
];
