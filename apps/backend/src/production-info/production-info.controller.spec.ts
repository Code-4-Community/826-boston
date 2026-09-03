import { Test, TestingModule } from '@nestjs/testing';
import { ProductionInfoController } from './production-info.controller';
import { ProductionInfoService } from './production-info.service';
import { CreateProductionInfoDto } from './dtos/create-production-info.dto';
import { UpdateProductionInfoDto } from './dtos/update-production-info.dto';
import { ProductionInfo } from './production-info.entity';
import { Anthology } from 'src/anthology/anthology.entity';

describe('ProductionInfoController', () => {
  let controller: ProductionInfoController;
  let service: ProductionInfoService;

  const mockProductionInfo: ProductionInfo = {
    id: 0,
    anthology: { id: 1 } as Anthology,
  };

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOneByAnthologyId: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductionInfoController],
      providers: [
        {
          provide: ProductionInfoService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductionInfoController>(ProductionInfoController);
    service = module.get<ProductionInfoService>(ProductionInfoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a production info', async () => {
      const dto: CreateProductionInfoDto = { anthology_id: 1 };
      mockService.create.mockResolvedValue(mockProductionInfo);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockProductionInfo);
    });
  });

  describe('findAll', () => {
    it('should return all production info', async () => {
      mockService.findAll.mockResolvedValue([mockProductionInfo]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockProductionInfo]);
    });
  });

  describe('findOneByAnthologyId', () => {
    it('should return production info by anthology id', async () => {
      mockService.findOneByAnthologyId.mockResolvedValue(mockProductionInfo);

      const result = await controller.findOneByAnthologyId(1);

      expect(service.findOneByAnthologyId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProductionInfo);
    });
  });

  describe('update', () => {
    it('should update production info', async () => {
      const dto: UpdateProductionInfoDto = { design_files_link: 'updated' };
      mockService.update.mockResolvedValue({ ...mockProductionInfo, ...dto });

      const result = await controller.update(1, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ ...mockProductionInfo, ...dto });
    });
  });
});
