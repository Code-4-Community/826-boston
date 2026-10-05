import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryHoldingService } from './inventory-holding.service';
import { InventoryHoldingController } from './inventory-holding.controller';
import { InventoryHolding } from './inventory-holding.entity';
import { Inventory } from '../inventory/inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryHolding, Inventory])],
  controllers: [InventoryHoldingController],
  providers: [InventoryHoldingService],
  exports: [InventoryHoldingService],
})
export class InventoryHoldingModule {}
