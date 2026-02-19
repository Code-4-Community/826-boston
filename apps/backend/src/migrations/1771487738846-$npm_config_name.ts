import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1771487738846 implements MigrationInterface {
    name = ' $npmConfigName1771487738846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "productioninfos" DROP CONSTRAINT "FK_productioninfos_anthology_id"`);
        await queryRunner.query(`ALTER TABLE "productioninfos" RENAME COLUMN "anthology_id" TO "anthology"`);
        await queryRunner.query(`CREATE TYPE "public"."omchais_role_enum" AS ENUM('OWNER', 'MANAGER', 'CONSULTED', 'HELPER', 'APPROVER', 'INFORMED')`);
        await queryRunner.query(`CREATE TABLE "omchais" ("id" SERIAL NOT NULL, "anthology_id" integer NOT NULL, "user_id" integer NOT NULL, "role" "public"."omchais_role_enum" NOT NULL, "datetime_assigned" date NOT NULL, CONSTRAINT "PK_84d53f60fa19cddfc4ed371c9bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('ADMIN', 'STANDARD')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer NOT NULL, "status" "public"."users_status_enum" NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "publishingName" character varying, "name" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "storys" DROP COLUMN "anthology_id"`);
        await queryRunner.query(`ALTER TABLE "storys" DROP COLUMN "author_id"`);
        await queryRunner.query(`ALTER TABLE "storys" ADD "anthologyId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "storys" ADD "authorId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventoryholdings" ADD "inventory_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventoryholdings" ADD "anthology_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "storys" ADD CONSTRAINT "FK_9c4542f58e2fc02bbd58d6a5a62" FOREIGN KEY ("anthologyId") REFERENCES "anthologys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "storys" ADD CONSTRAINT "FK_cbfcbd644297d3f60d10992f361" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productioninfos" ADD CONSTRAINT "FK_bc703cadb35d83218d22e93d68c" FOREIGN KEY ("anthology") REFERENCES "anthologys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "productioninfos" DROP CONSTRAINT "FK_bc703cadb35d83218d22e93d68c"`);
        await queryRunner.query(`ALTER TABLE "storys" DROP CONSTRAINT "FK_cbfcbd644297d3f60d10992f361"`);
        await queryRunner.query(`ALTER TABLE "storys" DROP CONSTRAINT "FK_9c4542f58e2fc02bbd58d6a5a62"`);
        await queryRunner.query(`ALTER TABLE "inventoryholdings" DROP COLUMN "anthology_id"`);
        await queryRunner.query(`ALTER TABLE "inventoryholdings" DROP COLUMN "inventory_id"`);
        await queryRunner.query(`ALTER TABLE "storys" DROP COLUMN "authorId"`);
        await queryRunner.query(`ALTER TABLE "storys" DROP COLUMN "anthologyId"`);
        await queryRunner.query(`ALTER TABLE "storys" ADD "author_id" integer`);
        await queryRunner.query(`ALTER TABLE "storys" ADD "anthology_id" integer`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TABLE "omchais"`);
        await queryRunner.query(`DROP TYPE "public"."omchais_role_enum"`);
        await queryRunner.query(`ALTER TABLE "productioninfos" RENAME COLUMN "anthology" TO "anthology_id"`);
        await queryRunner.query(`ALTER TABLE "productioninfos" ADD CONSTRAINT "FK_productioninfos_anthology_id" FOREIGN KEY ("anthology_id") REFERENCES "anthologys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
