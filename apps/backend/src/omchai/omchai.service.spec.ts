import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { FindOperator, QueryFailedError } from 'typeorm';
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
    count: jest.fn(),
    delete: jest.fn(),
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

  describe('team changes', () => {
    const ANTHOLOGY_ID = 1;
    const admin = { id: 100, role: Role.ADMIN };
    const owner = { id: 101, role: Role.STANDARD };
    const manager = { id: 102, role: Role.STANDARD };
    const helper = { id: 103, role: Role.STANDARD };
    const outsider = { id: 104, role: Role.STANDARD };
    const BOB = 7;
    const DANA = 8;

    const row = (
      id: number,
      userId: number,
      role: OmchaiRole,
      anthologyId: number | null = ANTHOLOGY_ID,
    ): Omchai => ({
      id,
      role,
      datetimeAssigned: new Date(),
      anthology: (anthologyId === null
        ? undefined
        : { id: anthologyId }) as Anthology,
      user: {
        id: userId,
        firstName: userId === BOB ? 'Bob' : 'User',
        lastName: userId === BOB ? 'Smith' : String(userId),
      } as User,
    });

    type Where = {
      id?: number;
      role?: OmchaiRole;
      user?: { id: number | FindOperator<number[]> };
      anthology?: { id: number };
    };
    // Enough of TypeORM's where matching for the queries OmchaiService makes
    const matches = (r: Omchai, where: Where) => {
      if (where.id !== undefined && r.id !== where.id) return false;
      if (where.role !== undefined && r.role !== where.role) return false;
      if (where.anthology && r.anthology?.id !== where.anthology.id) {
        return false;
      }
      if (where.user) {
        const id = where.user.id;
        const ids = id instanceof FindOperator ? id.value : [id];
        if (!(ids as number[]).includes(r.user.id)) return false;
      }
      return true;
    };

    let rows: Omchai[];

    beforeEach(() => {
      rows = [
        row(1, owner.id, OmchaiRole.OWNER),
        row(2, manager.id, OmchaiRole.MANAGER),
        row(3, helper.id, OmchaiRole.HELPER),
        row(4, BOB, OmchaiRole.CONSULTED),
      ];
      mockRepository.findOne.mockImplementation(
        async ({ where }: { where: Where }) =>
          rows.find((r) => matches(r, where)) ?? null,
      );
      mockRepository.count.mockImplementation(
        async ({ where }: { where: Where }) =>
          rows.filter((r) => matches(r, where)).length,
      );
      mockRepository.create.mockImplementation((value) => value);
      mockRepository.save.mockImplementation(async (value) => {
        if (Array.isArray(value)) return value;
        const saved = { id: 99, ...value };
        rows.push(saved);
        return saved;
      });
    });

    const dto = (
      role: OmchaiRole,
      userId = DANA,
      anthologyId = ANTHOLOGY_ID,
    ): CreateOmchaiDto => ({
      anthologyId,
      userId,
      role,
      datetimeAssigned: new Date('2025-01-15'),
    });

    describe('create', () => {
      it('saves the assignment with user and anthology relations', async () => {
        const result = await service.create(dto(OmchaiRole.HELPER), owner);

        expect(mockRepository.save).toHaveBeenCalledWith({
          role: OmchaiRole.HELPER,
          datetimeAssigned: new Date('2025-01-15'),
          user: { id: DANA },
          anthology: { id: ANTHOLOGY_ID },
        });
        expect(result?.id).toBe(99);
      });

      it.each([
        OmchaiRole.CONSULTED,
        OmchaiRole.HELPER,
        OmchaiRole.APPROVER,
        OmchaiRole.INFORMED,
      ])('lets an Owner and a Manager assign %s', async (role) => {
        await expect(service.create(dto(role, 8), owner)).resolves.toBeTruthy();
        await expect(
          service.create(dto(role, 9), manager),
        ).resolves.toBeTruthy();
      });

      it.each([OmchaiRole.OWNER, OmchaiRole.MANAGER])(
        'forbids an Owner or Manager from assigning %s',
        async (role) => {
          await expect(service.create(dto(role), owner)).rejects.toThrow(
            ForbiddenException,
          );
          await expect(service.create(dto(role), manager)).rejects.toThrow(
            ForbiddenException,
          );
          expect(mockRepository.save).not.toHaveBeenCalled();
        },
      );

      it.each([OmchaiRole.OWNER, OmchaiRole.MANAGER])(
        'lets an Admin assign %s without an OMCHAI role',
        async (role) => {
          await expect(service.create(dto(role), admin)).resolves.toBeTruthy();
        },
      );

      it('forbids a Helper or someone with no role on the publication', async () => {
        await expect(
          service.create(dto(OmchaiRole.INFORMED), helper),
        ).rejects.toThrow(ForbiddenException);
        await expect(
          service.create(dto(OmchaiRole.INFORMED), outsider),
        ).rejects.toThrow(ForbiddenException);
      });

      it('forbids an Owner of a different publication', async () => {
        await expect(
          service.create(dto(OmchaiRole.HELPER, DANA, 2), owner),
        ).rejects.toThrow(ForbiddenException);
      });

      it('rejects someone who already has a role, naming that role', async () => {
        await expect(
          service.create(dto(OmchaiRole.HELPER, BOB), owner),
        ).rejects.toThrow(
          new ConflictException(
            'Bob Smith is already Consulted on this publication. Remove them from that role first.',
          ),
        );
        expect(mockRepository.save).not.toHaveBeenCalled();
      });

      it('turns a unique-constraint violation into a conflict', async () => {
        mockRepository.save.mockRejectedValue(
          new QueryFailedError('INSERT', [], { code: '23505' } as never),
        );

        await expect(
          service.create(dto(OmchaiRole.HELPER), owner),
        ).rejects.toThrow(ConflictException);
      });
    });

    describe('createMany', () => {
      it('returns an empty list for an empty batch', async () => {
        await expect(service.createMany([], outsider)).resolves.toEqual([]);
      });

      it('saves every assignment when the caller may assign each role', async () => {
        await service.createMany(
          [dto(OmchaiRole.HELPER, 8), dto(OmchaiRole.INFORMED, 9)],
          manager,
        );

        expect(mockRepository.save).toHaveBeenCalledWith([
          expect.objectContaining({ user: { id: 8 }, role: OmchaiRole.HELPER }),
          expect.objectContaining({
            user: { id: 9 },
            role: OmchaiRole.INFORMED,
          }),
        ]);
      });

      it('forbids a batch containing a role the caller cannot assign', async () => {
        await expect(
          service.createMany(
            [dto(OmchaiRole.HELPER, 8), dto(OmchaiRole.MANAGER, 9)],
            owner,
          ),
        ).rejects.toThrow(ForbiddenException);
      });

      it('forbids a non-Admin with no role on the publication', async () => {
        await expect(
          service.createMany([dto(OmchaiRole.HELPER)], outsider),
        ).rejects.toThrow(ForbiddenException);
      });

      it('rejects the same person under two roles', async () => {
        await expect(
          service.createMany(
            [dto(OmchaiRole.OWNER, 8), dto(OmchaiRole.INFORMED, 8)],
            admin,
          ),
        ).rejects.toThrow(BadRequestException);
      });

      it('rejects someone who already has a role on the publication', async () => {
        await expect(
          service.createMany([dto(OmchaiRole.HELPER, BOB)], admin),
        ).rejects.toThrow(ConflictException);
      });
    });

    describe('update', () => {
      it('checks permissions against the publication on the assignment row', async () => {
        const result = await service.update(
          4,
          { role: OmchaiRole.APPROVER },
          owner,
        );

        expect(mockRepository.findOne).toHaveBeenCalledWith({
          where: { id: 4 },
          relations: ['anthology', 'user'],
        });
        expect(result.role).toBe(OmchaiRole.APPROVER);
      });

      it('forbids an Owner from promoting someone to Manager', async () => {
        await expect(
          service.update(3, { role: OmchaiRole.MANAGER }, owner),
        ).rejects.toThrow(ForbiddenException);
      });

      it('forbids a Manager from changing an Owner', async () => {
        await expect(
          service.update(1, { role: OmchaiRole.HELPER }, manager),
        ).rejects.toThrow(ForbiddenException);
      });

      it('forbids a Helper', async () => {
        await expect(
          service.update(4, { role: OmchaiRole.HELPER }, helper),
        ).rejects.toThrow(ForbiddenException);
      });

      it('blocks an Admin from demoting the last Owner', async () => {
        await expect(
          service.update(1, { role: OmchaiRole.HELPER }, admin),
        ).rejects.toThrow(BadRequestException);
      });

      it('throws NotFoundException if omchai not found', async () => {
        await expect(
          service.update(999, { role: OmchaiRole.MANAGER }, admin),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('remove', () => {
      it('lets an Owner remove a Helper', async () => {
        const result = await service.remove(3, owner);

        expect(mockRepository.delete).toHaveBeenCalledWith(3);
        expect(result.id).toBe(3);
      });

      it.each([
        [1, OmchaiRole.OWNER],
        [2, OmchaiRole.MANAGER],
      ])(
        'forbids an Owner or Manager from removing assignment %i (%s)',
        async (id) => {
          await expect(service.remove(id, owner)).rejects.toThrow(
            ForbiddenException,
          );
          await expect(service.remove(id, manager)).rejects.toThrow(
            ForbiddenException,
          );
          expect(mockRepository.delete).not.toHaveBeenCalled();
        },
      );

      it('forbids a Helper', async () => {
        await expect(service.remove(4, helper)).rejects.toThrow(
          ForbiddenException,
        );
      });

      it('lets an Admin remove an Owner when another Owner remains', async () => {
        rows.push(row(5, 110, OmchaiRole.OWNER));

        await service.remove(1, admin);

        expect(mockRepository.delete).toHaveBeenCalledWith(1);
      });

      it('blocks removing the last Owner', async () => {
        await expect(service.remove(1, admin)).rejects.toThrow(
          new BadRequestException(
            'A publication needs at least one Owner. Add another Owner before removing this one.',
          ),
        );
        expect(mockRepository.delete).not.toHaveBeenCalled();
      });

      it('lets only an Admin remove an assignment with no publication', async () => {
        rows.push(row(6, 111, OmchaiRole.HELPER, null));

        await expect(service.remove(6, owner)).rejects.toThrow(
          ForbiddenException,
        );
        await service.remove(6, admin);
        expect(mockRepository.delete).toHaveBeenCalledWith(6);
      });

      it('throws NotFoundException if omchai not found', async () => {
        await expect(service.remove(999, admin)).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });
});
