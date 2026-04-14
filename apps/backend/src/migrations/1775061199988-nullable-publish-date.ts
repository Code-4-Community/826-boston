import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullablePublishDate1775061199988 implements MigrationInterface {
  name = 'NullablePublishDate1775061199988';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "publishedDate" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "publishedDate" SET NOT NULL`,
    );
  }
}
