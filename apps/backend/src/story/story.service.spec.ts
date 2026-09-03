import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Story } from './story.entity';
import { StoryService } from './story.service';
import { StoriesSeed } from '../seeds/stories.seed';
import { Anthology } from 'src/anthology/anthology.entity';
import { Author } from 'src/author/author.entity';

export const storyExample = {
  title: 'Standing at the Threshold',
  description:
    'A reflection on crossing borders — geographic, cultural, and emotional — and what it means to build a new home while carrying the old one.',
  studentBio:
    'Abdullah is a 9th-grade student at Riverside International High School. He came to Boston from Karachi, Pakistan in 2023.',
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
        relations: ['storyDraft', 'author', 'anthology'],
        where: { anthology: { id: 999 } },
      });

      const result2 = await service.getStoriesByAnthology(1);
      expect(result2).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['storyDraft', 'author', 'anthology'],
        where: { anthology: { id: 1 } },
      });
    });
  });

  describe('createStory', () => {
    it('should create a story without a draft relation when no storyDraftId is passed', async () => {
      const createdStory = {
        id: 7,
        title: 'Test story',
        anthology: { id: 1 },
        author: { id: 2 },
        studentBio: 'Bio',
        description: 'Desc',
      } as Story;

      mockRepository.create.mockReturnValue(createdStory);
      mockRepository.save.mockResolvedValue(createdStory);

      const result = await service.createStory(
        'Test story',
        1,
        2,
        'Bio',
        'Desc',
        'Theme'
      );

      expect(mockRepository.create).toHaveBeenCalledWith({
        title: 'Test story',
        anthology: { id: 1 },
        author: { id: 2 },
        studentBio: 'Bio',
        description: 'Desc',
        theme: 'Theme',
      });
      expect(result).toEqual(createdStory);
    });
  });
});
