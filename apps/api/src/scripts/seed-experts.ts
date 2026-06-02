/**
 * Seed script — generates realistic Indian expert profiles whose calendars are
 * fully busy within the bookable window (BOOKING_MAX_DAYS_AHEAD days).
 *
 * Every row this script creates is TAGGED so it can be removed cleanly:
 *   - users.email   ends with `@${SEED_EMAIL_DOMAIN}`
 *   - blackout_dates.reason === SEED_REASON
 * Run `teardown-experts.ts` to remove everything this script inserts.
 *
 * Run (inside the api container, compiled):
 *   node dist/scripts/seed-experts.js
 * Or in dev:
 *   npx ts-node src/scripts/seed-experts.ts
 */
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import {
  ExpertCategory,
  UserRole,
  PayoutMethod,
  DayOfWeek,
  BOOKING_MAX_DAYS_AHEAD,
} from '@beep/shared';
import { User } from '../modules/identity/domain/entities/user.entity';
import { ExpertProfile } from '../modules/expert-profile/domain/entities/expert-profile.entity';
import { SessionOption } from '../modules/expert-profile/domain/entities/session-option.entity';
import { AvailabilitySchedule } from '../modules/availability/domain/entities/availability-schedule.entity';
import { BlackoutDate } from '../modules/availability/domain/entities/blackout-date.entity';

dotenv.config();

export const SEED_EMAIL_DOMAIN = 'kliik-seed.internal';
export const SEED_REASON = 'seed';
const SEED_PASSWORD = 'KliikSeed!2026';

// ── Data pools ────────────────────────────────────────────────────────────
const MALE_FIRST = [
  'Aarav', 'Vivaan', 'Aditya', 'Arjun', 'Rohan', 'Karan', 'Rahul', 'Vikram',
  'Sanjay', 'Amit', 'Rajesh', 'Nikhil', 'Siddharth', 'Aakash', 'Manish',
  'Devansh', 'Kabir', 'Aryan', 'Harsh', 'Yash', 'Ishaan', 'Ananya',
];
const FEMALE_FIRST = [
  'Priya', 'Ananya', 'Diya', 'Aanya', 'Saanvi', 'Riya', 'Isha', 'Kavya',
  'Meera', 'Neha', 'Pooja', 'Sneha', 'Anjali', 'Shruti', 'Divya', 'Nisha',
  'Aditi', 'Tara', 'Ishita', 'Sakshi', 'Manya', 'Trisha',
];
const LAST = [
  'Sharma', 'Verma', 'Gupta', 'Patel', 'Reddy', 'Nair', 'Iyer', 'Rao',
  'Mehta', 'Joshi', 'Kapoor', 'Malhotra', 'Chopra', 'Bhat', 'Desai',
  'Menon', 'Pillai', 'Banerjee', 'Chatterjee', 'Das', 'Bose', 'Khanna',
  'Sethi', 'Agarwal', 'Saxena', 'Mishra', 'Tiwari', 'Kulkarni', 'Shetty',
];

// MEDICINE intentionally excluded (no medical/doctor profiles allowed).
const CATEGORIES: { category: ExpertCategory; headline: string; tags: string[] }[] = [
  { category: ExpertCategory.FITNESS, headline: 'Certified personal trainer & strength coach', tags: ['strength', 'weight-loss', 'mobility'] },
  { category: ExpertCategory.EDUCATION, headline: 'Exam prep tutor — JEE/NEET foundations & maths', tags: ['maths', 'physics', 'exam-prep'] },
  { category: ExpertCategory.LAW, headline: 'Advocate — contracts, startups & IP', tags: ['contracts', 'startup-law', 'ip'] },
  { category: ExpertCategory.BUSINESS, headline: 'Business consultant & growth strategist', tags: ['strategy', 'growth', 'operations'] },
  { category: ExpertCategory.TECHNOLOGY, headline: 'Senior software engineer & system design mentor', tags: ['system-design', 'interviews', 'career'] },
  { category: ExpertCategory.PSYCHOLOGY, headline: 'Counselling psychologist & life coach', tags: ['stress', 'mindfulness', 'relationships'] },
  { category: ExpertCategory.NUTRITION, headline: 'Sports nutritionist & diet planner', tags: ['diet', 'meal-plans', 'wellness'] },
  { category: ExpertCategory.FINANCE, headline: 'Financial planner & investment advisor', tags: ['investing', 'tax', 'mutual-funds'] },
  { category: ExpertCategory.LANGUAGES, headline: 'Spoken English & IELTS coach', tags: ['english', 'ielts', 'fluency'] },
  { category: ExpertCategory.MUSIC, headline: 'Vocalist & music theory instructor', tags: ['vocals', 'theory', 'guitar'] },
  { category: ExpertCategory.ART, headline: 'Illustrator & digital art mentor', tags: ['illustration', 'digital-art', 'portfolio'] },
  { category: ExpertCategory.OTHER, headline: 'Career mentor & interview coach', tags: ['career', 'resume', 'interviews'] },
];

const LANGUAGE_SETS = [
  ['English', 'Hindi'],
  ['English', 'Hindi', 'Tamil'],
  ['English', 'Hindi', 'Marathi'],
  ['English', 'Hindi', 'Bengali'],
  ['English', 'Hindi', 'Telugu'],
  ['English', 'Kannada'],
];

// ── Helpers ─────────────────────────────────────────────────────────────────
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[randInt(0, arr.length - 1)];
const pad2 = (n: number) => String(n).padStart(2, '0');

function dateStr(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

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
  const scheduleRepo = dataSource.getRepository(AvailabilitySchedule);
  const blackoutRepo = dataSource.getRepository(BlackoutDate);

  // Guard: refuse to double-seed.
  const existing = await userRepo
    .createQueryBuilder('u')
    .where('u.email LIKE :pat', { pat: `%@${SEED_EMAIL_DOMAIN}` })
    .getCount();
  if (existing > 0) {
    console.error(
      `Found ${existing} existing seed users (@${SEED_EMAIL_DOMAIN}). ` +
        `Run teardown-experts first if you want to re-seed. Aborting.`,
    );
    await dataSource.destroy();
    process.exit(1);
  }

  const COUNT = 93 + randInt(0, 14); // 93..107
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 12);

  // Bookable window: today .. today + BOOKING_MAX_DAYS_AHEAD (all blacked out).
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + BOOKING_MAX_DAYS_AHEAD);
  const recurringUntil = dateStr(horizon);

  const usedSlugs = new Set<string>();
  const usedPhones = new Set<string>();

  let created = 0;
  for (let i = 0; i < COUNT; i++) {
    const isFemale = Math.random() < 0.5;
    const firstName = pick(isFemale ? FEMALE_FIRST : MALE_FIRST);
    const lastName = pick(LAST);

    // Unique slug
    let slug = `${firstName}-${lastName}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
    while (usedSlugs.has(slug)) slug = `${firstName}-${lastName}-${randInt(2, 999)}`.toLowerCase();
    usedSlugs.add(slug);

    // Unique +91 phone
    let phone = `+91${randInt(6, 9)}${String(randInt(0, 999999999)).padStart(9, '0')}`;
    while (usedPhones.has(phone)) phone = `+91${randInt(6, 9)}${String(randInt(0, 999999999)).padStart(9, '0')}`;
    usedPhones.add(phone);

    const cat = pick(CATEGORIES);
    const portraitIdx = i % 100;
    const gender = isFemale ? 'women' : 'men';

    // ── User ──
    const user = userRepo.create({
      email: `seed.${slug}@${SEED_EMAIL_DOMAIN}`,
      passwordHash,
      firstName,
      lastName,
      role: UserRole.EXPERT,
      phone,
      avatarUrl: `https://randomuser.me/api/portraits/${gender}/${portraitIdx}.jpg`,
      onboardingCompleted: true,
      isActive: true,
    });
    await userRepo.save(user);

    // ── Session options ──
    const basePrice = randInt(5, 50) * 10000; // ₹500..₹5000 in paise
    const sessionOptions = [
      Object.assign(new SessionOption(), {
        durationMinutes: 30,
        pricePaise: Math.round(basePrice * 0.6),
        label: 'Quick Consult',
        isActive: true,
        sortOrder: 0,
      }),
      Object.assign(new SessionOption(), {
        durationMinutes: 60,
        pricePaise: basePrice,
        label: 'Full Session',
        isActive: true,
        sortOrder: 1,
      }),
    ];

    // ── Profile ──
    const profile = profileRepo.create({
      slug,
      userId: user.id,
      bio: `${firstName} is a ${cat.headline.toLowerCase()} with ${randInt(3, 20)}+ years of experience helping clients across India. Sessions are practical, friendly, and tailored to your goals.`,
      headline: cat.headline,
      category: cat.category,
      tags: cat.tags,
      sessionPricePaise: basePrice,
      sessionDurationMinutes: 60,
      timezone: 'Asia/Kolkata',
      averageRating: Math.round((43 + randInt(0, 7)) ) / 10, // 4.3..5.0
      totalSessions: randInt(20, 400),
      isVisible: true,
      isFeatured: i < 8, // a handful featured on the home page
      yearsOfExperience: randInt(3, 20),
      languages: pick(LANGUAGE_SETS),
      payoutMethod: PayoutMethod.UPI,
      payoutDetails: { upiId: `${slug}@upi` },
      onboardingStep: 4,
      onboardingCompleted: true,
      profileCompleteness: 100,
      availabilityRecurring: true,
      availabilityRecurringUntil: recurringUntil,
      sessionOptions, // cascade insert
    });
    await profileRepo.save(profile);

    // ── Recurring weekday schedule (looks like a real working pro) ──
    // Morning block + afternoon block (lunch break in between).
    const startHour = randInt(8, 10); // 08:00..10:00
    const morningEnd = randInt(12, 13);
    const afternoonStart = morningEnd + 1;
    const endHour = randInt(17, 19);
    const weekdays = [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY];
    const schedules: AvailabilitySchedule[] = [];
    for (const day of weekdays) {
      schedules.push(
        Object.assign(new AvailabilitySchedule(), {
          expertProfileId: profile.id,
          dayOfWeek: day,
          startTime: `${pad2(startHour)}:00`,
          endTime: `${pad2(morningEnd)}:00`,
          isActive: true,
        }),
        Object.assign(new AvailabilitySchedule(), {
          expertProfileId: profile.id,
          dayOfWeek: day,
          startTime: `${pad2(afternoonStart)}:00`,
          endTime: `${pad2(endHour)}:00`,
          isActive: true,
        }),
      );
    }
    await scheduleRepo.save(schedules);

    // ── Blackout every day in the bookable window → zero open slots ──
    const blackouts: BlackoutDate[] = [];
    const cursor = new Date(today);
    while (cursor <= horizon) {
      blackouts.push(
        Object.assign(new BlackoutDate(), {
          expertProfileId: profile.id,
          date: dateStr(cursor),
          reason: SEED_REASON,
        }),
      );
      cursor.setDate(cursor.getDate() + 1);
    }
    await blackoutRepo.save(blackouts);

    created++;
    if (created % 10 === 0) console.log(`  …${created}/${COUNT} experts seeded`);
  }

  console.log(`✅ Seeded ${created} expert profiles (fully busy for ${BOOKING_MAX_DAYS_AHEAD} days).`);
  await dataSource.destroy();
}

main().catch(async (err) => {
  console.error('Seed failed:', err);
  try {
    await dataSource.destroy();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
