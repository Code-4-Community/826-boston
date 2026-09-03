import { Test, TestingModule } from '@nestjs/testing';
import { OmchaiController } from './omchai.controller';
import { OmchaiService } from './omchai.service';
import { CreateOmchaiDto } from './dtos/create-omchai.dto';
import { EditOmchaiDto } from './dtos/edit-omchai.dto';
import { OmchaiRole } from './omchai.entity';

const omchaiDto1: CreateOmchaiDto = {
  anthologyId: 1,
  userId: 1,
  role: OmchaiRole.OWNER,
  datetimeAssigned: new Date(),
};

describe('OmchaiController', () => {
  let controller: OmchaiController;
  let service: OmchaiService;

  const mockOmchaiService = {
    create: jest.fn(),
    createMany: jest.fn(),
    findAll: jest.fn(),
    findByAnthologyId: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OmchaiController],
      providers: [
        {
          provide: OmchaiService,
          useValue: mockOmchaiService,
        },
      ],
    }).compile();

    controller = module.get<OmchaiController>(OmchaiController);
    service = module.get<OmchaiService>(OmchaiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an omchai', () => {
      mockOmchaiService.create.mockReturnValue('created');

      const result = controller.create(omchaiDto1);

      expect(service.create).toHaveBeenCalledWith(omchaiDto1);
      expect(result).toBe('created');
    });
  });

  describe('findAll', () => {
    it('should return all omchai', () => {
      mockOmchaiService.findAll.mockReturnValue('all omchai');

      const result = controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toBe('all omchai');
    });
  });

  describe('findByAnthologyId', () => {
    it('should return omchai by anthology id', () => {
      mockOmchaiService.findByAnthologyId.mockReturnValue(
        'omchai for anthology',
      );

      const result = controller.findByAnthologyId(1);

      expect(service.findByAnthologyId).toHaveBeenCalledWith(1);
      expect(result).toBe('omchai for anthology');
    });
  });

  describe('update', () => {
    it('should update an omchai', () => {
      const dto: EditOmchaiDto = {
        role: OmchaiRole.MANAGER,
      };
      mockOmchaiService.update.mockReturnValue('updated');

      const result = controller.update(1, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toBe('updated');
    });
  });
});
