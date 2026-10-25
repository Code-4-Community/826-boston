import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Story } from './story.entity';
import { StoryService, splitName } from './story.service';
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
    findAndCount: jest.fn(),
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

  describe('splitName', () => {
    it('splits on the last space', () => {
      expect(splitName('John Doe')).toEqual({
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(splitName('Mary Ann Smith')).toEqual({
        firstName: 'Mary Ann',
        lastName: 'Smith',
      });
    });

    it('handles single-word and padded names', () => {
      expect(splitName('Madonna')).toEqual({
        firstName: 'Madonna',
        lastName: '',
      });
      expect(splitName('  John Doe ')).toEqual({
        firstName: 'John',
        lastName: 'Doe',
      });
    });
  });

  describe('getDocumentsByAnthology', () => {
    it('maps stories to document rows and paginates', async () => {
      mockRepository.findAndCount.mockResolvedValue([
        [
          {
            id: 1,
            author: { id: 10, name: 'John Doe', grade: 6 },
            storyDraft: {
              id: 3,
              studentConsent: true,
              docLink: 'https://x.com/a',
            },
          },
          {
            id: 2,
            author: { id: 11, name: 'Risa Tuffaha', grade: null },
            storyDraft: null,
          },
        ],
        12,
      ]);

      const result = await service.getDocumentsByAnthology(7, 2, 5);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { anthology: { id: 7 } },
        relations: ['author', 'storyDraft'],
        order: { id: 'ASC' },
        skip: 5,
        take: 5,
      });
      expect(result).toEqual({
        total: 12,
        page: 2,
        data: [
          {
            storyId: 1,
            storyDraftId: 3,
            authorId: 10,
            consent: true,
            firstName: 'John',
            lastName: 'Doe',
            grade: 6,
            docLink: 'https://x.com/a',
          },
          {
            storyId: 2,
            storyDraftId: null,
            authorId: 11,
            consent: false,
            firstName: 'Risa',
            lastName: 'Tuffaha',
            grade: null,
            docLink: null,
          },
        ],
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
        'Theme',
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
