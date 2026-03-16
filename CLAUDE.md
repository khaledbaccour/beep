# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Beep** (beep.tn) is a Tunisian marketplace platform where experts (fitness coaches, teachers, doctors, lawyers, etc.) get a personal link (beep.tn/joel) with a booking calendar. Clients pay to reserve online video meetings with experts. A public marketplace lets users browse and discover experts.

## Tech Stack

- **Backend:** NestJS (TypeScript) — chosen for native DI container and module system
- **Frontend:** Next.js 14+ (App Router, TypeScript, Tailwind CSS)
- **Database:** PostgreSQL via TypeORM (class-based entities align with DDD)
- **Cache/Queue:** Redis + BullMQ for job scheduling (reminders, refund windows, session cleanup)
- **Video Calls:** WebRTC peer-to-peer via PeerJS (free, no third-party subscription)
- **Real-time Chat:** Socket.IO over WebSockets (free, self-hosted)
- **Payments:** Gammal Tech payment gateway (Tunisia)
- **Domain/Hosting:** OVH (beep.tn), deployment target is AWS (ECS/Fargate)
- **Containerization:** Docker + docker-compose for all services

## Build & Run Commands

```bash
# Full stack (dev)
docker-compose up --build

# Backend only
cd apps/api && npm run start:dev

# Frontend only
cd apps/web && npm run dev

# Run all tests
cd apps/api && npm run test

# Run single test file
cd apps/api && npm run test -- --testPathPattern=booking.service

# Run e2e tests
cd apps/api && npm run test:e2e

# Lint
npm run lint          # root (all packages)

# Generate migration
cd apps/api && npm run migration:generate -- -n MigrationName

# Run migrations
cd apps/api && npm run migration:run
```

## Architecture (DDD + Hexagonal)

The backend follows Domain-Driven Design with hexagonal architecture. Every domain has this structure:

```
apps/api/src/modules/<domain>/
├── domain/
│   ├── entities/          # Rich domain models (TypeORM entities with behavior)
│   ├── value-objects/     # Immutable VOs (Money, TimeSlot, Duration, etc.)
│   ├── events/            # Domain events (BookingCreated, BookingCancelled)
│   ├── repositories/      # Repository interfaces (ports)
│   └── services/          # Domain services (pure business logic)
├── application/
│   ├── commands/          # CQRS command handlers
│   ├── queries/           # CQRS query handlers
│   ├── dtos/              # Request/Response DTOs (class-validator decorated)
│   └── services/          # Application/orchestration services
├── infrastructure/
│   ├── repositories/      # TypeORM repository implementations (adapters)
│   ├── providers/         # External service adapters
│   └── mappers/           # Entity ↔ DTO mappers
└── <domain>.module.ts     # NestJS module wiring
```

### Core Domains

- **Identity** — User accounts, authentication (JWT), roles (Expert, Client, Admin)
- **Expert Profile** — Public profiles, slugs (beep.tn/joel), categories, bio, pricing
- **Availability** — Recurring schedules, time slots, timezone handling, blackout dates
- **Booking** — Reservation lifecycle, conflict detection, status machine
- **Payment** — Payment processing, escrow-like hold, refund engine
- **Session** — WebRTC signaling, room management, chat messages
- **Marketplace** — Search, filtering, categories, featured experts
- **Notification** — Email, SMS, in-app push, reminders

## Critical Design Rules

### Strict Typing

- **Zero `any` types.** Every variable, parameter, return value, and generic must have an explicit type.
- All DTOs are `class` definitions decorated with `class-validator` and `class-transformer`.
- No string unions for domain concepts — use enums or branded types.
- API responses use typed response wrapper classes, never raw objects.

### Dependency Injection

- All external services (payment, email, SMS, storage) are behind interfaces injected via NestJS DI tokens.
- Repository pattern: domain defines the interface, infrastructure implements it.
- This enables swapping Gammal Tech for Stripe/Flouci without touching domain logic.
- Example: `PAYMENT_GATEWAY` injection token → `GammalTechPaymentAdapter` implements `IPaymentGateway`.

### Booking & Cancellation Logic

The booking lifecycle is a **state machine**:

```
PENDING_PAYMENT → CONFIRMED → IN_PROGRESS → COMPLETED
                → CANCELLED_BY_CLIENT
                → CANCELLED_BY_EXPERT
                → NO_SHOW
                → DISPUTED
```

**Refund eligibility rules:**
- Client cancels **≥24h before** session → full refund
- Client cancels **2–24h before** → 50% refund
- Client cancels **<2h before** → no refund
- Expert cancels at any time → full refund to client + expert penalty
- No-show (client doesn't join within 10min) → no refund, expert gets paid
- No-show (expert doesn't join within 10min) → full refund + expert penalty
- Disputed sessions → admin review queue, funds held in escrow

Payment flow: funds are **captured but held** until session completes. Released to expert after a 24h dispute window post-session.

### Video Call Architecture (WebRTC)

- PeerJS server self-hosted in Docker (no external costs)
- Signaling server via Socket.IO
- TURN/STUN: use free STUN (Google), self-host coturn for TURN
- Fallback: if P2P fails, relay through TURN server
- Sessions are time-boxed (auto-disconnect at booking end time + 5min grace)
- Chat messages during session are persisted to DB via WebSocket

### Payment Integration (Gammal Tech)

- All payment logic behind `IPaymentGateway` interface
- Webhook handler for async payment confirmations
- Idempotency keys on all payment operations
- Amounts stored as integer cents (millimes for TND) — never floating point

## Docker Setup

```
docker-compose.yml
├── api          (NestJS backend)
├── web          (Next.js frontend)
├── db           (PostgreSQL)
├── redis        (Cache + BullMQ broker)
├── peerjs       (WebRTC signaling)
├── coturn       (TURN relay server)
└── nginx        (Reverse proxy + SSL termination)
```

## Monorepo Structure

```
beep/
├── apps/
│   ├── api/         # NestJS backend
│   └── web/         # Next.js frontend
├── packages/
│   └── shared/      # Shared types, enums, constants between api & web
├── docker-compose.yml
├── .env.example
└── CLAUDE.md
```

## Key Conventions

- All dates/times stored in UTC, converted to user timezone on display
- Currency is TND (Tunisian Dinar), subdivided to millimes (1 TND = 1000 millimes), stored as integers
- Expert slugs are unique, lowercase, alphanumeric + hyphens only
- API versioning via URL prefix (`/api/v1/`)
- All endpoints return consistent envelope: `{ data, meta, errors }`
