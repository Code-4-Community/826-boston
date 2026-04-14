import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EditRound, SubmissionRound } from './types';

@Entity()
export class StoryDraft {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  authorId: number;

  @Column({ type: 'int' })
  anthologyId: number;

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
}
