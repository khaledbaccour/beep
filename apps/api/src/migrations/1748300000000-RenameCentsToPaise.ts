import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameCentsToPaise1748300000000 implements MigrationInterface {
  name = 'RenameCentsToPaise1748300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "expert_profiles" RENAME COLUMN "sessionPriceCents" TO "sessionPricePaise"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session_options" RENAME COLUMN "priceCents" TO "pricePaise"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" RENAME COLUMN "amountCents" TO "amountPaise"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" RENAME COLUMN "refundAmountCents" TO "refundAmountPaise"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transactions" RENAME COLUMN "amountCents" TO "amountPaise"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transactions" RENAME COLUMN "refundedAmountCents" TO "refundedAmountPaise"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transactions" ALTER COLUMN "currency" SET DEFAULT 'INR'`,
    );
    await queryRunner.query(
      `ALTER TABLE "expert_profiles" ALTER COLUMN "timezone" SET DEFAULT 'Asia/Kolkata'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "expert_profiles" ALTER COLUMN "timezone" SET DEFAULT 'Europe/Paris'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transactions" ALTER COLUMN "currency" SET DEFAULT 'EUR'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transactions" RENAME COLUMN "refundedAmountPaise" TO "refundedAmountCents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transactions" RENAME COLUMN "amountPaise" TO "amountCents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" RENAME COLUMN "refundAmountPaise" TO "refundAmountCents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" RENAME COLUMN "amountPaise" TO "amountCents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session_options" RENAME COLUMN "pricePaise" TO "priceCents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expert_profiles" RENAME COLUMN "sessionPricePaise" TO "sessionPriceCents"`,
    );
  }
}
