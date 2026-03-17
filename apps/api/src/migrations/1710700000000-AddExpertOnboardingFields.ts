import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExpertOnboardingFields1710700000000 implements MigrationInterface {
  name = 'AddExpertOnboardingFields1710700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create payout_method enum type
    await queryRunner.query(`
      CREATE TYPE "public"."expert_profiles_payoutmethod_enum"
      AS ENUM('BANK_TRANSFER', 'MOBILE_MONEY')
    `);

    // Add new columns to expert_profiles
    await queryRunner.query(`
      ALTER TABLE "expert_profiles"
      ADD COLUMN "certifications" jsonb,
      ADD COLUMN "yearsOfExperience" integer,
      ADD COLUMN "languages" text,
      ADD COLUMN "payoutMethod" "public"."expert_profiles_payoutmethod_enum",
      ADD COLUMN "payoutDetails" jsonb,
      ADD COLUMN "onboardingStep" integer NOT NULL DEFAULT 1,
      ADD COLUMN "onboardingCompleted" boolean NOT NULL DEFAULT false,
      ADD COLUMN "profileCompleteness" integer NOT NULL DEFAULT 0
    `);

    // Make sessionPriceMillimes nullable for draft profiles
    await queryRunner.query(`
      ALTER TABLE "expert_profiles"
      ALTER COLUMN "sessionPriceMillimes" DROP NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restore sessionPriceMillimes NOT NULL
    await queryRunner.query(`
      ALTER TABLE "expert_profiles"
      ALTER COLUMN "sessionPriceMillimes" SET NOT NULL
    `);

    // Drop new columns
    await queryRunner.query(`
      ALTER TABLE "expert_profiles"
      DROP COLUMN IF EXISTS "profileCompleteness",
      DROP COLUMN IF EXISTS "onboardingCompleted",
      DROP COLUMN IF EXISTS "onboardingStep",
      DROP COLUMN IF EXISTS "payoutDetails",
      DROP COLUMN IF EXISTS "payoutMethod",
      DROP COLUMN IF EXISTS "languages",
      DROP COLUMN IF EXISTS "yearsOfExperience",
      DROP COLUMN IF EXISTS "certifications"
    `);

    // Drop enum type
    await queryRunner.query(`
      DROP TYPE IF EXISTS "public"."expert_profiles_payoutmethod_enum"
    `);
  }
}
