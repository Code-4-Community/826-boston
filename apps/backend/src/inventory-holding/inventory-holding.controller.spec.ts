import { Test, TestingModule } from '@nestjs/testing';
import { InventoryHoldingController } from './inventory-holding.controller';
import { InventoryHoldingService } from './inventory-holding.service';

describe('InventoryHoldingController', () => {
  let controller: InventoryHoldingController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryHoldingController],
      providers: [
        {
          provide: InventoryHoldingService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<InventoryHoldingController>(
      InventoryHoldingController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create when creating inventory holding', async () => {
    const dto = { inventory: { id: 1 }, anthology: { id: 2 }, numCopies: 5 };
    const result = { id: 1, ...dto };
    service.create.mockResolvedValue(result);

    await expect(controller.create(dto as any)).resolves.toEqual(result);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call service.findAll when fetching all inventory holdings', async () => {
    const result = [
      { id: 1, inventory: { id: 1 }, anthology: { id: 2 }, numCopies: 5 },
    ];
    service.findAll.mockResolvedValue(result);

    await expect(controller.findAll()).resolves.toEqual(result);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call service.findOne when fetching a single inventory holding', async () => {
    const result = {
      id: 7,
      inventory: { id: 1 },
      anthology: { id: 2 },
      numCopies: 8,
    };
    service.findOne.mockResolvedValue(result);

    await expect(controller.findOne(7)).resolves.toEqual(result);
    expect(service.findOne).toHaveBeenCalledWith(7);
  });

  it('should call service.update when updating inventory holding', async () => {
    const dto = { numCopies: 9 };
    const result = {
      id: 7,
      inventory: { id: 1 },
      anthology: { id: 2 },
      numCopies: 9,
    };
    service.update.mockResolvedValue(result);

    await expect(controller.update(7, dto as any)).resolves.toEqual(result);
    expect(service.update).toHaveBeenCalledWith(7, dto);
  });

  it('should call service.remove when deleting inventory holding', async () => {
    const result = {
      id: 4,
      inventory: { id: 1 },
      anthology: { id: 2 },
      numCopies: 2,
    };
    service.remove.mockResolvedValue(result);

    await expect(controller.remove(4)).resolves.toEqual(result);
    expect(service.remove).toHaveBeenCalledWith(4);
  });
});
