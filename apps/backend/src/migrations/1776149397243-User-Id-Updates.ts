import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserIdUpdates1776149397243 implements MigrationInterface {
  name = 'UserIdUpdates1776149397243';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "users_id_seq" OWNED BY "users"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT nextval('"users_id_seq"')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "users_id_seq"`);
  }
}
