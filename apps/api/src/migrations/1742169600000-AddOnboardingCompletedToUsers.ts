import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOnboardingCompletedToUsers1742169600000
  implements MigrationInterface
{
  name = 'AddOnboardingCompletedToUsers1742169600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "onboardingCompleted" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "onboardingCompleted"`,
    );
  }
}
