import { MigrationInterface, QueryRunner } from 'typeorm';

// simple-array columns are comma-joined text, so the old `'[]'` default was read
// back as the single value "[]". An empty array is stored as an empty string.
export class FixAnthologyArrayDefaults1792400000000
  implements MigrationInterface
{
  name = 'FixAnthologyArrayDefaults1792400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const column of ['genres', 'themes', 'triggers']) {
      await queryRunner.query(
        `ALTER TABLE "anthologys" ALTER COLUMN "${column}" SET DEFAULT ''`,
      );
      await queryRunner.query(
        `UPDATE "anthologys" SET "${column}" = '' WHERE "${column}" = '[]'`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const column of ['genres', 'themes', 'triggers']) {
      await queryRunner.query(
        `ALTER TABLE "anthologys" ALTER COLUMN "${column}" SET DEFAULT '[]'`,
      );
    }
  }
}
