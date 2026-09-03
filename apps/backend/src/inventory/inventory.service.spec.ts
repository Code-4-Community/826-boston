import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.entity';

describe('InventoryService', () => {
  let service: InventoryService;

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
        InventoryService,
        {
          provide: getRepositoryToken(Inventory),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new inventory', async () => {
    const dto = { name: 'Hardcover' };
    const created = { id: 1, name: 'Hardcover', holdings: [] };

    mockRepository.create.mockReturnValue(created);
    mockRepository.save.mockResolvedValue(created);

    const result = await service.create(dto as any);

    expect(result).toEqual(created);
    expect(mockRepository.create).toHaveBeenCalledWith({ name: 'Hardcover' });
    expect(mockRepository.save).toHaveBeenCalledWith(created);
  });

  it('should return all inventories', async () => {
    const inventories = [{ id: 1, name: 'Hardcover', holdings: [] }];
    mockRepository.find.mockResolvedValue(inventories);

    const result = await service.findAll();

    expect(result).toEqual(inventories);
    expect(mockRepository.find).toHaveBeenCalledWith({
      relations: ['holdings'],
    });
  });

  it('should return an inventory when found', async () => {
    const inventory = { id: 7, name: 'Paperback', holdings: [] };
    mockRepository.findOne.mockResolvedValue(inventory);

    const result = await service.findOne(7);

    expect(result).toEqual(inventory);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: 7 },
      relations: ['holdings'],
    });
  });

  it('should throw NotFoundException when inventory not found', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toThrow(
      new NotFoundException('Inventory not found'),
    );
  });

  it('should update an inventory', async () => {
    const existing = { id: 7, name: 'Old Name', holdings: [] };
    const updated = { ...existing, name: 'New Name' };

    mockRepository.findOne.mockResolvedValue(existing);
    mockRepository.save.mockResolvedValue(updated);

    const result = await service.update(7, { name: 'New Name' } as any);

    expect(result).toEqual(updated);
    expect(mockRepository.save).toHaveBeenCalledWith(updated);
  });

  it('should remove an inventory', async () => {
    const inventory = { id: 7, name: 'Paperback', holdings: [] };
    mockRepository.findOne.mockResolvedValue(inventory);
    mockRepository.remove.mockResolvedValue(inventory);

    const result = await service.remove(7);

    expect(result).toEqual(inventory);
    expect(mockRepository.remove).toHaveBeenCalledWith(inventory);
  });
});
