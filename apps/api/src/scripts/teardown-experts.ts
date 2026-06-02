/**
 * Teardown for seed-experts.ts — removes every seeded expert and its data.
 * Identifies seed users by email domain (@kliik-seed.internal) and deletes
 * their blackout dates, schedules, session options, profiles, and users.
 *
 * Run (inside the api container, compiled):
 *   node dist/scripts/teardown-experts.js
 * Or in dev:
 *   npx ts-node src/scripts/teardown-experts.ts
 */
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource, In } from 'typeorm';
import { User } from '../modules/identity/domain/entities/user.entity';
import { ExpertProfile } from '../modules/expert-profile/domain/entities/expert-profile.entity';
import { SessionOption } from '../modules/expert-profile/domain/entities/session-option.entity';
import { AvailabilitySchedule } from '../modules/availability/domain/entities/availability-schedule.entity';
import { BlackoutDate } from '../modules/availability/domain/entities/blackout-date.entity';
import { SEED_EMAIL_DOMAIN } from './seed-experts';

dotenv.config();

function buildConnectionOptions() {
  const databaseUrl = process.env.DATABASE_URL;
  const isProduction = process.env.NODE_ENV === 'production';
  if (databaseUrl) {
    return { url: databaseUrl, ssl: isProduction ? { rejectUnauthorized: false } : false };
  }
  return {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'beep',
    password: process.env.POSTGRES_PASSWORD || 'changeme',
    database: process.env.POSTGRES_DB || 'beep',
  };
}

const dataSource = new DataSource({
  type: 'postgres',
  entities: [User, ExpertProfile, SessionOption, AvailabilitySchedule, BlackoutDate],
  synchronize: false,
  ...buildConnectionOptions(),
});

async function main() {
  await dataSource.initialize();
  const userRepo = dataSource.getRepository(User);
  const profileRepo = dataSource.getRepository(ExpertProfile);
  const sessionRepo = dataSource.getRepository(SessionOption);
  const scheduleRepo = dataSource.getRepository(AvailabilitySchedule);
  const blackoutRepo = dataSource.getRepository(BlackoutDate);

  const seedUsers = await userRepo
    .createQueryBuilder('u')
    .where('u.email LIKE :pat', { pat: `%@${SEED_EMAIL_DOMAIN}` })
    .getMany();

  if (seedUsers.length === 0) {
    console.log('No seed users found. Nothing to remove.');
    await dataSource.destroy();
    return;
  }

  const userIds = seedUsers.map((u) => u.id);
  const profiles = await profileRepo.find({ where: { userId: In(userIds) } });
  const profileIds = profiles.map((p) => p.id);

  if (profileIds.length > 0) {
    await blackoutRepo.delete({ expertProfileId: In(profileIds) });
    await scheduleRepo.delete({ expertProfileId: In(profileIds) });
    await sessionRepo.delete({ expertProfileId: In(profileIds) });
    await profileRepo.delete({ id: In(profileIds) });
  }
  await userRepo.delete({ id: In(userIds) });

  console.log(`🧹 Removed ${seedUsers.length} seed users and ${profileIds.length} profiles (+ their schedules/blackouts/options).`);
  await dataSource.destroy();
}

main().catch(async (err) => {
  console.error('Teardown failed:', err);
  try {
    await dataSource.destroy();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
