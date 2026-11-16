import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import { AgeCategory, AnthologyStatus, AnthologyPubLevel } from './types';
import { AnthologySortOption } from './dtos/filter-anthology.dto';

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
});
