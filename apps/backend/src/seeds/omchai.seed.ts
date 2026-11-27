import { OmchaiRole } from '../omchai/omchai.entity';

export interface OmchaiSeedItem {
  id?: number;
  userId: number;
  anthologyId: number;
  role: OmchaiRole;
  datetimeAssigned: Date;
}

export const OmchaiSeed: OmchaiSeedItem[] = [
  // Anthology 1 (Walk a Mile in Our Shoes) — all 6 roles
  {
    anthologyId: 1,
    userId: 1,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-01-15'),
  },
  {
    anthologyId: 1,
    userId: 2,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-01-15'),
  },
  {
    anthologyId: 1,
    userId: 3,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-01-15'),
  },
  {
    anthologyId: 1,
    userId: 4,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-01-15'),
  },
  {
    anthologyId: 1,
    userId: 5,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2025-01-15'),
  },
  {
    anthologyId: 1,
    userId: 6,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-01-15'),
  },

  // Anthology 2 (Utopia vs. Dystopia) — all 6 roles
  {
    anthologyId: 2,
    userId: 2,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyId: 2,
    userId: 1,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyId: 2,
    userId: 6,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyId: 2,
    userId: 7,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyId: 2,
    userId: 3,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyId: 2,
    userId: 8,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-02-01'),
  },

  // Anthology 3 (I'll Light Up My Own Sky) — all 6 roles
  {
    anthologyId: 3,
    userId: 3,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-02-15'),
  },
  {
    anthologyId: 3,
    userId: 1,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-02-15'),
  },
  {
    anthologyId: 3,
    userId: 2,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-02-15'),
  },
  {
    anthologyId: 3,
    userId: 9,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-02-15'),
  },
  {
    anthologyId: 3,
    userId: 4,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2025-02-15'),
  },
  {
    anthologyId: 3,
    userId: 10,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-02-15'),
  },

  // Anthology 4 (To The People Like Us) — all 6 roles
  {
    anthologyId: 4,
    userId: 1,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-03-01'),
  },
  {
    anthologyId: 4,
    userId: 4,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-03-01'),
  },
  {
    anthologyId: 4,
    userId: 5,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-03-01'),
  },
  {
    anthologyId: 4,
    userId: 6,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-03-01'),
  },
  {
    anthologyId: 4,
    userId: 7,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2025-03-01'),
  },
  {
    anthologyId: 4,
    userId: 2,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-03-01'),
  },

  // Anthology 5 (I Am Bravery Itself) — partial
  {
    anthologyId: 5,
    userId: 2,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-10-01'),
  },
  {
    anthologyId: 5,
    userId: 3,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-10-01'),
  },
  {
    anthologyId: 5,
    userId: 8,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2024-10-01'),
  },

  // Anthology 8 (Who Are You?) — all 6 roles
  {
    anthologyId: 8,
    userId: 1,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthologyId: 8,
    userId: 2,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthologyId: 8,
    userId: 3,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthologyId: 8,
    userId: 9,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthologyId: 8,
    userId: 5,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2024-09-01'),
  },
  {
    anthologyId: 8,
    userId: 10,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2024-09-01'),
  },

  // Anthology 9 (The Great Cost of Freedom) — partial
  {
    anthologyId: 9,
    userId: 4,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-01-10'),
  },
  {
    anthologyId: 9,
    userId: 1,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-01-10'),
  },
  {
    anthologyId: 9,
    userId: 9,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-01-10'),
  },

  // Anthology 12 (I Closed My Eyes and Imagined) — partial
  {
    anthologyId: 12,
    userId: 5,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-11-01'),
  },
  {
    anthologyId: 12,
    userId: 1,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-11-01'),
  },
  {
    anthologyId: 12,
    userId: 2,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2024-11-01'),
  },
  {
    anthologyId: 12,
    userId: 6,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2024-11-01'),
  },

  // Anthology 13 (All Kinds of Flavor) — partial
  {
    anthologyId: 13,
    userId: 6,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-01-20'),
  },
  {
    anthologyId: 13,
    userId: 7,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-01-20'),
  },
  {
    anthologyId: 13,
    userId: 1,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-01-20'),
  },

  // Anthology 14 (It’s Not The Stone That Brings You Strength) — partial
  {
    anthologyId: 14,
    userId: 1,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-10-15'),
  },
  {
    anthologyId: 14,
    userId: 8,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-10-15'),
  },
  {
    anthologyId: 14,
    userId: 2,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2024-10-15'),
  },

  // Anthology 6 (In Everday Things)
  {
    anthologyId: 6,
    userId: 3,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyId: 6,
    userId: 7,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-02-01'),
  },
  {
    anthologyId: 6,
    userId: 10,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-02-01'),
  },

  // Anthology 7 (Nothing Suspicious Was Going On)
  {
    anthologyId: 7,
    userId: 7,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-11-15'),
  },
  {
    anthologyId: 7,
    userId: 2,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-11-15'),
  },
  {
    anthologyId: 7,
    userId: 5,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2024-11-15'),
  },

  // Anthology 10 (Us, From the Inside and Out)
  {
    anthologyId: 10,
    userId: 4,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-12-01'),
  },
  {
    anthologyId: 10,
    userId: 8,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2024-12-01'),
  },
  {
    anthologyId: 10,
    userId: 2,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2024-12-01'),
  },

  // Anthology 11 (Rubix Literay Magazine #12 - Futures)
  {
    anthologyId: 11,
    userId: 5,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-09-01'),
  },
  {
    anthologyId: 11,
    userId: 6,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-09-01'),
  },
  {
    anthologyId: 11,
    userId: 3,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-09-01'),
  },

  // Anthology 15 (Like the Sun in Dark Spaces)
  {
    anthologyId: 15,
    userId: 8,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-12-10'),
  },
  {
    anthologyId: 15,
    userId: 4,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2024-12-10'),
  },
  {
    anthologyId: 15,
    userId: 7,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2024-12-10'),
  },

  // Anthology 16 (With a Crunch and a Slurp)
  {
    anthologyId: 16,
    userId: 9,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-08-01'),
  },
  {
    anthologyId: 16,
    userId: 1,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2024-08-01'),
  },
  {
    anthologyId: 16,
    userId: 6,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2024-08-01'),
  },

  // Anthology 17 (A Long Walk To Healthy)
  {
    anthologyId: 17,
    userId: 10,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-01-05'),
  },
  {
    anthologyId: 17,
    userId: 7,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-01-05'),
  },
  {
    anthologyId: 17,
    userId: 3,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-01-05'),
  },

  // Anthology 18 (Before This Place Filled with Zombies)
  {
    anthologyId: 18,
    userId: 6,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2024-10-20'),
  },
  {
    anthologyId: 18,
    userId: 9,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2024-10-20'),
  },
  {
    anthologyId: 18,
    userId: 4,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2024-10-20'),
  },

  // Anthology 19 (I’m a Flame You Can’t Put Out)
  {
    anthologyId: 19,
    userId: 7,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-01-08'),
  },
  {
    anthologyId: 19,
    userId: 5,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-01-08'),
  },
  {
    anthologyId: 19,
    userId: 8,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date('2025-01-08'),
  },

  // Anthology 20 (My Generation Can)
  {
    anthologyId: 20,
    userId: 3,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-02-10'),
  },
  {
    anthologyId: 20,
    userId: 10,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date('2025-02-10'),
  },
  {
    anthologyId: 20,
    userId: 2,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date('2025-02-10'),
  },

  // Anthology 21 (What if the World Needs You?)
  {
    anthologyId: 21,
    userId: 2,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-07-01'),
  },
  {
    anthologyId: 21,
    userId: 9,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date('2025-07-01'),
  },

  // Anthology 22 (85 Cents Might Not Sound Like a Lot)
  {
    anthologyId: 22,
    userId: 4,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date('2025-07-15'),
  },
  {
    anthologyId: 22,
    userId: 3,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date('2025-07-15'),
  },

  // Anthology 5 (I Am Bravery Itself) — full set of roles with multi-user entries
  {
    anthologyId: 5,
    userId: 1,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 5,
    userId: 3,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 5,
    userId: 6,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 5,
    userId: 4,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 5,
    userId: 5,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 5,
    userId: 7,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 5,
    userId: 6,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 5,
    userId: 2,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 5,
    userId: 5,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date(),
  },
  {
    anthologyId: 5,
    userId: 1,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date(),
  },
];
