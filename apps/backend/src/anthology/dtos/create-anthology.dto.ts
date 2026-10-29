import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AnthologyStatus, AnthologyPubLevel } from '../types';

export class CreateAnthologyDto {
  @ApiProperty({ description: 'Title of the anthology' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the anthology' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Status of the anthology',
    enum: AnthologyStatus,
    example: AnthologyStatus.DRAFT,
  })
  @IsEnum(AnthologyStatus)
  status: AnthologyStatus;

  @ApiProperty({ description: 'Projected publication date of the anthology' })
  @IsString()
  publicationDate: Date;

  @ApiProperty({
    description: 'Publication level of the anthology',
    enum: AnthologyPubLevel,
    example: AnthologyPubLevel.ZINE,
  })
  @IsEnum(AnthologyPubLevel)
  pub_level: AnthologyPubLevel;

  @ApiPropertyOptional({
    description: 'Programs associated with the anthology',
    type: [String],
  })
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

  @ApiProperty({ description: 'Genre of the anthology' })
  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @ApiProperty({ description: 'Theme of the anthology' })
  @IsArray()
  @IsString({ each: true })
  themes: string[];

  @ApiProperty({ description: 'ISBN of the anthology' })
  @IsString()
  isbn?: string;

  @ApiPropertyOptional({ description: 'Grade level of the anthology' })
  @IsOptional()
  @IsString()
  gradeLevel?: string;

  @ApiPropertyOptional({ description: 'Shopify URL for purchasing' })
  @IsOptional()
  @IsString()
  shopify_url?: string;
}
