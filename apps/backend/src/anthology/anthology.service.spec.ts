import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import { OmchaiRole } from '../omchai/omchai.entity';
import { OmchaiService } from '../omchai/omchai.service';
import { AnthologyStatus, AnthologyPubLevel } from './types';
import { AnthologySortOption } from './dtos/filter-anthology.dto';
import { TrackerAnthologyDto } from './dtos/tracker-anthology.dto';
import { Role } from '../users/types';
import { User } from '../users/user.entity';
import { In } from 'typeorm';

const mockAnthology1: Anthology = {
  id: 1,
  title: 'Alpha Anthology',
  byline: '',
  subtitle: '',
  description: 'desc',
  genres: ['mystery'],
  themes: [],
  triggers: [],
  ageCategories: [],
  publishedDate: new Date('2020-01-01'),
  programs: ['after-school'],
  sponsors: [],
  status: AnthologyStatus.AWAITING_REVIEW,
  pubLevel: AnthologyPubLevel.ZINE,
  photoUrl: '',
  isbn: '',
  shopifyUrl: '',
  stories: [],
  inventoryHoldings: [],
  omchaiAssignments: [],
  productionInfo: {
    id: 1,
    anthology: { id: 1 } as Anthology,
  },
  tasks: [],
};

describe('AnthologyService', () => {
  let service: AnthologyService;

  const mockQueryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockTransactionRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockTransactionManager = {
    findBy: jest.fn(),
    getRepository: jest.fn().mockReturnValue(mockTransactionRepo),
  };

  const mockDataSource = {
    transaction: jest.fn((run) => run(mockTransactionManager)),
  };

  const mockOmchaiService = {
    createMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnthologyService,
        {
          provide: getRepositoryToken(Anthology),
          useValue: mockRepository,
        },
        { provide: DataSource, useValue: mockDataSource },
        { provide: OmchaiService, useValue: mockOmchaiService },
      ],
    }).compile();

    service = module.get<AnthologyService>(AnthologyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const anthology = { id: 42, title: 'New Anthology' } as Anthology;

    it('saves the anthology and its owners in the same transaction', async () => {
      mockTransactionManager.findBy.mockResolvedValue([{ id: 3 }, { id: 7 }]);
      mockTransactionRepo.create.mockImplementation((data) => ({ ...data }));
      mockTransactionRepo.save.mockResolvedValue(anthology);

      const result = await service.create(
        'New Anthology',
        AnthologyPubLevel.ZINE,
        [3, 7],
        ['Tutoring'],
        '2026-06-01',
      );

      expect(mockDataSource.transaction).toHaveBeenCalledTimes(1);
      expect(mockTransactionRepo.save).toHaveBeenCalledWith({
        title: 'New Anthology',
        pubLevel: AnthologyPubLevel.ZINE,
        programs: ['Tutoring'],
        publishedDate: new Date('2026-06-01'),
      });
      expect(mockOmchaiService.createMany).toHaveBeenCalledWith(
        [3, 7].map((userId) => ({
          anthologyId: anthology.id,
          userId,
          role: OmchaiRole.OWNER,
        })),
        mockTransactionManager,
      );
      expect(result).toBe(anthology);
    });

    it('leaves publishedDate unset when no date is given', async () => {
      mockTransactionManager.findBy.mockResolvedValue([{ id: 3 }]);
      mockTransactionRepo.create.mockImplementation((data) => ({ ...data }));
      mockTransactionRepo.save.mockResolvedValue(anthology);

      await service.create('New Anthology', AnthologyPubLevel.ZINE, [3]);

      expect(mockTransactionRepo.save.mock.calls[0][0]).not.toHaveProperty(
        'publishedDate',
      );
    });

    it('rethrows the error if assigning the owner fails', async () => {
      mockTransactionManager.findBy.mockResolvedValue([{ id: 3 }]);
      mockTransactionRepo.create.mockReturnValue(anthology);
      mockTransactionRepo.save.mockResolvedValue(anthology);
      mockOmchaiService.createMany.mockRejectedValueOnce(
        new Error('assigning the owner failed'),
      );

      await expect(
        service.create('New Anthology', AnthologyPubLevel.ZINE, [3]),
      ).rejects.toThrow('assigning the owner failed');
    });

    it('throws NotFoundException if owners are missing', async () => {
      mockTransactionManager.findBy.mockResolvedValue([{ id: 3 }]);

      await expect(
        service.create('New Anthology', AnthologyPubLevel.ZINE, [3, 99]),
      ).rejects.toThrow(new NotFoundException('Owners not found: 99'));
    });
  });

  describe('update', () => {
    it('throws NotFoundException if the anthology does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(999, { title: 'Renamed' })).rejects.toThrow(
        new NotFoundException('Anthology not found'),
      );
    });

    it('only changes the fields that were sent', async () => {
      mockRepository.findOneBy.mockResolvedValue({ ...mockAnthology1 });

      await service.update(1, { title: 'Renamed' });

      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockAnthology1,
        title: 'Renamed',
      });
    });
  });

  describe('findWithFilterSort', () => {
    const whereClauses = () =>
      mockQueryBuilder.andWhere.mock.calls.map(([clause]) => clause);

    beforeEach(() => {
      mockQueryBuilder.getMany.mockResolvedValue([mockAnthology1]);
    });

    it('no filters, no sort — no conditions, natural (id) order', async () => {
      const result = await service.findWithFilterSort({});

      expect(result).toEqual([mockAnthology1]);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('a');
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
      // no sort field is imposed when none is chosen
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('a.id', 'ASC');
      expect(mockQueryBuilder.addOrderBy).not.toHaveBeenCalled();
    });

    it('pubDateRange — between the two dates', async () => {
      await service.findWithFilterSort({
        pubDateRange: { start: '2020-01-01', end: '2021-01-01' },
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'a.publishedDate BETWEEN :start AND :end',
        // plain strings, so the server's timezone can't shift the day
        { start: '2020-01-01', end: '2021-01-01' },
      );
    });

    it('pubLevels — any of the given levels', async () => {
      await service.findWithFilterSort({
        pubLevels: [AnthologyPubLevel.CHAPBOOK, AnthologyPubLevel.ZINE],
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'a.pubLevel IN (:...pubLevels)',
        { pubLevels: [AnthologyPubLevel.CHAPBOOK, AnthologyPubLevel.ZINE] },
      );
    });

    it('genres — array overlap', async () => {
      await service.findWithFilterSort({ genres: ['fiction', 'mystery'] });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'a.genres && :genres',
        { genres: ['fiction', 'mystery'] },
      );
    });

    it('programs — array overlap', async () => {
      await service.findWithFilterSort({ programs: ['OB', 'YABP'] });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'a.programs && :programs',
        { programs: ['OB', 'YABP'] },
      );
    });

    it('search — trimmed, case-insensitive, wildcards escaped', async () => {
      await service.findWithFilterSort({ search: '  50%_off\\ ' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'a.title ILIKE :search',
        { search: '%50\\%\\_off\\\\%' },
      );
    });

    it('blank search — ignored', async () => {
      await service.findWithFilterSort({ search: '   ' });
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });

    it('staffIds — publications where any of the users holds an OMCHAI role', async () => {
      await service.findWithFilterSort({ staffIds: [3, 4] });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('o."user" IN (:...staffIds)'),
        { staffIds: [3, 4] },
      );
    });

    it('themes — overlap on the comma-separated column', async () => {
      await service.findWithFilterSort({ themes: ['Identity', 'Culture'] });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        "string_to_array(NULLIF(a.themes, '[]'), ',') && :themes",
        { themes: ['Identity', 'Culture'] },
      );
    });

    it('locationIds — publications with copies at any of the locations', async () => {
      await service.findWithFilterSort({ locationIds: [1, 5] });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('h.inventory IN (:...locationIds)'),
        { locationIds: [1, 5] },
      );
      // zero-copy holdings must not count as being in stock
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('h."numCopies" > 0'),
        expect.anything(),
      );
    });

    it('empty lists — add no conditions', async () => {
      await service.findWithFilterSort({
        pubLevels: [],
        genres: [],
        programs: [],
        themes: [],
        staffIds: [],
        locationIds: [],
      });
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });

    it('all filters combined — every condition is added', async () => {
      await service.findWithFilterSort({
        pubDateRange: { start: '2020-01-01', end: '2022-12-31' },
        pubLevels: [AnthologyPubLevel.CHAPBOOK],
        genres: ['fiction'],
        programs: ['OB'],
        themes: ['Identity'],
        search: 'moon',
        staffIds: [2],
        locationIds: [3],
        sortBy: AnthologySortOption.DATE_RECENT,
      });

      expect(whereClauses()).toEqual([
        'a.publishedDate BETWEEN :start AND :end',
        'a.pubLevel IN (:...pubLevels)',
        'a.genres && :genres',
        'a.programs && :programs',
        expect.stringContaining(':themes'),
        'a.title ILIKE :search',
        expect.stringContaining(':...staffIds'),
        expect.stringContaining(':...locationIds'),
      ]);
    });

    it('filters that match nothing — returns empty array', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);
      const result = await service.findWithFilterSort({
        genres: ['nonexistent'],
      });
      expect(result).toEqual([]);
    });

    it.each([
      [AnthologySortOption.TITLE_ASC, ['LOWER(a.title)', 'ASC'], false],
      [AnthologySortOption.TITLE_DESC, ['LOWER(a.title)', 'DESC'], false],
      [
        AnthologySortOption.BYLINE_ASC,
        ["NULLIF(LOWER(a.byline), '')", 'ASC', 'NULLS LAST'],
        true,
      ],
      [
        AnthologySortOption.BYLINE_DESC,
        ["NULLIF(LOWER(a.byline), '')", 'DESC', 'NULLS LAST'],
        true,
      ],
      [
        AnthologySortOption.DATE_RECENT,
        ['a.publishedDate', 'DESC', 'NULLS LAST'],
        true,
      ],
      [
        AnthologySortOption.DATE_OLDEST,
        ['a.publishedDate', 'ASC', 'NULLS LAST'],
        true,
      ],
    ])('sorts by %s', async (sortBy, orderArgs, titleTiebreak) => {
      await service.findWithFilterSort({ sortBy });

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(...orderArgs);
      expect(mockQueryBuilder.addOrderBy.mock.calls).toEqual(
        titleTiebreak
          ? [
              ['LOWER(a.title)', 'ASC'],
              ['a.id', 'ASC'],
            ]
          : [['a.id', 'ASC']],
      );
    });
  });

  describe('findForTracker', () => {
    const statusDto: TrackerAnthologyDto = {
      status: AnthologyStatus.DRAFTING,
    };

    it('returns every publication for an admin and applies status in the query', async () => {
      mockRepository.find.mockResolvedValue([mockAnthology1]);

      const result = await service.findForTracker(statusDto, {
        role: Role.ADMIN,
      } as User);

      expect(result).toEqual([mockAnthology1]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { status: AnthologyStatus.DRAFTING },
      });
    });

    it('scopes standard users to their assigned anthology ids in the query', async () => {
      mockRepository.find.mockResolvedValue([mockAnthology1]);

      const result = await service.findForTracker({}, {
        role: Role.STANDARD,
        omchaiAssignments: [{ anthology: mockAnthology1 }],
      } as User);

      expect(result).toEqual([mockAnthology1]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { id: In([mockAnthology1.id]) },
      });
    });
  });

  describe('update status rules', () => {
    const complete = (overrides: Partial<Anthology> = {}): Anthology =>
      ({
        ...mockAnthology1,
        status: AnthologyStatus.NOT_STARTED,
        title: 'Title',
        description: 'desc',
        genres: ['mystery'],
        programs: ['after-school'],
        pubLevel: AnthologyPubLevel.ZINE,
        isbn: '',
        ...overrides,
      } as Anthology);

    beforeEach(() => {
      mockRepository.save.mockImplementation(async (a) => a);
    });

    it('rejects leaving Not Started with missing fields, naming them', async () => {
      mockRepository.findOneBy.mockResolvedValue(
        complete({ description: '', genres: [] }),
      );

      await expect(
        service.update(1, { status: AnthologyStatus.DRAFTING }),
      ).rejects.toMatchObject({
        response: { missingFields: ['description', 'genres'] },
      });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('allows leaving Not Started when required fields are set', async () => {
      mockRepository.findOneBy.mockResolvedValue(complete());

      const result = await service.update(1, {
        status: AnthologyStatus.DRAFTING,
      });

      expect(result.status).toBe(AnthologyStatus.DRAFTING);
    });

    it('allows non-status edits with missing fields', async () => {
      mockRepository.findOneBy.mockResolvedValue(complete({ title: '' }));

      await expect(
        service.update(1, { description: 'new' }),
      ).resolves.toBeDefined();
    });

    it.each([AnthologyPubLevel.PERFECT_BOUND, AnthologyPubLevel.SIGNATURE])(
      'requires an ISBN for %s before Can Be Shared',
      async (pubLevel) => {
        mockRepository.findOneBy.mockResolvedValue(complete({ pubLevel }));

        await expect(
          service.update(1, { status: AnthologyStatus.CAN_BE_SHARED }),
        ).rejects.toMatchObject({ response: { missingFields: ['ISBN'] } });
      },
    );

    it('allows Can Be Shared for Perfect Bound with an ISBN', async () => {
      mockRepository.findOneBy.mockResolvedValue(
        complete({
          pubLevel: AnthologyPubLevel.PERFECT_BOUND,
          isbn: '978-0-00-000000-0',
        }),
      );

      const result = await service.update(1, {
        status: AnthologyStatus.CAN_BE_SHARED,
      });

      expect(result.status).toBe(AnthologyStatus.CAN_BE_SHARED);
    });
  });
});
