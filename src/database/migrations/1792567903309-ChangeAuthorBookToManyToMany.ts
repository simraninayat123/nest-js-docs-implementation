import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeAuthorBookToManyToMany1792567903309 implements MigrationInterface {
  name = 'ChangeAuthorBookToManyToMany1792567903309';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "book_author" ("bookId" uuid NOT NULL, "authorId" uuid NOT NULL, CONSTRAINT "PK_9a862048014a06fa7c62aaf7970" PRIMARY KEY ("bookId", "authorId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_56b8cdc80ea78d03dcece601ff" ON "book_author" ("bookId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4979ade189c87f2db1e0e9c213" ON "book_author" ("authorId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_author" ADD CONSTRAINT "FK_56b8cdc80ea78d03dcece601fff" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_author" ADD CONSTRAINT "FK_4979ade189c87f2db1e0e9c213c" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );

    await queryRunner.query(
      `INSERT INTO "book_author" ("bookId", "authorId") SELECT "id", "authorId" FROM "book"`,
    );

    await queryRunner.query(
      `ALTER TABLE "book" DROP CONSTRAINT "FK_66a4f0f47943a0d99c16ecf90b2"`,
    );
    await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "authorId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "book" ADD "authorId" uuid`);

    await queryRunner.query(
      `UPDATE "book" SET "authorId" = (SELECT "ba"."authorId" FROM "book_author" "ba" INNER JOIN "author" "a" ON "a"."id" = "ba"."authorId" WHERE "ba"."bookId" = "book"."id" ORDER BY "a"."createdAt" ASC, "a"."id" ASC LIMIT 1)`,
    );

    await queryRunner.query(
      `ALTER TABLE "book" ALTER COLUMN "authorId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" ADD CONSTRAINT "FK_66a4f0f47943a0d99c16ecf90b2" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "book_author" DROP CONSTRAINT "FK_4979ade189c87f2db1e0e9c213c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_author" DROP CONSTRAINT "FK_56b8cdc80ea78d03dcece601fff"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4979ade189c87f2db1e0e9c213"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_56b8cdc80ea78d03dcece601ff"`,
    );
    await queryRunner.query(`DROP TABLE "book_author"`);
  }
}
