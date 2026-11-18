import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { AnthologyStatus } from '../types';

export class TrackerAnthologyDto {
  @ApiPropertyOptional({
    enum: AnthologyStatus,
    description: 'Only return publications with this status.',
  })
  @IsOptional()
  @IsEnum(AnthologyStatus)
  status?: AnthologyStatus;
}
