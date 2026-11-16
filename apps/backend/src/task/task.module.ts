import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskAttachment } from './task-attachment.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Anthology } from 'src/anthology/anthology.entity';
import { User } from 'src/users/user.entity';
import { AwsS3Module } from 'src/aws/aws-s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TaskAttachment, Anthology, User]),
    AwsS3Module,
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
