import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { OmchaiService } from './omchai.service';
import { Omchai, OmchaiRole } from './omchai.entity';
import { Anthology } from 'src/anthology/anthology.entity';
import { User } from 'src/users/user.entity';
import { CreateOmchaiDto } from './dtos/create-omchai.dto';

describe('OmchaiService', () => {
  let service: OmchaiService;

  const mockOmchai: Omchai = {
    id: 1,
    anthology: { id: 1 } as Anthology,
    user: { id: 1 } as User,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OmchaiService,
        {
          provide: getRepositoryToken(Omchai),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OmchaiService>(OmchaiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new omchai', async () => {
      const dto: CreateOmchaiDto = {
        anthologyId: 1,
        userId: 1,
        role: OmchaiRole.OWNER,
        datetimeAssigned: new Date(),
      };

      mockRepository.create.mockReturnValue(mockOmchai);
      mockRepository.save.mockResolvedValue(mockOmchai);

      const result = await service.create(dto);

      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockOmchai);
      expect(result).toEqual(mockOmchai);
    });
  });

  describe('findAll', () => {
    it('should return all omchai', async () => {
      mockRepository.find.mockResolvedValue([mockOmchai]);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockOmchai]);
    });
  });

  describe('findByAnthologyId', () => {
    it('should return omchai for specific anthology', async () => {
      mockRepository.find.mockResolvedValue([mockOmchai]);

      const result = await service.findByAnthologyId(1);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { anthology: { id: 1 } },
        relations: ['user'],
      });
      expect(result).toEqual([mockOmchai]);
    });
  });

  describe('update', () => {
    it('should update an omchai', async () => {
      const dto = { role: OmchaiRole.MANAGER };
      const updated = { ...mockOmchai, role: OmchaiRole.MANAGER };

      mockRepository.findOneBy.mockResolvedValue(mockOmchai);
      mockRepository.save.mockResolvedValue(updated);

      const result = await service.update(1, dto);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException if omchai not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(999, { role: OmchaiRole.MANAGER }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
