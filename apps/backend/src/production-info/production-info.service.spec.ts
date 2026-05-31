import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProductionInfoService } from './production-info.service';
import { ProductionInfo } from './production-info.entity';
import { Anthology } from '../anthology/anthology.entity';
import { CreateProductionInfoDto } from './dtos/create-production-info.dto';
import { UpdateProductionInfoDto } from './dtos/update-production-info.dto';
import { Repository } from 'typeorm';
import { AnthologyStatus, AnthologyPubLevel } from 'src/anthology/types';

export const mockAnthology: Anthology = {
  id: 1,
  title: 'Test Anthology',
  byline: '',
  subtitle: 'A College Essay Anthology',
  description: '',
  genres: [],
  themes: [],
  triggers: [],
  publishedDate: undefined,
  status: AnthologyStatus.ARCHIVED,
  pubLevel: AnthologyPubLevel.ZINE,
  photoUrl: '',
  isbn: '',
  shopifyUrl: '',
  stories: [],
  inventoryHoldings: [],
  productionInfo: new ProductionInfo(),
  omchaiAssignments: [],
  programs: [],
  sponsors: [],
};

export const mockProductionInfo: ProductionInfo = {
  id: 1,
  design_files_link: 'http://example.com',
  cover_image_file_link: '',
  binding_type: '',
  dimensions: '',
  printing_cost: 0,
  print_run: 0,
  weight_in_grams: 0,
  page_count: 0,
  printed_by: '',
  anthology: { id: 1 } as Anthology,
};

describe('ProductionInfoService', () => {
  let service: ProductionInfoService;
  let productionInfoRepository: Repository<ProductionInfo>;
  let anthologyRepository: Repository<Anthology>;

  const mockProductionInfoRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockAnthologyRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductionInfoService,
        {
          provide: getRepositoryToken(ProductionInfo),
          useValue: mockProductionInfoRepository,
        },
        {
          provide: getRepositoryToken(Anthology),
          useValue: mockAnthologyRepository,
        },
      ],
    }).compile();

    service = module.get<ProductionInfoService>(ProductionInfoService);
    productionInfoRepository = module.get(getRepositoryToken(ProductionInfo));
    anthologyRepository = module.get(getRepositoryToken(Anthology));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new production info', async () => {
      const dto: CreateProductionInfoDto = {
        anthology_id: 1,
        design_files_link: 'http://example.com',
      };

      mockAnthologyRepository.findOne.mockResolvedValue(mockAnthology);
      mockProductionInfoRepository.create.mockReturnValue(mockProductionInfo);
      mockProductionInfoRepository.save.mockResolvedValue(mockProductionInfo);

      const result = await service.create(dto);

      expect(anthologyRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(productionInfoRepository.create).toHaveBeenCalledWith(dto);
      expect(productionInfoRepository.save).toHaveBeenCalledWith(
        mockProductionInfo,
      );
      expect(result).toEqual(mockProductionInfo);
    });

    it('should throw NotFoundException if anthology not found', async () => {
      const dto: CreateProductionInfoDto = {
        anthology_id: 999,
      };

      mockAnthologyRepository.findOne.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all production info', async () => {
      mockProductionInfoRepository.find.mockResolvedValue([mockProductionInfo]);

      const result = await service.findAll();

      expect(productionInfoRepository.find).toHaveBeenCalledWith({
        relations: ['anthology'],
      });
      expect(result).toEqual([mockProductionInfo]);
    });
  });

  describe('findOneByAnthologyId', () => {
    it('should return production info for specific anthology', async () => {
      mockProductionInfoRepository.findOne.mockResolvedValue(
        mockProductionInfo,
      );

      const result = await service.findOneByAnthologyId(1);

      expect(productionInfoRepository.findOne).toHaveBeenCalledWith({
        where: { anthology: { id: 1 } },
        relations: ['anthology'],
      });
      expect(result).toEqual(mockProductionInfo);
    });

    it('should throw NotFoundException if production info not found', async () => {
      mockProductionInfoRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneByAnthologyId(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update production info', async () => {
      const dto: UpdateProductionInfoDto = {
        design_files_link: 'http://updated.com',
      };
      const updatedProductionInfo = { ...mockProductionInfo, ...dto };

      mockProductionInfoRepository.findOne.mockResolvedValue(
        mockProductionInfo,
      );
      mockProductionInfoRepository.save.mockResolvedValue(
        updatedProductionInfo,
      );

      const result = await service.update(1, dto);

      expect(productionInfoRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['anthology'],
      });
      expect(productionInfoRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedProductionInfo);
    });

    it('should throw NotFoundException if production info not found', async () => {
      mockProductionInfoRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });

    it('should update anthology if anthology_id is provided', async () => {
      const dto: UpdateProductionInfoDto = { anthology_id: 2 };
      const newAnthology = { id: 2, title: 'New Anthology' } as Anthology;

      mockProductionInfoRepository.findOne.mockResolvedValue(
        mockProductionInfo,
      );
      mockAnthologyRepository.findOne.mockResolvedValue(newAnthology);
      mockProductionInfoRepository.save.mockImplementation((val) => val);

      await service.update(1, dto);

      expect(anthologyRepository.findOne).toHaveBeenCalledWith({
        where: { id: 2 },
      });
      expect(productionInfoRepository.save).toHaveBeenCalled();
    });
  });
});
