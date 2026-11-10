import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
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

  @ApiPropertyOptional({ description: 'Whether release forms are on file' })
  // Same reasoning as status: null would hit the NOT NULL column
  @ValidateIf((_, value) => value !== undefined)
  @IsBoolean()
  releaseFormsOnFile?: boolean;

  @ApiPropertyOptional({
    description: 'Optional link to the release forms (null clears it)',
  })
  @IsOptional()
  @IsString()
  releaseFormsUrl?: string | null;
}
