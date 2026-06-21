import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeStoryDraftOptional1778977140715 implements MigrationInterface {
  name = 'MakeStoryDraftOptional1778977140715';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "storydrafts" DROP CONSTRAINT "FK_1bbe9a8148ad0e07b5c40b11153"`,
    );
    await queryRunner.query(
      `ALTER TABLE "storydrafts" DROP CONSTRAINT "UQ_1bbe9a8148ad0e07b5c40b11153"`,
    );
    await queryRunner.query(`ALTER TABLE "storydrafts" DROP COLUMN "story"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "storydrafts" ADD "story" integer`);
    await queryRunner.query(
      `ALTER TABLE "storydrafts" ADD CONSTRAINT "UQ_1bbe9a8148ad0e07b5c40b11153" UNIQUE ("story")`,
    );
    await queryRunner.query(
      `ALTER TABLE "storydrafts" ADD CONSTRAINT "FK_1bbe9a8148ad0e07b5c40b11153" FOREIGN KEY ("story") REFERENCES "storys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
