import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationName1775332569883 implements MigrationInterface {
  name = 'MigrationName1775332569883';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "publishingName"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);

    await queryRunner.query(`
        CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'STANDARD')
    `);

    // await queryRunner.query(`
    //   UPDATE "anthologys"
    //   SET "status" = 'Archived'
    //   WHERE "status" = 'CanBeShared'
    // `);

    await queryRunner.query(`
        ALTER TABLE "users" ADD "role" "public"."users_role_enum" DEFAULT 'STANDARD'
    `);

    await queryRunner.query(`
        ALTER TABLE "users" ADD "title" character varying
    `);

    await queryRunner.query(
      `ALTER TYPE "public"."anthologys_status_enum" RENAME TO "anthologys_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."anthologys_status_enum" AS ENUM('Draft', 'In Revision', 'In Production', 'Published', 'Archived')`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "status" TYPE "public"."anthologys_status_enum" USING "status"::"text"::"public"."anthologys_status_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."anthologys_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."anthologys_status_enum_old" AS ENUM('Archived', 'NotStarted', 'Drafting', 'CanBeShared')`,
    );
    await queryRunner.query(
      `ALTER TABLE "anthologys" ALTER COLUMN "status" TYPE "public"."anthologys_status_enum_old" USING "status"::"text"::"public"."anthologys_status_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."anthologys_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."anthologys_status_enum_old" RENAME TO "anthologys_status_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "publishingName" character varying`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('ADMIN', 'VOLUNTEER')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "status" "public"."users_status_enum" NOT NULL`,
    );
  }
}
