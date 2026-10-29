import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Replaces the anthology statuses with the publication pipeline from the spec
 * (Not Started → Drafting → Awaiting Review → Can Be Shared → Archived).
 * Existing rows map one-to-one, so `down` restores them exactly.
 */
export class AnthologyStatusPipeline1792977338110
  implements MigrationInterface
{
  name = 'AnthologyStatusPipeline1792977338110';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."anthologys_status_enum" RENAME TO "anthologys_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."anthologys_status_enum" AS ENUM('Not Started', 'Drafting', 'Awaiting Review', 'Can Be Shared', 'Archived')`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "status" TYPE "public"."anthologys_status_enum" USING (CASE "status"::text
        WHEN 'Draft' THEN 'Not Started'
        WHEN 'In Revision' THEN 'Drafting'
        WHEN 'In Production' THEN 'Awaiting Review'
        WHEN 'Published' THEN 'Can Be Shared'
        WHEN 'Archived' THEN 'Archived'
      END)::"public"."anthologys_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "status" SET DEFAULT 'Not Started'`,
    );
    await queryRunner.query(`DROP TYPE "public"."anthologys_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."anthologys_status_enum" RENAME TO "anthologys_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."anthologys_status_enum" AS ENUM('Draft', 'In Revision', 'In Production', 'Published', 'Archived')`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "status" TYPE "public"."anthologys_status_enum" USING (CASE "status"::text
        WHEN 'Not Started' THEN 'Draft'
        WHEN 'Drafting' THEN 'In Revision'
        WHEN 'Awaiting Review' THEN 'In Production'
        WHEN 'Can Be Shared' THEN 'Published'
        WHEN 'Archived' THEN 'Archived'
      END)::"public"."anthologys_status_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."anthologys_status_enum_old"`);
  }
}
