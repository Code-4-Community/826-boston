import { Anthology } from '../../anthology/anthology.entity';

/** A single inventory location and the number of copies it holds. */
export class AnthologyInventoryLocationDto {
  inventoryId: number;

  name: string;

  /** 0 when the location has no holding row for this anthology. */
  numCopies: number;
}

export class AnthologyInventoryDto {
  anthology: Anthology;

  /** Every inventory location, including those holding no copies. */
  locations: AnthologyInventoryLocationDto[];

  totalCopies: number;
}
