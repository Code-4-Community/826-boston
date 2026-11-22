import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeTaskDatesNonNullable1794423861954
  implements MigrationInterface
{
  name = 'MakeTaskDatesNonNullable1794423861954';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tasks" ALTER COLUMN "timeFrame" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ALTER COLUMN "dueBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."anthologys_agecategories_enum" RENAME TO "anthologys_agecategories_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."anthologys_agecategories_enum" AS ENUM('Early Reader Books (Ages 5–8)', 'Chapter Books (Ages 6–10)', 'Middle Grade Books (Ages 8–13)', 'Young Adult Books (Ages 13–18)', 'Adult (Ages 18+)')`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "ageCategories" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "ageCategories" TYPE "public"."anthologys_agecategories_enum"[] USING "ageCategories"::"text"::"public"."anthologys_agecategories_enum"[]`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "ageCategories" SET DEFAULT '{}'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."anthologys_agecategories_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."anthologys_agecategories_enum_old" AS ENUM('Early Reader Books (Ages 5–8)', 'Chapter Books (Ages 6–10)', 'Middle Grade Books (Ages 8–13)', 'Young Adult Books (Ages 13–18)', 'Adult (Ages 18+)')`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "ageCategories" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "ageCategories" TYPE "public"."anthologys_agecategories_enum_old"[] USING "ageCategories"::"text"::"public"."anthologys_agecategories_enum_old"[]`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "ageCategories" SET DEFAULT '{}'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."anthologys_agecategories_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."anthologys_agecategories_enum_old" RENAME TO "anthologys_agecategories_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ALTER COLUMN "dueBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ALTER COLUMN "timeFrame" DROP NOT NULL`,
    );
  }
}
