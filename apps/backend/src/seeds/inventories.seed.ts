interface InventorySeedItem {
  id: number;
  name: string;
}

// NOTE: inventoryHoldings uses the string literal "name"
// to link foreign key
export const InventoriesSeed: InventorySeedItem[] = [
  { id: 1, name: "O'Bryant Writers' Room" },
  { id: 2, name: 'Northeastern University' },
  { id: 3, name: '826 Columbus Ave' },
  { id: 4, name: "Holland Writers' Room Library" },
  { id: 5, name: 'Administrative Office' },
];
