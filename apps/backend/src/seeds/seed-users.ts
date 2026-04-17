import { User } from 'src/users/user.entity';
import { DataSource } from 'typeorm';
import { UsersSeed } from './users.seed';

export async function seedUsers(dataSource: DataSource) {
  const repository = dataSource.getRepository(User);

  console.log('Seeding users...');

  for (const data of UsersSeed) {
    const exists = await repository.findOne({ where: { email: data.email } });

    if (!exists) {
      const entity = repository.create(data);
      await repository.save(entity);
      console.log(`  ✓ Created user: ${entity.firstName}`);
    } else {
      console.log(`  - User already exists: ${data.firstName}`);
    }
  }
}
