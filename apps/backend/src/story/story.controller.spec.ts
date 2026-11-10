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
    const staff = { user: { id: 1 } };

    it('get stories given anthology id', async () => {
      mockService.getStoriesByAnthology.mockResolvedValue([StoriesSeed[0]]);
      const result = await controller.getStoriesByAnthology(
        999,
        undefined,
        staff,
      );
      expect(result).toEqual([StoriesSeed[0]]);
      expect(mockService.getStoriesByAnthology).toHaveBeenCalledWith(
        999,
        false,
      );
      expect(mockAnthologyService.findOne).not.toHaveBeenCalled();
    });

    it('404s for an anonymous caller when the publication is not in the Library', async () => {
      mockAnthologyService.findOne.mockResolvedValue(null);

      await expect(
        controller.getStoriesByAnthology(7, undefined, { user: undefined }),
      ).rejects.toThrow(NotFoundException);
      expect(mockAnthologyService.findOne).toHaveBeenCalledWith(7, true);
      expect(mockService.getStoriesByAnthology).not.toHaveBeenCalled();
    });

    it('returns stories to an anonymous caller for a Library publication', async () => {
      mockAnthologyService.findOne.mockResolvedValue({ id: 7 });
      mockService.getStoriesByAnthology.mockResolvedValue([StoriesSeed[0]]);

      await expect(
        controller.getStoriesByAnthology(7, undefined, { user: undefined }),
      ).resolves.toEqual([StoriesSeed[0]]);
      expect(mockService.getStoriesByAnthology).toHaveBeenCalledWith(7, true);
    });

    it('applies the Library rule for staff when library=true', async () => {
      mockAnthologyService.findOne.mockResolvedValue(null);

      await expect(
        controller.getStoriesByAnthology(7, 'true', staff),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('get library story', () => {
    it('passes the Library rule to the query for an anonymous caller', async () => {
      mockService.findByAnthologyAndId.mockResolvedValue(StoriesSeed[0]);

      await controller.getStory(7, 3, undefined, { user: undefined });
      expect(mockService.findByAnthologyAndId).toHaveBeenCalledWith(7, 3, true);
    });

    it('does not apply it for staff without the flag', async () => {
      mockService.findByAnthologyAndId.mockResolvedValue(StoriesSeed[0]);

      await controller.getStory(7, 3, undefined, { user: { id: 1 } });
      expect(mockService.findByAnthologyAndId).toHaveBeenCalledWith(
        7,
        3,
        false,
      );
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

    it('passes the inManuscript filter to the service', async () => {
      mockAnthologyService.findOne.mockResolvedValue({ id: 5 });
      mockService.getDocumentsByAnthology.mockResolvedValue(page);

      await controller.getStoryDocumentsByAnthology(
        5,
        1,
        10,
        undefined,
        undefined,
        false,
      );
      expect(mockService.getDocumentsByAnthology).toHaveBeenCalledWith(
        5,
        1,
        10,
        { inManuscript: false },
      );
    });

    it('passes document filters to the service', async () => {
      mockAnthologyService.findOne.mockResolvedValue({ id: 5 });
      mockService.getDocumentsByAnthology.mockResolvedValue(page);

      await controller.getStoryDocumentsByAnthology(
        5,
        1,
        10,
        '5,6',
        'draft1,consent',
      );

      expect(mockService.getDocumentsByAnthology).toHaveBeenCalledWith(
        5,
        1,
        10,
        {
          grades: [5, 6],
          checkpoints: ['draft1', 'consent'],
        },
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
