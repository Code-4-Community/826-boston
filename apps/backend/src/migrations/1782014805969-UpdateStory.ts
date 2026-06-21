import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStory1782014805969 implements MigrationInterface {
    name = 'UpdateStory1782014805969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "storys" DROP COLUMN "studentBio"`);
        await queryRunner.query(`ALTER TABLE "storys" DROP COLUMN "theme"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "storys" ADD "theme" character varying`);
        await queryRunner.query(`ALTER TABLE "storys" ADD "studentBio" character varying`);
    }

}
