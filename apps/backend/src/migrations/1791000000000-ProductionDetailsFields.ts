import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds the fields the Production Details tab renders that had no column:
 * foreword author and number of students published (on productioninfos), and
 * age categories (on anthologys, stored like the other simple-array fields).
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
      `ALTER TABLE "anthologys" ADD "ageCategories" text NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "anthologys" DROP COLUMN "ageCategories"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "number_of_students"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "foreword_author"`,
    );
  }
}
