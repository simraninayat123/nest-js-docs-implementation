import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReminderLanguage1794456080773 implements MigrationInterface {
  name = 'AddReminderLanguage1794456080773';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reminder" ADD "language" character varying(10)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reminder" DROP COLUMN "language"`);
  }
}
