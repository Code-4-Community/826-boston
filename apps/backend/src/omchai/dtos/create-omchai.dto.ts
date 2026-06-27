import { IsNumber, IsEnum, IsDateString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OmchaiRole } from '../omchai.entity';
import { Anthology } from 'src/anthology/anthology.entity';
import { User } from 'src/users/user.entity';

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

  @ApiProperty({ description: 'Date that the user was assigned' })
  @IsDateString()
  datetimeAssigned: Date;
}
