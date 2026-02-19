import {
  Entity,
  Column,
  IntegerType,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import { AnthologyStatus, AnthologyPubLevel } from './types';

import { Story } from '../story/story.entity';
import { InventoryHolding } from '../inventory-holding/inventory-holding.entity';
import { ProductionInfo } from '../production-info/production-info.entity';

@Entity()
export class Anthology {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'int' })
  published_year: number;

  @Column('text', { nullable: true })
  programs?: string[];

  @Column({
    type: 'enum',
    enum: AnthologyStatus,
  })
  status: AnthologyStatus;

  @Column({
    type: 'enum',
    enum: AnthologyPubLevel,
  })
  pub_level: AnthologyPubLevel;

  @Column({ nullable: true })
  photo_url: string;

  @Column({ nullable: true })
  isbn: string;

  @Column({ nullable: true })
  shopify_url: string;

  @OneToMany(() => Story, (story) => story.anthologyId)
  stories: Story[];

  @OneToMany(() => InventoryHolding, (ih) => ih.anthology_id)
  holdings: InventoryHolding[];

  @OneToOne(() => ProductionInfo, (productionInfo) => productionInfo.anthology)
  productionInfo: ProductionInfo;
}
