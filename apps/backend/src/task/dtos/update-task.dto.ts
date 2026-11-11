import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsString, ValidateIf } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from '../types';

// Override these fields to prevent PartialType from allowing them to be null
export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({ description: 'Task name' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Task status', enum: TaskStatus })
  @ValidateIf((_, value) => value !== undefined)
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    description:
      'Start of the week the task happens in. Displayed as "Week of MM/DD".',
  })
  @ValidateIf((_, value) => value !== undefined)
  @IsDateString()
  timeFrame?: Date;

  @ApiPropertyOptional({ description: 'Task deadline' })
  @ValidateIf((_, value) => value !== undefined)
  @IsDateString()
  dueBy?: Date;
}
