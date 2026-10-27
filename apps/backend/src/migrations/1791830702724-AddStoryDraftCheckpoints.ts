import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStoryDraftCheckpoints1791830702724
  implements MigrationInterface
{
  name = 'AddStoryDraftCheckpoints1791830702724';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "storydrafts" ADD "checkpoints" jsonb NOT NULL DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "storydrafts" DROP COLUMN "checkpoints"`,
    );
  }
}
