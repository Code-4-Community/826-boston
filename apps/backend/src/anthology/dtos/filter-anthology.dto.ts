import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  ValidateNested,
  IsArray,
  IsInt,
  MaxLength,
  ArrayMaxSize,
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
  TITLE_DESC = 'title-desc',
  BYLINE_ASC = 'byline-asc',
  BYLINE_DESC = 'byline-desc',
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

  // case-insensitive match anywhere in the title
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  // publications where any of these users holds any OMCHAI role
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(200)
  @IsInt({ each: true })
  staffIds?: number[];
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
