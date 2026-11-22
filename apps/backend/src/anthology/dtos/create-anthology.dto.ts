import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AnthologyPubLevel } from '../types';

export class CreateAnthologyDto {
  @ApiProperty({ description: 'Title of the anthology' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Projected publication date of the anthology',
  })
  @IsOptional()
  @IsDateString()
  publicationDate?: string;

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
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  programs?: string[];

  @ApiProperty({
    description: 'Owners of the anthology',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  owner_ids: number[];
}
