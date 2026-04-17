import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationName1776194219594 implements MigrationInterface {
  name = 'MigrationName1776194219594';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "omchais" DROP CONSTRAINT "FK_6d37f0d754706d78ea1a5427c22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "omchais" DROP CONSTRAINT "FK_6069876e8c78c2516e7ea88f617"`,
    );
    await queryRunner.query(
      `ALTER TABLE "storydrafts" DROP COLUMN "classPeriod"`,
    );
    await queryRunner.query(`ALTER TABLE "omchais" DROP COLUMN "user"`);
    await queryRunner.query(`ALTER TABLE "omchais" DROP COLUMN "anthology"`);
    await queryRunner.query(
      `ALTER TABLE "omchais" ADD CONSTRAINT "FK_e57b5e6e51175532b58f12569ef" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "omchais" ADD CONSTRAINT "FK_993c4deaab09fec417730d9b225" FOREIGN KEY ("anthologyId") REFERENCES "anthologys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "omchais" DROP CONSTRAINT "FK_993c4deaab09fec417730d9b225"`,
    );
    await queryRunner.query(
      `ALTER TABLE "omchais" DROP CONSTRAINT "FK_e57b5e6e51175532b58f12569ef"`,
    );
    await queryRunner.query(`ALTER TABLE "omchais" ADD "anthology" integer`);
    await queryRunner.query(`ALTER TABLE "omchais" ADD "user" integer`);
    await queryRunner.query(
      `ALTER TABLE "storydrafts" ADD "classPeriod" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "omchais" ADD CONSTRAINT "FK_6069876e8c78c2516e7ea88f617" FOREIGN KEY ("anthology") REFERENCES "anthologys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "omchais" ADD CONSTRAINT "FK_6d37f0d754706d78ea1a5427c22" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
