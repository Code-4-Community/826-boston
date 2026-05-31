import { MigrationInterface, QueryRunner } from 'typeorm';

export class GeneralEntityCorrections1778973199676
  implements MigrationInterface
{
  name = 'GeneralEntityCorrections1778973199676';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP CONSTRAINT "FK_bc703cadb35d83218d22e93d68c"`,
    );
    await queryRunner.query(`ALTER TABLE "storydrafts" DROP COLUMN "authorId"`);
    await queryRunner.query(
      `ALTER TABLE "storydrafts" DROP COLUMN "anthologyId"`,
    );
    await queryRunner.query(`ALTER TABLE "storys" DROP COLUMN "anthologyId"`);
    await queryRunner.query(`ALTER TABLE "storys" DROP COLUMN "authorId"`);
    await queryRunner.query(
      `ALTER TABLE "inventoryholdings" DROP COLUMN "inventoryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventoryholdings" DROP COLUMN "anthologyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP CONSTRAINT "UQ_bc703cadb35d83218d22e93d68c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP COLUMN "anthology"`,
    );
    await queryRunner.query(`ALTER TABLE "omchais" DROP COLUMN "anthologyId"`);
    await queryRunner.query(`ALTER TABLE "omchais" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "storys" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "storys" ALTER COLUMN "studentBio" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "storys" ALTER COLUMN "theme" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "subtitle" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "programs" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "programs" SET DEFAULT '[]'`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "sponsors" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "sponsors" SET DEFAULT '[]'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "sponsors" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "sponsors" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "programs" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "programs" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "subtitle" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "storys" ALTER COLUMN "theme" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "storys" ALTER COLUMN "studentBio" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "storys" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "omchais" ADD "userId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "omchais" ADD "anthologyId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD "anthology" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD CONSTRAINT "UQ_bc703cadb35d83218d22e93d68c" UNIQUE ("anthology")`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventoryholdings" ADD "anthologyId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventoryholdings" ADD "inventoryId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "storys" ADD "authorId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "storys" ADD "anthologyId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "storydrafts" ADD "anthologyId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "storydrafts" ADD "authorId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD CONSTRAINT "FK_bc703cadb35d83218d22e93d68c" FOREIGN KEY ("anthology") REFERENCES "anthologys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
