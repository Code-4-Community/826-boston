import { OmchaiRole } from '../omchai/omchai.entity';

export interface OmchaiSeedItem {
  anthologyTitle: string;
  userEmail: string;
  role: OmchaiRole;
  datetimeAssigned: Date;
}

export const OmchaiSeed: OmchaiSeedItem[] = [
  // Anthology 1 (Voices From the Threshold) — all 6 roles
  {
    anthologyTitle: 'Voices From the Threshold',
    userEmail: 'richie.jacobs@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-01-15'),
  },
  {
    anthologyTitle: 'Voices From the Threshold',
    userEmail: 'kanyin.brown@gmail.com',
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-01-15'),
  },
  {
    anthologyTitle: 'Voices From the Threshold',
    userEmail: 'mirn.miller@gmail.com',
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-01-15'),
  },
  {
    anthologyTitle: 'Voices From the Threshold',
    userEmail: 'kelly.williams@gmail.com',
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-01-15'),
  },
  {
    anthologyTitle: 'Voices From the Threshold',
    userEmail: 'tony.king@gmail.com',
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2025-01-15'),
  },
  {
    anthologyTitle: 'Voices From the Threshold',
    userEmail: 'jordan.hayes@gmail.com',
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-01-15'),
  },

  // Anthology 2 (The Color of Saturday) — all 6 roles
  {
    anthologyTitle: 'The Color of Saturday',
    userEmail: 'kanyin.brown@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyTitle: 'The Color of Saturday',
    userEmail: 'richie.jacobs@gmail.com',
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyTitle: 'The Color of Saturday',
    userEmail: 'jordan.hayes@gmail.com',
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyTitle: 'The Color of Saturday',
    userEmail: 'alex.rivera@gmail.com',
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyTitle: 'The Color of Saturday',
    userEmail: 'mirn.miller@gmail.com',
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyTitle: 'The Color of Saturday',
    userEmail: 'sam.chen@gmail.com',
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-02-01'),
  },

  // Anthology 3 (What the River Carries) — all 6 roles
  {
    anthologyTitle: 'What the River Carries',
    userEmail: 'mirn.miller@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-02-15'),
  },
  {
    anthologyTitle: 'What the River Carries',
    userEmail: 'richie.jacobs@gmail.com',
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-02-15'),
  },
  {
    anthologyTitle: 'What the River Carries',
    userEmail: 'kanyin.brown@gmail.com',
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-02-15'),
  },
  {
    anthologyTitle: 'What the River Carries',
    userEmail: 'maya.osei@gmail.com',
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-02-15'),
  },
  {
    anthologyTitle: 'What the River Carries',
    userEmail: 'kelly.williams@gmail.com',
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2025-02-15'),
  },
  {
    anthologyTitle: 'What the River Carries',
    userEmail: 'chris.park@gmail.com',
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-02-15'),
  },

  // Anthology 4 (Prism Literary Magazine #14) — all 6 roles
  {
    anthologyTitle: 'Prism Literary Magazine #14: Borrowed and Stolen',
    userEmail: 'richie.jacobs@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-03-01'),
  },
  {
    anthologyTitle: 'Prism Literary Magazine #14: Borrowed and Stolen',
    userEmail: 'kelly.williams@gmail.com',
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-03-01'),
  },
  {
    anthologyTitle: 'Prism Literary Magazine #14: Borrowed and Stolen',
    userEmail: 'tony.king@gmail.com',
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-03-01'),
  },
  {
    anthologyTitle: 'Prism Literary Magazine #14: Borrowed and Stolen',
    userEmail: 'jordan.hayes@gmail.com',
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-03-01'),
  },
  {
    anthologyTitle: 'Prism Literary Magazine #14: Borrowed and Stolen',
    userEmail: 'alex.rivera@gmail.com',
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2025-03-01'),
  },
  {
    anthologyTitle: 'Prism Literary Magazine #14: Borrowed and Stolen',
    userEmail: 'kanyin.brown@gmail.com',
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-03-01'),
  },

  // Anthology 5 (Snapshots at 3AM) — partial
  {
    anthologyTitle: 'Snapshots at 3AM',
    userEmail: 'kanyin.brown@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-10-01'),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userEmail: 'mirn.miller@gmail.com',
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-10-01'),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userEmail: 'sam.chen@gmail.com',
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2024-10-01'),
  },

  // Anthology 8 (Aftershock) — all 6 roles
  {
    anthologyTitle: 'Aftershock',
    userEmail: 'richie.jacobs@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthologyTitle: 'Aftershock',
    userEmail: 'kanyin.brown@gmail.com',
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthologyTitle: 'Aftershock',
    userEmail: 'mirn.miller@gmail.com',
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthologyTitle: 'Aftershock',
    userEmail: 'maya.osei@gmail.com',
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthologyTitle: 'Aftershock',
    userEmail: 'tony.king@gmail.com',
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthologyTitle: 'Aftershock',
    userEmail: 'chris.park@gmail.com',
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2024-09-01'),
  },

  // Anthology 9 (Bright Noise) — partial
  {
    anthologyTitle: 'Bright Noise',
    userEmail: 'kelly.williams@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-01-10'),
  },
  {
    anthologyTitle: 'Bright Noise',
    userEmail: 'richie.jacobs@gmail.com',
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-01-10'),
  },
  {
    anthologyTitle: 'Bright Noise',
    userEmail: 'maya.osei@gmail.com',
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-01-10'),
  },

  // Anthology 12 (Not Guilty) — partial
  {
    anthologyTitle: 'Not Guilty',
    userEmail: 'tony.king@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-11-01'),
  },
  {
    anthologyTitle: 'Not Guilty',
    userEmail: 'richie.jacobs@gmail.com',
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-11-01'),
  },
  {
    anthologyTitle: 'Not Guilty',
    userEmail: 'kanyin.brown@gmail.com',
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2024-11-01'),
  },
  {
    anthologyTitle: 'Not Guilty',
    userEmail: 'jordan.hayes@gmail.com',
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2024-11-01'),
  },

  // Anthology 13 (Unlocked) — partial
  {
    anthologyTitle: 'Unlocked',
    userEmail: 'jordan.hayes@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-01-20'),
  },
  {
    anthologyTitle: 'Unlocked',
    userEmail: 'alex.rivera@gmail.com',
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-01-20'),
  },
  {
    anthologyTitle: 'Unlocked',
    userEmail: 'richie.jacobs@gmail.com',
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-01-20'),
  },

  // Anthology 14 (Burn and Bloom) — partial
  {
    anthologyTitle: 'Burn and Bloom',
    userEmail: 'richie.jacobs@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-10-15'),
  },
  {
    anthologyTitle: 'Burn and Bloom',
    userEmail: 'sam.chen@gmail.com',
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-10-15'),
  },
  {
    anthologyTitle: 'Burn and Bloom',
    userEmail: 'kanyin.brown@gmail.com',
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2024-10-15'),
  },

  // Anthology 6 (How to Survive a Cafeteria)
  {
    anthologyTitle: 'How to Survive a Cafeteria',
    userEmail: 'mirn.miller@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyTitle: 'How to Survive a Cafeteria',
    userEmail: 'alex.rivera@gmail.com',
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyTitle: 'How to Survive a Cafeteria',
    userEmail: 'chris.park@gmail.com',
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-02-01'),
  },

  // Anthology 7 (Letters to Nobody)
  {
    anthologyTitle: 'Letters to Nobody',
    userEmail: 'alex.rivera@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-11-15'),
  },
  {
    anthologyTitle: 'Letters to Nobody',
    userEmail: 'kanyin.brown@gmail.com',
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-11-15'),
  },
  {
    anthologyTitle: 'Letters to Nobody',
    userEmail: 'tony.king@gmail.com',
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2024-11-15'),
  },
  // Anthology 10 (Tomorrow's Almanac)
  {
    anthologyTitle: "Tomorrow's Almanac",
    userEmail: 'kelly.williams@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-12-01'),
  },
  {
    anthologyTitle: "Tomorrow's Almanac",
    userEmail: 'sam.chen@gmail.com',
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2024-12-01'),
  },
  {
    anthologyTitle: "Tomorrow's Almanac",
    userEmail: 'kanyin.brown@gmail.com',
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2024-12-01'),
  },

  // Anthology 11 (Prism Literary Magazine #15: Memory Palace)
  {
    anthologyTitle: 'Prism Literary Magazine #15: Memory Palace',
    userEmail: 'tony.king@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-09-01'),
  },
  {
    anthologyTitle: 'Prism Literary Magazine #15: Memory Palace',
    userEmail: 'jordan.hayes@gmail.com',
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-09-01'),
  },
  {
    anthologyTitle: 'Prism Literary Magazine #15: Memory Palace',
    userEmail: 'mirn.miller@gmail.com',
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-09-01'),
  },

  // Anthology 15 (Civic Creatures)
  {
    anthologyTitle: 'Civic Creatures',
    userEmail: 'sam.chen@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-12-10'),
  },
  {
    anthologyTitle: 'Civic Creatures',
    userEmail: 'kelly.williams@gmail.com',
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2024-12-10'),
  },
  {
    anthologyTitle: 'Civic Creatures',
    userEmail: 'alex.rivera@gmail.com',
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2024-12-10'),
  },

  // Anthology 16 (The Weight of a Suitcase)
  {
    anthologyTitle: 'The Weight of a Suitcase',
    userEmail: 'maya.osei@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-08-01'),
  },
  {
    anthologyTitle: 'The Weight of a Suitcase',
    userEmail: 'richie.jacobs@gmail.com',
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-08-01'),
  },
  {
    anthologyTitle: 'The Weight of a Suitcase',
    userEmail: 'jordan.hayes@gmail.com',
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2024-08-01'),
  },

  // Anthology 17 (Every Map Lies)
  {
    anthologyTitle: 'Every Map Lies',
    userEmail: 'chris.park@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-01-05'),
  },
  {
    anthologyTitle: 'Every Map Lies',
    userEmail: 'alex.rivera@gmail.com',
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-01-05'),
  },
  {
    anthologyTitle: 'Every Map Lies',
    userEmail: 'mirn.miller@gmail.com',
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-01-05'),
  },

  // Anthology 18 (The Night Kitchen)
  {
    anthologyTitle: 'The Night Kitchen',
    userEmail: 'jordan.hayes@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-10-20'),
  },
  {
    anthologyTitle: 'The Night Kitchen',
    userEmail: 'maya.osei@gmail.com',
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2024-10-20'),
  },
  {
    anthologyTitle: 'The Night Kitchen',
    userEmail: 'kelly.williams@gmail.com',
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2024-10-20'),
  },

  // Anthology 19 (Hard Pivot)
  {
    anthologyTitle: 'Hard Pivot',
    userEmail: 'alex.rivera@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-01-08'),
  },
  {
    anthologyTitle: 'Hard Pivot',
    userEmail: 'tony.king@gmail.com',
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-01-08'),
  },
  {
    anthologyTitle: 'Hard Pivot',
    userEmail: 'sam.chen@gmail.com',
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-01-08'),
  },

  // Anthology 20 (The Space Between Languages)
  {
    anthologyTitle: 'The Space Between Languages',
    userEmail: 'mirn.miller@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-02-10'),
  },
  {
    anthologyTitle: 'The Space Between Languages',
    userEmail: 'chris.park@gmail.com',
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-02-10'),
  },
  {
    anthologyTitle: 'The Space Between Languages',
    userEmail: 'kanyin.brown@gmail.com',
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2025-02-10'),
  },

  // Anthology 21 (Hallway Dispatches) — new ZINE
  {
    anthologyTitle: 'Hallway Dispatches',
    userEmail: 'kanyin.brown@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-07-01'),
  },
  {
    anthologyTitle: 'Hallway Dispatches',
    userEmail: 'maya.osei@gmail.com',
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-07-01'),
  },

  // Anthology 22 (Field Notes From the T) — new ZINE
  {
    anthologyTitle: 'Field Notes From the T',
    userEmail: 'kelly.williams@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-07-15'),
  },
  {
    anthologyTitle: 'Field Notes From the T',
    userEmail: 'mirn.miller@gmail.com',
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-07-15'),
  },

  // Anthology 5 — full set of roles with multi-user entries
  {
    anthologyTitle: 'Snapshots at 3AM',
    userEmail: 'richie.jacobs@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userEmail: 'mirn.miller@gmail.com',
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userEmail: 'jordan.hayes@gmail.com',
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userEmail: 'kelly.williams@gmail.com',
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date(),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userEmail: 'tony.king@gmail.com',
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date(),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userEmail: 'jordan.hayes@gmail.com',
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userEmail: 'jordan.hayes@gmail.com',
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userEmail: 'kanyin.brown@gmail.com',
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userEmail: 'tony.king@gmail.com',
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date(),
  },
  {
    anthologyTitle: 'Snapshots at 3AM',
    userEmail: 'richie.jacobs@gmail.com',
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date(),
  },
  {
    anthologyTitle: 'Aftershock',
    userEmail: 'richie.jacobs@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthologyTitle: 'Civic Creatures',
    userEmail: 'gauri.ggsr@gmail.com',
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthologyTitle: 'Letters to Nobody',
    userEmail: 'gauri.ggsr@gmail.com',
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2024-09-01'),
  },
];
