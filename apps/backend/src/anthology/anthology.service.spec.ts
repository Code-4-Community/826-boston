import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import { AgeCategory, AnthologyStatus, AnthologyPubLevel } from './types';
import { AnthologySortOption } from './dtos/filter-anthology.dto';
import {
  isLibraryEligible,
  isLibraryRequest,
  LIBRARY_STATUSES,
} from './library-eligibility';
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
  releaseFormsOnFile: false,
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

const mockAnthology2: Anthology = {
  id: 2,
  title: 'Beta Anthology',
  byline: '',
  subtitle: undefined,
  description: 'desc',
  genres: ['fiction'],
  themes: [],
  triggers: [],
  ageCategories: [],
  publishedDate: new Date('2022-06-15'),
  programs: ['summer'],
  sponsors: [],
  status: AnthologyStatus.DRAFTING,
  releaseFormsOnFile: false,
  pubLevel: AnthologyPubLevel.CHAPBOOK,
  photoUrl: '',
  isbn: '',
  shopifyUrl: '',
  stories: [],
  inventoryHoldings: [],
  omchaiAssignments: [],
  productionInfo: {
    id: 2,
    anthology: { id: 2 } as Anthology,
  },
  tasks: [],
};

const mockAnthology3: Anthology = {
  id: 3,
  title: 'Gamma Anthology',
  byline: '',
  subtitle: undefined,
  description: 'desc',
  genres: ['nonfiction'],
  themes: [],
  triggers: [],
  ageCategories: [],
  publishedDate: new Date('2018-03-20'),
  programs: ['in-school'],
  sponsors: [],
  status: AnthologyStatus.NOT_STARTED,
  releaseFormsOnFile: false,
  pubLevel: AnthologyPubLevel.PERFECT_BOUND,
  photoUrl: '',
  isbn: '',
  shopifyUrl: '',
  stories: [],
  inventoryHoldings: [],
  omchaiAssignments: [],
  productionInfo: {
    id: 3,
    anthology: { id: 3 } as Anthology,
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnthologyService,
        {
          provide: getRepositoryToken(Anthology),
          useValue: mockRepository,
        },
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

  describe('findWithFilterSort', () => {
    const whereClauses = () =>
      mockQueryBuilder.andWhere.mock.calls.map(([clause]) => clause);

    beforeEach(() => {
      mockQueryBuilder.getMany.mockResolvedValue([mockAnthology1]);
    });

    it('no filters — no conditions, default title sort', async () => {
      const result = await service.findWithFilterSort({});

      expect(result).toEqual([mockAnthology1]);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('a');
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'LOWER(a.title)',
        'ASC',
      );
      expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledWith('a.id', 'ASC');
    });

    it('pubDateRange — between the two dates', async () => {
      await service.findWithFilterSort({
        pubDateRange: { start: '2020-01-01', end: '2021-01-01' },
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'a.publishedDate BETWEEN :start AND :end',
        { start: new Date('2020-01-01'), end: new Date('2021-01-01') },
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

    it('empty lists — add no conditions', async () => {
      await service.findWithFilterSort({
        pubLevels: [],
        genres: [],
        programs: [],
        staffIds: [],
      });
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });

    it('all filters combined — every condition is added', async () => {
      await service.findWithFilterSort({
        pubDateRange: { start: '2020-01-01', end: '2022-12-31' },
        pubLevels: [AnthologyPubLevel.CHAPBOOK],
        genres: ['fiction'],
        programs: ['OB'],
        search: 'moon',
        staffIds: [2],
        sortBy: AnthologySortOption.DATE_RECENT,
      });

      expect(whereClauses()).toEqual([
        'a.publishedDate BETWEEN :start AND :end',
        'a.pubLevel IN (:...pubLevels)',
        'a.genres && :genres',
        'a.programs && :programs',
        'a.title ILIKE :search',
        expect.stringContaining(':...staffIds'),
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
          releaseFormsOnFile: true,
        }),
      );

      const result = await service.update(1, {
        status: AnthologyStatus.CAN_BE_SHARED,
      });

      expect(result.status).toBe(AnthologyStatus.CAN_BE_SHARED);
    });

    it('blocks Can Be Shared without release forms', async () => {
      mockRepository.findOneBy.mockResolvedValue(
        complete({ releaseFormsOnFile: false }),
      );

      await expect(
        service.update(1, { status: AnthologyStatus.CAN_BE_SHARED }),
      ).rejects.toMatchObject({
        response: { missingFields: ['release forms'] },
      });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('allows Can Be Shared with release forms', async () => {
      mockRepository.findOneBy.mockResolvedValue(
        complete({ releaseFormsOnFile: true }),
      );

      const result = await service.update(1, {
        status: AnthologyStatus.CAN_BE_SHARED,
      });

      expect(result.status).toBe(AnthologyStatus.CAN_BE_SHARED);
    });

    it('allows marking release forms and Can Be Shared in one update', async () => {
      mockRepository.findOneBy.mockResolvedValue(
        complete({ releaseFormsOnFile: false }),
      );

      const result = await service.update(1, {
        status: AnthologyStatus.CAN_BE_SHARED,
        releaseFormsOnFile: true,
      });

      expect(result.status).toBe(AnthologyStatus.CAN_BE_SHARED);
    });

    it('allows unmarking release forms on a shared publication', async () => {
      mockRepository.findOneBy.mockResolvedValue(
        complete({
          status: AnthologyStatus.CAN_BE_SHARED,
          releaseFormsOnFile: true,
        }),
      );

      const result = await service.update(1, { releaseFormsOnFile: false });

      expect(result.releaseFormsOnFile).toBe(false);
      expect(result.status).toBe(AnthologyStatus.CAN_BE_SHARED);
    });

    it('applies the same rules through updateStatus', async () => {
      mockRepository.findOneBy.mockResolvedValue(
        complete({ releaseFormsOnFile: false }),
      );

      await expect(
        service.updateStatus(1, AnthologyStatus.CAN_BE_SHARED),
      ).rejects.toMatchObject({
        response: { missingFields: ['release forms'] },
      });
    });
  });

  describe('Library eligibility', () => {
    it.each([
      [AnthologyStatus.NOT_STARTED, false, false],
      [AnthologyStatus.NOT_STARTED, true, false],
      [AnthologyStatus.DRAFTING, false, false],
      [AnthologyStatus.DRAFTING, true, false],
      [AnthologyStatus.AWAITING_REVIEW, false, false],
      [AnthologyStatus.AWAITING_REVIEW, true, false],
      [AnthologyStatus.CAN_BE_SHARED, false, false],
      [AnthologyStatus.CAN_BE_SHARED, true, true],
      [AnthologyStatus.ARCHIVED, false, false],
      [AnthologyStatus.ARCHIVED, true, true],
    ])(
      '%s with release forms on file = %s is eligible: %s',
      (status, releaseFormsOnFile, expected) => {
        expect(isLibraryEligible({ status, releaseFormsOnFile })).toBe(
          expected,
        );
      },
    );

    it.each([
      [undefined, undefined, true],
      [undefined, 'true', true],
      [{ id: 1 }, undefined, false],
      [{ id: 1 }, 'false', false],
      [{ id: 1 }, 'true', true],
      [{ id: 1 }, true, true],
    ])('isLibraryRequest(user=%j, flag=%j) → %s', (user, flag, expected) => {
      expect(isLibraryRequest(user, flag)).toBe(expected);
    });

    const libraryCondition = {
      status: In(LIBRARY_STATUSES),
      releaseFormsOnFile: true,
    };

    it('findOne filters by eligibility in the query when libraryOnly', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(1, true)).resolves.toBeNull();
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
        ...libraryCondition,
      });
    });

    it('findOne does not filter by default', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockAnthology2);

      await service.findOne(1);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('findAll filters by eligibility in the query when libraryOnly', async () => {
      mockRepository.find.mockResolvedValue([]);

      await service.findAll(true);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: libraryCondition,
      });
    });

    it('findWithFilterSort combines eligibility with the other filters', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.findWithFilterSort(
        { pubLevels: [AnthologyPubLevel.ZINE] },
        true,
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'a.status IN (:...libraryStatuses)',
        { libraryStatuses: LIBRARY_STATUSES },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'a.releaseFormsOnFile = :releaseFormsOnFile',
        { releaseFormsOnFile: true },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'a.pubLevel IN (:...pubLevels)',
        { pubLevels: [AnthologyPubLevel.ZINE] },
      );
    });

    it('findWithFilterSort leaves out the Library rule for the Tracker', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.findWithFilterSort({}, false);
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        'a.status IN (:...libraryStatuses)',
        expect.anything(),
      );
    });
  });
});
