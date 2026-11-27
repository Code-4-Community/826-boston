import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductionInfoCamelCaseColumns1795815606009
  implements MigrationInterface
{
  name = 'ProductionInfoCamelCaseColumns1795815606009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "productioninfos" RENAME COLUMN "design_files_link" TO "designFilesLink"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" RENAME COLUMN "cover_image_file_link" TO "coverImageFileLink"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" RENAME COLUMN "binding_type" TO "bindingType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" RENAME COLUMN "printing_cost" TO "printingCost"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" RENAME COLUMN "print_run" TO "printRun"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" RENAME COLUMN "weight_in_grams" TO "weightInGrams"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" RENAME COLUMN "page_count" TO "pageCount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" RENAME COLUMN "printed_by" TO "printedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" RENAME COLUMN "foreword_author" TO "forewordAuthor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" RENAME COLUMN "number_of_students" TO "numberOfStudents"`,
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
      `ALTER TABLE "productioninfos" RENAME COLUMN "numberOfStudents" TO "number_of_students"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" RENAME COLUMN "forewordAuthor" TO "foreword_author"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" RENAME COLUMN "printedBy" TO "printed_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" RENAME COLUMN "pageCount" TO "page_count"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" RENAME COLUMN "weightInGrams" TO "weight_in_grams"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" RENAME COLUMN "printRun" TO "print_run"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" RENAME COLUMN "printingCost" TO "printing_cost"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" RENAME COLUMN "bindingType" TO "binding_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" RENAME COLUMN "coverImageFileLink" TO "cover_image_file_link"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" RENAME COLUMN "designFilesLink" TO "design_files_link"`,
    );
  }
}
