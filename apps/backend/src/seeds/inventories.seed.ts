interface InventorySeedItem {
  id: number;
  name: string;
}

// The real 826 Boston storage locations, taken from the per-location
// copy-count columns of the publications spreadsheet.
export const InventoriesSeed: InventorySeedItem[] = [
  { id: 1, name: "O'Bryant Writers' Room" },
  { id: 2, name: "Holland Writers' Room Library" },
  { id: 3, name: "BINcA Writers' Room" },
  { id: 4, name: "BTU Writers' Room" },
  { id: 5, name: 'Dev/Comms Office (1865 Columbus)' },
  { id: 6, name: "Muñiz Writers' Room" },
  { id: 7, name: "New Mission Writers' Room" },
  { id: 8, name: 'The Hub (1989 Columbus)' },
  { id: 9, name: 'Tutoring Center (3035 Office)' },
];
