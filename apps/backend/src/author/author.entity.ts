import { Story } from 'src/story/story.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  classPeriod?: string;

  @Column({
    nullable: true,
  })
  nameInBook: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true, type: 'int' })
  grade: number;

  @OneToMany(() => Story, (story) => story.author)
  stories: Relation<Story>[];
}
