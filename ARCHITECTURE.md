# AGRINET RURALPAY — System Architecture

> **Canonical architecture reference. Every engineering decision must align with this document.**
> Update when architecture evolves. All PRs must preserve the patterns described here.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [User Roles](#2-user-roles)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Database Architecture](#5-database-architecture)
6. [Authentication Flow](#6-authentication-flow)
7. [Payment Flow](#7-payment-flow)
8. [Commodity Flow](#8-commodity-flow)
9. [Traceability Flow](#9-traceability-flow)
10. [Climate Intelligence Flow](#10-climate-intelligence-flow)
11. [Marketplace Flow](#11-marketplace-flow)
12. [External Integrations](#12-external-integrations)
13. [Deployment Architecture](#13-deployment-architecture)
14. [Security Architecture](#14-security-architecture)
15. [Data Flow Diagrams](#15-data-flow-diagrams)

---

## 1. System Overview

AGRINET RURALPAY is a multi-tenant, multi-role enterprise SaaS platform built as a **Next.js 15 App Router** application backed by **Supabase** (PostgreSQL + Auth + Edge Functions + Realtime).

The system consists of **7 integrated applications** sharing a single codebase, database, and authentication layer, differentiated by role-based routing:

```
agrinet-ruralpay/
├── Public Website          → /
├── Farmer Portal           → /farmer/*
├── Agent Portal            → /agent/*
├── Hub Management          → /hub/*
├── Marketplace             → /marketplace/*
├── Finance Engine          → /finance/*
├── Executive Dashboard     → /admin/*
└── Climate Intelligence    → /climate/*
```

All applications share:
- Supabase PostgreSQL database (single schema, multi-tenant RLS)
- Supabase Auth (JWT with custom claims for roles)
- Supabase Realtime (live updates for payments, alerts, IoT)
- Supabase Edge Functions (server-side logic, webhooks, scheduled jobs)
- Zustand global state
- Shadcn/Tailwind design system

---

## 2. User Roles

### Role Hierarchy

```
SUPER_ADMIN
    └── ADMIN
            ├── HUB_MANAGER
            ├── ANALYST
            ├── AGENT
            │     └── (manages) FARMER
            └── BUYER
```

### Role Definitions

| Role | Description | Portal Access |
|------|-------------|---------------|
| `SUPER_ADMIN` | Platform owner. Full system access. | All portals |
| `ADMIN` | Organization admin. Manages agents, hubs, buyers. | Admin, all portals read |
| `AGENT` | Field agent. Onboards farmers, procures commodities. | Agent Portal |
| `FARMER` | Registered farmer. Views own data only. | Farmer Portal |
| `BUYER` | Commodity buyer (brewery, processor, exporter). | Marketplace |
| `HUB_MANAGER` | Manages a specific AgriHub. | Hub Management |
| `ANALYST` | Read-only analytics access. | Executive Dashboard |

### Permission Matrix

| Permission | SUPER_ADMIN | ADMIN | AGENT | FARMER | BUYER | HUB_MANAGER | ANALYST |
|------------|:-----------:|:-----:|:-----:|:------:|:-----:|:-----------:|:-------:|
| farmers:create | ✓ | ✓ | ✓ | — | — | — | — |
| farmers:read | ✓ | ✓ | ✓ (own) | ✓ (self) | — | — | ✓ |
| farmers:update | ✓ | ✓ | ✓ (own) | ✓ (self) | — | — | — |
| procurement:create | ✓ | ✓ | ✓ | — | — | — | — |
| procurement:approve | ✓ | ✓ | — | — | — | — | — |
| payments:initiate | ✓ | ✓ | ✓ | — | — | — | — |
| payments:approve | ✓ | ✓ | — | — | — | — | — |
| marketplace:bid | ✓ | ✓ | — | — | ✓ | — | — |
| marketplace:list | ✓ | ✓ | — | — | ✓ | — | ✓ |
| hub:manage | ✓ | ✓ | — | — | — | ✓ | — |
| analytics:read | ✓ | ✓ | — | — | — | — | ✓ |
| finance:score | ✓ | ✓ | — | — | — | — | ✓ |
| finance:approve | ✓ | ✓ | — | — | — | — | — |

---

## 3. Frontend Architecture

### Technology Stack

```
Next.js 15 (App Router)
├── React 19
├── TypeScript (strict)
├── TailwindCSS 3 + custom theme
├── Shadcn UI (Radix primitives)
├── Zustand (global state)
├── React Hook Form + Zod (forms)
├── Recharts (data visualization)
├── Mapbox GL JS (maps)
├── Lucide React (icons)
└── next-themes (dark/light mode)
```

### Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public website — no auth required
│   ├── (auth)/                   # Auth pages — unauthenticated only
│   ├── (farmer)/                 # Farmer portal — role: FARMER
│   ├── (agent)/                  # Agent portal — role: AGENT
│   ├── (hub)/                    # Hub management — role: HUB_MANAGER
│   ├── (marketplace)/            # Marketplace — role: BUYER or higher
│   ├── (finance)/                # Finance engine — role: ADMIN or higher
│   ├── (climate)/                # Climate dashboard — role: AGENT or higher
│   ├── (admin)/                  # Executive dashboard — role: ADMIN+ANALYST
│   ├── (trace)/                  # Public traceability scan pages
│   └── api/                      # Next.js API Routes (server-side)
├── components/
│   ├── ui/                       # Shadcn base components
│   ├── public/                   # Public website components
│   ├── auth/                     # Auth forms and guards
│   ├── farmer/                   # Farmer portal components
│   ├── agent/                    # Agent portal components
│   ├── hub/                      # Hub management components
│   ├── marketplace/              # Marketplace components
│   ├── finance/                  # Finance components
│   ├── climate/                  # Climate components
│   ├── admin/                    # Admin dashboard components
│   ├── traceability/             # Traceability components
│   ├── payments/                 # Payment components
│   └── notifications/            # Notification components
├── lib/
│   ├── supabase/                 # Supabase clients (browser, server, middleware)
│   ├── auth/                     # Auth helpers, RBAC, session
│   ├── payments/                 # Payment engine and providers
│   ├── finance/                  # Credit scoring, loan calculator
│   ├── climate/                  # OpenWeather client, alert engine
│   ├── traceability/             # Batch and QR generators
│   ├── notifications/            # Twilio, WhatsApp, in-app
│   ├── grn/                      # GRN generator
│   ├── qr/                       # QR code utilities
│   └── validations/              # Zod schemas for all entities
├── store/                        # Zustand stores
│   ├── authStore.ts
│   ├── farmerStore.ts
│   ├── agentStore.ts
│   ├── marketplaceStore.ts
│   └── notificationStore.ts
├── types/                        # Global TypeScript types
│   ├── database.types.ts         # Supabase generated types
│   ├── auth.types.ts
│   ├── payment.types.ts
│   └── index.ts
└── hooks/                        # Custom React hooks
    ├── useAuth.ts
    ├── usePermissions.ts
    ├── useFarmer.ts
    ├── useRealtime.ts
    └── useGeolocation.ts
```

### Routing Architecture

All routes protected by `middleware.ts` which:
1. Refreshes Supabase session
2. Checks authentication status
3. Validates role against route group
4. Redirects unauthorized requests

Route group → required role mapping:
```
/(auth)/*          → must NOT be authenticated (redirect to dashboard)
/(farmer)/*        → FARMER, AGENT, ADMIN, SUPER_ADMIN
/(agent)/*         → AGENT, ADMIN, SUPER_ADMIN
/(hub)/*           → HUB_MANAGER, ADMIN, SUPER_ADMIN
/(marketplace)/*   → BUYER, ADMIN, SUPER_ADMIN
/(finance)/*       → ADMIN, SUPER_ADMIN
/(climate)/*       → AGENT, FARMER, ADMIN, SUPER_ADMIN
/(admin)/*         → ADMIN, ANALYST, SUPER_ADMIN
/(trace)/*         → public (no auth)
```

### State Management

```
Zustand Store
├── authStore        → user, role, permissions, session
├── farmerStore      → farmer profile, wallet, sales
├── agentStore       → procurement list, farmer list, inventory
├── marketplaceStore → listings, bids, contracts
└── notificationStore→ unread count, notification list
```

Server state (data fetching) handled by:
- Next.js Server Components (initial page load)
- API Routes (`/api/*`) for mutations
- Supabase Realtime subscriptions for live updates

### Design System

Theme tokens defined in `tailwind.config.ts`:
```
Colors:
  primary:   #1B5E20 (Forest Green)
  secondary: #F9A825 (Gold)
  accent:    #5D4037 (Earth Brown)
  
Dark mode: class-based via next-themes

Typography: Inter (body), Plus Jakarta Sans (headings)

Border radius: lg (0.5rem) default

Glassmorphism utility:
  .glass { backdrop-blur-md bg-white/10 border border-white/20 }
```

---

## 4. Backend Architecture

### Supabase Architecture

```
Supabase Project
├── PostgreSQL 15
│   ├── public schema (all tables)
│   ├── Row Level Security (RLS) on every table
│   ├── PostGIS extension (GPS coordinates)
│   └── pg_cron (scheduled jobs)
├── Supabase Auth
│   ├── JWT with custom claims (role, permissions)
│   └── Email + Phone OTP providers
├── Supabase Edge Functions (Deno)
│   ├── on-user-created      → assign role, create profile
│   ├── climate-sync         → hourly weather data fetch
│   ├── send-alerts          → dispatch climate alerts
│   ├── notify-farmer        → payment notification
│   ├── notify-agent         → procurement notification
│   └── notify-buyer         → order notification
├── Supabase Storage
│   ├── farmer-documents     → ID photos, farm photos
│   ├── commodity-photos     → grading photos
│   └── certificates         → traceability certificates
└── Supabase Realtime
    ├── payments channel     → live payment status
    ├── iot channel          → hub telemetry
    └── notifications channel→ real-time alerts
```

### API Routes Architecture

Next.js API Routes follow RESTful conventions:

```
/api/
├── auth/
│   ├── session              GET  — current session
│   └── signout              POST — sign out
├── farmer/
│   ├── profile              GET, PUT
│   ├── wallet               GET
│   └── sales                GET
├── agent/
│   ├── farmers              GET, POST
│   ├── procurement          GET, POST
│   └── grn                  POST — generate GRN
├── hub/
│   ├── status               GET
│   ├── devices              GET
│   └── telemetry            POST
├── marketplace/
│   ├── listings             GET, POST
│   ├── bids                 GET, POST
│   ├── contracts            GET, POST
│   └── orders               GET, POST
├── finance/
│   ├── credit-score         GET, POST
│   ├── loans                GET, POST
│   └── insurance            GET, POST
├── payments/
│   ├── initiate             POST
│   ├── verify               POST
│   └── webhook              POST (provider callbacks)
├── traceability/
│   ├── batch                GET, POST
│   └── scan/[batchId]       GET
├── climate/
│   ├── forecast             GET
│   ├── alerts               GET
│   └── ndvi                 GET
├── admin/
│   └── analytics            GET
└── notifications/
    ├── (root)               GET, POST
    └── preferences          GET, PUT
```

All API Routes:
- Validate session via Supabase server client
- Check permissions via `src/lib/auth/rbac.ts`
- Validate request body via Zod schemas
- Log to `audit_logs` table on mutations
- Return consistent error format: `{ error: string, code: string }`

---

## 5. Database Architecture

### Schema Overview

```
PostgreSQL (Supabase)
│
├── IDENTITY & ACCESS
│   ├── users              (extends auth.users)
│   ├── roles
│   ├── permissions
│   ├── role_permissions
│   └── user_roles
│
├── GEOGRAPHY
│   ├── regions
│   ├── districts
│   └── villages
│
├── PEOPLE
│   ├── farmers
│   ├── agents
│   ├── agent_villages
│   └── buyers
│
├── INFRASTRUCTURE
│   ├── farms
│   ├── storage_hubs
│   └── iot_devices
│
├── COMMODITIES
│   ├── commodities
│   ├── commodity_grades
│   ├── inventory
│   └── commodity_batches
│
├── TRACEABILITY
│   ├── traceability
│   └── batch_events
│
├── FINANCE
│   ├── wallets
│   ├── transactions
│   ├── payments
│   ├── credit_scores
│   ├── loans
│   └── insurance
│
├── MARKETPLACE
│   ├── marketplace_orders
│   ├── bids
│   └── contracts
│
├── CLIMATE
│   ├── weather_data
│   └── alerts
│
└── SYSTEM
    ├── notifications
    ├── notification_templates
    └── audit_logs
```

### Key Design Decisions

1. **Multi-tenant isolation via RLS**: Every table has RLS policies. Farmers see only their rows. Agents see only their assigned farmers. Admins see all rows in their organization.

2. **Soft deletes**: All domain tables use `deleted_at TIMESTAMP` instead of hard deletes to preserve audit history.

3. **PostGIS for GPS**: Farm and hub coordinates stored as `GEOMETRY(POINT, 4326)` for spatial queries.

4. **JSONB for flexibility**: IoT telemetry, payment provider metadata, and climate data extras stored as JSONB.

5. **Optimistic locking**: Inventory updates use row versioning (`version INTEGER`) to prevent race conditions.

6. **Audit trail**: Every INSERT/UPDATE/DELETE on domain tables fires a trigger that writes to `audit_logs`.

### Core Table Schemas (key tables)

**farmers**
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID REFERENCES auth.users(id)
agent_id        UUID REFERENCES agents(id)
village_id      UUID REFERENCES villages(id)
first_name      TEXT NOT NULL
last_name       TEXT NOT NULL
phone           TEXT NOT NULL UNIQUE
ghana_card_id   TEXT
date_of_birth   DATE
gender          TEXT CHECK (gender IN ('male','female','other'))
photo_url       TEXT
digital_id      TEXT UNIQUE -- QR payload
wallet_id       UUID REFERENCES wallets(id)
credit_score    INTEGER DEFAULT 0
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMPTZ DEFAULT now()
updated_at      TIMESTAMPTZ DEFAULT now()
deleted_at      TIMESTAMPTZ
```

**commodity_batches**
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
batch_id        TEXT UNIQUE NOT NULL -- human-readable: AGN-2024-0001
farmer_id       UUID REFERENCES farmers(id)
agent_id        UUID REFERENCES agents(id)
hub_id          UUID REFERENCES storage_hubs(id)
commodity_id    UUID REFERENCES commodities(id)
grade_id        UUID REFERENCES commodity_grades(id)
quantity_kg     DECIMAL(10,2) NOT NULL
moisture_pct    DECIMAL(4,2)
purchase_price  DECIMAL(12,2) NOT NULL
total_value     DECIMAL(14,2) NOT NULL
gps_lat         DECIMAL(10,7)
gps_lng         DECIMAL(10,7)
location        GEOMETRY(POINT, 4326)
grn_number      TEXT UNIQUE
qr_code_url     TEXT
status          TEXT DEFAULT 'received'
  -- received | graded | stored | sold | exported
created_at      TIMESTAMPTZ DEFAULT now()
updated_at      TIMESTAMPTZ DEFAULT now()
```

**payments**
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
farmer_id       UUID REFERENCES farmers(id)
batch_id        UUID REFERENCES commodity_batches(id)
amount          DECIMAL(12,2) NOT NULL
currency        TEXT DEFAULT 'GHS'
provider        TEXT NOT NULL
  -- mtn | telecel | airteltigo | bank
provider_ref    TEXT
phone_number    TEXT
account_number  TEXT
status          TEXT DEFAULT 'pending'
  -- pending | processing | successful | failed | reversed
initiated_at    TIMESTAMPTZ DEFAULT now()
completed_at    TIMESTAMPTZ
failure_reason  TEXT
metadata        JSONB
```

---

## 6. Authentication Flow

```
Browser                    Next.js                    Supabase Auth
   │                          │                            │
   │  POST /auth/login         │                            │
   │ ─────────────────────────>│                            │
   │                          │  signInWithPassword()      │
   │                          │ ──────────────────────────>│
   │                          │                            │ verify credentials
   │                          │  { session, user }         │
   │                          │ <──────────────────────────│
   │                          │                            │
   │                          │ fetch user_roles           │
   │                          │ ──────────────────────────>│ (Supabase DB)
   │                          │  { role, permissions }     │
   │                          │ <──────────────────────────│
   │                          │                            │
   │  Set-Cookie: sb-token    │                            │
   │ <─────────────────────────│                            │
   │                          │                            │
   │  GET /farmer/dashboard    │                            │
   │ ─────────────────────────>│                            │
   │                          │ middleware.ts              │
   │                          │  verifySession()           │
   │                          │  checkRole(FARMER)         │
   │                          │  → allowed                 │
   │  200 Dashboard           │                            │
   │ <─────────────────────────│                            │
```

**JWT Custom Claims** (set via `on-user-created` edge function):
```json
{
  "sub": "user-uuid",
  "role": "AGENT",
  "permissions": ["farmers:create", "procurement:create", "payments:initiate"],
  "organization_id": "org-uuid",
  "iat": 1700000000,
  "exp": 1700003600
}
```

**Session Refresh**: Supabase middleware refreshes the session on every server request, ensuring tokens stay valid during active sessions.

---

## 7. Payment Flow

```
Agent                 API Route              Payment Engine         MoMo Provider
  │                      │                        │                      │
  │ POST /api/payments/  │                        │                      │
  │ initiate             │                        │                      │
  │ ─────────────────────>                        │                      │
  │                      │ validateRequest()      │                      │
  │                      │ checkGRNApproved()     │                      │
  │                      │ createTransaction()    │                      │
  │                      │ ─────────────────────────>                    │
  │                      │                        │ selectProvider()      │
  │                      │                        │ ──────────────────────>
  │                      │                        │                      │ initiate()
  │                      │                        │ { provider_ref }      │
  │                      │                        │ <──────────────────────
  │                      │ updateStatus(PROCESSING)                      │
  │                      │ <─────────────────────────                    │
  │ { txn_id: "..." }    │                        │                      │
  │ <─────────────────────                        │                      │
  │                      │                        │                      │
  │                      │ POST /api/payments/    │                      │
  │                      │ webhook ←──────────────────────────────────────
  │                      │                        │                      │
  │                      │ verifySignature()      │                      │
  │                      │ updateStatus(SUCCESS)  │                      │
  │                      │ creditFarmerWallet()   │                      │
  │                      │ sendNotification()     │                      │
  │                      │ updateInventory()      │                      │
  │                      │                        │                      │
```

**Payment Status State Machine:**
```
PENDING → PROCESSING → SUCCESSFUL
                    ↘ FAILED → (manual retry) → PROCESSING
```

**Provider Abstraction Layer** (`src/lib/payments/providers/index.ts`):
```typescript
interface PaymentProvider {
  initiate(params: PaymentParams): Promise<PaymentResult>
  verify(ref: string): Promise<PaymentStatus>
  reverse(ref: string): Promise<void>
}
```
Each provider (MTN, Telecel, AirtelTigo, Bank) implements this interface.

---

## 8. Commodity Flow

```
FARM                  FIELD                 HUB                   MARKET
  │                     │                    │                       │
  │  Harvest            │                    │                       │
  │ ─────────────────── │                    │                       │
  │                     │ Agent procures     │                       │
  │                     │ Weighs + grades    │                       │
  │                     │ Records GPS        │                       │
  │                     │ Creates batch      │                       │
  │                     │ ──────────────────>│                       │
  │                     │                    │ Receives delivery     │
  │                     │                    │ Checks moisture       │
  │                     │                    │ Updates inventory     │
  │                     │                    │ Issues GRN            │
  │                     │                    │ ──────────────────────>
  │                     │                    │                       │ Buyer sees listing
  │                     │                    │                       │ Places bid/order
  │                     │                    │ ←──────────────────────
  │                     │                    │ Updates batch status  │
  │                     │                    │ Schedules logistics   │
  │                     │                    │ ──────────────────────>
  │                     │                    │                       │ Commodity delivered
```

**Batch Status States:**
```
received → graded → stored → reserved → sold → exported
```

---

## 9. Traceability Flow

Every commodity batch receives a globally unique identifier and QR code at creation time:

```
Batch Created
     │
     ▼
Generate Batch ID (AGN-YYYY-NNNN)
     │
     ▼
Generate QR Code (encodes: batchId, farmerId, commodityId, GPS, date)
     │
     ▼
Write traceability record (initial event: RECEIVED)
     │
     ▼
As batch moves:
  RECEIVED → GRADED → STORED → SOLD → SHIPPED → DELIVERED
  Each transition writes a batch_event with:
    - timestamp
    - GPS coordinates
    - actor (agent/hub_manager/buyer)
    - notes
     │
     ▼
Public scan page: /trace/scan/[batchId]
  Shows: origin farm, farmer, commodity, grade, all events, GPS map
```

---

## 10. Climate Intelligence Flow

```
OpenWeather API           Edge Function              Database            Users
      │                    (climate-sync)                │                 │
      │ ←── GET forecast ──                              │                 │
      │ ─── weather data ──>                             │                 │
      │                    │ parse & normalize           │                 │
      │                    │ ────────────────────────────>                 │
      │                    │ upsert weather_data         │                 │
      │                    │                             │                 │
      │                    │ check thresholds            │                 │
      │                    │ (rain < 20mm, temp > 38°C)  │                 │
      │                    │ ────────────────────────────>                 │
      │                    │ insert alerts               │                 │
      │                    │                             │                 │
      │                    │ ──── trigger send-alerts ──>                  │
      │                    │                             │ query farmers  │
      │                    │                             │ in region ─────>
      │                    │                             │                 │ SMS via Twilio
      │                    │                             │                 │ WhatsApp msg
      │                    │                             │                 │ In-app alert
```

**Scheduled**: `climate-sync` runs every hour via `pg_cron`.
**Alert types**: DROUGHT_WARNING, FLOOD_RISK, PEST_ALERT, FROST_ALERT, HIGH_TEMPERATURE, PLANTING_ADVISORY, HARVEST_ADVISORY.

---

## 11. Marketplace Flow

```
Seller (Admin/Hub)               Platform                      Buyer
        │                            │                             │
        │ Create listing              │                             │
        │ (commodity, qty, price)     │                             │
        │ ────────────────────────────>                             │
        │                            │ publish listing             │
        │                            │ ─────────────────────────────>
        │                            │                             │ Browse listings
        │                            │                             │ Place bid
        │                            │ <─────────────────────────────
        │                            │                             │
        │ Notified of bid            │                             │
        │ <────────────────────────────                             │
        │                            │                             │
        │ Accept bid                 │                             │
        │ ────────────────────────────>                             │
        │                            │ create contract             │
        │                            │ generate purchase order     │
        │                            │ schedule logistics          │
        │                            │ ─────────────────────────────>
        │                            │                             │ Contract signed
        │                            │                             │ Payment initiated
```

**Order States:** `pending → accepted → contracted → logistics → delivered → complete`

---

## 12. External Integrations

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| **Supabase** | Database, Auth, Storage, Realtime, Edge Functions | `@supabase/supabase-js` |
| **Mapbox** | Interactive maps, GPS visualization, routing | `mapbox-gl`, `react-map-gl` |
| **OpenWeather API** | Weather forecasts, historical climate data | REST API via Edge Function |
| **Twilio** | SMS notifications to farmers and agents | `twilio` SDK in Edge Functions |
| **WhatsApp Cloud API** | WhatsApp messages for alerts and receipts | REST API via Edge Function |
| **MTN Mobile Money** | Farmer payments (Ghana MoMo) | REST API (sandbox → production) |
| **Telecel Cash** | Farmer payments | REST API |
| **AirtelTigo Money** | Farmer payments | REST API |
| **Bank Transfer** | Bulk transfers | REST API (Ghana Interbank) |
| **QR Code** | Batch traceability, farmer digital ID | `qrcode` npm package |

### Integration Configuration

All external service credentials stored in Supabase Vault and exposed as:
- Environment variables for Next.js API Routes (`NEXT_PUBLIC_*` for browser-safe, server-only otherwise)
- Supabase secrets for Edge Functions (`Deno.env.get()`)

### Environment Variables Required

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=

# OpenWeather
OPENWEATHER_API_KEY=

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# WhatsApp
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=

# MTN MoMo
MTN_MOMO_API_KEY=
MTN_MOMO_SUBSCRIPTION_KEY=
MTN_MOMO_ENVIRONMENT=sandbox

# Telecel
TELECEL_API_KEY=
TELECEL_MERCHANT_ID=

# AirtelTigo
AIRTELTIGO_API_KEY=
AIRTELTIGO_MERCHANT_CODE=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=AGRINET RURALPAY
```

---

## 13. Deployment Architecture

### Production

```
GitHub (main branch)
       │
       ▼ GitHub Actions (CI: lint, type-check, test, build)
       │
       ▼ Vercel (Next.js deployment)
       │  ├── Edge Middleware (route protection)
       │  ├── Server Components (SSR)
       │  ├── API Routes (serverless functions)
       │  └── Static Assets (CDN)
       │
       ▼ Supabase Cloud (managed)
          ├── PostgreSQL
          ├── Auth
          ├── Storage
          ├── Realtime
          └── Edge Functions (Deno Deploy)
```

### Vercel Configuration

```json
{
  "framework": "nextjs",
  "regions": ["fra1"],
  "env": { ... },
  "headers": [
    { "source": "/api/(.*)", "headers": [{ "key": "Cache-Control", "value": "no-store" }] }
  ]
}
```

### Local Development

```
Docker Compose
├── supabase (local stack)
│   ├── db (PostgreSQL)
│   ├── auth (GoTrue)
│   ├── rest (PostgREST)
│   ├── realtime
│   └── storage
└── app (Next.js dev server)
```

### CI/CD Pipeline

```
Push to feature branch:
  → lint (ESLint)
  → type-check (tsc --noEmit)
  → unit tests (Jest)
  → build check (next build)

Push to main:
  → all above
  → Supabase migration (supabase db push)
  → Vercel deploy (production)
  → E2E tests (Playwright, post-deploy)
```

---

## 14. Security Architecture

### Layers of Security

1. **Authentication**: Supabase Auth (JWTs, refresh tokens, PKCE flow)
2. **Authorization**: RBAC via JWT custom claims + RLS in PostgreSQL
3. **API Protection**: Session validation on every API Route before processing
4. **Input Validation**: Zod schemas on all user inputs
5. **Rate Limiting**: Vercel Edge middleware — 60 req/min per IP on auth routes
6. **SQL Injection**: Supabase client uses parameterized queries only
7. **XSS**: React's built-in escaping + Content-Security-Policy headers
8. **CSRF**: SameSite=Strict cookies + Supabase's built-in protection
9. **Secrets**: No secrets in client bundle; all sensitive keys server-side only
10. **Audit Logging**: Every mutation logged with actor, timestamp, before/after state

### Row Level Security Policies (pattern)

```sql
-- Farmers can only read their own data
CREATE POLICY "farmers_own_data" ON farmers
  FOR SELECT USING (user_id = auth.uid());

-- Agents can read farmers they onboarded
CREATE POLICY "agents_read_own_farmers" ON farmers
  FOR SELECT USING (
    agent_id IN (
      SELECT id FROM agents WHERE user_id = auth.uid()
    )
  );

-- Admins can read all farmers in their organization
CREATE POLICY "admins_read_all_farmers" ON farmers
  FOR ALL USING (
    (SELECT role FROM user_roles WHERE user_id = auth.uid()) 
    IN ('ADMIN', 'SUPER_ADMIN')
  );
```

### Payment Security

- Payment amounts validated server-side against GRN value
- Provider webhook signatures verified before processing
- Payment state machine enforced in database (cannot skip states)
- Duplicate payment detection via idempotency keys

---

## 15. Data Flow Diagrams

### Complete System Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                  │
│  Browser (Next.js) │ Mobile Browser │ WhatsApp │ SMS           │
└────────────┬────────────────────────────────────────────────────┘
             │ HTTPS
┌────────────▼────────────────────────────────────────────────────┐
│                      VERCEL EDGE                                │
│  Middleware (auth check, rate limit, route protection)          │
└────────────┬────────────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────────────┐
│                   NEXT.JS APP (VERCEL)                          │
│                                                                 │
│  Server Components ──► API Routes ──► Supabase Server Client   │
│  Client Components ──► API Routes ──► Supabase Browser Client  │
│                                  └──► External APIs            │
└────────────┬────────────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────────────┐
│                      SUPABASE                                   │
│                                                                 │
│  Auth ──► JWT validation                                        │
│  PostgreSQL ──► RLS ──► Data                                    │
│  Edge Functions ──► Webhooks, Schedules                         │
│  Realtime ──► WebSocket ──► Client subscriptions               │
│  Storage ──► Farmer photos, documents, certificates             │
└────────────┬────────────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                               │
│                                                                 │
│  Mapbox ──► Map tiles, geocoding                                │
│  OpenWeather ──► Forecast data                                  │
│  Twilio ──► SMS                                                 │
│  WhatsApp Cloud API ──► Messages                                │
│  MTN/Telecel/AirtelTigo ──► Mobile money                        │
└─────────────────────────────────────────────────────────────────┘
```

---

*Last updated: 2026-06-21*
*Maintained by: Engineering Team*
*Reference: TASKS.md for milestone tracking, PRODUCT_REQUIREMENTS.md for feature scope*
