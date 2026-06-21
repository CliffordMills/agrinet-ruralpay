# AGRINET RURALPAY — Product Requirements Document

> **Canonical product specification. All features must trace back to a requirement here.**
> Reference this document before implementing any feature. Update when requirements change.

---

## Table of Contents

1. [Business Objectives](#1-business-objectives)
2. [User Personas](#2-user-personas)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [Security Requirements](#5-security-requirements)
6. [Scalability Requirements](#6-scalability-requirements)
7. [Future Expansion Requirements](#7-future-expansion-requirements)
8. [Acceptance Criteria](#8-acceptance-criteria)
9. [Out of Scope](#9-out-of-scope)

---

## 1. Business Objectives

### Primary Mission

Build Africa's largest village-level commodity origination infrastructure, digitizing the first-mile agricultural supply chain from farmgate to export market.

### Strategic Objectives

| ID | Objective | Metric | Target |
|----|-----------|--------|--------|
| BO-01 | Digitize farmgate payments | % of payments via platform | 80% in coverage areas |
| BO-02 | Aggregate commodity at village level | Villages connected | 500 in Year 1 |
| BO-03 | Reduce payment time from delivery to receipt | Days to payment | < 24 hours |
| BO-04 | Enable commodity traceability | % of batches traceable | 100% |
| BO-05 | Connect farmers to formal markets | Unique buyers on platform | 50 in Year 1 |
| BO-06 | Extend financial services to unbanked farmers | Farmers with credit score | 10,000 in Year 1 |
| BO-07 | Provide climate advisory to improve yields | Farmers receiving alerts | All registered farmers |
| BO-08 | Build warehouse receipt financing | Active WRF facilities | 20 in Year 1 |

### Revenue Streams

1. **Transaction fees**: 0.5–1.5% on commodity transactions
2. **SaaS subscription**: Per-buyer and per-hub monthly fee
3. **Finance origination**: Fee on loans and insurance
4. **Data services**: Aggregated commodity and climate analytics
5. **Premium advisory**: Advanced climate and market intelligence

### Market Context

- **Primary market**: Ghana (10 agricultural regions)
- **Target crops**: Maize, Soybean, Sesame, Cashew, Sorghum, Shea nuts, Cocoa
- **Target users**: Smallholder farmers (0.5–5 hectares), rural field agents, commodity processors, exporters
- **Regulatory context**: Bank of Ghana payment regulations, MOFA commodity standards

---

## 2. User Personas

### Persona 1: Abena — Smallholder Farmer

- **Age**: 42 | **Location**: Tamale, Northern Region
- **Education**: Primary school | **Phone**: Basic smartphone (Android Go)
- **Language**: Dagbani + basic English
- **Farm size**: 2 hectares (maize + soybean)
- **Income**: GHS 4,000–8,000/year from farm
- **Pain points**:
  - Gets paid in cash weeks after delivery — loses money to middlemen
  - No proof of sales or income for bank loans
  - No weather information — loses crops to unexpected rains
  - No formal identity — cannot access financial services
- **Goals**:
  - Get paid quickly and securely after selling
  - Build a credit history to access input loans
  - Receive planting and weather advice
  - Have a digital identity and sales record
- **Usage pattern**: Checks portal monthly; relies on agent for onboarding

### Persona 2: Kwame — Field Agent

- **Age**: 29 | **Location**: Kintampo, Bono East Region
- **Education**: Senior High School | **Phone**: Mid-range Android smartphone
- **Covers**: 3 villages, ~120 registered farmers
- **Daily tasks**: Farm visits, commodity procurement, farmer payments, input distribution
- **Pain points**:
  - Paper-based receipts — errors and disputes
  - Manual weight recording — prone to fraud
  - Long wait times for payment approvals
  - No digital records of farmers under his care
- **Goals**:
  - Quickly register new farmers on the go
  - Record procurement with GPS accuracy
  - Initiate payments immediately after delivery
  - Track his performance and commissions
- **Usage pattern**: Daily active user; mobile-first

### Persona 3: Emmanuel — Hub Manager

- **Age**: 35 | **Location**: Bolgatanga, Upper East Region
- **Education**: HND Agriculture | **Phone**: Tablet + desktop
- **Manages**: 1 AgriHub with 500-tonne capacity
- **Pain points**:
  - Manual stock takes — inaccurate inventory
  - No remote monitoring of temperature/humidity
  - Difficult to communicate storage capacity to buyers
  - Poor visibility of incoming deliveries
- **Goals**:
  - Monitor hub inventory and environmental conditions remotely
  - Know capacity in real-time to accept or reject deliveries
  - Communicate available stock to marketplace buyers
  - Track all incoming and outgoing batches
- **Usage pattern**: Daily desktop + mobile; real-time monitoring

### Persona 4: Ama — Commodity Buyer (Brewery)

- **Age**: 38 | **Location**: Accra, Greater Accra Region
- **Organization**: Accra Breweries Ltd
- **Role**: Procurement Manager
- **Pain points**:
  - Inconsistent commodity quality — no standardized grading
  - No traceability — cannot verify origin or handling
  - Relationship-based procurement — limited competition
  - Logistics unreliable — no visibility
- **Goals**:
  - Browse verified, graded commodity inventory
  - Place competitive bids and secure forward contracts
  - Access traceability certificates for quality assurance
  - Schedule and track logistics
- **Usage pattern**: Weekly; desktop-first

### Persona 5: Kofi — Finance Analyst (Admin)

- **Age**: 32 | **Location**: Accra (HQ)
- **Role**: Platform Analyst / Operations
- **Pain points**:
  - No unified view of payment flows across regions
  - Cannot identify underperforming agents without manual reports
  - Climate events affect procurement but no correlation data exists
- **Goals**:
  - View national commodity flow and payment analytics
  - Identify top-performing agents and regions
  - Correlate climate events with procurement patterns
  - Generate investor reports
- **Usage pattern**: Daily desktop user

### Persona 6: Yaa — Platform Super Admin

- **Age**: 45 | **Location**: Accra (HQ)
- **Role**: CTO / Platform Owner
- **Needs**:
  - Full system visibility across all modules
  - Manage users, roles, and permissions
  - Configure commodities, grades, pricing benchmarks
  - Audit all system actions
- **Usage pattern**: Daily; requires full platform access

---

## 3. Functional Requirements

### FR-PW: Public Website

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PW-01 | Home page with hero, statistics, interactive map, CTA | Must Have |
| FR-PW-02 | About page with company mission, team, milestones | Must Have |
| FR-PW-03 | How It Works page with step-by-step visual flow | Must Have |
| FR-PW-04 | Solutions page describing each platform module | Must Have |
| FR-PW-05 | Impact page with real metrics, stories, testimonials | Must Have |
| FR-PW-06 | Partners page with logos and partnership tiers | Should Have |
| FR-PW-07 | Pricing page with tier comparison table | Must Have |
| FR-PW-08 | FAQ page with searchable accordion | Must Have |
| FR-PW-09 | Contact page with form submission to Supabase | Must Have |
| FR-PW-10 | Book Demo page with calendar-linked form | Must Have |
| FR-PW-11 | Newsletter subscription with email capture | Should Have |
| FR-PW-12 | Dark/light mode toggle | Must Have |
| FR-PW-13 | Fully responsive (mobile, tablet, desktop) | Must Have |
| FR-PW-14 | SEO meta tags on all pages | Should Have |

### FR-AUTH: Authentication & RBAC

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AUTH-01 | Email + password registration with email verification | Must Have |
| FR-AUTH-02 | Login with email + password | Must Have |
| FR-AUTH-03 | Forgot password / reset password flow | Must Have |
| FR-AUTH-04 | Role assignment on registration (selectable or admin-assigned) | Must Have |
| FR-AUTH-05 | JWT with custom claims (role, permissions) | Must Have |
| FR-AUTH-06 | Route-level RBAC enforcement via middleware | Must Have |
| FR-AUTH-07 | Component-level permission checks via RoleGuard | Must Have |
| FR-AUTH-08 | Rate limiting on auth endpoints (5 attempts then lockout) | Must Have |
| FR-AUTH-09 | Audit log on all auth events | Must Have |
| FR-AUTH-10 | Session auto-refresh during active use | Must Have |

### FR-FP: Farmer Portal

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-FP-01 | Dashboard with wallet balance, lifetime earnings, credit score | Must Have |
| FR-FP-02 | Farmer profile page (editable personal information) | Must Have |
| FR-FP-03 | Digital ID card with QR code (printable) | Must Have |
| FR-FP-04 | Wallet page with balance and transaction history | Must Have |
| FR-FP-05 | Sales history with commodity, quantity, price, date | Must Have |
| FR-FP-06 | Yield history chart (monthly and seasonal) | Must Have |
| FR-FP-07 | Climate alerts page (active alerts for farmer's region) | Must Have |
| FR-FP-08 | Loan eligibility page with credit score and available products | Must Have |
| FR-FP-09 | Monthly sales chart (Recharts bar chart) | Must Have |
| FR-FP-10 | Income trend chart (Recharts line chart) | Must Have |

### FR-AP: Agent Portal

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AP-01 | Dashboard with farmer count, procurement volume, payment status | Must Have |
| FR-AP-02 | Farmer list with search and filter | Must Have |
| FR-AP-03 | Farmer registration form with GPS capture | Must Have |
| FR-AP-04 | Farmer profile view | Must Have |
| FR-AP-05 | Procurement form (farmer, commodity, quantity, grade, moisture, price, GPS) | Must Have |
| FR-AP-06 | Auto-generate GRN on procurement submission | Must Have |
| FR-AP-07 | Printable GRN document | Must Have |
| FR-AP-08 | Digital receipt for farmer | Must Have |
| FR-AP-09 | Payment initiation from approved GRN | Must Have |
| FR-AP-10 | Inventory view (agent's procured stock) | Must Have |
| FR-AP-11 | Input distribution recording | Should Have |
| FR-AP-12 | Climate support view (same as farmer climate page) | Must Have |

### FR-HM: Hub Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-HM-01 | Hub list with status indicators (online/offline, capacity) | Must Have |
| FR-HM-02 | Hub detail page (capacity, occupancy, location map) | Must Have |
| FR-HM-03 | IoT device grid (list all devices with status) | Must Have |
| FR-HM-04 | Environmental gauges (temperature, humidity real-time) | Must Have |
| FR-HM-05 | Storage capacity bar (occupancy percentage) | Must Have |
| FR-HM-06 | Solar generation and battery status panel | Should Have |
| FR-HM-07 | CCTV status panel (online/offline per camera) | Should Have |
| FR-HM-08 | Internet connectivity status | Should Have |
| FR-HM-09 | Hub inventory by commodity and batch | Must Have |
| FR-HM-10 | Alerts panel (threshold breaches) | Must Have |
| FR-HM-11 | Mapbox map of all hub locations | Must Have |

### FR-MP: Marketplace

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-MP-01 | Commodity listing browser with filters (type, grade, region, price) | Must Have |
| FR-MP-02 | Listing detail page with traceability link | Must Have |
| FR-MP-03 | Bid submission form | Must Have |
| FR-MP-04 | Bid management (view bids received, accept/reject) | Must Have |
| FR-MP-05 | Forward contract creation and management | Must Have |
| FR-MP-06 | Purchase order generation | Must Have |
| FR-MP-07 | Purchase order detail view | Must Have |
| FR-MP-08 | Logistics scheduling (pickup date, transporter, route) | Should Have |
| FR-MP-09 | Price chart (commodity spot price history) | Should Have |
| FR-MP-10 | Buyer type filter (brewery, processor, exporter, trader, government) | Must Have |

### FR-FE: Finance Engine

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-FE-01 | Credit score calculation using 5-factor model | Must Have |
| FR-FE-02 | Credit score display with factor breakdown chart | Must Have |
| FR-FE-03 | Loan product listing (input finance, production, asset) | Must Have |
| FR-FE-04 | Loan application form | Must Have |
| FR-FE-05 | Loan repayment schedule generation | Must Have |
| FR-FE-06 | Loan status tracking | Must Have |
| FR-FE-07 | Crop insurance enrollment | Should Have |
| FR-FE-08 | Warehouse receipt financing request | Should Have |
| FR-FE-09 | Finance dashboard (portfolio overview) | Must Have |

**Credit Scoring Model:**
| Factor | Weight |
|--------|--------|
| Volume delivered | 30% |
| Delivery consistency | 20% |
| Quality performance (grade) | 20% |
| Repayment history | 15% |
| Farm size | 15% |
Score range: 0–1000. Categories: Poor (<300), Fair (300–499), Good (500–699), Excellent (700+).

### FR-PE: Payment Engine

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PE-01 | Support MTN Mobile Money payments | Must Have |
| FR-PE-02 | Support Telecel Cash payments | Must Have |
| FR-PE-03 | Support AirtelTigo Money payments | Must Have |
| FR-PE-04 | Support bank transfer payments | Should Have |
| FR-PE-05 | Provider abstraction layer (swappable providers) | Must Have |
| FR-PE-06 | Payment status tracking (Pending, Processing, Successful, Failed) | Must Have |
| FR-PE-07 | Webhook handling for provider callbacks | Must Have |
| FR-PE-08 | Farmer wallet credit on successful payment | Must Have |
| FR-PE-09 | Payment failure handling with reason capture | Must Have |
| FR-PE-10 | Transaction receipt generation | Must Have |
| FR-PE-11 | Payment history for admin view | Must Have |
| FR-PE-12 | Idempotency — no duplicate payments on retry | Must Have |

### FR-TE: Traceability Engine

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-TE-01 | Auto-generate Batch ID on procurement (AGN-YYYY-NNNN format) | Must Have |
| FR-TE-02 | Generate QR code encoding batch data | Must Have |
| FR-TE-03 | Public QR scan page (no auth required) | Must Have |
| FR-TE-04 | Traceability timeline on scan page | Must Have |
| FR-TE-05 | GPS origin map on scan page | Must Have |
| FR-TE-06 | Farmer identity on scan page (name, village, commodity) | Must Have |
| FR-TE-07 | Batch event logging at each stage transition | Must Have |
| FR-TE-08 | Downloadable batch certificate | Should Have |

### FR-CI: Climate Intelligence

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CI-01 | 7-day weather forecast by district | Must Have |
| FR-CI-02 | Rainfall chart (7-day and 30-day) | Must Have |
| FR-CI-03 | Temperature chart | Must Have |
| FR-CI-04 | Automatic alert generation on threshold breach | Must Have |
| FR-CI-05 | Alert types: drought, flood, pest, frost, high temp | Must Have |
| FR-CI-06 | Alert delivery via SMS (Twilio) | Must Have |
| FR-CI-07 | Alert delivery via WhatsApp | Must Have |
| FR-CI-08 | Alert delivery via in-app notification | Must Have |
| FR-CI-09 | NDVI visualization on Mapbox | Should Have |
| FR-CI-10 | Crop advisory cards (planting, harvesting, fertilizer, pest) | Must Have |
| FR-CI-11 | Yield prediction chart | Should Have |

### FR-ED: Executive Dashboard

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ED-01 | National KPI overview (farmers, volume, payments, revenue) | Must Have |
| FR-ED-02 | Regional analytics breakdown | Must Have |
| FR-ED-03 | Commodity flow map (Mapbox animated lines) | Must Have |
| FR-ED-04 | Payment volume and value charts | Must Have |
| FR-ED-05 | Farmer growth chart (cumulative over time) | Must Have |
| FR-ED-06 | Agent productivity table (volume, farmers, payments) | Must Have |
| FR-ED-07 | Climate impact correlation chart | Should Have |
| FR-ED-08 | Storage utilization chart across all hubs | Must Have |
| FR-ED-09 | Export readiness table | Should Have |
| FR-ED-10 | Downloadable reports | Should Have |

### FR-NT: Notifications

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-NT-01 | In-app notification bell with unread count | Must Have |
| FR-NT-02 | Notification drawer with list | Must Have |
| FR-NT-03 | SMS on payment approval | Must Have |
| FR-NT-04 | SMS on climate alert | Must Have |
| FR-NT-05 | WhatsApp on payment confirmation | Should Have |
| FR-NT-06 | WhatsApp on climate advisory | Should Have |
| FR-NT-07 | User notification preferences | Should Have |
| FR-NT-08 | Real-time in-app via Supabase Realtime | Must Have |

---

## 4. Non-Functional Requirements

### Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-P-01 | Page load time (LCP) on mobile 3G | < 3 seconds |
| NFR-P-02 | Time to Interactive (TTI) | < 5 seconds |
| NFR-P-03 | API response time (p95) | < 500ms |
| NFR-P-04 | Lighthouse Performance score | ≥ 85 |
| NFR-P-05 | Lighthouse Accessibility score | ≥ 90 |
| NFR-P-06 | Map load time | < 2 seconds |
| NFR-P-07 | Payment initiation response | < 3 seconds |
| NFR-P-08 | QR code generation | < 1 second |

### Reliability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-R-01 | Platform uptime | 99.5% monthly |
| NFR-R-02 | Payment processing success rate | > 98% |
| NFR-R-03 | Data loss on system failure | Zero (point-in-time recovery) |
| NFR-R-04 | Webhook retry on provider failure | 3 retries with exponential backoff |

### Accessibility

| ID | Requirement |
|----|-------------|
| NFR-A-01 | WCAG 2.1 AA compliance on all pages |
| NFR-A-02 | Full keyboard navigation |
| NFR-A-03 | Screen reader compatible (ARIA labels) |
| NFR-A-04 | Minimum contrast ratio 4.5:1 |
| NFR-A-05 | Font size minimum 16px on body text |

### Usability

| ID | Requirement |
|----|-------------|
| NFR-U-01 | Agent can complete a procurement in < 3 minutes |
| NFR-U-02 | Farmer can view wallet balance in < 2 clicks |
| NFR-U-03 | QR scan page loads and displays batch info without login |
| NFR-U-04 | All forms show inline validation errors |
| NFR-U-05 | Skeleton loaders on all async data |
| NFR-U-06 | Mobile-first layout (works on 360px viewport) |

### Internationalization

| ID | Requirement |
|----|-------------|
| NFR-I-01 | English language support (primary) |
| NFR-I-02 | SMS and WhatsApp templates in English and Twi |
| NFR-I-03 | Ghana Cedi (GHS) as primary currency |
| NFR-I-04 | Date format: DD/MM/YYYY |
| NFR-I-05 | Phone numbers in Ghana format (+233) |

---

## 5. Security Requirements

| ID | Requirement | Implementation |
|----|-------------|----------------|
| SR-01 | Authentication required for all non-public routes | Supabase Auth + middleware |
| SR-02 | Passwords minimum 8 characters, complexity enforced | Zod validation + Supabase Auth |
| SR-03 | JWTs expire after 1 hour (auto-refresh) | Supabase default |
| SR-04 | Refresh tokens expire after 7 days of inactivity | Supabase config |
| SR-05 | Row Level Security on all database tables | Supabase RLS policies |
| SR-06 | No sensitive data in client-side JavaScript bundle | Server-only env vars |
| SR-07 | All API endpoints validate session before processing | API route middleware |
| SR-08 | Input sanitization on all user-provided fields | Zod + parameterized queries |
| SR-09 | Rate limiting: 60 req/min general, 5 req/min auth | Vercel Edge middleware |
| SR-10 | Audit log for all data mutations | PostgreSQL trigger |
| SR-11 | Payment webhook signatures verified | HMAC-SHA256 verification |
| SR-12 | HTTPS enforced (HSTS header) | Vercel default |
| SR-13 | Content Security Policy headers | next.config.ts headers |
| SR-14 | No PII in URL parameters | Design enforcement |
| SR-15 | Farmer wallet transfers require payment approval step | Business logic enforcement |
| SR-16 | Admin actions require re-authentication (sudo mode) | Session elevation |
| SR-17 | Database backups daily, retained 30 days | Supabase backups |

---

## 6. Scalability Requirements

### Current Scale (Year 1)

| Metric | Target |
|--------|--------|
| Registered farmers | 50,000 |
| Active agents | 500 |
| Storage hubs | 50 |
| Monthly transactions | 100,000 |
| Monthly data volume | 5 GB |
| Concurrent users | 1,000 |

### Scale-Out Strategy

| Component | Approach |
|-----------|----------|
| Frontend | Vercel Edge — auto-scales globally |
| Database | Supabase connection pooling (PgBouncer); read replicas for analytics |
| Storage | Supabase Storage (S3-backed) — no capacity limit |
| Edge Functions | Deno Deploy — auto-scales to demand |
| Notifications | Queue-based (Supabase queue) to handle SMS bursts |
| Maps | Mapbox CDN — scales independently |

### Database Optimization

- Indexes on: `farmer_id`, `agent_id`, `hub_id`, `village_id`, `created_at`, `status` for all high-read tables
- Partitioning: `transactions`, `audit_logs` partitioned by month after 6 months
- Materialized views: `agent_productivity`, `regional_summary` refreshed hourly for dashboard
- Connection pooling: PgBouncer transaction mode, max 100 connections

---

## 7. Future Expansion Requirements

### Phase 2: West Africa Expansion

| Country | Timeline | Requirements |
|---------|----------|--------------|
| Nigeria | Year 2 | Naira currency, OPay/Flutterwave payment, Hausa language |
| Côte d'Ivoire | Year 2 | CFA Franc, Orange Money, French language |
| Burkina Faso | Year 3 | CFA Franc, Moov Money, French + Moore |
| Senegal | Year 3 | CFA Franc, Wave, French + Wolof |

**Multi-tenancy requirements for expansion:**
- Organization-level data isolation
- Per-country payment provider configuration
- Configurable commodity types and grades per country
- Language switching per organization
- Currency display per organization

### Phase 3: Platform Extensions

| Feature | Description | Timeline |
|---------|-------------|----------|
| Mobile App | React Native farmer and agent apps | Year 2 |
| Offline Mode | PWA with offline form submission and sync | Year 2 |
| Drone Integration | NDVI imagery from drone surveys | Year 2 |
| IoT SDK | Standard SDK for AgriHub sensor vendors | Year 2 |
| AI Advisory | ML-based yield prediction and pest detection | Year 3 |
| Carbon Credits | Track and monetize carbon sequestration | Year 3 |
| Exchange | Cross-platform commodity exchange | Year 3 |
| API Marketplace | Third-party developer API | Year 3 |

### Technical Debt Priorities for Scale

1. Move from Next.js API Routes to dedicated microservices for payment engine at 500K tx/month
2. Introduce Redis caching for frequently-read data (commodity prices, weather)
3. Migrate analytics to dedicated OLAP (ClickHouse) at 1M+ daily events
4. Introduce event streaming (Kafka or Supabase Realtime at scale) for IoT telemetry

---

## 8. Acceptance Criteria

### Definition of Done (per milestone)

A milestone is complete when ALL of the following are true:

- [ ] All deliverables listed in TASKS.md are implemented
- [ ] No TypeScript errors (`tsc --noEmit` exits 0)
- [ ] No ESLint errors (`eslint .` exits 0)
- [ ] `next build` succeeds
- [ ] All functional requirements for the milestone are implemented
- [ ] Mobile layout tested at 375px viewport
- [ ] Dark mode tested
- [ ] Data from Supabase renders correctly (no hardcoded mock data)
- [ ] Forms validate via Zod and show inline errors
- [ ] Route protection enforced (unauthorized access redirects)
- [ ] Committed to `claude/nice-thompson-bykx5a` branch

### Definition of Done (full platform)

- [ ] All 15 milestones complete
- [ ] E2E tests pass (Playwright)
- [ ] Unit test coverage ≥ 80% on `src/lib/`
- [ ] Lighthouse scores: Performance ≥ 85, Accessibility ≥ 90 on all pages
- [ ] Seed data populates all Ghana regions with realistic data
- [ ] CI/CD pipeline green
- [ ] Deployed to Vercel production
- [ ] README complete with setup instructions

---

## 9. Out of Scope

The following are explicitly NOT in scope for v1.0:

- Mobile native apps (iOS/Android) — deferred to Phase 2
- Offline-capable PWA — deferred to Phase 2
- Non-Ghana payment providers — deferred to Phase 2
- Drone imagery processing — deferred to Phase 2
- AI/ML models (yield prediction is rule-based in v1) — deferred to Phase 3
- Carbon credit tracking — deferred to Phase 3
- Third-party developer API — deferred to Phase 3
- Multi-language UI (Twi, Dagbani, etc.) — SMS/WhatsApp only in v1
- Real-time commodity exchange — forward contracts only in v1
- Hardware IoT device management (firmware updates, provisioning) — monitoring only

---

*Last updated: 2026-06-21*
*Product Owner: AGRINET RURALPAY Engineering Team*
*Reference: TASKS.md for milestone tracking, ARCHITECTURE.md for technical design*
