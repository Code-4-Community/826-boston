import { MigrationInterface, QueryRunner } from 'typeorm';

const COLUMNS = ['genres', 'programs'];

/**
 * Converts anthologys.genres and anthologys.programs from simple-array
 * (comma-separated text) to text[], so array operators like && work in Postgres.
 * The old default '[]' can't be cast automatically, so it's dropped first.
 * Note: `down` re-joins with commas, so an element containing a comma won't round-trip.
 */
export class AnthologyGenresProgramsArrays1793153027000
  implements MigrationInterface
{
  name = 'AnthologyGenresProgramsArrays1793153027000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const column of COLUMNS) {
      await queryRunner.query(
        `ALTER TABLE "anthologys" ALTER COLUMN "${column}" DROP DEFAULT`,
      );
      await queryRunner.query(
        `ALTER TABLE "anthologys" ALTER COLUMN "${column}" TYPE text[] USING COALESCE(array_remove(string_to_array(NULLIF("${column}", '[]'), ','), ''), '{}')`,
      );
      await queryRunner.query(
        `ALTER TABLE "anthologys" ALTER COLUMN "${column}" SET DEFAULT '{}'`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const column of COLUMNS) {
      await queryRunner.query(
        `ALTER TABLE "anthologys" ALTER COLUMN "${column}" DROP DEFAULT`,
      );
      await queryRunner.query(
        `ALTER TABLE "anthologys" ALTER COLUMN "${column}" TYPE text USING array_to_string("${column}", ',')`,
      );
      await queryRunner.query(
        `ALTER TABLE "anthologys" ALTER COLUMN "${column}" SET DEFAULT '[]'`,
      );
    }
  }
}
