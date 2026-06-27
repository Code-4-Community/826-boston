import { Anthology } from 'src/anthology/anthology.entity';
import { Inventory } from 'src/inventory/inventory.entity';
import { InventoryHolding } from 'src/inventory-holding/inventory-holding.entity';
import { DataSource } from 'typeorm';
import { InventoryHoldingsSeed } from './inventoryHoldings.seed';

export async function seedInventoryHoldings(dataSource: DataSource) {
  const holdingRepo = dataSource.getRepository(InventoryHolding);
  const anthologyRepo = dataSource.getRepository(Anthology);
  const inventoryRepo = dataSource.getRepository(Inventory);

  console.log('Seeding inventory holdings...');

  for (const inventoryHolding of InventoryHoldingsSeed) {
    const anthology = await anthologyRepo.findOne({
      where: { id: inventoryHolding.anthology_id },
    });

    if (!anthology) {
      console.log(
        `  - Anthology with id ${inventoryHolding.anthology_id} not found, skipping holding`,
      );
      continue;
    }

    const inventory = await inventoryRepo.findOne({
      where: { id: inventoryHolding.inventory_id },
    });

    if (!inventory) {
      console.log(
        `  - Inventory with id ${inventoryHolding.inventory_id} not found, skipping holding`,
      );
      continue;
    }

    const exists = await holdingRepo.findOne({
      where: {
        inventory: { id: inventory.id },
        anthology: { id: anthology.id },
      },
    });

    if (!exists) {
      await holdingRepo.save(inventoryHolding);
      console.log(
        `  ✓ Created holding: "Anthology ${anthology.title}" @ "${inventory.name}" (${inventoryHolding.numCopies} copies)`,
      );
    } else {
      console.log(
        `  - Holding already exists: "${anthology.title}" @ "${inventory.name}"`,
      );
    }
  }
}
