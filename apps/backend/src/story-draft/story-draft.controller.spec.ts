import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';
import { StoryDraftController } from './story-draft.controller';
import { CreateStoryDraftDto } from './dto/create-story-draft.dto';
import { UpdateStoryDraftDto } from './dto/update-story-draft.dto';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { StoryDraftService } from './story-draft.service';
import { EditRound, SubmissionRound } from './types';

describe('StoryDraftController', () => {
  let controller: StoryDraftController;

  const mockService = {
    create: jest.fn(),
    edit: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoryDraftController],
      providers: [{ provide: StoryDraftService, useValue: mockService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideInterceptor(CurrentUserInterceptor)
      .useValue({ intercept: (_ctx, next) => next.handle() })
      .compile();

    controller = module.get<StoryDraftController>(StoryDraftController);
    jest.clearAllMocks();
  });

  it('creates a story draft and returns success message', async () => {
    const dto: CreateStoryDraftDto = {
      authorId: 1,
      docLink: 'https://docs.google.com/doc1',
      submissionRound: SubmissionRound.ONE,
      studentConsent: true,
      inManuscript: false,
      editRound: EditRound.ONE,
      proofread: false,
      notes: ['First draft'],
    };

    const response = await controller.createStoryDraft(dto);

    expect(mockService.create).toHaveBeenCalledWith(
      dto.authorId,
      dto.docLink,
      dto.submissionRound,
      dto.studentConsent,
      dto.inManuscript,
      dto.editRound,
      dto.proofread,
      dto.notes,
    );
    expect(response).toEqual({ message: 'StoryDraft created successfully' });
  });

  it('edits a story draft and returns success message', async () => {
    mockService.edit.mockResolvedValue({});
    const dto: UpdateStoryDraftDto = {
      docLink: 'https://docs.google.com/doc2',
      submissionRound: SubmissionRound.TWO,
    };

    const response = await controller.editStoryDraft(7, dto);

    expect(mockService.edit).toHaveBeenCalledWith(
      7,
      dto.authorId,
      dto.docLink,
      dto.submissionRound,
      dto.studentConsent,
      dto.inManuscript,
      dto.editRound,
      dto.proofread,
      dto.notes,
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
});
