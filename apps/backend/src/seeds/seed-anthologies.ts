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

  for (const piData of ProductionInfoSeed) {
    const pi = piRepo.create(piData);
    await piRepo.save(pi);
    console.log(`  ✓ Created production info with id: ${pi.id}`);
  }
}
