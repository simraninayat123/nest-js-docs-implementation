import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReminder1794286871664 implements MigrationInterface {
  name = 'CreateReminder1794286871664';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reminder" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "message" character varying(500) NOT NULL, "cronTime" character varying(100) NOT NULL, "timeZone" character varying(100), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9ec029d17cb8dece186b9221ede" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c4cc144b2a558182ac6d869d2a" ON "reminder"  ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "reminder" ADD CONSTRAINT "FK_c4cc144b2a558182ac6d869d2a4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reminder" DROP CONSTRAINT "FK_c4cc144b2a558182ac6d869d2a4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c4cc144b2a558182ac6d869d2a"`,
    );
    await queryRunner.query(`DROP TABLE "reminder"`);
  }
}
