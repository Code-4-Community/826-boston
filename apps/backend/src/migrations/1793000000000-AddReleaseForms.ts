import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReleaseForms1793000000000 implements MigrationInterface {
  name = 'AddReleaseForms1793000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "anthologys" ADD "releaseFormsOnFile" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ADD "releaseFormsUrl" character varying`,
    );
    await queryRunner.query(
      `UPDATE "anthologys" SET "releaseFormsOnFile" = true
             WHERE "status" IN ('Can Be Shared', 'Archived')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "anthologys" DROP COLUMN "releaseFormsUrl"`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" DROP COLUMN "releaseFormsOnFile"`,
    );
  }
}
