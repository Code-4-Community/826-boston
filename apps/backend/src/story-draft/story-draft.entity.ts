import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { EditRound, SubmissionRound } from './types';
import { Story } from 'src/story/story.entity';

@Entity()
export class StoryDraft {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  docLink: string;

  @Column({
    type: 'enum',
    enum: SubmissionRound,
  })
  submissionRound: SubmissionRound;

  @Column()
  studentConsent: boolean;

  @Column()
  inManuscript: boolean;

  @Column({
    type: 'enum',
    enum: EditRound,
  })
  editRound: EditRound;

  @Column()
  proofread: boolean;

  @Column('text', { array: true })
  notes: string[];

  @OneToOne(() => Story, (story) => story.storyDraft)
  story: Relation<Story>;
}
