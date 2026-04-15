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

  for (const { anthologyTitle, ...data } of OmchaiSeed) {
    const anthology = await anthologyRepo.findOne({
      where: { title: anthologyTitle },
    });

    if (!anthology) {
      console.log(
        `  - Anthology not found: "${anthologyTitle}", skipping omchai`,
      );
      continue;
    }

    const user = usersById.get(data.userId);

    if (!user) {
      console.log(`  - User not found: id=${data.userId}, skipping omchai`);
      continue;
    }

    const exists = await omchaiRepo.findOne({
      where: {
        userId: data.userId,
        anthologyId: anthology.id,
        role: data.role,
      },
    });

    if (!exists) {
      const entity = omchaiRepo.create({
        ...data,
        anthologyId: anthology.id,
        anthology,
        user,
      });
      await omchaiRepo.save(entity);
      console.log(
        `  ✓ Created omchai: userId=${data.userId}, anthology="${anthologyTitle}", role=${data.role}`,
      );
    } else {
      console.log(
        `  - Omchai already exists: userId=${data.userId}, anthology="${anthologyTitle}", role=${data.role}`,
      );
    }
  }
}
