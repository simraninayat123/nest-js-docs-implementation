import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOneTimeTokenExpiresAtIndex1793766963519 implements MigrationInterface {
  name = 'AddOneTimeTokenExpiresAtIndex1793766963519';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_c44440102d4104b9a4e052d9af" ON "one_time_token"  ("expiresAt") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c44440102d4104b9a4e052d9af"`,
    );
  }
}
