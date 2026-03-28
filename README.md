# Autoblogger AI

A production-ready, AI-powered SaaS platform for automated blog generation, optimization, and multi-platform publishing.

## Features

- **AI Blog Generation** — GPT-4 powered pipeline that researches topics, writes content, optimizes SEO, and generates images
- **Multi-Platform Publishing** — Auto-publish to WordPress, Medium, LinkedIn, and Twitter (X)
- **Smart Scheduling** — Daily, weekly, or custom cron-based automated blog generation
- **Analytics Dashboard** — Track views, clicks, shares, and engagement with interactive charts
- **Multi-Tenant SaaS** — Organizations, role-based access, and subscription plans
- **Background Workers** — BullMQ-powered job processing for generation, imaging, and publishing
- **Content Calendar** — Visual schedule management for automated content pipelines

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (App Router), React, Tailwind CSS |
| Backend | Next.js API Routes, Node.js |
| Database | PostgreSQL, Prisma ORM |
| Caching & Queues | Redis, BullMQ |
| AI | LangChain, OpenAI GPT-4, DALL-E 3 |
| Auth | NextAuth.js (JWT) |
| Deployment | Docker, Docker Compose, Vercel-ready |

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Next.js App                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Pages &  │  │   API    │  │   NextAuth   │   │
│  │    UI     │  │  Routes  │  │     Auth     │   │
│  └──────────┘  └────┬─────┘  └──────────────┘   │
│                     │                             │
│         ┌───────────┼───────────┐                 │
│         ▼           ▼           ▼                 │
│   ┌──────────┐ ┌─────────┐ ┌────────┐           │
│   │  Prisma  │ │  Redis  │ │  AI    │           │
│   │   ORM    │ │  Queue  │ │ Agents │           │
│   └────┬─────┘ └────┬────┘ └────────┘           │
└────────┼────────────┼────────────────────────────┘
         ▼            ▼
   ┌──────────┐  ┌─────────────────────────┐
   │ Postgres │  │     Background Workers   │
   │    DB    │  │  ┌─────┐ ┌─────┐ ┌────┐│
   └──────────┘  │  │Blog │ │Image│ │Pub ││
                 │  │Worker│ │Worker│ │Worker││
                 │  └─────┘ └─────┘ └────┘│
                 └─────────────────────────┘
```

### AI Agents

| Agent | Purpose |
|-------|---------|
| Research Agent | Finds trending topics and generates research |
| Writer Agent | Generates full blog content in markdown |
| SEO Agent | Optimizes title, meta, keywords, and content |
| Image Agent | Creates blog header images with DALL-E 3 |

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- OpenAI API key

### 1. Clone and Install

```bash
git clone https://github.com/vishaljha04/autoblogger-ai.git
cd autoblogger-ai
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
npm run db:seed  # Optional: seed demo data
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo credentials:** `demo@autoblogger.ai` / `password123`

### 5. Run Workers (optional)

```bash
npm run worker
```

## Docker Deployment

```bash
# Set your OpenAI API key
export OPENAI_API_KEY=sk-your-key

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec web npx prisma db push

# Seed demo data (optional)
docker-compose exec web npm run db:seed
```

## Project Structure

```
autoblogger-ai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # NextAuth + registration
│   │   │   ├── blogs/          # Blog CRUD
│   │   │   ├── ai/             # AI generation endpoint
│   │   │   ├── analytics/      # Analytics data
│   │   │   ├── platforms/      # Platform management
│   │   │   └── schedule/       # Schedule management
│   │   ├── dashboard/          # Dashboard page
│   │   ├── blogs/              # Blog list, detail, generator
│   │   ├── analytics/          # Analytics page
│   │   ├── calendar/           # Content calendar
│   │   ├── platforms/          # Platform connections
│   │   ├── settings/           # User settings
│   │   ├── login/              # Login page
│   │   └── register/           # Registration page
│   ├── components/             # React components
│   │   ├── layout/             # Sidebar, DashboardLayout
│   │   └── ui/                 # StatCard, BlogCard
│   ├── lib/                    # Core libraries
│   │   ├── ai/                 # AI agents (research, writer, SEO, image)
│   │   ├── auth/               # NextAuth config
│   │   ├── db/                 # Prisma client
│   │   ├── publishers/         # WordPress, Medium, LinkedIn, Twitter
│   │   ├── queue/              # BullMQ queues
│   │   └── utils/              # Helpers
│   └── workers/                # Background job workers
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.js                 # Demo data seeder
├── Dockerfile                  # Web app container
├── Dockerfile.worker           # Worker container
├── docker-compose.yml          # Full stack orchestration
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/[...nextauth]` | NextAuth sign in |
| GET | `/api/blogs` | List blogs (paginated, filterable) |
| POST | `/api/blogs` | Create blog manually |
| GET | `/api/blogs/[id]` | Get blog detail |
| PUT | `/api/blogs/[id]` | Update blog |
| DELETE | `/api/blogs/[id]` | Delete blog |
| POST | `/api/ai/generate` | Generate blog with AI pipeline |
| GET | `/api/analytics` | Get analytics data |
| GET/POST | `/api/platforms` | Manage publishing platforms |
| GET/POST/DELETE | `/api/schedule` | Manage schedules |

## Database Schema

Key models: `User`, `Organization`, `Blog`, `Platform`, `Publication`, `Schedule`, `BlogAnalytics`, `JobLog`

See `prisma/schema.prisma` for the complete schema.

## Environment Variables

See `.env.example` for all required and optional variables.

## License

MIT
