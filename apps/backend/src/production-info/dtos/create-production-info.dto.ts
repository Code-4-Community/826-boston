import { IsString, IsNumber, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductionInfoDto {
  @ApiProperty({ description: 'Anthology ID' })
  @IsInt()
  anthologyId: number;

  @ApiPropertyOptional({ description: 'Link to design files' })
  @IsOptional()
  @IsString()
  designFilesLink?: string;

  @ApiPropertyOptional({ description: 'Link to cover image file' })
  @IsOptional()
  @IsString()
  coverImageFileLink?: string;

  @ApiPropertyOptional({ description: 'Binding type' })
  @IsOptional()
  @IsString()
  bindingType?: string;

  @ApiPropertyOptional({ description: 'Dimensions' })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiPropertyOptional({ description: 'Printing cost' })
  @IsOptional()
  @IsNumber()
  printingCost?: number;

  @ApiPropertyOptional({ description: 'Print run count' })
  @IsOptional()
  @IsInt()
  printRun?: number;

  @ApiPropertyOptional({ description: 'Weight in grams' })
  @IsOptional()
  @IsNumber()
  weightInGrams?: number;

  @ApiPropertyOptional({ description: 'Page count' })
  @IsOptional()
  @IsInt()
  pageCount?: number;

  @ApiPropertyOptional({ description: 'Printed by' })
  @IsOptional()
  @IsString()
  printedBy?: string;
}
