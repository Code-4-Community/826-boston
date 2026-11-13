import { IsNumber, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OmchaiRole } from '../omchai.entity';

export class CreateOmchaiDto {
  @ApiProperty({ description: 'ID of the anthology' })
  @IsNumber()
  anthologyId: number;

  @ApiProperty({ description: 'ID of the user' })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'Role of the user in the project',
    enum: OmchaiRole,
  })
  @IsEnum(OmchaiRole)
  role: OmchaiRole;

  @ApiPropertyOptional({ description: 'Date that the user was assigned' })
  @IsOptional()
  @IsDateString()
  datetimeAssigned?: Date;
}
