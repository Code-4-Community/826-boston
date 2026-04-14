import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1776029357853 implements MigrationInterface {
  name = 'InitSchema1776029357853';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "storydrafts" ADD "anthologyId" integer`,
    );
    await queryRunner.query(
      `UPDATE "storydrafts" SET "anthologyId" = 0 WHERE "anthologyId" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "storydrafts" ALTER COLUMN "anthologyId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "publishedDate" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "publishedDate" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "storydrafts" DROP COLUMN "anthologyId"`,
    );
  }
}
