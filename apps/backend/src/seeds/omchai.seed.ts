import { OmchaiRole } from '../omchai/omchai.entity';

export interface OmchaiSeedItem {
  id?: number;
  user_id: number;
  anthology_id: number;
  role: OmchaiRole;
  datetimeAssigned: Date;
}

export const OmchaiSeed: OmchaiSeedItem[] = [
  // Anthology 1 (Walk a Mile in Our Shoes) — all 6 roles
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

  // Anthology 2 (Utopia vs. Dystopia) — all 6 roles
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

  // Anthology 3 (I'll Light Up My Own Sky) — all 6 roles
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

  // Anthology 4 (To The People Like Us) — all 6 roles
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

  // Anthology 5 (I Am Bravery Itself) — partial
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

  // Anthology 8 (Who Are You?) — all 6 roles
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

  // Anthology 9 (The Great Cost of Freedom) — partial
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

  // Anthology 12 (I Closed My Eyes and Imagined) — partial
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

  // Anthology 13 (All Kinds of Flavor) — partial
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

  // Anthology 14 (It’s Not The Stone That Brings You Strength) — partial
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

  // Anthology 6 (In Everday Things)
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

  // Anthology 7 (Nothing Suspicious Was Going On)
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

  // Anthology 10 (Us, From the Inside and Out)
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

  // Anthology 11 (Rubix Literay Magazine #12 - Futures)
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

  // Anthology 15 (Like the Sun in Dark Spaces)
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

  // Anthology 16 (With a Crunch and a Slurp)
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

  // Anthology 17 (A Long Walk To Healthy)
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

  // Anthology 18 (Before This Place Filled with Zombies)
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

  // Anthology 19 (I’m a Flame You Can’t Put Out)
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

  // Anthology 20 (My Generation Can)
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

  // Anthology 21 (What if the World Needs You?)
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

  // Anthology 22 (85 Cents Might Not Sound Like a Lot)
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

  // Anthology 5 (I Am Bravery Itself) — full set of roles with multi-user entries
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
