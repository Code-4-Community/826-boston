import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryHoldingService } from './inventory-holding.service';
import { InventoryHoldingController } from './inventory-holding.controller';
import { InventoryHolding } from './inventory-holding.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryHolding])],
  controllers: [InventoryHoldingController],
  providers: [InventoryHoldingService],
  exports: [InventoryHoldingService],
})
export class InventoryHoldingModule {}
