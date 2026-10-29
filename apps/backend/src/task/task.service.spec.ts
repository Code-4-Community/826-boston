import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { TaskAttachment } from './task-attachment.entity';
import { AreaOfWork, TaskStatus } from './types';
import { User } from 'src/users/user.entity';
import { Anthology } from 'src/anthology/anthology.entity';
import { SortOrder } from 'src/shared/types';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: Repository<Task>;
  let anthologyRepository: Repository<Anthology>;

  const mockTaskRepository = {
    find: jest.fn(),
  };

  const mockAnthologyRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: getRepositoryToken(Anthology),
          useValue: mockAnthologyRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get(getRepositoryToken(Task));
    anthologyRepository = module.get(getRepositoryToken(Anthology));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByAnthologyId', () => {
    const mockTask: Task = {
      id: 1,
      name: 'Draft Check-Point',
      areaOfWork: AreaOfWork.CHECKPOINT,
      status: TaskStatus.NOT_STARTED,
      dueBy: new Date('2026-10-10'),
      personInCharge: {
        id: 2,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      } as User,
      anthology: { id: 1 } as Anthology,
      attachments: [
        {
          id: 1,
          fileName: 'First_Draft.pdf',
          fileUrl: 'tasks/attachments/First_Draft.pdf',
        } as TaskAttachment,
      ],
      createdAt: new Date('2026-10-01'),
      updatedAt: new Date('2026-10-01'),
    };

    it('should throw NotFoundException if anthology not found', async () => {
      mockAnthologyRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findByAnthologyId(999, SortOrder.ASC),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return filtered tasks with person in charge and attachments', async () => {
      mockAnthologyRepository.findOne.mockResolvedValue({ id: 1 });
      mockTaskRepository.find.mockResolvedValue([mockTask]);

      const result = await service.findByAnthologyId(
        1,
        SortOrder.DESC,
        TaskStatus.NOT_STARTED,
        AreaOfWork.CHECKPOINT,
        2,
      );

      expect(anthologyRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(taskRepository.find).toHaveBeenCalledWith({
        where: {
          anthology: { id: 1 },
          status: TaskStatus.NOT_STARTED,
          areaOfWork: AreaOfWork.CHECKPOINT,
          personInCharge: { id: 2 },
        },
        relations: ['personInCharge', 'attachments'],
        order: { dueBy: SortOrder.DESC },
      });
      expect(result).toEqual([
        {
          ...mockTask,
          anthology: undefined,
          personInCharge: { id: 2, firstName: 'John', lastName: 'Doe' },
          attachments: [
            {
              fileName: 'First_Draft.pdf',
              fileUrl: 'tasks/attachments/First_Draft.pdf',
            },
          ],
        },
      ]);
    });

    it('should return an empty array if anthology has no tasks', async () => {
      mockAnthologyRepository.findOne.mockResolvedValue({ id: 1 });
      mockTaskRepository.find.mockResolvedValue([]);

      const result = await service.findByAnthologyId(1, SortOrder.ASC);

      expect(result).toEqual([]);
    });

    it('should return a null person in charge if task is unassigned', async () => {
      mockAnthologyRepository.findOne.mockResolvedValue({ id: 1 });
      mockTaskRepository.find.mockResolvedValue([
        { ...mockTask, personInCharge: null },
      ]);

      const result = await service.findByAnthologyId(1, SortOrder.ASC);

      expect(result[0].personInCharge).toBeNull();
    });
  });
});
