import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Story } from './story.entity';
import { StoryService } from './story.service';
import { StoriesSeed } from '../seeds/stories.seed';
import { Anthology } from 'src/anthology/anthology.entity';
import { Author } from 'src/author/author.entity';

export const storyExample = {
  title: 'Standing at the Threshold',
  description: 'A reflection on crossing borders — geographic, cultural, and emotional — and what it means to build a new home while carrying the old one.',
  studentBio: 'Abdullah is a 9th-grade student at Riverside International High School. He came to Boston from Karachi, Pakistan in 2023.',
  theme: 'Immigration and Belonging',
  anthology_id: 1,
  author_id: 1,
  id: 1,
} as unknown as Story;

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
    it('get stories given anthology id', async () => {
      mockRepository.find.mockImplementation(async (query) => {
        if (query.where?.anthology?.id === 999) {
          return [storyExample];
        }
        return [];
      });

      const result1 = await service.getStoriesByAnthology(999);
      expect(result1).toEqual([storyExample]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { anthology: { id: 999 } },
      });

      const result2 = await service.getStoriesByAnthology(1);
      expect(result2).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { anthology: { id: 1 } },
      });
    });
  });
});
