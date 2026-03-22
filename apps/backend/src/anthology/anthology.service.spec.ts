import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import { AnthologyStatus } from './types';

describe('AnthologyService', () => {
  let service: AnthologyService;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    count: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnthologyService,
        { provide: getRepositoryToken(Anthology), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<AnthologyService>(AnthologyService);
    jest.clearAllMocks();
  });

  describe('update', () => {
    it('throws when anthology does not exist', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(999, { title: 'New Title' }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(mockRepo.save).not.toHaveBeenCalled();
    });

    it('updates and saves anthology when found', async () => {
      const existing = {
        id: 1,
        title: 'Old Title',
        description: 'Old Description',
      } as Anthology;

      const updated = {
        ...existing,
        title: 'New Title',
      } as Anthology;

      mockRepo.findOneBy.mockResolvedValue(existing);
      mockRepo.save.mockResolvedValue(updated);

      const result = await service.update(1, { title: 'New Title' });

      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'New Title' }),
      );
      expect(result.title).toBe('New Title');
    });
  });

  describe('publish', () => {
    it('throws when anthology does not exist', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.publish(999)).rejects.toBeInstanceOf(
        NotFoundException,
      );

      expect(mockRepo.save).not.toHaveBeenCalled();
    });

    it('returns benign message when already has publishedDate', async () => {
      const existing = {
        id: 1,
        title: 'Test Anthology',
        publishedDate: new Date('2025-01-15'),
      } as Anthology;

      mockRepo.findOneBy.mockResolvedValue(existing);

      const result = await service.publish(1);

      expect(mockRepo.save).not.toHaveBeenCalled();
      expect(result).toEqual({ message: 'Anthology is already published' });
    });

    it('sets publishedDate when not yet published', async () => {
      const existing = {
        id: 1,
        title: 'Test Anthology',
        status: AnthologyStatus.DRAFTING,
        publishedDate: null,
      } as Anthology;

      mockRepo.findOneBy.mockResolvedValue(existing);
      mockRepo.save.mockImplementation(async (anthology) => anthology);

      const result = await service.publish(1);

      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepo.save).toHaveBeenCalled();
      const savedAnthology = mockRepo.save.mock.calls[0][0];
      expect(savedAnthology.publishedDate).toBeInstanceOf(Date);
      expect((result as Anthology).publishedDate).toBeInstanceOf(Date);
    });
  });
});
