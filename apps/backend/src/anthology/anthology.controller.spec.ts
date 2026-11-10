import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
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
    findOne: jest.Mock;
    findAll: jest.Mock;
    findWithFilterSort: jest.Mock;
  };
  let inventoryHoldingService: { findLocationsByAnthology: jest.Mock };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findWithFilterSort: jest.fn(),
    };
    inventoryHoldingService = { findLocationsByAnthology: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnthologyController],
      providers: [
        { provide: AnthologyService, useValue: service },
        { provide: AwsS3Service, useValue: { uploadFile: jest.fn() } },
        {
          provide: InventoryHoldingService,
          useValue: inventoryHoldingService,
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
      description: 'A new collection of student works',
      publicationDate: new Date('2026-06-01'),
      pub_level: AnthologyPubLevel.CHAPBOOK,
      programs: ['after-school'],
      photo_url: 'https://example.com/cover.jpg',
      genres: ['fiction'],
      themes: ['identity'],
      isbn: '978-1-234567-89-0',
      shopify_url: 'https://shop.example.com/new-anthology',
    };

    // The service takes positional arguments, so a dropped or reordered one
    // would silently shift every value after it.
    it('passes the dto fields to service.create in order, with no status', async () => {
      const created = { id: 42, title: dto.title } as Anthology;
      service.create.mockResolvedValue(created);

      const result = await controller.createAnthology(dto);

      expect(service.create).toHaveBeenCalledWith(
        dto.title,
        dto.description,
        dto.pub_level,
        dto.programs,
        dto.photo_url,
        dto.isbn,
        dto.shopify_url,
        dto.genres,
        dto.themes,
        new Date(dto.publicationDate as Date),
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

    it('maps the snake_case dto fields to the entity property names', async () => {
      service.update.mockResolvedValue({ id: 5 } as Anthology);

      await controller.updateAnthology(5, {
        photo_url: 'https://example.com/new.jpg',
        shopify_url: 'https://shop.example.com/new',
        pub_level: AnthologyPubLevel.SIGNATURE,
      });

      expect(service.update).toHaveBeenCalledWith(5, {
        photoUrl: 'https://example.com/new.jpg',
        shopifyUrl: 'https://shop.example.com/new',
        pubLevel: AnthologyPubLevel.SIGNATURE,
      });
      const attrs = service.update.mock.calls[0][1];
      expect(attrs).not.toHaveProperty('photo_url');
      expect(attrs).not.toHaveProperty('shopify_url');
      expect(attrs).not.toHaveProperty('pub_level');
    });

    it('only includes the fields that were sent', async () => {
      service.update.mockResolvedValue({ id: 5 } as Anthology);

      await controller.updateAnthology(5, { title: 'Renamed' });

      expect(Object.keys(service.update.mock.calls[0][1])).toEqual(['title']);
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

  describe('Library gating on public routes', () => {
    const anonymous = { user: undefined };
    const staff = { user: { id: 1 } };

    it('getAnthology 404s for an anonymous caller on an ineligible publication', async () => {
      service.findOne.mockResolvedValue(null);

      await expect(
        controller.getAnthology(1, undefined, anonymous),
      ).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(1, true);
    });

    it('getAnthology does not filter for staff without the library flag', async () => {
      service.findOne.mockResolvedValue({ id: 1 });

      await controller.getAnthology(1, undefined, staff);
      expect(service.findOne).toHaveBeenCalledWith(1, false);
    });

    it('getAnthology filters for staff with library=true', async () => {
      service.findOne.mockResolvedValue(null);

      await expect(controller.getAnthology(1, 'true', staff)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(1, true);
    });

    it('getAnthologyInventory 404s for an anonymous caller on an ineligible publication', async () => {
      service.findOne.mockResolvedValue(null);

      await expect(
        controller.getAnthologyInventory(1, undefined, anonymous),
      ).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(1, true);
      expect(
        inventoryHoldingService.findLocationsByAnthology,
      ).not.toHaveBeenCalled();
    });

    it('getAllAnthologies filters for anonymous callers only', async () => {
      service.findAll.mockResolvedValue([]);

      await controller.getAllAnthologies(undefined, anonymous);
      expect(service.findAll).toHaveBeenLastCalledWith(true);

      await controller.getAllAnthologies(undefined, staff);
      expect(service.findAll).toHaveBeenLastCalledWith(false);
    });

    it('filterSort filters for anonymous callers and Library requests, not the Tracker', async () => {
      service.findWithFilterSort.mockResolvedValue([]);

      await controller.filterSort({}, anonymous);
      expect(service.findWithFilterSort).toHaveBeenLastCalledWith({}, true);

      await controller.filterSort({ library: true }, staff);
      expect(service.findWithFilterSort).toHaveBeenLastCalledWith(
        { library: true },
        true,
      );

      await controller.filterSort({}, staff);
      expect(service.findWithFilterSort).toHaveBeenLastCalledWith({}, false);
    });
  });
});
