import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Anthology } from '../anthology/anthology.entity';
import { Inventory } from '../inventory/inventory.entity';

@Entity()
export class InventoryHolding {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inventory, (inventory) => inventory.holdings)
  @JoinColumn()
  inventory: Relation<Inventory>;

  @ManyToOne(() => Anthology, (anthology) => anthology.inventoryHoldings)
  @JoinColumn()
  anthology: Relation<Anthology>;

  @Column()
  numCopies: number;
}
