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
  const usersByEmail = new Map(allUsers.map((u) => [u.email, u]));

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

    const user = usersByEmail.get(data.userEmail);

    if (!user) {
      console.log(
        `  - User not found: email=${data.userEmail}, skipping omchai`,
      );
      continue;
    }

    const userId = allUsers.find((u) => u.email === data.userEmail)?.id;
    const exists = await omchaiRepo.findOne({
      where: {
        userId: userId,
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
        `  ✓ Created omchai: userEmail=${data.userEmail}, anthology="${anthologyTitle}", role=${data.role}`,
      );
    } else {
      console.log(
        `  - Omchai already exists: userEmail=${data.userEmail}, anthology="${anthologyTitle}", role=${data.role}`,
      );
    }
  }
}
