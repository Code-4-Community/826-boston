import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { Anthology } from 'src/anthology/anthology.entity';
import { SortOrder } from 'src/shared/types';
import { AreaOfWork, TaskStatus } from './types';
import { TaskResponseDto } from './dtos/task-response.dto';
import { CreateTaskDto } from './dtos/create-task.dto';
import { User } from 'src/users/user.entity';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Anthology)
    private anthologyRepository: Repository<Anthology>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

    return tasks.map((t) => this.toResponseDto(t));
  }

  async create(
    anthologyId: number,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    const anthology = await this.anthologyRepository.findOne({
      where: { id: anthologyId },
    });
    if (!anthology) {
      throw new NotFoundException(`Anthology with ID ${anthologyId} not found`);
    }

    let personInCharge: User | undefined;
    if (createTaskDto.personInChargeId) {
      const user = await this.userRepository.findOne({
        where: { id: createTaskDto.personInChargeId },
      });

      if (!user) {
        throw new BadRequestException(
          `User with ID ${createTaskDto.personInChargeId} not found`,
        );
      }
      personInCharge = user;
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      anthology,
      personInCharge,
    });
    return this.toResponseDto(await this.taskRepository.save(task));
  }

  async update(
    anthologyId: number,
    taskId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, anthology: { id: anthologyId } },
      relations: ['personInCharge', 'attachments'],
    });
    if (!task) {
      throw new NotFoundException(
        `Task with ID ${taskId} not found in this anthology`,
      );
    }

    const { personInChargeId, ...fields } = updateTaskDto;
    if (personInChargeId === null) {
      task.personInCharge = null;
    } else if (personInChargeId) {
      const user = await this.userRepository.findOne({
        where: { id: personInChargeId },
      });

      if (!user) {
        throw new BadRequestException(
          `User with ID ${personInChargeId} not found`,
        );
      }
      task.personInCharge = user;
    }

    if (fields.name === null) {
      throw new BadRequestException('Task name cannot be null');
    }

    if (fields.status === null) {
      throw new BadRequestException('Task status cannot be null');
    }

    Object.assign(task, fields);
    return this.toResponseDto(await this.taskRepository.save(task));
  }

  private toResponseDto(t: Task): TaskResponseDto {
    return {
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
      attachments: (t.attachments ?? []).map((a) => ({
        id: a.id,
        fileName: a.fileName,
        fileUrl: a.fileUrl,
      })),
    };
  }
}
