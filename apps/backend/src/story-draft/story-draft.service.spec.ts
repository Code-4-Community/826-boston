import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StoryDraftService } from './story-draft.service';
import { EditRound, SubmissionRound } from './types';
import { StoryDraft } from './story-draft.entity';


describe('StoryDraftService', () => {
  let service: StoryDraftService;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoryDraftService,
        { provide: getRepositoryToken(StoryDraft), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<StoryDraftService>(StoryDraftService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('persists a new story draft successfully', async () => {
      const payload = {
        docLink: 'https://docs.google.com/doc1',
        submissionRound: SubmissionRound.ONE,
        studentConsent: true,
        inManuscript: false,
        editRound: EditRound.ONE,
        proofread: false,
        notes: ['First draft'],
        story: { id: 1 },
      };

      const created = { id: 1, ...payload } as StoryDraft;
      mockRepo.create.mockReturnValue(created);
      mockRepo.save.mockResolvedValue(created);

      const result = await service.create(
        payload.docLink,
        payload.submissionRound,
        payload.studentConsent,
        payload.inManuscript,
        payload.editRound,
        payload.proofread,
        payload.notes,
        payload.story.id,
      );

      expect(mockRepo.create).toHaveBeenCalledWith(payload);
      expect(mockRepo.save).toHaveBeenCalledWith(created);
      expect(result).toBe(created);
    });
  });

  describe('edit', () => {
    it('throws when story draft does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.edit(7, 'newLink')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockRepo.save).not.toHaveBeenCalled();
    });

    it('updates and saves story draft when found', async () => {
      const existing = {
        id: 3,
        docLink: 'https://docs.google.com/old',
        submissionRound: SubmissionRound.ONE,
        studentConsent: false,
        inManuscript: false,
        editRound: EditRound.ONE,
        proofread: false,
        notes: ['Old note'],
      } as StoryDraft;

      mockRepo.findOne.mockResolvedValue(existing);
      mockRepo.save.mockImplementation(async (storyDraft) => storyDraft);

      const result = await service.edit(
        3,
        'https://docs.google.com/new',
        SubmissionRound.TWO,
        true,
        true,
        EditRound.TWO,
        true,
        ['New note'],
      );

      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 3,
          docLink: 'https://docs.google.com/new',
          submissionRound: SubmissionRound.TWO,
          studentConsent: true,
          inManuscript: true,
          editRound: EditRound.TWO,
          proofread: true,
          notes: ['New note'],
        }),
      );
      expect(result.docLink).toBe('https://docs.google.com/new');
      expect(result.submissionRound).toBe(SubmissionRound.TWO);
      expect(result.studentConsent).toBe(true);
      expect(result.inManuscript).toBe(true);
      expect(result.editRound).toBe(EditRound.TWO);
      expect(result.proofread).toBe(true);
      expect(result.notes).toEqual(['New note']);
    });
  });

  describe('remove', () => {
    it('throws when story draft does not exist', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.remove(42)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockRepo.remove).not.toHaveBeenCalled();
    });

    it('removes story draft when found', async () => {
      const existing = { id: 5 } as StoryDraft;
      mockRepo.findOneBy.mockResolvedValue(existing);
      mockRepo.remove.mockResolvedValue(existing);

      const result = await service.remove(5);

      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 5 });
      expect(mockRepo.remove).toHaveBeenCalledWith(existing);
      expect(result).toBe(existing);
    });
  });
});
