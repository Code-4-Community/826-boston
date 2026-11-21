import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException } from '@nestjs/common';
import { StoryDraftController } from './story-draft.controller';
import { CreateStoryDraftDto } from './dto/create-story-draft.dto';
import { UpdateStoryDraftDto } from './dto/update-story-draft.dto';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { StoryDraftService } from './story-draft.service';
import { EditRound, SubmissionRound } from './types';
import { OmchaiService } from '../omchai/omchai.service';
import { Omchai, OmchaiRole } from '../omchai/omchai.entity';
import { Story } from '../story/story.entity';
import { Anthology } from '../anthology/anthology.entity';
import { Role } from '../users/types';
import { IS_PUBLIC_KEY, USER_STATUS } from '../auth/roles.decorator';

const { OWNER, MANAGER, CONSULTED, HELPER, APPROVER, INFORMED } = OmchaiRole;
const ALL_ROLES = [OWNER, MANAGER, CONSULTED, HELPER, APPROVER, INFORMED];

const standardReq = { user: { id: 1, role: Role.STANDARD } } as never;
const adminReq = { user: { id: 2, role: Role.ADMIN } } as never;

describe('StoryDraftController', () => {
  let controller: StoryDraftController;

  const mockService = {
    create: jest.fn(),
    edit: jest.fn(),
    remove: jest.fn(),
  };
  // Real OmchaiService over mocked repositories, so the role checks run.
  const omchaiRepo = { findOne: jest.fn() };
  const storyRepo = { findOne: jest.fn() };

  /** Gives the standard user `role` on anthology 5 (or no role). */
  const asRole = (role: OmchaiRole | null) =>
    omchaiRepo.findOne.mockImplementation(async ({ where }) =>
      role && where.anthology.id === 5 ? { role } : null,
    );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoryDraftController],
      providers: [
        { provide: StoryDraftService, useValue: mockService },
        OmchaiService,
        { provide: getRepositoryToken(Omchai), useValue: omchaiRepo },
        { provide: getRepositoryToken(Story), useValue: storyRepo },
        { provide: getRepositoryToken(Anthology), useValue: {} },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideInterceptor(CurrentUserInterceptor)
      .useValue({ intercept: (_ctx, next) => next.handle() })
      .compile();

    controller = module.get<StoryDraftController>(StoryDraftController);
    jest.clearAllMocks();
    // every story and draft in these tests is on anthology 5
    storyRepo.findOne.mockResolvedValue({ anthology: { id: 5 } });
  });

  it('creates a story draft and returns success message', async () => {
    asRole(OWNER);
    const dto: CreateStoryDraftDto = {
      docLink: 'https://docs.google.com/doc1',
      submissionRound: SubmissionRound.ONE,
      studentConsent: true,
      inManuscript: false,
      editRound: EditRound.ONE,
      proofread: false,
      notes: ['First draft'],
      storyId: 1,
      checkpoints: { copyedit: true },
    };

    const response = await controller.createStoryDraft(dto, standardReq);

    expect(mockService.create).toHaveBeenCalledWith(
      dto.docLink,
      dto.submissionRound,
      dto.studentConsent,
      dto.inManuscript,
      dto.editRound,
      dto.proofread,
      dto.notes,
      dto.storyId,
      dto.checkpoints,
    );
    expect(response).toEqual({ message: 'StoryDraft created successfully' });
  });

  it('edits a story draft and returns success message', async () => {
    asRole(OWNER);
    mockService.edit.mockResolvedValue({});
    const dto: UpdateStoryDraftDto = {
      docLink: 'https://docs.google.com/doc2',
      submissionRound: SubmissionRound.TWO,
    };

    const response = await controller.editStoryDraft(7, dto, standardReq);

    expect(mockService.edit).toHaveBeenCalledWith(
      7,
      dto.docLink,
      dto.submissionRound,
      dto.studentConsent,
      dto.inManuscript,
      dto.editRound,
      dto.proofread,
      dto.notes,
      dto.checkpoints,
    );
    expect(response).toEqual({
      message: 'StoryDraft with id 7 updated successfully',
    });
  });

  it('deletes a story draft and returns success message', async () => {
    mockService.remove.mockResolvedValue({});

    const response = await controller.deleteStoryDraft(5);

    expect(mockService.remove).toHaveBeenCalledWith(5);
    expect(response).toEqual({ message: 'StoryDraft deleted successfully' });
  });

  describe('GET /story-drafts', () => {
    it('is no longer public and is admin only', () => {
      const handler = StoryDraftController.prototype.getStoryDrafts;
      expect(Reflect.getMetadata(IS_PUBLIC_KEY, handler)).toBeUndefined();
      expect(Reflect.getMetadata(USER_STATUS, handler)).toEqual([Role.ADMIN]);
    });
  });

  describe('PATCH permissions', () => {
    // [what the body changes, body, roles that may send it]
    const cases: [string, UpdateStoryDraftDto, OmchaiRole[]][] = [
      ['draft fields', { docLink: 'x' }, [OWNER, MANAGER, HELPER]],
      ['consent', { studentConsent: true }, [OWNER, MANAGER, HELPER]],
      [
        'checkpoints',
        { checkpoints: { copyedit: true } },
        [OWNER, MANAGER, APPROVER],
      ],
      [
        'rounds',
        { submissionRound: SubmissionRound.TWO },
        [OWNER, MANAGER, APPROVER],
      ],
      ['proofread', { proofread: true }, [OWNER, MANAGER, APPROVER]],
      ['add to manuscript', { inManuscript: true }, [OWNER, MANAGER, APPROVER]],
      [
        'remove from manuscript',
        { inManuscript: false },
        [OWNER, MANAGER, APPROVER],
      ],
      [
        'draft fields and checkpoints together',
        { docLink: 'x', checkpoints: { copyedit: true } },
        [OWNER, MANAGER],
      ],
      ['an empty body', {}, [OWNER, MANAGER, HELPER]],
    ];

    describe.each(cases)('changing %s', (_, body, allowed) => {
      it.each(ALL_ROLES)('as %s', async (role) => {
        asRole(role);
        const call = controller.editStoryDraft(7, body, standardReq);

        if (allowed.includes(role)) {
          await expect(call).resolves.toBeDefined();
          expect(mockService.edit).toHaveBeenCalled();
        } else {
          await expect(call).rejects.toThrow(ForbiddenException);
          expect(mockService.edit).not.toHaveBeenCalled();
        }
      });
    });

    it('checks the role on the draft’s publication', async () => {
      asRole(OWNER);
      storyRepo.findOne.mockResolvedValue({ anthology: { id: 6 } });

      await expect(
        controller.editStoryDraft(7, { docLink: 'x' }, standardReq),
      ).rejects.toThrow(ForbiddenException);
      expect(storyRepo.findOne).toHaveBeenCalledWith({
        where: { storyDraft: { id: 7 } },
        relations: ['anthology'],
      });
    });

    it('rejects a user with no role on the publication', async () => {
      asRole(null);

      await expect(
        controller.editStoryDraft(7, { docLink: 'x' }, standardReq),
      ).rejects.toThrow(ForbiddenException);
    });

    it('lets an admin with no role change anything', async () => {
      asRole(null);

      await expect(
        controller.editStoryDraft(
          7,
          { docLink: 'x', checkpoints: { a: true }, inManuscript: true },
          adminReq,
        ),
      ).resolves.toBeDefined();
    });
  });

  describe('POST permissions', () => {
    const plain: CreateStoryDraftDto = { storyId: 1, docLink: 'x' };

    it.each([
      [OWNER, true],
      [MANAGER, true],
      [HELPER, true],
      [APPROVER, false],
      [CONSULTED, false],
      [INFORMED, false],
    ])('a plain new draft as %s → allowed %s', async (role, allowed) => {
      asRole(role);
      const call = controller.createStoryDraft(plain, standardReq);

      if (allowed) await expect(call).resolves.toBeDefined();
      else await expect(call).rejects.toThrow(ForbiddenException);
    });

    it('stops a Helper from creating a draft with checkpoints already ticked', async () => {
      asRole(HELPER);

      await expect(
        controller.createStoryDraft(
          { ...plain, checkpoints: { copyedit: true } },
          standardReq,
        ),
      ).rejects.toThrow(ForbiddenException);
      expect(mockService.create).not.toHaveBeenCalled();
    });

    it('stops a Helper from creating a draft already in the manuscript', async () => {
      asRole(HELPER);

      await expect(
        controller.createStoryDraft(
          { ...plain, inManuscript: true },
          standardReq,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('checks the role on the publication of the story in the body', async () => {
      asRole(OWNER);

      await controller.createStoryDraft({ ...plain, storyId: 42 }, standardReq);

      expect(storyRepo.findOne).toHaveBeenCalledWith({
        where: { id: 42 },
        relations: ['anthology'],
      });
    });
  });
});
