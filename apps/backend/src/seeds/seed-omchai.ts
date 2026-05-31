import { Anthology } from 'src/anthology/anthology.entity';
import { Omchai } from 'src/omchai/omchai.entity';
import { User } from 'src/users/user.entity';
import { DataSource } from 'typeorm';
import { OmchaiSeed } from './omchai.seed';

export async function seedOmchais(dataSource: DataSource) {
  const omchaiRepo = dataSource.getRepository(Omchai);
  const anthologyRepo = dataSource.getRepository(Anthology);
  const userRepo = dataSource.getRepository(User);

  console.log('Seeding omchais...');

  const allUsers = await userRepo.find();
  const usersById = new Map(allUsers.map((u) => [u.id, u]));

  for (const omchai of OmchaiSeed) {
    const anthology = await anthologyRepo.findOne({
      where: { id: omchai.anthology_id },
    });

    if (!anthology) {
      console.log(
        `  - Anthology with id not found: "${omchai.anthology_id}", skipping omchai`,
      );
      continue;
    }

    const user = usersById.get(omchai.user_id);

    if (!user) {
      console.log(`  - User with id not found: id=${omchai.user_id}, skipping omchai`);
      continue;
    }

    const exists = await omchaiRepo.findOne({
      where: {
        user: { id: omchai.user_id },
        anthology: { id: anthology.id },
        role: omchai.role,
      },
    });

    if (!exists) {
      const entity = omchaiRepo.create({
        user: { id: omchai.user_id },
        anthology: { id: anthology.id },
        role: omchai.role,
        datetimeAssigned: omchai.datetimeAssigned,
      });
      await omchaiRepo.save(entity);
      console.log(
        `  ✓ Created omchai: userId=${omchai.user_id}, anthology="${anthology.title}", role=${omchai.role}`,
      );
    } else {
      console.log(
        `  - Omchai already exists: userId=${omchai.user_id}, anthology="${anthology.title}", role=${omchai.role}`,
      );
    }
  }
}
