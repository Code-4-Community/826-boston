import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OmchaiService } from './omchai.service';
import { OmchaiController } from './omchai.controller';
import { Omchai } from './omchai.entity';
import { Story } from '../story/story.entity';
import { Anthology } from '../anthology/anthology.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Omchai, Story, Anthology])],
  controllers: [OmchaiController],
  providers: [OmchaiService],
  exports: [OmchaiService],
})
export class OmchaiModule {}
