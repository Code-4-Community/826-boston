import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  Relation,
  JoinColumn,
} from 'typeorm';

import { AnthologyStatus, AnthologyPubLevel, AgeCategory } from './types';

import { Story } from '../story/story.entity';
import { InventoryHolding } from '../inventory-holding/inventory-holding.entity';
import { ProductionInfo } from '../production-info/production-info.entity';
import { Omchai } from 'src/omchai/omchai.entity';
import { Task } from 'src/task/task.entity';

@Entity()
export class Anthology {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: '' })
  byline: string;

  @Column({ nullable: true, default: '' })
  subtitle?: string;

  @Column({ default: '' })
  description: string;

  @Column({ type: 'text', array: true, default: [] })
  genres: string[];

  @Column({ type: 'simple-array', default: '' })
  themes: string[];

  @Column({ type: 'simple-array', default: '' })
  triggers: string[];

  // NOTE: PluralNamingStrategy ignores @Column `name`, so the physical column
  // is "ageCategories". Don't add a `name:` here — it would be silently dropped.
  @Column({
    type: 'enum',
    enum: AgeCategory,
    enumName: 'anthologys_agecategories_enum',
    array: true,
    default: [],
  })
  ageCategories: AgeCategory[];

  @Column({ type: 'date', nullable: true })
  publishedDate?: Date;

  @Column({ type: 'text', array: true, default: [] })
  programs: string[];

  @Column({ type: 'simple-array', default: [] })
  sponsors: string[];

  @Column({
    type: 'enum',
    enum: AnthologyStatus,
    default: AnthologyStatus.NOT_STARTED,
  })
  status: AnthologyStatus;

  @Column({
    type: 'enum',
    enum: AnthologyPubLevel,
  })
  pubLevel: AnthologyPubLevel;

  @Column({
    nullable: true,
    default: '',
  })
  photoUrl?: string;

  @Column({ nullable: true })
  isbn?: string;

  @Column({ nullable: true })
  gradeLevel?: string;

  @Column({
    nullable: true,
    default: '',
  })
  shopifyUrl?: string;

  @OneToMany(() => Story, (story) => story.anthology)
  stories: Relation<Story[]>;

  @OneToMany(() => InventoryHolding, (holding) => holding.anthology)
  inventoryHoldings: Relation<InventoryHolding[]>;

  @OneToOne(() => ProductionInfo, (productionInfo) => productionInfo.anthology)
  @JoinColumn()
  productionInfo: Relation<ProductionInfo>;

  @OneToMany(() => Omchai, (omchai) => omchai.anthology)
  omchaiAssignments: Relation<Omchai[]>;

  @OneToMany(() => Task, (task) => task.anthology)
  tasks: Relation<Task[]>;
}
