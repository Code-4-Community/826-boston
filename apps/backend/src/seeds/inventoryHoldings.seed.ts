export interface InventoryHoldingSeedItem {
  id?: number;
  anthology_id: number;
  inventory_id: number;
  numCopies: number;
}

export const InventoryHoldingsSeed: InventoryHoldingSeedItem[] = [
  // Voices From the Threshold (BINcA, Chapbook, 60 print run)
  {
    anthology_id: 1,
    inventory_id: 1,
    numCopies: 50,
  },
  {
    anthology_id: 1,
    inventory_id: 4,
    numCopies: 10,
  },

  // The Color of Saturday (OB, Chapbook, 80 print run)
  {
    anthology_id: 2,
    inventory_id: 1,
    numCopies: 75,
  },
  {
    anthology_id: 2,
    inventory_id: 5,
    numCopies: 5,
  },

  // What the River Carries (Muñiz, Chapbook, 50 print run)
  {
    anthology_id: 3,
    inventory_id: 3,
    numCopies: 45,
  },

  // Prism Literary Magazine #14 (OB, Perfect Bound, 75 print run)
  {
    anthology_id: 4,
    inventory_id: 1,
    numCopies: 60,
  },
  {
    anthology_id: 4,
    inventory_id: 5,
    numCopies: 2,
  },

  // Snapshots at 3AM (YLAB, Perfect Bound, 320 print run)
  {
    anthology_id: 5,
    inventory_id: 3,
    numCopies: 200,
  },
  {
    anthology_id: 5,
    inventory_id: 5,
    numCopies: 4,
  },

  // How to Survive a Cafeteria (After-School, Chapbook, archived)
  {
    anthology_id: 6,
    inventory_id: 5,
    numCopies: 20,
  },

  // I'll Light Up My Own Sky
  {
    anthology_id: 21,
    inventory_id: 1,
    numCopies: 76,
  },
  {
    anthology_id: 21,
    inventory_id: 2,
    numCopies: 400,
  },
  {
    anthology_id: 21,
    inventory_id: 3,
    numCopies: 3,
  },
  {
    anthology_id: 21,
    inventory_id: 4,
    numCopies: 2,
  },

  // Rubix Literary Magazine #12 - Futures (OB, Perfect Bound, 100 print run)
  {
    anthology_id: 29,
    inventory_id: 1,
    numCopies: 18,
  },

  // Prism Literary Magazine #15 (OB, DRAFT)
  {
    anthology_id: 9,
    inventory_id: 5,
    numCopies: 2,
  },

  // Not Guilty (YABP+YLAB, Signature, 500 print run)
  {
    anthology_id: 10,
    inventory_id: 3,
    numCopies: 150,
  },
  {
    anthology_id: 10,
    inventory_id: 5,
    numCopies: 31,
  },

  // Unlocked (In-School, Perfect Bound, 500 print run)
  {
    anthology_id: 11,
    inventory_id: 3,
    numCopies: 100,
  },
  {
    anthology_id: 11,
    inventory_id: 1,
    numCopies: 50,
  },
  {
    anthology_id: 11,
    inventory_id: 5,
    numCopies: 62,
  },

  // Utopia vs. Dystopia (YABP+YLAB, Signature, 500 print run)
  {
    anthology_id: 20,
    inventory_id: 1,
    numCopies: 23,
  },

  // Civic Creatures (YABP+YLAB, Signature, IN_REVISION)
  {
    anthology_id: 12,
    inventory_id: 3,
    numCopies: 200,
  },
  {
    anthology_id: 12,
    inventory_id: 5,
    numCopies: 25,
  },

  // The Weight of a Suitcase (BINcA, Chapbook, older)
  {
    anthology_id: 13,
    inventory_id: 5,
    numCopies: 10,
  },

  // Hard Pivot (OB, Perfect Bound, 400 print run)
  {
    anthology_id: 15,
    inventory_id: 1,
    numCopies: 100,
  },
  {
    anthology_id: 15,
    inventory_id: 5,
    numCopies: 47,
  },
];
