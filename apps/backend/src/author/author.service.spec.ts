import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { AuthorService } from './author.service';
import { Author } from './author.entity';
import {
  mockAuthor1,
  mockAuthor2,
  mockCreateAuthor1Dto,
} from './author.controller.spec';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { EditAuthorDto } from './dtos/edit-author.dto';

describe('AuthorService', () => {
  let service: AuthorService;

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
        AuthorService,
        {
          provide: getRepositoryToken(Author),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new author', async () => {
      mockRepository.count.mockResolvedValue(0);
      mockRepository.create.mockResolvedValue({
        ...mockCreateAuthor1Dto,
        id: 1,
      });
      mockRepository.save.mockResolvedValue({
        ...mockCreateAuthor1Dto,
        id: 1,
      });

      const result = await service.create(mockCreateAuthor1Dto);

      expect(result).toEqual({
        ...mockCreateAuthor1Dto,
        id: 1,
      });
      expect(mockRepository.count).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...mockCreateAuthor1Dto,
        id: 1,
      });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockCreateAuthor1Dto,
        id: 1,
      });
    });

    it('should increment id based on count', async () => {
      const created: Author = {
        id: 6,
        name: 'Another Author',
        bio: 'Another bio',
        grade: 3,
        classPeriod: '',
        nameInBook: '',
        stories: [],
      };
      const createdDto: CreateAuthorDto = {
        name: 'Another Author',
        bio: 'Another bio',
        grade: 3,
      };

      mockRepository.count.mockResolvedValue(5);
      mockRepository.create.mockReturnValue(created);
      mockRepository.save.mockResolvedValue(created);

      const result = await service.create(createdDto);

      expect(result).toEqual(created);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createdDto,
        id: 6,
      });
    });
  });

  describe('findOne', () => {
    it('should return author when found', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockAuthor2);

      const result = await service.findOne(1);

      expect(result).toEqual(mockAuthor2);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should raise not found exception when author not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      
      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Author not found'),
      );
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });

    it('should raise not found exception when id is falsy', async () => {
      await expect(service.findOne(0)).rejects.toThrow(
        new NotFoundException('Author not found'),
      );
    });
  });

  describe('findAll', () => {
    it('should return authors', async () => {
      const authors: Author[] = [mockAuthor1, mockAuthor2];
      mockRepository.find.mockResolvedValue(authors);

      const result = await service.findAll();

      expect(result).toEqual(authors);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an author when found', async () => {
      const existing: Author = { ...mockAuthor1 };
      const updated: Author = { ...mockAuthor1, bio: 'Updated bio' };

      mockRepository.findOneBy.mockResolvedValue(existing);
      mockRepository.save.mockResolvedValue(updated);

      const editAuthorDto: EditAuthorDto = { bio: 'Updated bio' };

      const result = await service.update(1, editAuthorDto);

      expect(result).toEqual(updated);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...existing,
        bio: 'Updated bio',
      });
    });

    it('should throw NotFoundException when author does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(999, { name: 'Nope' })).rejects.toThrow(
        new NotFoundException('Author not found'),
      );
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove author when found', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockAuthor2);
      mockRepository.remove.mockResolvedValue(mockAuthor2);
      await service.remove(1);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockAuthor2);
    });

    it('should throw NotFoundException when author not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Author not found'),
      );
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });
});
