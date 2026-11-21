import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnthologyService } from '../anthology/anthology.service';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from '../author/author.service';
import { StoriesSeed } from '../seeds/stories.seed';
import { OmchaiService } from '../omchai/omchai.service';
import { Omchai, OmchaiRole } from '../omchai/omchai.entity';
import { Story } from './story.entity';
import { Anthology } from '../anthology/anthology.entity';
import { Role } from '../users/types';
import { IS_PUBLIC_KEY, OMCHAI_ROLES } from '../auth/roles.decorator';

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
  const omchaiRepo = { findOne: jest.fn() };
  const storyRepo = { findOne: jest.fn() };

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
        OmchaiService,
        { provide: getRepositoryToken(Omchai), useValue: omchaiRepo },
        { provide: getRepositoryToken(Story), useValue: storyRepo },
        { provide: getRepositoryToken(Anthology), useValue: {} },
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

  describe('route protection', () => {
    const proto = StoryController.prototype;
    const ALL_ROLES = Object.values(OmchaiRole);

    it.each([
      ['getStoryDocumentsByAnthology', proto.getStoryDocumentsByAnthology],
      ['getStoryDraftsByAnthology', proto.getStoryDraftsByAnthology],
    ])('%s needs login and any role on the publication', (_, handler) => {
      expect(Reflect.getMetadata(IS_PUBLIC_KEY, handler)).toBeUndefined();
      expect(Reflect.getMetadata(OMCHAI_ROLES, handler)).toEqual(ALL_ROLES);
    });

    it('createStory needs draft-edit rights', () => {
      expect(Reflect.getMetadata(OMCHAI_ROLES, proto.createStory)).toEqual([
        OmchaiRole.OWNER,
        OmchaiRole.MANAGER,
        OmchaiRole.HELPER,
      ]);
    });

    it.each([
      ['getStoriesByAnthology', proto.getStoriesByAnthology],
      ['getStory (library)', proto.getStory],
    ])('%s stays public for the Library', (_, handler) => {
      expect(Reflect.getMetadata(IS_PUBLIC_KEY, handler)).toBe(true);
    });
  });

  describe('remove story', () => {
    const req = { user: { id: 1, role: Role.STANDARD } } as never;

    beforeEach(() => {
      storyRepo.findOne.mockResolvedValue({ anthology: { id: 5 } });
      mockService.remove.mockResolvedValue({ id: 3 });
    });

    it.each([
      [OmchaiRole.OWNER, true],
      [OmchaiRole.MANAGER, true],
      [OmchaiRole.HELPER, true],
      [OmchaiRole.APPROVER, false],
      [OmchaiRole.CONSULTED, false],
      [OmchaiRole.INFORMED, false],
    ])('as %s → allowed %s', async (role, allowed) => {
      omchaiRepo.findOne.mockResolvedValue({ role });
      const call = controller.removeStory(3, req);

      if (allowed) {
        await expect(call).resolves.toEqual({ id: 3 });
      } else {
        await expect(call).rejects.toThrow(ForbiddenException);
        expect(mockService.remove).not.toHaveBeenCalled();
      }
    });

    it('checks the role on the story’s publication', async () => {
      omchaiRepo.findOne.mockResolvedValue({ role: OmchaiRole.OWNER });

      await controller.removeStory(3, req);

      expect(omchaiRepo.findOne).toHaveBeenCalledWith({
        where: { user: { id: 1 }, anthology: { id: 5 } },
      });
    });

    it('lets an admin with no role delete', async () => {
      omchaiRepo.findOne.mockResolvedValue(null);

      await expect(
        controller.removeStory(3, {
          user: { id: 2, role: Role.ADMIN },
        } as never),
      ).resolves.toEqual({ id: 3 });
    });
  });
});
