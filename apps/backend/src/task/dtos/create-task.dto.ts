import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AreaOfWork, TaskStatus } from '../types';

export class CreateTaskDto {
  @ApiProperty({ description: 'Task name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Task description' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({
    description: 'Area of work the task belongs to',
    enum: AreaOfWork,
  })
  @IsOptional()
  @IsEnum(AreaOfWork)
  areaOfWork?: AreaOfWork;

  @ApiPropertyOptional({
    description: 'Task status. Defaults to "not started".',
    enum: TaskStatus,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'User in charge of the task',
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  personInChargeId?: number;

  @ApiProperty({
    description:
      'Start of the week the task happens in. Displayed as "Week of MM/DD".',
  })
  @IsDateString()
  timeFrame: Date;

  @ApiProperty({ description: 'Task deadline' })
  @IsDateString()
  dueBy: Date;
}
