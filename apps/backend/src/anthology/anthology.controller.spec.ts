import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { AnthologyController } from './anthology.controller';
import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import { CreateAnthologyDto } from './dtos/create-anthology.dto';
import { AnthologyPubLevel, AnthologyStatus } from './types';
import { AwsS3Service } from '../aws/aws-s3.service';
import { InventoryHoldingService } from '../inventory-holding/inventory-holding.service';
import { User } from '../users/user.entity';
import { Role } from '../users/types';

describe('AnthologyController', () => {
  let controller: AnthologyController;
  let service: {
    create: jest.Mock;
    update: jest.Mock;
    findWithFilterSort: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      update: jest.fn(),
      findWithFilterSort: jest.fn(),
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

  describe('filterSort', () => {
    const asRequest = (user?: Partial<User> & Record<string, unknown>) =>
      ({ user } as Request & { user?: Partial<User> });

    it('allows anonymous requests without a staff filter', async () => {
      service.findWithFilterSort.mockResolvedValue([]);

      await controller.filterSort({ search: 'moon' }, asRequest());

      expect(service.findWithFilterSort).toHaveBeenCalledWith({
        search: 'moon',
      });
    });

    it('allows a staff filter from a logged-in user', async () => {
      service.findWithFilterSort.mockResolvedValue([]);

      await controller.filterSort(
        { staffIds: [3] },
        asRequest({ id: 5, role: Role.STANDARD }),
      );

      expect(service.findWithFilterSort).toHaveBeenCalledWith({
        staffIds: [3],
      });
    });

    it('rejects a staff filter from an anonymous request', () => {
      expect(() =>
        controller.filterSort({ staffIds: [3] }, asRequest()),
      ).toThrow(UnauthorizedException);
      expect(service.findWithFilterSort).not.toHaveBeenCalled();
    });

    it('rejects a staff filter from a token-only user with no database id', () => {
      expect(() =>
        controller.filterSort(
          { staffIds: [3] },
          asRequest({ idUser: 'cognito-sub', role: Role.ADMIN }),
        ),
      ).toThrow(UnauthorizedException);
    });

    it('allows an empty staff list from an anonymous request', async () => {
      service.findWithFilterSort.mockResolvedValue([]);

      await controller.filterSort({ staffIds: [] }, asRequest());

      expect(service.findWithFilterSort).toHaveBeenCalled();
    });
  });
});
