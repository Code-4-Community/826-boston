import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArrayOverlap, Between, In } from 'typeorm';
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
  publishedDate: new Date('2020-01-01'),
  programs: ['after-school'],
  sponsors: [],
  status: AnthologyStatus.IN_PRODUCTION,
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
  publishedDate: new Date('2022-06-15'),
  programs: ['summer'],
  sponsors: [],
  status: AnthologyStatus.IN_REVISION,
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
  publishedDate: new Date('2018-03-20'),
  programs: ['in-school'],
  sponsors: [],
  status: AnthologyStatus.DRAFT,
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
};

describe('AnthologyService', () => {
  let service: AnthologyService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    remove: jest.fn(),
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
    it('no filters, no sort — returns all anthologies', async () => {
      mockRepository.find.mockResolvedValue([
        mockAnthology1,
        mockAnthology2,
        mockAnthology3,
      ]);
      const result = await service.findWithFilterSort({});
      expect(result).toEqual([mockAnthology1, mockAnthology2, mockAnthology3]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {},
        order: {},
      });
    });

    it('sort only — applies order, no where conditions', async () => {
      // Sorted alphabetically: Alpha, Beta, Gamma
      mockRepository.find.mockResolvedValue([
        mockAnthology1,
        mockAnthology2,
        mockAnthology3,
      ]);
      await service.findWithFilterSort({
        sortBy: AnthologySortOption.TITLE_ASC,
      });
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {},
        order: { title: 'ASC' },
      });
    });

    it('multiple pubLevels — excludes non-matching anthology', async () => {
      // CHAPBOOK (2) and ZINE (1) match; PERFECT_BOUND (3) does not
      mockRepository.find.mockResolvedValue([mockAnthology1, mockAnthology2]);
      const result = await service.findWithFilterSort({
        pubLevels: [AnthologyPubLevel.CHAPBOOK, AnthologyPubLevel.ZINE],
      });
      expect(result).toEqual([mockAnthology1, mockAnthology2]);
      expect(result).not.toContainEqual(mockAnthology3);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          pubLevel: In([AnthologyPubLevel.CHAPBOOK, AnthologyPubLevel.ZINE]),
        },
        order: {},
      });
    });

    it('pubDateRange filter — excludes anthologies outside range', async () => {
      // 2020-2021 range: only anthology1 (2020-01-01) matches;
      // anthology2 (2022) and anthology3 (2018) are outside
      mockRepository.find.mockResolvedValue([mockAnthology1]);
      const result = await service.findWithFilterSort({
        pubDateRange: { start: '2020-01-01', end: '2021-01-01' },
      });
      expect(result).toEqual([mockAnthology1]);
      expect(result).not.toContainEqual(mockAnthology2);
      expect(result).not.toContainEqual(mockAnthology3);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          publishedDate: Between(
            new Date('2020-01-01'),
            new Date('2021-01-01'),
          ),
        },
        order: {},
      });
    });

    it('multiple genres — excludes non-matching anthology', async () => {
      // fiction (2) and mystery (1) match; nonfiction (3) does not
      mockRepository.find.mockResolvedValue([mockAnthology1, mockAnthology2]);
      const result = await service.findWithFilterSort({
        genres: ['fiction', 'mystery'],
      });
      expect(result).toEqual([mockAnthology1, mockAnthology2]);
      expect(result).not.toContainEqual(mockAnthology3);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { genres: ArrayOverlap(['fiction', 'mystery']) },
        order: {},
      });
    });

    it('programs filter — returns only matching anthology', async () => {
      // in-school matches only anthology3; after-school and summer do not
      mockRepository.find.mockResolvedValue([mockAnthology3]);
      const result = await service.findWithFilterSort({
        programs: ['in-school'],
      });
      expect(result).toEqual([mockAnthology3]);
      expect(result).not.toContainEqual(mockAnthology1);
      expect(result).not.toContainEqual(mockAnthology2);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { programs: ArrayOverlap(['in-school']) },
        order: {},
      });
    });

    it('all filters and sort — applies every condition', async () => {
      // Only anthology2 (CHAPBOOK, fiction, summer, 2022) matches all constraints
      mockRepository.find.mockResolvedValue([mockAnthology2]);
      const result = await service.findWithFilterSort({
        pubDateRange: { start: '2020-01-01', end: '2022-12-31' },
        pubLevels: [AnthologyPubLevel.CHAPBOOK, AnthologyPubLevel.ZINE],
        genres: ['fiction'],
        programs: ['summer', 'after-school'],
        sortBy: AnthologySortOption.DATE_RECENT,
      });
      expect(result).toEqual([mockAnthology2]);
      expect(result).not.toContainEqual(mockAnthology1);
      expect(result).not.toContainEqual(mockAnthology3);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          publishedDate: Between(
            new Date('2020-01-01'),
            new Date('2022-12-31'),
          ),
          pubLevel: In([AnthologyPubLevel.CHAPBOOK, AnthologyPubLevel.ZINE]),
          genres: ArrayOverlap(['fiction']),
          programs: ArrayOverlap(['summer', 'after-school']),
        },
        order: { publishedDate: 'DESC' },
      });
    });

    it('filters that match nothing — returns empty array', async () => {
      mockRepository.find.mockResolvedValue([]);
      const result = await service.findWithFilterSort({
        genres: ['nonexistent'],
      });
      expect(result).toEqual([]);
    });
  });
});
