import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryHolding } from './inventory-holding.entity';
import { Inventory } from '../inventory/inventory.entity';
import { CreateInventoryHoldingDto } from './dto/create-inventory-holding.dto';
import { UpdateInventoryHoldingDto } from './dto/update-inventory-holding.dto';
import { AnthologyInventoryLocationDto } from './dto/anthology-inventory.dto';

@Injectable()
export class InventoryHoldingService {
  constructor(
    @InjectRepository(InventoryHolding)
    private readonly repo: Repository<InventoryHolding>,
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  async create(
    createInventoryHoldingDto: CreateInventoryHoldingDto,
  ): Promise<InventoryHolding> {
    const inventoryHolding = this.repo.create(createInventoryHoldingDto);
    return this.repo.save(inventoryHolding);
  }

  async findAll(): Promise<InventoryHolding[]> {
    return this.repo.find({ relations: ['inventory', 'anthology'] });
  }

  /**
   * Lists every inventory location alongside the copies it holds of the given
   * anthology. Locations without a holding row are still returned, with
   * `numCopies: 0`, so callers can render a complete location list.
   */
  async findLocationsByAnthology(
    anthologyId: number,
  ): Promise<AnthologyInventoryLocationDto[]> {
    const [inventories, holdings] = await Promise.all([
      this.inventoryRepo.find({ order: { name: 'ASC' } }),
      this.repo.find({
        where: { anthology: { id: anthologyId } },
        relations: ['inventory'],
      }),
    ]);

    const copiesByInventoryId = new Map(
      holdings.map((holding) => [holding.inventory.id, holding.numCopies]),
    );

    return inventories.map((inventory) => ({
      inventoryId: inventory.id,
      name: inventory.name,
      numCopies: copiesByInventoryId.get(inventory.id) ?? 0,
    }));
  }

  async findOne(id: number): Promise<InventoryHolding> {
    const inventoryHolding = await this.repo.findOne({
      where: { id },
      relations: ['inventory', 'anthology'],
    });

    if (!inventoryHolding) {
      throw new NotFoundException('InventoryHolding not found');
    }

    return inventoryHolding;
  }

  async update(
    id: number,
    updateInventoryHoldingDto: UpdateInventoryHoldingDto,
  ): Promise<InventoryHolding> {
    const inventoryHolding = await this.findOne(id);

    Object.assign(inventoryHolding, updateInventoryHoldingDto);

    return this.repo.save(inventoryHolding);
  }

  async remove(id: number): Promise<InventoryHolding> {
    const inventoryHolding = await this.findOne(id);

    return this.repo.remove(inventoryHolding);
  }
}
