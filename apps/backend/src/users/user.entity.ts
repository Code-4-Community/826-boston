import {
  Entity,
  Column,
  OneToMany,
  Relation,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './types';
import { Omchai } from 'src/omchai/omchai.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Role, default: Role.STANDARD })
  role: Role;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name', default: '' })
  lastName: string;

  @Column({ default: '' })
  email: string;

  @Column({ nullable: true })
  title?: string;

  @OneToMany(() => Omchai, (omchai) => omchai.user)
  omchaiAssignments: Relation<Omchai[]>;
}
