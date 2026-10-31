import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskResponseDto } from './dtos/task-response.dto';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { AreaOfWork, TaskStatus } from './types';
import { SortOrder, UploadedFileType } from 'src/shared/types';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockTaskService = {
    findByAnthologyId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    uploadAttachment: jest.fn(),
    removeAttachment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findByAnthologyId', () => {
    const mockTask: TaskResponseDto = {
      id: 1,
      name: 'Draft Check-Point',
      areaOfWork: AreaOfWork.CHECKPOINT,
      status: TaskStatus.NOT_STARTED,
      dueBy: new Date('2026-10-10'),
      createdAt: new Date('2026-10-01'),
      updatedAt: new Date('2026-10-01'),
      personInCharge: { id: 1, firstName: 'John', lastName: 'Doe' },
      attachments: [],
    };

    it('should return tasks by anthology id', async () => {
      mockTaskService.findByAnthologyId.mockResolvedValue([mockTask]);

      const result = await controller.findByAnthologyId(1, SortOrder.ASC);

      expect(service.findByAnthologyId).toHaveBeenCalledWith(
        1,
        SortOrder.ASC,
        undefined,
        undefined,
        undefined,
      );
      expect(result).toEqual([mockTask]);
    });
  });

  describe('create', () => {
    const createTaskDto: CreateTaskDto = { name: 'Draft Check-Point' };
    const mockTask: TaskResponseDto = {
      id: 1,
      name: 'Draft Check-Point',
      status: TaskStatus.NOT_STARTED,
      createdAt: new Date('2026-10-01'),
      updatedAt: new Date('2026-10-01'),
      personInCharge: null,
      attachments: [],
    };

    it('should create a task for the anthology', async () => {
      mockTaskService.create.mockResolvedValue(mockTask);

      const result = await controller.create(1, createTaskDto);

      expect(service.create).toHaveBeenCalledWith(1, createTaskDto);
      expect(result).toEqual(mockTask);
    });
  });

  describe('update', () => {
    const updateTaskDto: UpdateTaskDto = { status: TaskStatus.COMPLETE };
    const mockTask: TaskResponseDto = {
      id: 2,
      name: 'Draft Check-Point',
      status: TaskStatus.COMPLETE,
      createdAt: new Date('2026-10-01'),
      updatedAt: new Date('2026-10-01'),
      personInCharge: null,
      attachments: [],
    };

    it('should update a task in the anthology', async () => {
      mockTaskService.update.mockResolvedValue(mockTask);

      const result = await controller.update(1, 2, updateTaskDto);

      expect(service.update).toHaveBeenCalledWith(1, 2, updateTaskDto);
      expect(result).toEqual(mockTask);
    });
  });

  describe('remove', () => {
    it('should delete a task in the anthology', async () => {
      mockTaskService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1, 2);

      expect(service.remove).toHaveBeenCalledWith(1, 2);
      expect(result).toEqual({ message: 'Task deleted successfully' });
    });
  });

  describe('uploadAttachment', () => {
    const file: UploadedFileType = {
      fieldname: 'file',
      originalname: 'First_Draft.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      buffer: Buffer.from('file contents'),
      size: 13,
    };
    const mockTask: TaskResponseDto = {
      id: 2,
      name: 'Draft Check-Point',
      status: TaskStatus.NOT_STARTED,
      createdAt: new Date('2026-10-01'),
      updatedAt: new Date('2026-10-01'),
      personInCharge: null,
      attachments: [
        {
          id: 1,
          fileName: 'First_Draft.pdf',
          fileUrl: 'https://s3.example.com/first-draft.pdf',
        },
      ],
    };

    it('should upload an attachment to a task in the anthology', async () => {
      mockTaskService.uploadAttachment.mockResolvedValue(mockTask);

      const result = await controller.uploadAttachment(1, 2, file);

      expect(service.uploadAttachment).toHaveBeenCalledWith(1, 2, file);
      expect(result).toEqual(mockTask);
    });
  });

  describe('removeAttachment', () => {
    it('should delete an attachment from a task in the anthology', async () => {
      mockTaskService.removeAttachment.mockResolvedValue(undefined);

      const result = await controller.removeAttachment(1, 2, 3);

      expect(service.removeAttachment).toHaveBeenCalledWith(1, 2, 3);
      expect(result).toEqual({ message: 'Attachment deleted successfully' });
    });
  });
});
