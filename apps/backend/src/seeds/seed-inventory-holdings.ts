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

  for (const {
    anthologyTitle,
    inventoryName,
    numCopies,
  } of InventoryHoldingsSeed) {
    const anthology = await anthologyRepo.findOne({
      where: { title: anthologyTitle },
    });

    if (!anthology) {
      console.log(
        `  - Anthology not found: "${anthologyTitle}", skipping holding`,
      );
      continue;
    }

    const inventory = await inventoryRepo.findOne({
      where: { name: inventoryName },
    });

    if (!inventory) {
      console.log(
        `  - Inventory not found: "${inventoryName}", skipping holding`,
      );
      continue;
    }

    const exists = await holdingRepo.findOne({
      where: {
        inventoryId: inventory.id,
        anthologyId: anthology.id,
      },
    });

    if (!exists) {
      const entity = holdingRepo.create({
        inventoryId: inventory.id,
        inventory,
        anthologyId: anthology.id,
        anthology,
        numCopies,
      });
      await holdingRepo.save(entity);
      console.log(
        `  ✓ Created holding: "${anthologyTitle}" @ "${inventoryName}" (${numCopies} copies)`,
      );
    } else {
      console.log(
        `  - Holding already exists: "${anthologyTitle}" @ "${inventoryName}"`,
      );
    }
  }
}
