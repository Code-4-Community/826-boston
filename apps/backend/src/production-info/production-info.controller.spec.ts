import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OmchaiService } from 'src/omchai/omchai.service';
import { Omchai, OmchaiRole } from 'src/omchai/omchai.entity';
import { Story } from 'src/story/story.entity';
import { Role } from 'src/users/types';
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
  const omchaiRepo = { findOne: jest.fn() };
  const anthologyRepo = { findOne: jest.fn() };
  const req = { user: { id: 1, role: Role.STANDARD } } as never;

  /** Gives the standard user the given role per anthology id. */
  const withRoles = (roles: Record<number, OmchaiRole>) =>
    omchaiRepo.findOne.mockImplementation(async ({ where }) =>
      roles[where.anthology.id] ? { role: roles[where.anthology.id] } : null,
    );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductionInfoController],
      providers: [
        {
          provide: ProductionInfoService,
          useValue: mockService,
        },
        OmchaiService,
        { provide: getRepositoryToken(Omchai), useValue: omchaiRepo },
        { provide: getRepositoryToken(Story), useValue: {} },
        { provide: getRepositoryToken(Anthology), useValue: anthologyRepo },
      ],
    }).compile();

    controller = module.get<ProductionInfoController>(ProductionInfoController);
    service = module.get<ProductionInfoService>(ProductionInfoService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a production info', async () => {
      const dto: CreateProductionInfoDto = { anthology_id: 1 };
      mockService.create.mockResolvedValue(mockProductionInfo);
      withRoles({ 1: OmchaiRole.OWNER });

      const result = await controller.create(dto, req);

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
      anthologyRepo.findOne.mockResolvedValue({ id: 1 });
      withRoles({ 1: OmchaiRole.OWNER });

      const result = await controller.update(1, dto, req);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ ...mockProductionInfo, ...dto });
    });
  });

  describe('permissions', () => {
    const ROLE_CASES: [OmchaiRole, boolean][] = [
      [OmchaiRole.OWNER, true],
      [OmchaiRole.MANAGER, true],
      [OmchaiRole.HELPER, false],
      [OmchaiRole.APPROVER, false],
      [OmchaiRole.CONSULTED, false],
      [OmchaiRole.INFORMED, false],
    ];

    it.each(ROLE_CASES)('create as %s → allowed %s', async (role, allowed) => {
      withRoles({ 1: role });
      const call = controller.create({ anthology_id: 1 }, req);

      if (allowed) {
        await call;
        expect(mockService.create).toHaveBeenCalled();
      } else {
        await expect(call).rejects.toThrow(ForbiddenException);
        expect(mockService.create).not.toHaveBeenCalled();
      }
    });

    it.each(ROLE_CASES)('update as %s → allowed %s', async (role, allowed) => {
      anthologyRepo.findOne.mockResolvedValue({ id: 1 });
      withRoles({ 1: role });
      const call = controller.update(1, { printed_by: 'x' }, req);

      if (allowed) {
        await call;
        expect(mockService.update).toHaveBeenCalled();
      } else {
        await expect(call).rejects.toThrow(ForbiddenException);
        expect(mockService.update).not.toHaveBeenCalled();
      }
    });

    it('checks the publication that owns record N, not publication N', async () => {
      // production info 5 belongs to anthology 9; the user owns anthology 5 only
      anthologyRepo.findOne.mockResolvedValue({ id: 9 });
      withRoles({ 5: OmchaiRole.OWNER });

      await expect(
        controller.update(5, { printed_by: 'x' }, req),
      ).rejects.toThrow(ForbiddenException);
      expect(anthologyRepo.findOne).toHaveBeenCalledWith({
        where: { productionInfo: { id: 5 } },
      });
      expect(mockService.update).not.toHaveBeenCalled();
    });

    it('needs edit rights on the target publication to move a record', async () => {
      anthologyRepo.findOne.mockResolvedValue({ id: 1 });
      withRoles({ 1: OmchaiRole.OWNER, 2: OmchaiRole.CONSULTED });

      await expect(
        controller.update(1, { anthology_id: 2 }, req),
      ).rejects.toThrow(ForbiddenException);
      expect(mockService.update).not.toHaveBeenCalled();
    });

    it('allows a move when the user can edit both publications', async () => {
      anthologyRepo.findOne.mockResolvedValue({ id: 1 });
      withRoles({ 1: OmchaiRole.OWNER, 2: OmchaiRole.MANAGER });

      await controller.update(1, { anthology_id: 2 }, req);

      expect(mockService.update).toHaveBeenCalled();
    });

    it('lets an admin with no role create and update', async () => {
      const adminReq = { user: { id: 2, role: Role.ADMIN } } as never;
      anthologyRepo.findOne.mockResolvedValue({ id: 1 });
      withRoles({});

      await controller.create({ anthology_id: 1 }, adminReq);
      await controller.update(1, { printed_by: 'x' }, adminReq);

      expect(mockService.create).toHaveBeenCalled();
      expect(mockService.update).toHaveBeenCalled();
    });
  });
});
