import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationName1776482988130 implements MigrationInterface {
  name = 'MigrationName1776482988130';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "authors" ALTER COLUMN "classPeriod" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "authors" ALTER COLUMN "classPeriod" SET NOT NULL`,
    );
  }
}
