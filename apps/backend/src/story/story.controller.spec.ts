import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AnthologyService } from '../anthology/anthology.service';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from '../author/author.service';
import { StoriesSeed } from '../seeds/stories.seed';

describe('StoryController', () => {
  let controller: StoryController;

  const mockService = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    getStoriesByAnthology: jest.fn(),
    findByTitle: jest.fn(),
    findByTheme: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByAnthologyAndId: jest.fn(),
    createStory: jest.fn(),
    getDocumentsByAnthology: jest.fn(),
  };

  const mockAnthologyService = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoryController],
      providers: [
        { provide: StoryService, useValue: mockService },
        {
          provide: AnthologyService,
          useValue: mockAnthologyService,
        },
        {
          provide: AuthorService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StoryController>(StoryController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get stories by anthology', () => {
    it('get stories given anthology id', () => {
      mockService.getStoriesByAnthology.mockResolvedValue([StoriesSeed[0]]);
      const result = controller.getStoriesByAnthology(999);
      expect(result).resolves.toEqual([StoriesSeed[0]]);
      expect(mockService.getStoriesByAnthology).toHaveBeenCalledWith(999);
    });
  });

  describe('get story documents by anthology', () => {
    const page = { data: [], total: 0, page: 2 };

    it('returns the paginated documents', async () => {
      mockAnthologyService.findOne.mockResolvedValue({ id: 5 });
      mockService.getDocumentsByAnthology.mockResolvedValue(page);

      await expect(
        controller.getStoryDocumentsByAnthology(5, 2, 10),
      ).resolves.toEqual(page);
      expect(mockService.getDocumentsByAnthology).toHaveBeenCalledWith(
        5,
        2,
        10,
      );
    });

    it('caps limit at 100', async () => {
      mockAnthologyService.findOne.mockResolvedValue({ id: 5 });
      mockService.getDocumentsByAnthology.mockResolvedValue(page);

      await controller.getStoryDocumentsByAnthology(5, 1, 500);
      expect(mockService.getDocumentsByAnthology).toHaveBeenCalledWith(
        5,
        1,
        100,
      );
    });

    it('throws NotFoundException when the anthology does not exist', async () => {
      mockAnthologyService.findOne.mockResolvedValue(null);

      await expect(
        controller.getStoryDocumentsByAnthology(999, 1, 10),
      ).rejects.toThrow(NotFoundException);
      expect(mockService.getDocumentsByAnthology).not.toHaveBeenCalled();
    });

    it('throws BadRequestException when page is too large for an offset', async () => {
      await expect(
        controller.getStoryDocumentsByAnthology(5, 1e20, 10),
      ).rejects.toThrow(BadRequestException);
      expect(mockService.getDocumentsByAnthology).not.toHaveBeenCalled();
    });

    it('throws BadRequestException for non-positive page or limit', async () => {
      await expect(
        controller.getStoryDocumentsByAnthology(5, 0, 10),
      ).rejects.toThrow(BadRequestException);
      await expect(
        controller.getStoryDocumentsByAnthology(5, 1, 0),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('get story drafts by anthology', () => {
    const author = { id: 10, name: 'John Doe' };
    const stories = [
      {
        id: 1,
        title: 'Approved',
        author,
        storyDraft: { id: 3, inManuscript: true },
      },
      {
        id: 2,
        title: 'Not Approved',
        author,
        storyDraft: { id: 4, inManuscript: false },
      },
      { id: 3, title: 'No Draft', author, storyDraft: null },
    ];

    beforeEach(() => {
      mockService.getStoriesByAnthology.mockResolvedValue(stories);
    });

    it('returns every draft with its story when inManuscript is omitted', async () => {
      const result = await controller.getStoryDraftsByAnthology(5);

      expect(mockService.getStoriesByAnthology).toHaveBeenCalledWith(5);
      expect(result).toEqual([
        {
          id: 3,
          inManuscript: true,
          story: { id: 1, title: 'Approved', author },
        },
        {
          id: 4,
          inManuscript: false,
          story: { id: 2, title: 'Not Approved', author },
        },
      ]);
    });

    it('returns only approved drafts when inManuscript is true', async () => {
      const result = await controller.getStoryDraftsByAnthology(5, true);

      expect(result.map((draft) => draft.id)).toEqual([3]);
    });

    it('returns only unapproved drafts when inManuscript is false', async () => {
      const result = await controller.getStoryDraftsByAnthology(5, false);

      expect(result.map((draft) => draft.id)).toEqual([4]);
    });
  });

  // todo: other tests
});
