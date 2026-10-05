export interface InventoryHoldingSeedItem {
  id?: number;
  anthology_id: number;
  inventory_id: number;
  numCopies: number;
}

// Per-location copy counts taken from the publications spreadsheet.
// `anthology_id` is the 1-indexed position in AnthologiesSeed, since anthology
// ids are generated in insertion order — append there, never insert.
export const InventoryHoldingsSeed: InventoryHoldingSeedItem[] = [
  // Utopia vs. Dystopia (id 2)
  { anthology_id: 2, inventory_id: 1, numCopies: 23 },

  // I'll Light Up My Own Sky (id 3)
  { anthology_id: 3, inventory_id: 2, numCopies: 2 },
  { anthology_id: 3, inventory_id: 5, numCopies: 76 },
  { anthology_id: 3, inventory_id: 8, numCopies: 400 },

  // To The People Like Us (id 4)
  { anthology_id: 4, inventory_id: 2, numCopies: 1 },
  { anthology_id: 4, inventory_id: 5, numCopies: 34 },
  { anthology_id: 4, inventory_id: 9, numCopies: 2 },

  // I Am Bravery Itself (id 5)
  { anthology_id: 5, inventory_id: 2, numCopies: 5 },

  // In Everday Things (id 6)
  { anthology_id: 6, inventory_id: 2, numCopies: 1 },
  { anthology_id: 6, inventory_id: 5, numCopies: 5 },
  { anthology_id: 6, inventory_id: 9, numCopies: 220 },

  // Nothing Suspicious Was Going On (id 7)
  { anthology_id: 7, inventory_id: 5, numCopies: 19 },

  // Who Are You? (id 8)
  { anthology_id: 8, inventory_id: 5, numCopies: 13 },
  { anthology_id: 8, inventory_id: 6, numCopies: 4 },

  // The Great Cost of Freedom (id 9)
  { anthology_id: 9, inventory_id: 3, numCopies: 16 },
  { anthology_id: 9, inventory_id: 5, numCopies: 14 },

  // Rubix Literay Magazine #12 - Futures (id 11)
  { anthology_id: 11, inventory_id: 1, numCopies: 18 },

  // I Closed My Eyes and Imagined (id 12)
  { anthology_id: 12, inventory_id: 1, numCopies: 1 },
  { anthology_id: 12, inventory_id: 2, numCopies: 1 },
  { anthology_id: 12, inventory_id: 5, numCopies: 5 },
  { anthology_id: 12, inventory_id: 6, numCopies: 7 },
  { anthology_id: 12, inventory_id: 7, numCopies: 2 },
  { anthology_id: 12, inventory_id: 8, numCopies: 230 },
  { anthology_id: 12, inventory_id: 9, numCopies: 235 },

  // All Kinds of Flavor (id 13)
  { anthology_id: 13, inventory_id: 1, numCopies: 2 },
  { anthology_id: 13, inventory_id: 2, numCopies: 2 },
  { anthology_id: 13, inventory_id: 3, numCopies: 1 },
  { anthology_id: 13, inventory_id: 5, numCopies: 2 },
  { anthology_id: 13, inventory_id: 7, numCopies: 3 },
  { anthology_id: 13, inventory_id: 9, numCopies: 5 },

  // It’s Not The Stone That Brings You Strength (id 14)
  { anthology_id: 14, inventory_id: 1, numCopies: 4 },
  { anthology_id: 14, inventory_id: 2, numCopies: 4 },
  { anthology_id: 14, inventory_id: 3, numCopies: 1 },
  { anthology_id: 14, inventory_id: 5, numCopies: 2 },
  { anthology_id: 14, inventory_id: 7, numCopies: 5 },
  { anthology_id: 14, inventory_id: 8, numCopies: 138 },
  { anthology_id: 14, inventory_id: 9, numCopies: 144 },

  // Like the Sun in Dark Spaces (id 15)
  { anthology_id: 15, inventory_id: 1, numCopies: 1 },
  { anthology_id: 15, inventory_id: 2, numCopies: 1 },
  { anthology_id: 15, inventory_id: 3, numCopies: 8 },
  { anthology_id: 15, inventory_id: 5, numCopies: 4 },
  { anthology_id: 15, inventory_id: 7, numCopies: 1 },
  { anthology_id: 15, inventory_id: 8, numCopies: 43 },
  { anthology_id: 15, inventory_id: 9, numCopies: 51 },

  // With a Crunch and a Slurp (id 16)
  { anthology_id: 16, inventory_id: 1, numCopies: 3 },
  { anthology_id: 16, inventory_id: 2, numCopies: 1 },
  { anthology_id: 16, inventory_id: 3, numCopies: 2 },
  { anthology_id: 16, inventory_id: 5, numCopies: 6 },
  { anthology_id: 16, inventory_id: 7, numCopies: 3 },
  { anthology_id: 16, inventory_id: 8, numCopies: 127 },
  { anthology_id: 16, inventory_id: 9, numCopies: 2 },

  // A Long Walk To Healthy (id 17)
  { anthology_id: 17, inventory_id: 1, numCopies: 2 },
  { anthology_id: 17, inventory_id: 3, numCopies: 2 },
  { anthology_id: 17, inventory_id: 5, numCopies: 10 },
  { anthology_id: 17, inventory_id: 7, numCopies: 3 },
  { anthology_id: 17, inventory_id: 8, numCopies: 14 },
  { anthology_id: 17, inventory_id: 9, numCopies: 103 },

  // Before This Place Filled with Zombies (id 18)
  { anthology_id: 18, inventory_id: 2, numCopies: 2 },
  { anthology_id: 18, inventory_id: 3, numCopies: 1 },
  { anthology_id: 18, inventory_id: 5, numCopies: 33 },
  { anthology_id: 18, inventory_id: 7, numCopies: 6 },
  { anthology_id: 18, inventory_id: 8, numCopies: 148 },
  { anthology_id: 18, inventory_id: 9, numCopies: 185 },

  // I’m a Flame You Can’t Put Out (id 19)
  { anthology_id: 19, inventory_id: 1, numCopies: 1 },
  { anthology_id: 19, inventory_id: 2, numCopies: 3 },
  { anthology_id: 19, inventory_id: 5, numCopies: 9 },
  { anthology_id: 19, inventory_id: 6, numCopies: 3 },

  // My Generation Can (id 20)
  { anthology_id: 20, inventory_id: 2, numCopies: 1 },
  { anthology_id: 20, inventory_id: 3, numCopies: 1 },
  { anthology_id: 20, inventory_id: 5, numCopies: 5 },
  { anthology_id: 20, inventory_id: 7, numCopies: 4 },
  { anthology_id: 20, inventory_id: 8, numCopies: 300 },
  { anthology_id: 20, inventory_id: 9, numCopies: 299 },

  // What if the World Needs You? (id 21)
  { anthology_id: 21, inventory_id: 1, numCopies: 3 },
  { anthology_id: 21, inventory_id: 2, numCopies: 1 },
  { anthology_id: 21, inventory_id: 5, numCopies: 2 },
  { anthology_id: 21, inventory_id: 6, numCopies: 1 },
  { anthology_id: 21, inventory_id: 7, numCopies: 32 },
  { anthology_id: 21, inventory_id: 9, numCopies: 313 },

  // 85 Cents Might Not Sound Like a Lot (id 22)
  { anthology_id: 22, inventory_id: 1, numCopies: 1 },
  { anthology_id: 22, inventory_id: 3, numCopies: 2 },
  { anthology_id: 22, inventory_id: 5, numCopies: 4 },
  { anthology_id: 22, inventory_id: 9, numCopies: 26 },

  // I Was Meant For This (id 23)
  { anthology_id: 23, inventory_id: 5, numCopies: 9 },
  { anthology_id: 23, inventory_id: 7, numCopies: 1 },
  { anthology_id: 23, inventory_id: 8, numCopies: 54 },
  { anthology_id: 23, inventory_id: 9, numCopies: 62 },

  // We Think You’re Old Enough to Know (id 24)
  { anthology_id: 24, inventory_id: 2, numCopies: 3 },
  { anthology_id: 24, inventory_id: 5, numCopies: 9 },
  { anthology_id: 24, inventory_id: 7, numCopies: 5 },
  { anthology_id: 24, inventory_id: 8, numCopies: 43 },

  // We Turned Back to See Where We Came From (id 25)
  { anthology_id: 25, inventory_id: 2, numCopies: 2 },
  { anthology_id: 25, inventory_id: 8, numCopies: 15 },
  { anthology_id: 25, inventory_id: 9, numCopies: 5 },

  // I Rate Today a -1,000 (id 26)
  { anthology_id: 26, inventory_id: 1, numCopies: 1 },
  { anthology_id: 26, inventory_id: 2, numCopies: 1 },
  { anthology_id: 26, inventory_id: 5, numCopies: 2 },

  // Invincible: Book 1 (id 27)
  { anthology_id: 27, inventory_id: 5, numCopies: 2 },
  { anthology_id: 27, inventory_id: 8, numCopies: 35 },
  { anthology_id: 27, inventory_id: 9, numCopies: 11 },

  // Oh My Chocolate (id 28)
  { anthology_id: 28, inventory_id: 5, numCopies: 5 },
  { anthology_id: 28, inventory_id: 7, numCopies: 1 },
  { anthology_id: 28, inventory_id: 8, numCopies: 17 },
  { anthology_id: 28, inventory_id: 9, numCopies: 7 },

  // Wait, Whaaa? Where Am I? (id 29)
  { anthology_id: 29, inventory_id: 1, numCopies: 1 },
  { anthology_id: 29, inventory_id: 5, numCopies: 2 },
  { anthology_id: 29, inventory_id: 9, numCopies: 31 },

  // Small Things Can Grow Tall (id 30)
  { anthology_id: 30, inventory_id: 1, numCopies: 2 },
  { anthology_id: 30, inventory_id: 8, numCopies: 6 },
  { anthology_id: 30, inventory_id: 9, numCopies: 6 },

  // Rubix Literary Magazine #9: The Connections Issue (id 31)
  { anthology_id: 31, inventory_id: 1, numCopies: 38 },
  { anthology_id: 31, inventory_id: 3, numCopies: 1 },
  { anthology_id: 31, inventory_id: 7, numCopies: 2 },
];
