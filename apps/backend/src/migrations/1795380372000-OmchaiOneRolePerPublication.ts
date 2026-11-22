import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * A person holds at most one role per publication. Before adding the
 * constraint, drops duplicate assignments, keeping the highest role in OMCHAI
 * order (so an Owner who was also Informed stays Owner). `down` only drops the
 * constraint; the removed duplicates are not restored.
 */
export class OmchaiOneRolePerPublication1795380372000
  implements MigrationInterface
{
  name = 'OmchaiOneRolePerPublication1795380372000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "omchais" WHERE "id" IN (
        SELECT "id" FROM (
          SELECT "id", ROW_NUMBER() OVER (
            PARTITION BY "user", "anthology" ORDER BY "role", "id"
          ) AS "rank"
          FROM "omchais"
          WHERE "user" IS NOT NULL AND "anthology" IS NOT NULL
        ) "ranked"
        WHERE "rank" > 1
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "omchais" ADD CONSTRAINT "UQ_omchais_user_anthology" UNIQUE ("user", "anthology")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "omchais" DROP CONSTRAINT "UQ_omchais_user_anthology"`,
    );
  }
}
