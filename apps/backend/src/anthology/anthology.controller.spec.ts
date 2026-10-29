import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { AnthologyController } from './anthology.controller';
import { AnthologyService } from './anthology.service';
import { AwsS3Service } from '../aws/aws-s3.service';
import { InventoryHoldingService } from '../inventory-holding/inventory-holding.service';
import { User } from '../users/user.entity';
import { Role } from '../users/types';

describe('AnthologyController', () => {
  let controller: AnthologyController;

  const mockAnthologyService = {
    findWithFilterSort: jest.fn(),
  };

  const asRequest = (user?: Partial<User> & Record<string, unknown>) =>
    ({ user } as Request & { user?: Partial<User> });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnthologyController],
      providers: [
        { provide: AnthologyService, useValue: mockAnthologyService },
        { provide: AwsS3Service, useValue: {} },
        { provide: InventoryHoldingService, useValue: {} },
      ],
    }).compile();

    controller = module.get<AnthologyController>(AnthologyController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('filterSort', () => {
    it('allows anonymous requests without a staff filter', async () => {
      mockAnthologyService.findWithFilterSort.mockResolvedValue([]);

      await controller.filterSort({ search: 'moon' }, asRequest());

      expect(mockAnthologyService.findWithFilterSort).toHaveBeenCalledWith({
        search: 'moon',
      });
    });

    it('allows a staff filter from a logged-in user', async () => {
      mockAnthologyService.findWithFilterSort.mockResolvedValue([]);

      await controller.filterSort(
        { staffIds: [3] },
        asRequest({ id: 5, role: Role.STANDARD }),
      );

      expect(mockAnthologyService.findWithFilterSort).toHaveBeenCalledWith({
        staffIds: [3],
      });
    });

    it('rejects a staff filter from an anonymous request', () => {
      expect(() =>
        controller.filterSort({ staffIds: [3] }, asRequest()),
      ).toThrow(UnauthorizedException);
      expect(mockAnthologyService.findWithFilterSort).not.toHaveBeenCalled();
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
      mockAnthologyService.findWithFilterSort.mockResolvedValue([]);

      await controller.filterSort({ staffIds: [] }, asRequest());

      expect(mockAnthologyService.findWithFilterSort).toHaveBeenCalled();
    });
  });
});
