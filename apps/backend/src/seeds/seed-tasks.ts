import { Anthology } from 'src/anthology/anthology.entity';
import { Task } from 'src/task/task.entity';
import { User } from 'src/users/user.entity';
import { DataSource } from 'typeorm';
import { TasksSeed } from './tasks.seed';

export async function seedTasks(dataSource: DataSource) {
  const taskRepo = dataSource.getRepository(Task);
  const anthologyRepo = dataSource.getRepository(Anthology);
  const userRepo = dataSource.getRepository(User);

  console.log('Seeding tasks...');

  const allUsers = await userRepo.find();
  const usersById = new Map(allUsers.map((u) => [u.id, u]));

  for (const task of TasksSeed) {
    const anthology = await anthologyRepo.findOne({
      where: { id: task.anthology_id },
    });

    if (!anthology) {
      console.log(
        `  - Anthology with id not found: "${task.anthology_id}", skipping task`,
      );
      continue;
    }

    if (task.person_in_charge_id && !usersById.has(task.person_in_charge_id)) {
      console.log(
        `  - User with id not found: id=${task.person_in_charge_id}, skipping task`,
      );
      continue;
    }

    const exists = await taskRepo.findOne({
      where: { name: task.name, anthology: { id: anthology.id } },
    });

    if (!exists) {
      const entity = taskRepo.create({
        name: task.name,
        note: task.note,
        areaOfWork: task.areaOfWork,
        status: task.status,
        personInCharge: { id: task.person_in_charge_id },
        timeFrame: task.timeFrame,
        dueBy: task.dueBy,
        anthology: { id: anthology.id },
      });
      await taskRepo.save(entity);
      console.log(
        `  ✓ Created task: name="${task.name}", anthology="${anthology.title}"`,
      );
    } else {
      console.log(
        `  - Task already exists: name="${task.name}", anthology="${anthology.title}"`,
      );
    }
  }
}
