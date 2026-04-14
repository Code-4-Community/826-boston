import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({ description: 'Name of author' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Name as it appears in the book' })
  @IsString()
  @IsOptional()
  nameInBook?: string;

  @ApiPropertyOptional({ description: 'Class period of the author' })
  @IsString()
  @IsOptional()
  classPeriod?: string;

  @ApiPropertyOptional({ description: 'Bio of author' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ description: 'Grade of author' })
  @IsNumber()
  @IsOptional()
  grade?: number;
}
