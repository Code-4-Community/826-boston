import { DataSource } from 'typeorm';
import { Anthology } from 'src/anthology/anthology.entity';
import { ProductionInfo } from 'src/production-info/production-info.entity';
import { AnthologiesSeed } from './anthologies.seed';
import { ProductionInfoSeed } from './production-info.seed';

export async function seedAnthologies(dataSource: DataSource) {
  const anthologyRepo = dataSource.getRepository(Anthology);
  const piRepo = dataSource.getRepository(ProductionInfo);

  console.log('Seeding anthologies...');

  for (const data of AnthologiesSeed) {
    const exists = await anthologyRepo.findOne({
      where: { title: data.title },
    });

    if (!exists) {
      const savedAnthology = await anthologyRepo.save(
        anthologyRepo.create(data),
      );
      console.log(`  ✓ Created anthology: ${savedAnthology.title}`);
    } else {
      console.log(`  - Anthology already exists: ${data.title}`);
    }
  }

  console.log('Seeding production info...');

  // Anthology ids are generated in AnthologiesSeed order, so `anthology_id` is
  // that 1-indexed position. Look the anthology up by it and attach the row —
  // previously these were saved unlinked, and re-inserted on every seed run.
  const anthologies = await anthologyRepo.find({
    order: { id: 'ASC' },
    relations: ['productionInfo'],
  });

  for (const { anthology_id, ...piData } of ProductionInfoSeed) {
    const anthology = anthologies[anthology_id - 1];

    if (!anthology) {
      console.log(
        `  - Anthology at position ${anthology_id} not found, skipping production info`,
      );
      continue;
    }

    if (anthology.productionInfo) {
      console.log(`  - Production info already exists for: ${anthology.title}`);
      continue;
    }

    const pi = await piRepo.save(piRepo.create(piData));

    // Anthology owns the join column, so the link is saved from this side.
    anthology.productionInfo = pi;
    await anthologyRepo.save(anthology);

    console.log(`  ✓ Created production info for: ${anthology.title}`);
  }
}
