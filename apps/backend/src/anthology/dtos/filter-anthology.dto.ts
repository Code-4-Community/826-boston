import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  ValidateNested,
  IsArray,
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
  AUTHOR_ASC = 'author-asc',
  AUTHOR_DESC = 'author-desc',
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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  themes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  inventoryLocations?: string[];
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
