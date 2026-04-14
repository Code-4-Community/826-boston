import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';

import { AnthologyStatus, AnthologyPubLevel, AgeCategory } from './types';

import { Story } from '../story/story.entity';
import { InventoryHolding } from '../inventory-holding/inventory-holding.entity';
import { ProductionInfo } from '../production-info/production-info.entity';
import { Omchai } from 'src/omchai/omchai.entity';

@Entity()
export class Anthology {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: '' })
  byline: string;

  @Column({ nullable: true })
  subtitle: 'A College Essay Anthology';

  @Column()
  description: string;

  @Column({ type: 'simple-array', default: [] })
  genres: string[];

  @Column({ type: 'simple-array', default: [] })
  themes: string[];

  @Column({ type: 'simple-array', default: [] })
  triggers: string[];

  @Column({ type: 'date', nullable: true })
  publishedDate?: Date;

  @Column({ type: 'simple-array', nullable: true })
  programs?: string[];

  @Column({ type: 'simple-array', nullable: true })
  sponsors?: string[];

  @Column({ type: 'enum', enum: AnthologyStatus })
  status: AnthologyStatus;

  @Column({
    type: 'enum',
    enum: AgeCategory,
    name: 'age_category',
    nullable: true,
  })
  ageCategory: AgeCategory;

  @Column({
    name: 'pub_level',
    type: 'enum',
    enum: AnthologyPubLevel,
  })
  pubLevel: AnthologyPubLevel;

  @Column({
    name: 'photo_url',
    nullable: true,
    default: '',
  })
  photoUrl: string;

  @Column({ nullable: true })
  isbn: string;

  @Column({
    name: 'shopify_url',
    nullable: true,
    default: '',
  })
  shopifyUrl: string;

  @OneToMany(() => Story, (story) => story.anthology)
  stories: Relation<Story[]>;

  @OneToMany(() => InventoryHolding, (holding) => holding.anthology)
  inventoryHoldings: Relation<InventoryHolding[]>;

  @OneToOne(
    () => ProductionInfo,
    (productionInfo) => productionInfo.anthology_id,
  )
  productionInfo: ProductionInfo;

  @OneToMany(() => Omchai, (omchai) => omchai.anthology)
  omchaiAssignments: Relation<Omchai[]>;
}
