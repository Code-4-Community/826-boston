import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { Anthology } from '../anthology/anthology.entity';

@Entity()
export class ProductionInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  designFilesLink?: string;

  @Column({ nullable: true })
  coverImageFileLink?: string;

  @Column({ nullable: true })
  bindingType?: string;

  @Column({ nullable: true })
  dimensions?: string;

  @Column('float', { nullable: true })
  printingCost?: number;

  @Column('int', { nullable: true })
  printRun?: number;

  @Column('float', { nullable: true })
  weightInGrams?: number;

  @Column('int', { nullable: true })
  pageCount?: number;

  @Column({ nullable: true })
  printedBy?: string;

  @Column({ nullable: true })
  forewordAuthor?: string;

  @Column('int', { nullable: true })
  numberOfStudents?: number;

  @OneToOne(() => Anthology, (anthology) => anthology.productionInfo)
  anthology: Relation<Anthology>;
}
