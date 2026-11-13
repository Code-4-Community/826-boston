import { Test, TestingModule } from '@nestjs/testing';
import { AnthologyController } from './anthology.controller';
import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import { CreateAnthologyDto } from './dtos/create-anthology.dto';
import { AnthologyPubLevel, AnthologyStatus } from './types';
import { AwsS3Service } from '../aws/aws-s3.service';
import { InventoryHoldingService } from '../inventory-holding/inventory-holding.service';

describe('AnthologyController', () => {
  let controller: AnthologyController;
  let service: {
    create: jest.Mock;
    update: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnthologyController],
      providers: [
        { provide: AnthologyService, useValue: service },
        { provide: AwsS3Service, useValue: { uploadFile: jest.fn() } },
        {
          provide: InventoryHoldingService,
          useValue: { findLocationsByAnthology: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AnthologyController>(AnthologyController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAnthology', () => {
    const dto: CreateAnthologyDto = {
      title: 'New Anthology',
      pub_level: AnthologyPubLevel.CHAPBOOK,
      programs: ['Tutoring'],
      publicationDate: '2026-06-01',
      owner_ids: [3, 7],
    };

    // The service takes positional arguments, so a dropped or reordered one
    // would silently shift every value after it.
    it('passes the dto fields to service.create in order, with no status', async () => {
      const created = { id: 42, title: dto.title } as Anthology;
      service.create.mockResolvedValue(created);

      const result = await controller.createAnthology(dto);

      expect(service.create).toHaveBeenCalledWith(
        dto.title,
        dto.pub_level,
        dto.owner_ids,
        dto.programs,
        dto.publicationDate,
      );
      expect(result).toBe(created);
    });
  });

  describe('updateAnthology', () => {
    it('passes status through to service.update', async () => {
      service.update.mockResolvedValue({ id: 5 } as Anthology);

      await controller.updateAnthology(5, {
        status: AnthologyStatus.DRAFTING,
      });

      expect(service.update).toHaveBeenCalledWith(5, {
        status: AnthologyStatus.DRAFTING,
      });
    });

    it('returns the updated anthology', async () => {
      const updated = { id: 5, status: AnthologyStatus.ARCHIVED } as Anthology;
      service.update.mockResolvedValue(updated);

      const result = await controller.updateAnthology(5, {
        status: AnthologyStatus.ARCHIVED,
      });

      expect(result).toBe(updated);
    });
  });
});
