import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOnboardingCompletedToUsers1710672000000
  implements MigrationInterface
{
  name = 'AddOnboardingCompletedToUsers1710672000000';

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
