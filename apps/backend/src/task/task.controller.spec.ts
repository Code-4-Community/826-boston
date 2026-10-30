import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskResponseDto } from './dtos/task-response.dto';
import { CreateTaskDto } from './dtos/create-task.dto';
import { AreaOfWork, TaskStatus } from './types';
import { SortOrder } from 'src/shared/types';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockTaskService = {
    findByAnthologyId: jest.fn(),
    create: jest.fn(),
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
});
