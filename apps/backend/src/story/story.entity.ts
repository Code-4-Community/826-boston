import { Entity, Column, IntegerType } from 'typeorm';

@Entity()
export class Story {
  @Column({ primary: true })
  id: number;

  @Column()
  title: string;

  @Column()
  description?: string;

  @Column()
  author: string;

  @Column()
  student_bio?: string;

  @Column()
  genre?: string;

  @Column()
  theme?: string;

  @Column()
  anthology_id?: number;

  /*
  @ManyToOne(() => Anthology)
  @JoinColumn({ name: 'anthology_id' })
  anthology?: Anthology;
  */
}
