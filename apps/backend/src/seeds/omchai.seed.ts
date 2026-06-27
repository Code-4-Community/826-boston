import { OmchaiRole } from '../omchai/omchai.entity';

export interface OmchaiSeedItem {
  id?: number;
  user_id: number;
  anthology_id: number;
  role: OmchaiRole;
  datetimeAssigned: Date;
}

export const OmchaiSeed: OmchaiSeedItem[] = [
  // Anthology 1 (Voices From the Threshold) — all 6 roles
  {
    anthology_id: 1,
    user_id: 1,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-01-15'),
  },
  {
    anthology_id: 1,
    user_id: 2,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-01-15'),
  },
  {
    anthology_id: 1,
    user_id: 3,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-01-15'),
  },
  {
    anthology_id: 1,
    user_id: 4,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-01-15'),
  },
  {
    anthology_id: 1,
    user_id: 5,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2025-01-15'),
  },
  {
    anthology_id: 1,
    user_id: 6,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-01-15'),
  },

  // Anthology 2 (The Color of Saturday) — all 6 roles
  {
    anthology_id: 2,
    user_id: 2,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthology_id: 2,
    user_id: 1,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthology_id: 2,
    user_id: 6,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthology_id: 2,
    user_id: 7,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthology_id: 2,
    user_id: 3,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthology_id: 2,
    user_id: 8,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-02-01'),
  },

  // Anthology 3 (What the River Carries) — all 6 roles
  {
    anthology_id: 3,
    user_id: 3,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-02-15'),
  },
  {
    anthology_id: 3,
    user_id: 1,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-02-15'),
  },
  {
    anthology_id: 3,
    user_id: 2,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-02-15'),
  },
  {
    anthology_id: 3,
    user_id: 9,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-02-15'),
  },
  {
    anthology_id: 3,
    user_id: 4,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2025-02-15'),
  },
  {
    anthology_id: 3,
    user_id: 10,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-02-15'),
  },

  // Anthology 4 (Prism Literary Magazine #14) — all 6 roles
  {
    anthology_id: 4,
    user_id: 1,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-03-01'),
  },
  {
    anthology_id: 4,
    user_id: 4,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-03-01'),
  },
  {
    anthology_id: 4,
    user_id: 5,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-03-01'),
  },
  {
    anthology_id: 4,
    user_id: 6,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-03-01'),
  },
  {
    anthology_id: 4,
    user_id: 7,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2025-03-01'),
  },
  {
    anthology_id: 4,
    user_id: 2,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-03-01'),
  },

  // Anthology 5 (Snapshots at 3AM) — partial
  {
    anthology_id: 5,
    user_id: 2,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-10-01'),
  },
  {
    anthology_id: 5,
    user_id: 3,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-10-01'),
  },
  {
    anthology_id: 5,
    user_id: 8,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2024-10-01'),
  },

  // Anthology 8 (I'll Light Up My Own Sky) — all 6 roles
  {
    anthology_id: 8,
    user_id: 1,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthology_id: 8,
    user_id: 2,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthology_id: 8,
    user_id: 3,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthology_id: 8,
    user_id: 9,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthology_id: 8,
    user_id: 5,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthology_id: 8,
    user_id: 10,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2024-09-01'),
  },

  // Anthology 9 (Rubix Literary Magazine #12 - Futures) — partial
  {
    anthology_id: 9,
    user_id: 4,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-01-10'),
  },
  {
    anthology_id: 9,
    user_id: 1,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-01-10'),
  },
  {
    anthology_id: 9,
    user_id: 9,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-01-10'),
  },

  // Anthology 12 (Not Guilty) — partial
  {
    anthology_id: 12,
    user_id: 5,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-11-01'),
  },
  {
    anthology_id: 12,
    user_id: 1,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-11-01'),
  },
  {
    anthology_id: 12,
    user_id: 2,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2024-11-01'),
  },
  {
    anthology_id: 12,
    user_id: 6,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2024-11-01'),
  },

  // Anthology 13 (Unlocked) — partial
  {
    anthology_id: 13,
    user_id: 6,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-01-20'),
  },
  {
    anthology_id: 13,
    user_id: 7,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-01-20'),
  },
  {
    anthology_id: 13,
    user_id: 1,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-01-20'),
  },

  // Anthology 14 (Utopia vs. Dystopia) — partial
  {
    anthology_id: 14,
    user_id: 1,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-10-15'),
  },
  {
    anthology_id: 14,
    user_id: 8,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-10-15'),
  },
  {
    anthology_id: 14,
    user_id: 2,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2024-10-15'),
  },

  // Anthology 6 (How to Survive a Cafeteria)
  {
    anthology_id: 6,
    user_id: 3,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthology_id: 6,
    user_id: 7,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthology_id: 6,
    user_id: 10,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-02-01'),
  },

  // Anthology 7 (Letters to Nobody)
  {
    anthology_id: 7,
    user_id: 7,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-11-15'),
  },
  {
    anthology_id: 7,
    user_id: 2,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-11-15'),
  },
  {
    anthology_id: 7,
    user_id: 5,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2024-11-15'),
  },

  // Anthology 10 (Tomorrow's Almanac)
  {
    anthology_id: 10,
    user_id: 4,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-12-01'),
  },
  {
    anthology_id: 10,
    user_id: 8,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2024-12-01'),
  },
  {
    anthology_id: 10,
    user_id: 2,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2024-12-01'),
  },

  // Anthology 11 (Prism Literary Magazine #15: Memory Palace)
  {
    anthology_id: 11,
    user_id: 5,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-09-01'),
  },
  {
    anthology_id: 11,
    user_id: 6,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-09-01'),
  },
  {
    anthology_id: 11,
    user_id: 3,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-09-01'),
  },

  // Anthology 15 (Civic Creatures)
  {
    anthology_id: 15,
    user_id: 8,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-12-10'),
  },
  {
    anthology_id: 15,
    user_id: 4,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2024-12-10'),
  },
  {
    anthology_id: 15,
    user_id: 7,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2024-12-10'),
  },

  // Anthology 16 (The Weight of a Suitcase)
  {
    anthology_id: 16,
    user_id: 9,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-08-01'),
  },
  {
    anthology_id: 16,
    user_id: 1,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-08-01'),
  },
  {
    anthology_id: 16,
    user_id: 6,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2024-08-01'),
  },

  // Anthology 17 (Walk a Mile in Our Shoes)
  {
    anthology_id: 17,
    user_id: 10,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-01-05'),
  },
  {
    anthology_id: 17,
    user_id: 7,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-01-05'),
  },
  {
    anthology_id: 17,
    user_id: 3,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-01-05'),
  },

  // Anthology 18 (The Night Kitchen)
  {
    anthology_id: 18,
    user_id: 6,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-10-20'),
  },
  {
    anthology_id: 18,
    user_id: 9,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2024-10-20'),
  },
  {
    anthology_id: 18,
    user_id: 4,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2024-10-20'),
  },

  // Anthology 19 (Hard Pivot)
  {
    anthology_id: 19,
    user_id: 7,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-01-08'),
  },
  {
    anthology_id: 19,
    user_id: 5,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-01-08'),
  },
  {
    anthology_id: 19,
    user_id: 8,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-01-08'),
  },

  // Anthology 20 (The Space Between Languages)
  {
    anthology_id: 20,
    user_id: 3,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-02-10'),
  },
  {
    anthology_id: 20,
    user_id: 10,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-02-10'),
  },
  {
    anthology_id: 20,
    user_id: 2,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2025-02-10'),
  },

  // Anthology 21 (Hallway Dispatches) — new ZINE
  {
    anthology_id: 21,
    user_id: 2,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-07-01'),
  },
  {
    anthology_id: 21,
    user_id: 9,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-07-01'),
  },

  // Anthology 22 (Field Notes From the T) — new ZINE
  {
    anthology_id: 22,
    user_id: 4,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-07-15'),
  },
  {
    anthology_id: 22,
    user_id: 3,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-07-15'),
  },

  // Anthology 5 — full set of roles with multi-user entries
  {
    anthology_id: 5,
    user_id: 1,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date(),
  },
  {
    anthology_id: 5,
    user_id: 3,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date(),
  },
  {
    anthology_id: 5,
    user_id: 6,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date(),
  },
  {
    anthology_id: 5,
    user_id: 4,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date(),
  },
  {
    anthology_id: 5,
    user_id: 5,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date(),
  },
  {
    anthology_id: 5,
    user_id: 7,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date(),
  },
  {
    anthology_id: 5,
    user_id: 6,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date(),
  },
  {
    anthology_id: 5,
    user_id: 2,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date(),
  },
  {
    anthology_id: 5,
    user_id: 5,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date(),
  },
  {
    anthology_id: 5,
    user_id: 1,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date(),
  },
];
