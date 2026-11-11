import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsDateString, ValidateIf } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

// Override these fields to prevent PartialType from allowing them to be null
export class UpdateTaskDto extends PartialType(CreateTaskDto) {
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
