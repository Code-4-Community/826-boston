import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { AnthologyPubLevel, AnthologyStatus } from '../types';

export class UpdateAnthologyDto {
  @ApiPropertyOptional({ description: 'Title of the anthology' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Description of the anthology' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Projected publication date of the anthology',
  })
  @IsOptional()
  @IsDateString()
  publicationDate?: string;

  @ApiPropertyOptional({
    description: 'Publication level of the anthology',
    enum: AnthologyPubLevel,
    example: AnthologyPubLevel.ZINE,
  })
  @IsOptional()
  @IsEnum(AnthologyPubLevel)
  pub_level?: AnthologyPubLevel;

  @ApiPropertyOptional({
    description: 'Programs associated with the anthology',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  programs?: string[];

  @ApiPropertyOptional({ description: 'Inventory count' })
  @IsOptional()
  @IsNumber()
  inventory?: number;

  @ApiPropertyOptional({ description: 'URL to anthology photo' })
  @IsOptional()
  @IsString()
  photo_url?: string;

  @ApiPropertyOptional({ description: 'Genre of the anthology' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];

  @ApiPropertyOptional({ description: 'Theme of the anthology' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  themes?: string[];

  @ApiPropertyOptional({ description: 'ISBN of the anthology' })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiPropertyOptional({ description: 'Shopify URL for purchasing' })
  @IsOptional()
  @IsString()
  shopify_url?: string;

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
