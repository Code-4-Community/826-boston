import { Entity, Column } from 'typeorm';

import { Status } from './types';

@Entity()
export class User {
  @Column({ primary: true })
  id: number;

  @Column({
    type: "enum",
    enum: Status,
  }
  )
  status: Status;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  publishingName?: string;

  @Column({ nullable: true })
  name?: string;
}
