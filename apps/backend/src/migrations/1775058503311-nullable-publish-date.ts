import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullablePublishDate1775058503311 implements MigrationInterface {
  name = 'NullablePublishDate1775058503311';

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
