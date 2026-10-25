import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds the fields the Production Details tab renders that had no column:
 * foreword author and number of students published (on productioninfos), and
 * age categories (on anthologys, as an array of the AgeCategory enum).
 */
export class ProductionDetailsFields1791000000000
  implements MigrationInterface
{
  name = 'ProductionDetailsFields1791000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "foreword_author" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "number_of_students" integer`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."anthologys_agecategories_enum" AS ENUM('Early Reader Books (Ages 5–8)', 'Chapter Books (Ages 6–10)', 'Middle Grade Books (Ages 8–13)', 'Young Adult Books (Ages 13–18)', 'Adult (Ages 18+)')`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ADD "ageCategories" "public"."anthologys_agecategories_enum" array NOT NULL DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "anthologys" DROP COLUMN "ageCategories"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."anthologys_agecategories_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "number_of_students"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "foreword_author"`,
    );
  }
}
