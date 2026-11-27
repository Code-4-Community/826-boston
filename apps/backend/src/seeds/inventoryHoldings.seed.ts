export interface InventoryHoldingSeedItem {
  id?: number;
  anthologyId: number;
  inventoryId: number;
  numCopies: number;
}

// Per-location copy counts taken from the publications spreadsheet.
// `anthologyId` is the 1-indexed position in AnthologiesSeed, since anthology
// ids are generated in insertion order — append there, never insert.
export const InventoryHoldingsSeed: InventoryHoldingSeedItem[] = [
  // Utopia vs. Dystopia (id 2)
  { anthologyId: 2, inventoryId: 1, numCopies: 23 },

  // I'll Light Up My Own Sky (id 3)
  { anthologyId: 3, inventoryId: 2, numCopies: 2 },
  { anthologyId: 3, inventoryId: 5, numCopies: 76 },
  { anthologyId: 3, inventoryId: 8, numCopies: 400 },

  // To The People Like Us (id 4)
  { anthologyId: 4, inventoryId: 2, numCopies: 1 },
  { anthologyId: 4, inventoryId: 5, numCopies: 34 },
  { anthologyId: 4, inventoryId: 9, numCopies: 2 },

  // I Am Bravery Itself (id 5)
  { anthologyId: 5, inventoryId: 2, numCopies: 5 },

  // In Everday Things (id 6)
  { anthologyId: 6, inventoryId: 2, numCopies: 1 },
  { anthologyId: 6, inventoryId: 5, numCopies: 5 },
  { anthologyId: 6, inventoryId: 9, numCopies: 220 },

  // Nothing Suspicious Was Going On (id 7)
  { anthologyId: 7, inventoryId: 5, numCopies: 19 },

  // Who Are You? (id 8)
  { anthologyId: 8, inventoryId: 5, numCopies: 13 },
  { anthologyId: 8, inventoryId: 6, numCopies: 4 },

  // The Great Cost of Freedom (id 9)
  { anthologyId: 9, inventoryId: 3, numCopies: 16 },
  { anthologyId: 9, inventoryId: 5, numCopies: 14 },

  // Rubix Literay Magazine #12 - Futures (id 11)
  { anthologyId: 11, inventoryId: 1, numCopies: 18 },

  // I Closed My Eyes and Imagined (id 12)
  { anthologyId: 12, inventoryId: 1, numCopies: 1 },
  { anthologyId: 12, inventoryId: 2, numCopies: 1 },
  { anthologyId: 12, inventoryId: 5, numCopies: 5 },
  { anthologyId: 12, inventoryId: 6, numCopies: 7 },
  { anthologyId: 12, inventoryId: 7, numCopies: 2 },
  { anthologyId: 12, inventoryId: 8, numCopies: 230 },
  { anthologyId: 12, inventoryId: 9, numCopies: 235 },

  // All Kinds of Flavor (id 13)
  { anthologyId: 13, inventoryId: 1, numCopies: 2 },
  { anthologyId: 13, inventoryId: 2, numCopies: 2 },
  { anthologyId: 13, inventoryId: 3, numCopies: 1 },
  { anthologyId: 13, inventoryId: 5, numCopies: 2 },
  { anthologyId: 13, inventoryId: 7, numCopies: 3 },
  { anthologyId: 13, inventoryId: 9, numCopies: 5 },

  // It’s Not The Stone That Brings You Strength (id 14)
  { anthologyId: 14, inventoryId: 1, numCopies: 4 },
  { anthologyId: 14, inventoryId: 2, numCopies: 4 },
  { anthologyId: 14, inventoryId: 3, numCopies: 1 },
  { anthologyId: 14, inventoryId: 5, numCopies: 2 },
  { anthologyId: 14, inventoryId: 7, numCopies: 5 },
  { anthologyId: 14, inventoryId: 8, numCopies: 138 },
  { anthologyId: 14, inventoryId: 9, numCopies: 144 },

  // Like the Sun in Dark Spaces (id 15)
  { anthologyId: 15, inventoryId: 1, numCopies: 1 },
  { anthologyId: 15, inventoryId: 2, numCopies: 1 },
  { anthologyId: 15, inventoryId: 3, numCopies: 8 },
  { anthologyId: 15, inventoryId: 5, numCopies: 4 },
  { anthologyId: 15, inventoryId: 7, numCopies: 1 },
  { anthologyId: 15, inventoryId: 8, numCopies: 43 },
  { anthologyId: 15, inventoryId: 9, numCopies: 51 },

  // With a Crunch and a Slurp (id 16)
  { anthologyId: 16, inventoryId: 1, numCopies: 3 },
  { anthologyId: 16, inventoryId: 2, numCopies: 1 },
  { anthologyId: 16, inventoryId: 3, numCopies: 2 },
  { anthologyId: 16, inventoryId: 5, numCopies: 6 },
  { anthologyId: 16, inventoryId: 7, numCopies: 3 },
  { anthologyId: 16, inventoryId: 8, numCopies: 127 },
  { anthologyId: 16, inventoryId: 9, numCopies: 2 },

  // A Long Walk To Healthy (id 17)
  { anthologyId: 17, inventoryId: 1, numCopies: 2 },
  { anthologyId: 17, inventoryId: 3, numCopies: 2 },
  { anthologyId: 17, inventoryId: 5, numCopies: 10 },
  { anthologyId: 17, inventoryId: 7, numCopies: 3 },
  { anthologyId: 17, inventoryId: 8, numCopies: 14 },
  { anthologyId: 17, inventoryId: 9, numCopies: 103 },

  // Before This Place Filled with Zombies (id 18)
  { anthologyId: 18, inventoryId: 2, numCopies: 2 },
  { anthologyId: 18, inventoryId: 3, numCopies: 1 },
  { anthologyId: 18, inventoryId: 5, numCopies: 33 },
  { anthologyId: 18, inventoryId: 7, numCopies: 6 },
  { anthologyId: 18, inventoryId: 8, numCopies: 148 },
  { anthologyId: 18, inventoryId: 9, numCopies: 185 },

  // I’m a Flame You Can’t Put Out (id 19)
  { anthologyId: 19, inventoryId: 1, numCopies: 1 },
  { anthologyId: 19, inventoryId: 2, numCopies: 3 },
  { anthologyId: 19, inventoryId: 5, numCopies: 9 },
  { anthologyId: 19, inventoryId: 6, numCopies: 3 },

  // My Generation Can (id 20)
  { anthologyId: 20, inventoryId: 2, numCopies: 1 },
  { anthologyId: 20, inventoryId: 3, numCopies: 1 },
  { anthologyId: 20, inventoryId: 5, numCopies: 5 },
  { anthologyId: 20, inventoryId: 7, numCopies: 4 },
  { anthologyId: 20, inventoryId: 8, numCopies: 300 },
  { anthologyId: 20, inventoryId: 9, numCopies: 299 },

  // What if the World Needs You? (id 21)
  { anthologyId: 21, inventoryId: 1, numCopies: 3 },
  { anthologyId: 21, inventoryId: 2, numCopies: 1 },
  { anthologyId: 21, inventoryId: 5, numCopies: 2 },
  { anthologyId: 21, inventoryId: 6, numCopies: 1 },
  { anthologyId: 21, inventoryId: 7, numCopies: 32 },
  { anthologyId: 21, inventoryId: 9, numCopies: 313 },

  // 85 Cents Might Not Sound Like a Lot (id 22)
  { anthologyId: 22, inventoryId: 1, numCopies: 1 },
  { anthologyId: 22, inventoryId: 3, numCopies: 2 },
  { anthologyId: 22, inventoryId: 5, numCopies: 4 },
  { anthologyId: 22, inventoryId: 9, numCopies: 26 },

  // I Was Meant For This (id 23)
  { anthologyId: 23, inventoryId: 5, numCopies: 9 },
  { anthologyId: 23, inventoryId: 7, numCopies: 1 },
  { anthologyId: 23, inventoryId: 8, numCopies: 54 },
  { anthologyId: 23, inventoryId: 9, numCopies: 62 },

  // We Think You’re Old Enough to Know (id 24)
  { anthologyId: 24, inventoryId: 2, numCopies: 3 },
  { anthologyId: 24, inventoryId: 5, numCopies: 9 },
  { anthologyId: 24, inventoryId: 7, numCopies: 5 },
  { anthologyId: 24, inventoryId: 8, numCopies: 43 },

  // We Turned Back to See Where We Came From (id 25)
  { anthologyId: 25, inventoryId: 2, numCopies: 2 },
  { anthologyId: 25, inventoryId: 8, numCopies: 15 },
  { anthologyId: 25, inventoryId: 9, numCopies: 5 },

  // I Rate Today a -1,000 (id 26)
  { anthologyId: 26, inventoryId: 1, numCopies: 1 },
  { anthologyId: 26, inventoryId: 2, numCopies: 1 },
  { anthologyId: 26, inventoryId: 5, numCopies: 2 },

  // Invincible: Book 1 (id 27)
  { anthologyId: 27, inventoryId: 5, numCopies: 2 },
  { anthologyId: 27, inventoryId: 8, numCopies: 35 },
  { anthologyId: 27, inventoryId: 9, numCopies: 11 },

  // Oh My Chocolate (id 28)
  { anthologyId: 28, inventoryId: 5, numCopies: 5 },
  { anthologyId: 28, inventoryId: 7, numCopies: 1 },
  { anthologyId: 28, inventoryId: 8, numCopies: 17 },
  { anthologyId: 28, inventoryId: 9, numCopies: 7 },

  // Wait, Whaaa? Where Am I? (id 29)
  { anthologyId: 29, inventoryId: 1, numCopies: 1 },
  { anthologyId: 29, inventoryId: 5, numCopies: 2 },
  { anthologyId: 29, inventoryId: 9, numCopies: 31 },

  // Small Things Can Grow Tall (id 30)
  { anthologyId: 30, inventoryId: 1, numCopies: 2 },
  { anthologyId: 30, inventoryId: 8, numCopies: 6 },
  { anthologyId: 30, inventoryId: 9, numCopies: 6 },

  // Rubix Literary Magazine #9: The Connections Issue (id 31)
  { anthologyId: 31, inventoryId: 1, numCopies: 38 },
  { anthologyId: 31, inventoryId: 3, numCopies: 1 },
  { anthologyId: 31, inventoryId: 7, numCopies: 2 },
];
