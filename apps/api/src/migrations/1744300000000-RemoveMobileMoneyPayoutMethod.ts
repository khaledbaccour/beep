import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveMobileMoneyPayoutMethod1744300000000 implements MigrationInterface {
  name = 'RemoveMobileMoneyPayoutMethod1744300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Convert any existing MOBILE_MONEY records to BANK_TRANSFER, clear their details
    await queryRunner.query(`
      UPDATE "expert_profiles"
      SET "payoutMethod" = 'BANK_TRANSFER',
          "payoutDetails" = NULL
      WHERE "payoutMethod" = 'MOBILE_MONEY'
    `);

    // Rename old enum
    await queryRunner.query(`
      ALTER TYPE "public"."expert_profiles_payoutmethod_enum"
      RENAME TO "expert_profiles_payoutmethod_enum_old"
    `);

    // Create new enum with only BANK_TRANSFER
    await queryRunner.query(`
      CREATE TYPE "public"."expert_profiles_payoutmethod_enum"
      AS ENUM('BANK_TRANSFER')
    `);

    // Alter column to use new enum
    await queryRunner.query(`
      ALTER TABLE "expert_profiles"
      ALTER COLUMN "payoutMethod" TYPE "public"."expert_profiles_payoutmethod_enum"
      USING "payoutMethod"::text::"public"."expert_profiles_payoutmethod_enum"
    `);

    // Drop old enum
    await queryRunner.query(`
      DROP TYPE "public"."expert_profiles_payoutmethod_enum_old"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TYPE "public"."expert_profiles_payoutmethod_enum"
      RENAME TO "expert_profiles_payoutmethod_enum_old"
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."expert_profiles_payoutmethod_enum"
      AS ENUM('BANK_TRANSFER', 'MOBILE_MONEY')
    `);

    await queryRunner.query(`
      ALTER TABLE "expert_profiles"
      ALTER COLUMN "payoutMethod" TYPE "public"."expert_profiles_payoutmethod_enum"
      USING "payoutMethod"::text::"public"."expert_profiles_payoutmethod_enum"
    `);

    await queryRunner.query(`
      DROP TYPE "public"."expert_profiles_payoutmethod_enum_old"
    `);
  }
}
