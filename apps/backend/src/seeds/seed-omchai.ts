import { Omchai } from 'src/omchai/omchai.entity';
import { DataSource } from 'typeorm';
import { OmchaiSeed } from './omchai.seed';

export async function seedOmchais(dataSource: DataSource) {
  const repository = dataSource.getRepository(Omchai);

  console.log('Seeding omchais...');

  for (const data of OmchaiSeed) {
    const exists = await repository.findOne({
      where: {
        userId: data.userId,
        anthologyId: data.anthologyId,
        role: data.role,
      },
    });

    if (!exists) {
      const entity = repository.create(data);
      await repository.save(entity);
      console.log(`  ✓ Created omchai`);
    } else {
      console.log(`  - Omchai already exists`);
    }
  }
}
