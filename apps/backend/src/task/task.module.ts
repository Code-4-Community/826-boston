import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskAttachment } from './task-attachment.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Anthology } from 'src/anthology/anthology.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskAttachment, Anthology])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
