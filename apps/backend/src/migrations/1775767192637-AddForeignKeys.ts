import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddForeignKeys1775767192637 implements MigrationInterface {
  name = 'AddForeignKeys1775767192637';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "anthologys" RENAME COLUMN "ageCategory" TO "productionInfo"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."anthologys_agecategory_enum" RENAME TO "anthologys_productioninfo_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "storydrafts" ADD "classPeriod" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "storydrafts" ADD "story" integer`);
    await queryRunner.query(
      `ALTER TABLE "storydrafts" ADD CONSTRAINT "UQ_1bbe9a8148ad0e07b5c40b11153" UNIQUE ("story")`,
    );
    await queryRunner.query(`ALTER TABLE "storys" ADD "storyDraft" integer`);
    await queryRunner.query(
      `ALTER TABLE "storys" ADD CONSTRAINT "UQ_1977c33203925bdc1313a5054a2" UNIQUE ("storyDraft")`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "anthology" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD CONSTRAINT "UQ_bc703cadb35d83218d22e93d68c" UNIQUE ("anthology")`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" DROP COLUMN "productionInfo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ADD "productionInfo" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ADD CONSTRAINT "UQ_98b3bd9e28c19c59c8a91ee6115" UNIQUE ("productionInfo")`,
    );
    await queryRunner.query(
      `ALTER TABLE "storydrafts" ADD CONSTRAINT "FK_1bbe9a8148ad0e07b5c40b11153" FOREIGN KEY ("story") REFERENCES "storys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "storys" ADD CONSTRAINT "FK_1977c33203925bdc1313a5054a2" FOREIGN KEY ("storyDraft") REFERENCES "storydrafts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD CONSTRAINT "FK_bc703cadb35d83218d22e93d68c" FOREIGN KEY ("anthology") REFERENCES "anthologys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ADD CONSTRAINT "FK_98b3bd9e28c19c59c8a91ee6115" FOREIGN KEY ("productionInfo") REFERENCES "productioninfos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "anthologys" DROP CONSTRAINT "FK_98b3bd9e28c19c59c8a91ee6115"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP CONSTRAINT "FK_bc703cadb35d83218d22e93d68c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "storys" DROP CONSTRAINT "FK_1977c33203925bdc1313a5054a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "storydrafts" DROP CONSTRAINT "FK_1bbe9a8148ad0e07b5c40b11153"`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" DROP CONSTRAINT "UQ_98b3bd9e28c19c59c8a91ee6115"`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" DROP COLUMN "productionInfo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ADD "productionInfo" "public"."anthologys_productioninfo_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP CONSTRAINT "UQ_bc703cadb35d83218d22e93d68c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "anthology"`,
    );
    await queryRunner.query(
      `ALTER TABLE "storys" DROP CONSTRAINT "UQ_1977c33203925bdc1313a5054a2"`,
    );
    await queryRunner.query(`ALTER TABLE "storys" DROP COLUMN "storyDraft"`);
    await queryRunner.query(
      `ALTER TABLE "storydrafts" DROP CONSTRAINT "UQ_1bbe9a8148ad0e07b5c40b11153"`,
    );
    await queryRunner.query(`ALTER TABLE "storydrafts" DROP COLUMN "story"`);
    await queryRunner.query(
      `ALTER TABLE "storydrafts" DROP COLUMN "classPeriod"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."anthologys_productioninfo_enum" RENAME TO "anthologys_agecategory_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" RENAME COLUMN "productionInfo" TO "ageCategory"`,
    );
  }
}
