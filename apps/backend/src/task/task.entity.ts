import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { AreaOfWork, TaskStatus } from './types';
import { User } from 'src/users/user.entity';
import { Anthology } from 'src/anthology/anthology.entity';
import { TaskAttachment } from './task-attachment.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @Column({ type: 'enum', enum: AreaOfWork, nullable: true })
  areaOfWork?: AreaOfWork;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.NOT_STARTED,
  })
  status: TaskStatus;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'person_in_charge_id' })
  personInCharge?: Relation<User> | null;

  @Column({ type: 'date', nullable: true })
  timeFrame?: Date;

  @Column({ type: 'date', nullable: true })
  dueBy?: Date;

  @ManyToOne(() => Anthology, (anthology) => anthology.tasks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'anthology_id' })
  anthology: Relation<Anthology>;

  @OneToMany(() => TaskAttachment, (attachment) => attachment.task)
  attachments: Relation<TaskAttachment[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
