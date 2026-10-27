import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Story } from './story.entity';
import { StoryService, splitName } from './story.service';
import { StoriesSeed } from '../seeds/stories.seed';
import { Anthology } from 'src/anthology/anthology.entity';
import { Author } from 'src/author/author.entity';
import { StoryDraft } from 'src/story-draft/story-draft.entity';
import { NotFoundException } from '@nestjs/common';

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
    findOne: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    count: jest.fn(),
    remove: jest.fn(),
    manager: { transaction: jest.fn() },
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
            author: {
              id: 10,
              name: 'John Doe',
              nameInBook: 'John Doe',
              grade: 6,
            },
            studentBio: 'A student description.',
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
            nameInBook: 'John Doe',
            description: 'A student description.',
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
            nameInBook: null,
            description: null,
            docLink: null,
          },
        ],
      });
    });

    it('applies grade and checkpoint filters before pagination', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.getDocumentsByAnthology(7, 1, 5, {
        grades: [5, 6],
        checkpoints: [
          'draft1',
          'draft2',
          'consent',
          'authorApproval',
          'copyedit',
          'proofread',
        ],
      });

      const query = mockRepository.findAndCount.mock.calls[0][0];
      expect(query.where.author.grade.value).toEqual([5, 6]);
      expect(query.where.storyDraft.submissionRound.value).toEqual([0, 1]);
      expect(query.where.storyDraft.studentConsent).toBe(true);
      expect(query.where.storyDraft.inManuscript).toBe(true);
      expect(query.where.storyDraft.editRound).toBe(1);
      expect(query.where.storyDraft.proofread).toBe(true);
    });

    it('filters by draft inManuscript when given', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.getDocumentsByAnthology(7, 1, 5, { inManuscript: true });

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { anthology: { id: 7 }, storyDraft: { inManuscript: true } },
        relations: ['author', 'storyDraft'],
        order: { id: 'ASC' },
        skip: 0,
        take: 5,
      });
    });
  });

  describe('findByAnthologyAndId', () => {
    it('returns the story when it belongs to the anthology', async () => {
      mockRepository.findOne.mockResolvedValue(storyExample);

      const result = await service.findByAnthologyAndId(1, 1);

      expect(result).toEqual(storyExample);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, anthology: { id: 1 } },
      });
    });

    it('throws NotFoundException when the story is not in the anthology', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findByAnthologyAndId(2, 1)).rejects.toThrow(
        NotFoundException,
      );
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

  describe('remove', () => {
    const mockManager = { remove: jest.fn() };

    beforeEach(() => {
      mockRepository.manager.transaction.mockImplementation(async (cb) =>
        cb(mockManager),
      );
      mockManager.remove.mockImplementation(async (entity) => entity);
    });

    it('removes the story and then its draft in one transaction', async () => {
      const storyDraft = {
        id: 5,
        docLink: 'https://docs.example',
      } as StoryDraft;
      const story = { id: 3, storyDraft } as Story;
      mockRepository.findOne.mockResolvedValue(story);

      const result = await service.remove(3);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 3 },
        relations: ['storyDraft'],
      });
      expect(mockManager.remove.mock.calls).toEqual([[story], [storyDraft]]);
      expect(result).toBe(story);
    });

    it('only removes the story when it has no draft', async () => {
      const story = { id: 4, storyDraft: null } as unknown as Story;
      mockRepository.findOne.mockResolvedValue(story);

      await service.remove(4);

      expect(mockManager.remove.mock.calls).toEqual([[story]]);
    });

    it('throws NotFoundException and removes nothing when the story does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.manager.transaction).not.toHaveBeenCalled();
    });
  });
});
