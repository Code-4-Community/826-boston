import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
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
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockAnthologyRepository = {
    findOne: jest.fn(),
  };

  const mockUserRepository = {
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
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
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
              id: 1,
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

  describe('create', () => {
    const mockAnthology = { id: 1 } as Anthology;
    const mockUser = {
      id: 2,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    } as User;
    const createTaskDto: CreateTaskDto = {
      name: 'Draft Check-Point',
      areaOfWork: AreaOfWork.CHECKPOINT,
      personInChargeId: 2,
    };
    const savedTask = {
      id: 1,
      name: 'Draft Check-Point',
      areaOfWork: AreaOfWork.CHECKPOINT,
      status: TaskStatus.NOT_STARTED,
      anthology: mockAnthology,
      personInCharge: mockUser,
      createdAt: new Date('2026-10-01'),
      updatedAt: new Date('2026-10-01'),
    } as Task;

    it('should throw NotFoundException if anthology not found', async () => {
      mockAnthologyRepository.findOne.mockResolvedValue(null);

      await expect(service.create(999, createTaskDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if person in charge not found', async () => {
      mockAnthologyRepository.findOne.mockResolvedValue(mockAnthology);
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(1, createTaskDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should successfully create a task', async () => {
      mockAnthologyRepository.findOne.mockResolvedValue(mockAnthology);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockTaskRepository.create.mockReturnValue(savedTask);
      mockTaskRepository.save.mockResolvedValue(savedTask);

      const result = await service.create(1, createTaskDto);

      expect(taskRepository.create).toHaveBeenCalledWith({
        ...createTaskDto,
        anthology: mockAnthology,
        personInCharge: mockUser,
      });
      expect(result).toEqual({
        id: 1,
        name: 'Draft Check-Point',
        areaOfWork: AreaOfWork.CHECKPOINT,
        status: TaskStatus.NOT_STARTED,
        createdAt: new Date('2026-10-01'),
        updatedAt: new Date('2026-10-01'),
        personInCharge: { id: 2, firstName: 'John', lastName: 'Doe' },
        attachments: [],
      });
    });

    it('should successfully create a task without a person in charge', async () => {
      const unassignedTask = { ...savedTask, personInCharge: undefined };
      mockAnthologyRepository.findOne.mockResolvedValue(mockAnthology);
      mockTaskRepository.create.mockReturnValue(unassignedTask);
      mockTaskRepository.save.mockResolvedValue(unassignedTask);

      const result = await service.create(1, { name: 'Draft Check-Point' });

      expect(taskRepository.create).toHaveBeenCalledWith({
        name: 'Draft Check-Point',
        anthology: mockAnthology,
        personInCharge: undefined,
      });
      expect(result).toEqual({
        id: 1,
        name: 'Draft Check-Point',
        areaOfWork: AreaOfWork.CHECKPOINT,
        status: TaskStatus.NOT_STARTED,
        createdAt: new Date('2026-10-01'),
        updatedAt: new Date('2026-10-01'),
        personInCharge: null,
        attachments: [],
      });
    });
  });

  describe('update', () => {
    const existingTask = {
      id: 1,
      name: 'Draft Check-Point',
      status: TaskStatus.NOT_STARTED,
      anthology: { id: 1 } as Anthology,
      personInCharge: {
        id: 2,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      } as User,
      attachments: [],
      createdAt: new Date('2026-10-01'),
      updatedAt: new Date('2026-10-01'),
    } as Task;

    it('should throw NotFoundException if task not found in this anthology', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, 999, {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should unassign the person in charge if personInChargeId is null', async () => {
      mockTaskRepository.findOne.mockResolvedValue({ ...existingTask });
      mockTaskRepository.save.mockImplementation(async (task) => task);

      const result = await service.update(1, 1, {
        personInChargeId: null,
      } as unknown as UpdateTaskDto);

      expect(result.personInCharge).toBeNull();
    });

    it('should throw BadRequestException if person in charge not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue({ ...existingTask });
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(1, 1, { personInChargeId: 999 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if name is null', async () => {
      mockTaskRepository.findOne.mockResolvedValue({ ...existingTask });

      await expect(
        service.update(1, 1, { name: null } as unknown as UpdateTaskDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if status is null', async () => {
      mockTaskRepository.findOne.mockResolvedValue({ ...existingTask });

      await expect(
        service.update(1, 1, { status: null } as unknown as UpdateTaskDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should successfully update a task', async () => {
      mockTaskRepository.findOne.mockResolvedValue({ ...existingTask });
      mockUserRepository.findOne.mockResolvedValue({
        id: 3,
        firstName: 'Jane',
        lastName: 'Smith',
      } as User);
      mockTaskRepository.save.mockImplementation(async (task) => task);

      const result = await service.update(1, 1, {
        status: TaskStatus.COMPLETE,
        personInChargeId: 3,
      });

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, anthology: { id: 1 } },
        relations: ['personInCharge', 'attachments'],
      });
      expect(result).toEqual({
        id: 1,
        name: 'Draft Check-Point',
        status: TaskStatus.COMPLETE,
        createdAt: new Date('2026-10-01'),
        updatedAt: new Date('2026-10-01'),
        personInCharge: { id: 3, firstName: 'Jane', lastName: 'Smith' },
        attachments: [],
      });
    });
  });
});
