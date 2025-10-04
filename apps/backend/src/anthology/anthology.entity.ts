import { Entity, Column, IntegerType } from 'typeorm';

import { AnthologyStatus, AnthologyPubLevel } from './types';

@Entity()
export class Anthology {
  @Column({ primary: true })
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  published_year: IntegerType;

  @Column({ nullable: true })
  programs?: string[] | string;

  @Column({ nullable: true })
  inventory?: IntegerType;

  @Column()
  status: AnthologyStatus;

  @Column()
  pub_level: AnthologyPubLevel;

  @Column({ nullable: true })
  photo_url: string;

  @Column({ nullable: true })
  genre: string;

  @Column({ nullable: true })
  theme: string;

  @Column({ nullable: true })
  isbn: string;

  @Column({ nullable: true })
  shopify_url: string;

  // TODO once Library is implemented
  // @Column()
  // library_id:
}
