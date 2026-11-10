import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  ValidateNested,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IntersectionType } from '@nestjs/swagger';
import { AnthologyPubLevel } from '../types';

export class DateRangeDto {
  @IsDateString()
  start: string;

  @IsDateString()
  end: string;
}

export enum AnthologySortOption {
  TITLE_ASC = 'title-asc',
  DATE_RECENT = 'date-recent',
  DATE_OLDEST = 'date-oldest',
}

// empty list means no filters
export class FilterAnthologyDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  pubDateRange?: DateRangeDto;

  @IsOptional()
  @IsArray()
  @IsEnum(AnthologyPubLevel, { each: true })
  pubLevels?: AnthologyPubLevel[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  programs?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];

  // Set by the Library page so logged-in staff see exactly what the public sees
  @IsOptional()
  @IsBoolean()
  library?: boolean;
}

export class SortAnthologyDto {
  @IsOptional()
  @IsEnum(AnthologySortOption)
  sortBy?: AnthologySortOption;
}

export class FilterSortAnthologyDto extends IntersectionType(
  FilterAnthologyDto,
  SortAnthologyDto,
) {}
