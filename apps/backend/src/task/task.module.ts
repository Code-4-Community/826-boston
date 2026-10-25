import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskAttachment } from './task-attachment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskAttachment])],
})
export class TaskModule {}
