import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { Anthology } from 'src/anthology/anthology.entity';
import { SortOrder } from 'src/shared/types';
import { AreaOfWork, TaskStatus } from './types';
import { TaskResponseDto } from './dtos/task-response.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Anthology)
    private anthologyRepository: Repository<Anthology>,
  ) {}

  async findByAnthologyId(
    anthologyId: number,
    sort: SortOrder,
    status?: TaskStatus,
    areaOfWork?: AreaOfWork,
    personInChargeId?: number,
  ): Promise<TaskResponseDto[]> {
    const anthology = await this.anthologyRepository.findOne({
      where: { id: anthologyId },
    });

    if (!anthology) {
      throw new NotFoundException(`Anthology with ID ${anthologyId} not found`);
    }

    const tasks = await this.taskRepository.find({
      where: {
        anthology: { id: anthologyId },
        status,
        areaOfWork,
        personInCharge: { id: personInChargeId },
      },
      relations: ['personInCharge', 'attachments'],
      order: { dueBy: sort },
    });

    return tasks.map((t) => ({
      id: t.id,
      name: t.name,
      note: t.note,
      areaOfWork: t.areaOfWork,
      status: t.status,
      timeFrame: t.timeFrame,
      dueBy: t.dueBy,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      personInCharge: t.personInCharge
        ? {
            id: t.personInCharge.id,
            firstName: t.personInCharge.firstName,
            lastName: t.personInCharge.lastName,
          }
        : null,
      attachments: t.attachments.map((a) => ({
        fileName: a.fileName,
        fileUrl: a.fileUrl,
      })),
    }));
  }
}
