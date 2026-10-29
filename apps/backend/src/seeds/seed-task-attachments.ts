import { Task } from 'src/task/task.entity';
import { TaskAttachment } from 'src/task/task-attachment.entity';
import { DataSource } from 'typeorm';
import { TaskAttachmentsSeed } from './taskAttachments.seed';

export async function seedTaskAttachments(dataSource: DataSource) {
  const attachmentRepo = dataSource.getRepository(TaskAttachment);
  const taskRepo = dataSource.getRepository(Task);

  console.log('Seeding task attachments...');

  for (const attachment of TaskAttachmentsSeed) {
    const task = await taskRepo.findOne({
      where: { id: attachment.task_id },
    });

    if (!task) {
      console.log(
        `  - Task with id ${attachment.task_id} not found, skipping attachment`,
      );
      continue;
    }

    const exists = await attachmentRepo.findOne({
      where: {
        fileName: attachment.fileName,
        task: { id: task.id },
      },
    });

    if (!exists) {
      await attachmentRepo.save(
        attachmentRepo.create({
          fileName: attachment.fileName,
          fileUrl: attachment.fileUrl,
          task: { id: task.id },
        }),
      );
      console.log(
        `  ✓ Created attachment: "${attachment.fileName}" for task "${task.name}"`,
      );
    } else {
      console.log(
        `  - Attachment already exists: "${attachment.fileName}" for task "${task.name}"`,
      );
    }
  }
}
