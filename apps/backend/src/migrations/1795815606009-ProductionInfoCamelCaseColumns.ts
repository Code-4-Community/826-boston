import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductionInfoCamelCaseColumns1795815606009
  implements MigrationInterface
{
  name = 'ProductionInfoCamelCaseColumns1795815606009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "design_files_link"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "cover_image_file_link"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "binding_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "printing_cost"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "print_run"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "weight_in_grams"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "page_count"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "printed_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "foreword_author"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "number_of_students"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "designFilesLink" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "coverImageFileLink" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "bindingType" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "printingCost" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "printRun" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "weightInGrams" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "pageCount" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "printedBy" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "forewordAuthor" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "numberOfStudents" integer`,
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
      `ALTER TABLE "productioninfos" DROP COLUMN "numberOfStudents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "forewordAuthor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "printedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "pageCount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "weightInGrams"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "printRun"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "printingCost"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "bindingType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "coverImageFileLink"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "designFilesLink"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "number_of_students" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "foreword_author" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "printed_by" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "page_count" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "weight_in_grams" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "print_run" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "printing_cost" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "binding_type" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "cover_image_file_link" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "design_files_link" character varying`,
    );
  }
}
