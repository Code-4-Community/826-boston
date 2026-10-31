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
import { SortOrder, UploadedFileType } from 'src/shared/types';
import { AwsS3Service } from 'src/aws/aws-s3.service';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: Repository<Task>;

  const mockTaskRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockAnthologyRepository = {
    findOne: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockTaskAttachmentRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockAwsS3Service = {
    uploadFile: jest.fn(),
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
        {
          provide: getRepositoryToken(TaskAttachment),
          useValue: mockTaskAttachmentRepository,
        },
        {
          provide: AwsS3Service,
          useValue: mockAwsS3Service,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get(getRepositoryToken(Task));
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

  describe('remove', () => {
    const existingTask = {
      id: 1,
      name: 'Draft Check-Point',
      status: TaskStatus.NOT_STARTED,
      anthology: { id: 1 } as Anthology,
      createdAt: new Date('2026-10-01'),
      updatedAt: new Date('2026-10-01'),
    } as Task;

    it('should throw NotFoundException if task not found in this anthology', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1, 999)).rejects.toThrow(NotFoundException);
    });

    it('should successfully delete a task', async () => {
      mockTaskRepository.findOne.mockResolvedValue(existingTask);
      mockTaskRepository.remove.mockResolvedValue(existingTask);

      await service.remove(1, 1);

      expect(taskRepository.remove).toHaveBeenCalledWith(existingTask);
    });
  });

  describe('uploadAttachment', () => {
    const existingAttachment = {
      id: 1,
      fileName: 'Outline.docx',
      fileUrl: 'https://s3.example.com/outline.docx',
    } as TaskAttachment;

    const existingTask = {
      id: 1,
      name: 'Draft Check-Point',
      status: TaskStatus.NOT_STARTED,
      anthology: { id: 1 } as Anthology,
      personInCharge: null,
      createdAt: new Date('2026-10-01'),
      updatedAt: new Date('2026-10-01'),
    } as Task;

    const file: UploadedFileType = {
      fieldname: 'file',
      originalname: 'First_Draft.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      buffer: Buffer.from('file contents'),
      size: 13,
    };

    const fileUrl = 'https://s3.example.com/first-draft.pdf';

    it('should throw NotFoundException if task not found in this anthology', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.uploadAttachment(1, 999, file)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should successfully upload an attachment and return the task with all attachments', async () => {
      mockTaskRepository.findOne.mockResolvedValue({
        ...existingTask,
        attachments: [existingAttachment],
      });
      mockAwsS3Service.uploadFile.mockResolvedValue(fileUrl);
      mockTaskAttachmentRepository.create.mockImplementation((data) => ({
        id: 2,
        ...data,
      }));
      mockTaskAttachmentRepository.save.mockImplementation(
        async (attachment) => attachment,
      );

      const result = await service.uploadAttachment(1, 1, file);

      expect(result.attachments).toEqual([
        {
          id: 1,
          fileName: 'Outline.docx',
          fileUrl: existingAttachment.fileUrl,
        },
        { id: 2, fileName: 'First_Draft.pdf', fileUrl },
      ]);
    });
  });
});
