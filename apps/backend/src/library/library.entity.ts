import { Entity, Column } from 'typeorm';
import { Anthology } from '../anthology/anthology.entity';

@Entity()
export class Library {
  @Column({ primary: true })
  id: number;

  @Column()
  anthologies: Anthology[];
}
