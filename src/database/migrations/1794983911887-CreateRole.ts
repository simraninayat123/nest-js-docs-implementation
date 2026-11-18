import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRole1794983911887 implements MigrationInterface {
  name = 'CreateRole1794983911887';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" character varying(255), "permissions" text array NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `INSERT INTO "role" ("id", "name", "description", "permissions") VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'Full access', '{reminders:read,reminders:write,roles:manage,users:manage}'), ('00000000-0000-4000-8000-000000000002', 'User', 'Default role for new users', '{reminders:read,reminders:write}')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "roleId" uuid NOT NULL DEFAULT '00000000-0000-4000-8000-000000000002'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c28e52f758e7bbc53828db9219" ON "user"  ("roleId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c28e52f758e7bbc53828db9219"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roleId"`);
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
