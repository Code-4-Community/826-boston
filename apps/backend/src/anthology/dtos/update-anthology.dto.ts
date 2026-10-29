import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, ValidateIf } from 'class-validator';
import { CreateAnthologyDto } from './create-anthology.dto';
import { AnthologyStatus } from '../types';

export class UpdateAnthologyDto extends PartialType(CreateAnthologyDto) {
  // Not on the create DTO: new anthologies always start as NOT_STARTED.
  @ApiPropertyOptional({
    description: 'Status of the anthology',
    enum: AnthologyStatus,
    example: AnthologyStatus.DRAFTING,
  })
  // Not @IsOptional(): that also skips validation for null, which would reach
  // the NOT NULL status column and fail as a 500 instead of a 400.
  @ValidateIf((_, value) => value !== undefined)
  @IsEnum(AnthologyStatus)
  status?: AnthologyStatus;
}
