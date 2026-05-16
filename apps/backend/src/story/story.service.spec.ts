import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Story } from './story.entity';
import { StoryService } from './story.service';
import { StoriesSeed } from '../seeds/stories.seed';

describe('StoryService', () => {
  let service: StoryService;

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
        StoryService,
        {
          provide: getRepositoryToken(Story),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<StoryService>(StoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get stories by anthology', () => {
    it('get stories given anthology id', () => {
      mockRepository.find.mockImplementation((query) => {
        if (query.where?.anthologyId === 999) {
          return Promise.resolve([StoriesSeed[0]]);
        }
        return Promise.resolve([]);
      });

      const result1 = service.getStoriesByAnthology(999);
      expect(result1).resolves.toEqual([StoriesSeed[0]]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { anthologyId: 999 },
      });

      const result2 = service.getStoriesByAnthology(1);
      expect(result2).resolves.toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { anthologyId: 1 },
      });
    });
  });
});
