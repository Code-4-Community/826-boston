import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryDto {
  @ApiProperty({ description: 'name of the inventory' })
  name: string;

  @ApiProperty({ description: 'inventory holdings available in the inventory' })
  holdings: number;
}
