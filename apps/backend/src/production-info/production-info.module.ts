import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionInfo } from './production-info.entity';
import { ProductionInfoController } from './production-info.controller';
import { ProductionInfoService } from './production-info.service';
import { Anthology } from '../anthology/anthology.entity';
import { OmchaiModule } from '../omchai/omchai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductionInfo, Anthology]),
    OmchaiModule,
  ],
  controllers: [ProductionInfoController],
  providers: [ProductionInfoService],
})
export class ProductionInfoModule {}
