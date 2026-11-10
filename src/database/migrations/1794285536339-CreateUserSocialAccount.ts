import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserSocialAccount1794285536339 implements MigrationInterface {
  name = 'CreateUserSocialAccount1794285536339';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_social_account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "provider" character varying(50) NOT NULL, "providerUserId" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_82b8cb48dcb7190d2fc6a0307b9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2483aac06262d6c798bf24b712" ON "user_social_account" ("userId") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5c1084b2f5a12c5486fe0cd37c" ON "user_social_account" ("provider", "providerUserId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_social_account" ADD CONSTRAINT "FK_2483aac06262d6c798bf24b7121" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_social_account" DROP CONSTRAINT "FK_2483aac06262d6c798bf24b7121"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5c1084b2f5a12c5486fe0cd37c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2483aac06262d6c798bf24b712"`,
    );
    await queryRunner.query(`DROP TABLE "user_social_account"`);
  }
}
