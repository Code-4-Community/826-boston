import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { OmchaiService } from './omchai.service';
import { Omchai, OmchaiRole } from './omchai.entity';
import { Anthology } from 'src/anthology/anthology.entity';
import { User } from 'src/users/user.entity';
import { CreateOmchaiDto } from './dtos/create-omchai.dto';
import { Story } from 'src/story/story.entity';
import { Role } from 'src/users/types';
import { OmchaiAction } from 'src/auth/omchai-permissions';

describe('OmchaiService', () => {
  let service: OmchaiService;

  const mockOmchai: Omchai = {
    id: 1,
    anthology: { id: 1 } as Anthology,
    user: { id: 1 } as User,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
  };
  const mockStoryRepository = { findOne: jest.fn() };
  const mockAnthologyRepository = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OmchaiService,
        {
          provide: getRepositoryToken(Omchai),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Story),
          useValue: mockStoryRepository,
        },
        {
          provide: getRepositoryToken(Anthology),
          useValue: mockAnthologyRepository,
        },
      ],
    }).compile();

    service = module.get<OmchaiService>(OmchaiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new omchai', async () => {
      const dto: CreateOmchaiDto = {
        anthologyId: 1,
        userId: 1,
        role: OmchaiRole.OWNER,
        datetimeAssigned: new Date(),
      };

      mockRepository.create.mockReturnValue(mockOmchai);
      mockRepository.save.mockResolvedValue(mockOmchai);

      const result = await service.create(dto);

      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockOmchai);
      expect(result).toEqual(mockOmchai);
    });
  });

  describe('findAll', () => {
    it('should return all omchai', async () => {
      mockRepository.find.mockResolvedValue([mockOmchai]);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockOmchai]);
    });
  });

  describe('findByAnthologyId', () => {
    it('should return omchai for specific anthology', async () => {
      mockRepository.find.mockResolvedValue([mockOmchai]);

      const result = await service.findByAnthologyId(1);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { anthology: { id: 1 } },
        relations: ['user'],
      });
      expect(result).toEqual([mockOmchai]);
    });
  });

  describe('update', () => {
    it('should update an omchai', async () => {
      const dto = { role: OmchaiRole.MANAGER };
      const updated = { ...mockOmchai, role: OmchaiRole.MANAGER };

      mockRepository.findOneBy.mockResolvedValue(mockOmchai);
      mockRepository.save.mockResolvedValue(updated);

      const result = await service.update(1, dto);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException if omchai not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(999, { role: OmchaiRole.MANAGER }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('assertCan', () => {
    const standard = { id: 7, role: Role.STANDARD };

    it('lets an admin through without looking up an assignment', async () => {
      await expect(
        service.assertCan({ id: 1, role: Role.ADMIN }, 5, [
          OmchaiAction.EDIT_PRODUCTION,
        ]),
      ).resolves.toBeUndefined();
      expect(mockRepository.findOne).not.toHaveBeenCalled();
    });

    it('looks up the assignment for this user on this anthology', async () => {
      mockRepository.findOne.mockResolvedValue({ role: OmchaiRole.OWNER });

      await service.assertCan(standard, 5, [OmchaiAction.EDIT_PRODUCTION]);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: 7 }, anthology: { id: 5 } },
      });
    });

    it('denies a user with no role on the anthology', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.assertCan(standard, 5, [OmchaiAction.VIEW]),
      ).rejects.toThrow(ForbiddenException);
    });

    it('denies a role that lacks the action', async () => {
      mockRepository.findOne.mockResolvedValue({ role: OmchaiRole.CONSULTED });

      await expect(
        service.assertCan(standard, 5, [OmchaiAction.EDIT_PRODUCTION]),
      ).rejects.toThrow(ForbiddenException);
    });

    it('needs every action when given several', async () => {
      mockRepository.findOne.mockResolvedValue({ role: OmchaiRole.HELPER });

      await expect(
        service.assertCan(standard, 5, [
          OmchaiAction.EDIT_DRAFTS,
          OmchaiAction.TICK_CHECKPOINTS,
        ]),
      ).rejects.toThrow(ForbiddenException);
    });

    it('accepts any role when no actions are given', async () => {
      mockRepository.findOne.mockResolvedValue({ role: OmchaiRole.INFORMED });

      await expect(service.assertCan(standard, 5, [])).resolves.toBeUndefined();
    });

    it.each([undefined, {}, { role: Role.STANDARD }])(
      'denies a user without an id (%o)',
      async (user) => {
        await expect(
          service.assertCan(user, 5, [OmchaiAction.VIEW]),
        ).rejects.toThrow(ForbiddenException);
        expect(mockRepository.findOne).not.toHaveBeenCalled();
      },
    );
  });

  describe('anthology resolvers', () => {
    it('finds a story’s anthology', async () => {
      mockStoryRepository.findOne.mockResolvedValue({ anthology: { id: 4 } });

      await expect(service.anthologyIdForStory(10)).resolves.toBe(4);
      expect(mockStoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 10 },
        relations: ['anthology'],
      });
    });

    it('finds a draft’s anthology through the story that owns it', async () => {
      mockStoryRepository.findOne.mockResolvedValue({ anthology: { id: 4 } });

      await expect(service.anthologyIdForStoryDraft(3)).resolves.toBe(4);
      expect(mockStoryRepository.findOne).toHaveBeenCalledWith({
        where: { storyDraft: { id: 3 } },
        relations: ['anthology'],
      });
    });

    it('finds production info’s anthology by the record, not by its id', async () => {
      // production info 5 belongs to anthology 9
      mockAnthologyRepository.findOne.mockResolvedValue({ id: 9 });

      await expect(service.anthologyIdForProductionInfo(5)).resolves.toBe(9);
      expect(mockAnthologyRepository.findOne).toHaveBeenCalledWith({
        where: { productionInfo: { id: 5 } },
      });
    });

    it('returns the draft’s anthology for an author edit by that author', async () => {
      mockStoryRepository.findOne.mockResolvedValue({
        anthology: { id: 4 },
        author: { id: 12 },
      });

      await expect(service.anthologyIdForAuthorEdit(12, 3)).resolves.toBe(4);
    });

    it('rejects an author edit through another author’s draft', async () => {
      mockStoryRepository.findOne.mockResolvedValue({
        anthology: { id: 4 },
        author: { id: 99 },
      });

      await expect(service.anthologyIdForAuthorEdit(12, 3)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it.each([
      ['anthologyIdForStory', () => service.anthologyIdForStory(1)],
      ['anthologyIdForStoryDraft', () => service.anthologyIdForStoryDraft(1)],
      [
        'anthologyIdForAuthorEdit',
        () => service.anthologyIdForAuthorEdit(1, 1),
      ],
      [
        'anthologyIdForProductionInfo',
        () => service.anthologyIdForProductionInfo(1),
      ],
    ])('%s throws NotFoundException when nothing matches', async (_, call) => {
      mockStoryRepository.findOne.mockResolvedValue(null);
      mockAnthologyRepository.findOne.mockResolvedValue(null);

      await expect(call()).rejects.toThrow(NotFoundException);
    });
  });
});
