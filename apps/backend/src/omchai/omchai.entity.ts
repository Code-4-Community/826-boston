import { Anthology } from 'src/anthology/anthology.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

export enum OmchaiRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  CONSULTED = 'CONSULTED',
  HELPER = 'HELPER',
  APPROVER = 'APPROVER',
  INFORMED = 'INFORMED',
}

@Entity()
export class Omchai {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OmchaiRole,
  })
  role: OmchaiRole;

  @Column({
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  datetimeAssigned: Date;

  @ManyToOne(() => User, (user) => user.omchaiAssignments)
  @JoinColumn()
  user: Relation<User>;

  @ManyToOne(() => Anthology, (anthology) => anthology.omchaiAssignments)
  @JoinColumn()
  anthology: Relation<Anthology>;
}
