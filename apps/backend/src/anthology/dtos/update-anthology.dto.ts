import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateAnthologyDto } from './create-anthology.dto';
import { AnthologyStatus } from '../types';

export class UpdateAnthologyDto extends PartialType(CreateAnthologyDto) {
  // Not on the create DTO: new anthologies always start as NOT_STARTED.
  @ApiPropertyOptional({
    description: 'Status of the anthology',
    enum: AnthologyStatus,
    example: AnthologyStatus.DRAFTING,
  })
  @IsOptional()
  @IsEnum(AnthologyStatus)
  status?: AnthologyStatus;
}
