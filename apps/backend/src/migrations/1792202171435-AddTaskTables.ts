import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTaskTables1792202171435 implements MigrationInterface {
  name = 'AddTaskTables1792202171435';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "task_attachments" ("id" SERIAL NOT NULL, "fileName" character varying NOT NULL, "fileUrl" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "task" integer, CONSTRAINT "PK_34eb9e5133310a488eaba0be28a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tasks_areaofwork_enum" AS ENUM('PLANNING', 'PROGRAMMING', 'CHECKPOINT', 'PRODUCTION')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tasks_status_enum" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "note" text, "areaOfWork" "public"."tasks_areaofwork_enum", "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'NOT_STARTED', "timeFrame" date, "dueBy" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "personInCharge" integer, "anthology" integer NOT NULL, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_attachments" ADD CONSTRAINT "FK_2566059384dbe28e25a7378ae88" FOREIGN KEY ("task") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_53e7908d40c156b94aa183245ac" FOREIGN KEY ("personInCharge") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_4137adb6f03458119fff1b91e6b" FOREIGN KEY ("anthology") REFERENCES "anthologys"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_4137adb6f03458119fff1b91e6b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_53e7908d40c156b94aa183245ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_attachments" DROP CONSTRAINT "FK_2566059384dbe28e25a7378ae88"`,
    );
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."tasks_areaofwork_enum"`);
    await queryRunner.query(`DROP TABLE "task_attachments"`);
  }
}
