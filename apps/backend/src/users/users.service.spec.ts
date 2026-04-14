import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Role } from './types';
import { Omchai, OmchaiRole } from '../omchai/omchai.entity';

export const mockUser: User = {
  id: 1,
  role: Role.STANDARD,
  email: 'john@example.com',
  firstName: 'John Doe',
  lastName: '',
  omchaiAssignments: [],
};

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      mockRepository.find.mockResolvedValue([mockUser]);
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(
        'john@example.com',
        'John',
        'Doe',
        Role.STANDARD,
      );

      expect(repo.find).toHaveBeenCalled();
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      mockRepository.find.mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockUser);
    });

    it('should return null if id is false', async () => {
      const result = await service.findOne(0);

      expect(result).toBeNull();
    });
  });

  describe('find', () => {
    it('should return users by email', async () => {
      mockRepository.find.mockResolvedValue([mockUser]);

      const result = await service.find('john@example.com');

      expect(repo.find).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findWithOmchai', () => {
    it('should return users with omchai assignments when none exist', async () => {
      const userWithoutOmchai = { ...mockUser, omchaiAssignments: [] };
      mockRepository.find.mockResolvedValue([userWithoutOmchai]);

      const result = await service.findWithOmchai('john@example.com');

      expect(repo.find).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
        relations: { omchaiAssignments: true },
      });
      expect(result).toEqual([userWithoutOmchai]);
      expect(result[0].omchaiAssignments).toHaveLength(0);
    });

    it('should return users with one omchai assignment', async () => {
      const mockOmchai: Omchai = {
        id: 1,
        anthologyId: 1,
        userId: 1,
        role: OmchaiRole.OWNER,
        datetimeAssigned: new Date(),
        user: null,
        anthology: null,
      };

      const userWithOneOmchai = {
        ...mockUser,
        omchaiAssignments: [mockOmchai],
      };
      mockRepository.find.mockResolvedValue([userWithOneOmchai]);

      const result = await service.findWithOmchai('john@example.com');

      expect(repo.find).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
        relations: { omchaiAssignments: true },
      });
      expect(result).toEqual([userWithOneOmchai]);
      expect(result[0].omchaiAssignments).toHaveLength(1);
      expect(result[0].omchaiAssignments[0].role).toBe(OmchaiRole.OWNER);
    });

    it('should return users with many omchai assignments', async () => {
      const mockOmchai1: Omchai = {
        id: 1,
        anthologyId: 1,
        userId: 1,
        role: OmchaiRole.OWNER,
        datetimeAssigned: new Date(),
        user: null,
        anthology: null,
      };

      const mockOmchai2: Omchai = {
        id: 2,
        anthologyId: 2,
        userId: 1,
        role: OmchaiRole.MANAGER,
        datetimeAssigned: new Date(),
        user: null,
        anthology: null,
      };

      const mockOmchai3: Omchai = {
        id: 3,
        anthologyId: 3,
        userId: 1,
        role: OmchaiRole.HELPER,
        datetimeAssigned: new Date(),
        user: null,
        anthology: null,
      };

      const userWithManyOmchai = {
        ...mockUser,
        omchaiAssignments: [mockOmchai1, mockOmchai2, mockOmchai3],
      };
      mockRepository.find.mockResolvedValue([userWithManyOmchai]);

      const result = await service.findWithOmchai('john@example.com');

      expect(repo.find).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
        relations: { omchaiAssignments: true },
      });
      expect(result).toEqual([userWithManyOmchai]);
      expect(result[0].omchaiAssignments).toHaveLength(3);
      expect(result[0].omchaiAssignments[0].role).toBe(OmchaiRole.OWNER);
      expect(result[0].omchaiAssignments[1].role).toBe(OmchaiRole.MANAGER);
      expect(result[0].omchaiAssignments[2].role).toBe(OmchaiRole.HELPER);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue({ ...mockUser, firstName: 'Jane' });

      const result = await service.update(1, { firstName: 'Jane' });

      expect(repo.save).toHaveBeenCalled();
      expect(result.firstName).toBe('Jane');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(999, { firstName: 'Jane' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockUser);
      mockRepository.remove.mockResolvedValue(mockUser);

      const result = await service.remove(1);

      expect(repo.remove).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
