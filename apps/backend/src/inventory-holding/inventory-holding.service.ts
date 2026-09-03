import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryHolding } from './inventory-holding.entity';
import { CreateInventoryHoldingDto } from './dto/create-inventory-holding.dto';
import { UpdateInventoryHoldingDto } from './dto/update-inventory-holding.dto';

@Injectable()
export class InventoryHoldingService {
  constructor(
    @InjectRepository(InventoryHolding)
    private readonly repo: Repository<InventoryHolding>,
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
