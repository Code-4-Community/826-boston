import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAnthologyGradeLevel1792300000000 implements MigrationInterface {
  name = 'AddAnthologyGradeLevel1792300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "anthologys" ADD "gradeLevel" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "anthologys" DROP COLUMN "gradeLevel"`,
    );
  }
}
