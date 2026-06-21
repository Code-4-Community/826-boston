import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
  OneToOne,
} from 'typeorm';
import { Anthology } from '../anthology/anthology.entity';
import { Author } from '../author/author.entity';
import { StoryDraft } from 'src/story-draft/story-draft.entity';

@Entity()
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Anthology, (anthology) => anthology.stories)
  @JoinColumn({ name: 'anthology_id' })
  anthology: Relation<Anthology>;

  @ManyToOne(() => Author, (author) => author.stories)
  @JoinColumn({ name: 'author_id' })
  author: Relation<Author>;

  @OneToOne(() => StoryDraft, (storyDraft) => storyDraft.story)
  @JoinColumn({ name: 'story_draft_id' })
  storyDraft?: Relation<StoryDraft>;
}
