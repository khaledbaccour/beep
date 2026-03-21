import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSessionOptions1742500000000 implements MigrationInterface {
  name = 'AddSessionOptions1742500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "session_options" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "expertProfileId" uuid NOT NULL,
        "durationMinutes" integer NOT NULL,
        "priceMillimes" integer NOT NULL,
        "label" character varying(100),
        "isActive" boolean NOT NULL DEFAULT true,
        "sortOrder" integer NOT NULL DEFAULT 0,
        CONSTRAINT "PK_session_options" PRIMARY KEY ("id"),
        CONSTRAINT "FK_session_options_expert_profile" FOREIGN KEY ("expertProfileId")
          REFERENCES "expert_profiles"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_session_options_expertProfileId"
      ON "session_options" ("expertProfileId")
    `);

    await queryRunner.query(`
      ALTER TABLE "bookings"
      ADD COLUMN "sessionOptionId" uuid,
      ADD COLUMN "durationMinutes" integer
    `);

    await queryRunner.query(`
      ALTER TABLE "bookings"
      ADD CONSTRAINT "FK_bookings_session_option" FOREIGN KEY ("sessionOptionId")
        REFERENCES "session_options"("id") ON DELETE SET NULL
    `);

    await queryRunner.query(`
      INSERT INTO "session_options" ("id", "expertProfileId", "durationMinutes", "priceMillimes", "sortOrder")
      SELECT uuid_generate_v4(), "id", "sessionDurationMinutes", "sessionPriceMillimes", 0
      FROM "expert_profiles"
      WHERE "sessionPriceMillimes" IS NOT NULL
    `);

    await queryRunner.query(`
      UPDATE "bookings"
      SET "durationMinutes" = EXTRACT(EPOCH FROM ("scheduledEndTime" - "scheduledStartTime")) / 60
      WHERE "durationMinutes" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "FK_bookings_session_option"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN IF EXISTS "durationMinutes", DROP COLUMN IF EXISTS "sessionOptionId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_session_options_expertProfileId"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "session_options"`);
  }
}
