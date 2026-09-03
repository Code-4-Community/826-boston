import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory) private readonly repo: Repository<Inventory>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    const inventory = this.repo.create({
      name: createInventoryDto.name,
    });

    return this.repo.save(inventory);
  }

  async findAll(): Promise<Inventory[]> {
    return this.repo.find({ relations: ['holdings'] });
  }

  async findOne(id: number): Promise<Inventory> {
    const inventory = await this.repo.findOne({
      where: { id },
      relations: ['holdings'],
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    return inventory;
  }

  async update(
    id: number,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<Inventory> {
    const inventory = await this.findOne(id);

    Object.assign(inventory, updateInventoryDto);

    return this.repo.save(inventory);
  }

  async remove(id: number): Promise<Inventory> {
    const inventory = await this.findOne(id);

    return this.repo.remove(inventory);
  }
}
