import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsInt, IsNumber, IsObject, IsString } from 'class-validator';
import { User } from '../../users/user.entity'; // Update the path based on your project structure


export class CreateOmchaiAssignmentsDto {
  @ApiProperty({ description: 'ID of the anthology' })
  @IsNumber()
  anthologyId: number;

  @ApiProperty({ description: 'Date that the user was assigned' })
  @IsDateString()
  datetimeAssigned: Date;

  @ApiProperty({ description: 'Ids of owners of the anthology' })
  @IsArray()
  owners: number[];

  @ApiProperty({ description: 'Ids of managers of the anthology' })
  @IsArray()
  managers: number[];

  @ApiProperty({ description: 'Ids of consulted users for the anthology' })
  @IsArray()
  @IsInt({ each: true })
  consulted: number[];

  @ApiProperty({ description: 'Ids of helper users for the anthology' })
  @IsArray()
  @IsInt({ each: true })
  helpers: number[];

  @ApiProperty({ description: 'Ids of approver users for the anthology' })
  @IsArray()
  @IsInt({ each: true })
  approvers: number[];

  @ApiProperty({ description: 'Ids of informed users for the anthology' })
  @IsArray()
  @IsInt({ each: true })
  informers: number[];
}
