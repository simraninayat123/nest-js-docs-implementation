import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOneTimeToken1793594005143 implements MigrationInterface {
  name = 'CreateOneTimeToken1793594005143';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "one_time_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "type" character varying(20) NOT NULL, "tokenHash" character varying(64) NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "usedAt" TIMESTAMP, "attempts" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_956e3dd6580e4829e05ab460808" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ce784511f648d2975abe8828a7" ON "one_time_token" ("tokenHash") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ffd90d16ecc785bcdeb44af6c3" ON "one_time_token" ("email", "type", "createdAt") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ffd90d16ecc785bcdeb44af6c3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ce784511f648d2975abe8828a7"`,
    );
    await queryRunner.query(`DROP TABLE "one_time_token"`);
  }
}
