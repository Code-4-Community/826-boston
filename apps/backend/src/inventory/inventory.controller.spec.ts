import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

describe('InventoryController', () => {
  let controller: InventoryController;
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
      controllers: [InventoryController],
      providers: [
        {
          provide: InventoryService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create when creating inventory', async () => {
    const dto = { name: 'Hardcover' };
    const result = { id: 1, name: 'Hardcover', holdings: [] };
    service.create.mockResolvedValue(result);

    await expect(controller.create(dto as any)).resolves.toEqual(result);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call service.findAll when fetching all inventories', async () => {
    const result = [{ id: 1, name: 'Hardcover', holdings: [] }];
    service.findAll.mockResolvedValue(result);

    await expect(controller.findAll()).resolves.toEqual(result);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call service.findOne when fetching a single inventory', async () => {
    const result = { id: 2, name: 'Paperback', holdings: [] };
    service.findOne.mockResolvedValue(result);

    await expect(controller.findOne(2)).resolves.toEqual(result);
    expect(service.findOne).toHaveBeenCalledWith(2);
  });

  it('should call service.update when updating inventory', async () => {
    const dto = { name: 'Updated Hardcover' };
    const result = { id: 2, name: 'Updated Hardcover', holdings: [] };
    service.update.mockResolvedValue(result);

    await expect(controller.update(2, dto as any)).resolves.toEqual(result);
    expect(service.update).toHaveBeenCalledWith(2, dto);
  });

  it('should call service.remove when deleting inventory', async () => {
    const result = { id: 3, name: 'Deleted Inventory', holdings: [] };
    service.remove.mockResolvedValue(result);

    await expect(controller.remove(3)).resolves.toEqual(result);
    expect(service.remove).toHaveBeenCalledWith(3);
  });
});
