import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { InventoryHoldingService } from './inventory-holding.service';
import { InventoryHolding } from './inventory-holding.entity';

describe('InventoryHoldingService', () => {
  let service: InventoryHoldingService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryHoldingService,
        {
          provide: getRepositoryToken(InventoryHolding),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<InventoryHoldingService>(InventoryHoldingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new inventory holding', async () => {
    const dto = { inventory: { id: 2 }, anthology: { id: 3 }, numCopies: 5 };
    const created = {
      id: 1,
      inventory: { id: 2 },
      anthology: { id: 3 },
      numCopies: 5,
    };

    mockRepository.create.mockReturnValue(created);
    mockRepository.save.mockResolvedValue(created);

    const result = await service.create(dto as any);

    expect(result).toEqual(created);
    expect(mockRepository.create).toHaveBeenCalledWith(dto);
    expect(mockRepository.save).toHaveBeenCalledWith(created);
  });

  it('should return all inventory holdings', async () => {
    const holdings = [
      { id: 1, numCopies: 5, inventory: { id: 2 }, anthology: { id: 3 } },
    ];
    mockRepository.find.mockResolvedValue(holdings);

    const result = await service.findAll();

    expect(result).toEqual(holdings);
    expect(mockRepository.find).toHaveBeenCalledWith({
      relations: ['inventory', 'anthology'],
    });
  });

  it('should return a single inventory holding when found', async () => {
    const holding = {
      id: 1,
      numCopies: 5,
      inventory: { id: 2 },
      anthology: { id: 3 },
    };
    mockRepository.findOne.mockResolvedValue(holding);

    const result = await service.findOne(1);

    expect(result).toEqual(holding);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['inventory', 'anthology'],
    });
  });

  it('should throw NotFoundException when inventory holding not found', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toThrow(
      new NotFoundException('InventoryHolding not found'),
    );
  });

  it('should update an inventory holding', async () => {
    const existing = {
      id: 1,
      numCopies: 5,
      inventory: { id: 2 },
      anthology: { id: 3 },
    };
    const updated = { ...existing, numCopies: 8 };

    mockRepository.findOne.mockResolvedValue(existing);
    mockRepository.save.mockResolvedValue(updated);

    const result = await service.update(1, { numCopies: 8 } as any);

    expect(result).toEqual(updated);
    expect(mockRepository.save).toHaveBeenCalledWith(updated);
  });

  it('should remove an inventory holding', async () => {
    const holding = {
      id: 1,
      numCopies: 5,
      inventory: { id: 2 },
      anthology: { id: 3 },
    };
    mockRepository.findOne.mockResolvedValue(holding);
    mockRepository.remove.mockResolvedValue(holding);

    const result = await service.remove(1);

    expect(result).toEqual(holding);
    expect(mockRepository.remove).toHaveBeenCalledWith(holding);
  });
});
