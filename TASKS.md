# AGRINET RURALPAY — Project Task Board

> **Single source of truth for all development milestones.**
> Update this file after every commit. Reference it before writing any code.

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ⬜ | Not started |
| 🔄 | In progress |
| ✅ | Complete |
| 🚫 | Blocked |

---

## Milestone Overview

| # | Milestone | Status | Branch Target |
|---|-----------|--------|---------------|
| M01 | Project Foundation & Tooling | ✅ | claude/nice-thompson-bykx5a |
| M02 | Database Schema & Migrations | ✅ | claude/nice-thompson-bykx5a |
| M03 | Authentication & RBAC | 🔄 | claude/nice-thompson-bykx5a |
| M04 | Public Website | ⬜ | claude/nice-thompson-bykx5a |
| M05 | Farmer Portal | ⬜ | claude/nice-thompson-bykx5a |
| M06 | Agent Portal | ⬜ | claude/nice-thompson-bykx5a |
| M07 | Smart AgriHub Management | ⬜ | claude/nice-thompson-bykx5a |
| M08 | Marketplace | ⬜ | claude/nice-thompson-bykx5a |
| M09 | Finance Engine | ⬜ | claude/nice-thompson-bykx5a |
| M10 | Payment Engine | ⬜ | claude/nice-thompson-bykx5a |
| M11 | Traceability Engine | ⬜ | claude/nice-thompson-bykx5a |
| M12 | Climate Intelligence Engine | ⬜ | claude/nice-thompson-bykx5a |
| M13 | Executive Dashboard | ⬜ | claude/nice-thompson-bykx5a |
| M14 | Notifications & Integrations | ⬜ | claude/nice-thompson-bykx5a |
| M15 | DevOps, Testing & Seed Data | ⬜ | claude/nice-thompson-bykx5a |

---

## M01 — Project Foundation & Tooling

**Objective:** Bootstrap the Next.js 15 monorepo with all tooling, design system, and shared infrastructure in place so every subsequent milestone builds on a stable base.

**Deliverables:**
- [x] `package.json` with all production and dev dependencies
- [x] `next.config.ts` — Next.js 15 configuration (App Router, image domains, env validation)
- [x] `tsconfig.json` — strict TypeScript configuration
- [x] `tailwind.config.ts` — custom theme (Forest Green, Gold, Earth Brown), dark mode
- [x] `postcss.config.js`
- [x] `.env.example` — all required environment variables documented
- [x] `src/lib/supabase/client.ts` — browser Supabase client
- [x] `src/lib/supabase/server.ts` — server Supabase client
- [x] `src/lib/supabase/middleware.ts` — session refresh middleware
- [x] `middleware.ts` — route protection middleware
- [x] `src/components/ui/` — complete Shadcn UI component library
- [x] `src/lib/utils.ts` — shared utility functions (`cn`, formatters)
- [x] `src/lib/validations/` — Zod schemas for every domain entity
- [x] `src/store/` — Zustand stores (auth, farmer, agent, marketplace, notifications)
- [x] `src/types/` — global TypeScript type definitions
- [x] `src/app/layout.tsx` — root layout with providers, fonts, theme
- [x] `src/app/globals.css` — design tokens and base styles
- [x] `src/components/providers/` — ThemeProvider, QueryProvider, StoreProvider
- [x] `public/` — logos, icons, OG images
- [x] `Dockerfile`, `docker-compose.yml`
- [x] `.github/workflows/ci.yml`
- [x] `vercel.json`

**Dependencies:** None — this is the foundation.

**Success Criteria:**
- `npm run build` exits 0 with no TypeScript errors ✅
- Supabase clients connect (checked via health endpoint) ✅
- All Shadcn components render without errors ✅

**Status: ✅ COMPLETE** (SHA: 5f5a9b6)

---

## M02 — Database Schema & Migrations

**Objective:** Define the complete production-grade PostgreSQL schema in Supabase, including all tables, indexes, RLS policies, functions, and triggers.

**Deliverables:**
- [x] `supabase/migrations/001_extensions.sql` — uuid-ossp, pgcrypto, pg_trgm
- [x] `supabase/migrations/002_roles_permissions.sql` — 8 ENUM types
- [x] `supabase/migrations/003_users.sql` — profiles + auto-create trigger
- [x] `supabase/migrations/004_geography.sql` — regions, districts, villages
- [x] `supabase/migrations/005_farmers.sql` — farmers, farms, digital_id trigger
- [x] `supabase/migrations/006_agents.sql` — agents, agent_villages, deferred FK
- [x] `supabase/migrations/007_buyers.sql` — buyers
- [x] `supabase/migrations/008_commodities.sql` — commodities, grades, market_prices
- [x] `supabase/migrations/009_storage_hubs.sql` — hubs, iot_devices, sensor_readings
- [x] `supabase/migrations/010_inventory.sql` — commodity_batches, GRN trigger, hub stock trigger
- [x] `supabase/migrations/011_traceability.sql` — batch_events, qr_scans, auto-log trigger
- [x] `supabase/migrations/012_wallets_transactions.sql` — wallets, transactions, auto-wallet trigger
- [x] `supabase/migrations/013_payments.sql` — payments, wallet credit trigger
- [x] `supabase/migrations/014_marketplace.sql` — listings, bids, contracts
- [x] `supabase/migrations/015_finance.sql` — credit_score_history, loans, insurance
- [x] `supabase/migrations/016_climate.sql` — weather_data, climate_alerts, crop_calendar
- [x] `supabase/migrations/017_notifications.sql` — notification_templates, notifications
- [x] `supabase/migrations/018_audit.sql` — audit_logs, generic audit trigger
- [x] `supabase/migrations/019_rls_policies.sql` — full RLS for all tables
- [x] `supabase/migrations/020_functions_triggers.sql` — compute_credit_score, search_farmers, admin_dashboard_stats
- [x] `supabase/seed.sql` — Ghana seed data (10 regions, 8 commodities, 5 hubs)

**Status: ✅ COMPLETE** (SHA: 4f52bb4)

---

## M03 — Authentication & RBAC

**Objective:** Implement multi-role authentication using Supabase Auth with JWT-based RBAC covering all 7 user roles.

**Deliverables:**
- [ ] `src/app/(auth)/login/page.tsx`
- [ ] `src/app/(auth)/register/page.tsx`
- [ ] `src/app/(auth)/forgot-password/page.tsx`
- [ ] `src/app/(auth)/reset-password/page.tsx`
- [ ] `src/app/(auth)/verify/page.tsx`
- [ ] `src/app/(auth)/layout.tsx`
- [ ] `src/components/auth/LoginForm.tsx`
- [ ] `src/components/auth/RegisterForm.tsx`
- [ ] `src/components/auth/RoleGuard.tsx`
- [ ] `src/lib/auth/session.ts` — session helpers
- [ ] `src/lib/auth/rbac.ts` — permission checker
- [ ] `src/lib/auth/roles.ts` — role definitions and permission matrix
- [ ] `src/hooks/useAuth.ts`
- [ ] `src/hooks/usePermissions.ts`
- [ ] `supabase/functions/on-user-created/index.ts` — edge function: assign role on signup
- [ ] Rate limiting middleware integration
- [ ] Audit log on every auth event

**Dependencies:** M01, M02

**Success Criteria:**
- Users can register, verify email, log in, reset password
- Each role (SUPER_ADMIN, ADMIN, AGENT, FARMER, BUYER, HUB_MANAGER, ANALYST) sees only their permitted routes
- JWT claims include role and permissions
- Failed login attempts rate-limited after 5 tries
- Audit log captures all auth events

**Estimated Files/Folders Affected:** ~20 files in `src/app/(auth)/`, `src/lib/auth/`, `src/hooks/`

---

## M04 — Public Website

**Objective:** Build the fully responsive public marketing website with 9 pages, interactive maps, and lead-capture forms.

**Deliverables:**
- [ ] `src/app/(public)/page.tsx` — Home
- [ ] `src/app/(public)/about/page.tsx`
- [ ] `src/app/(public)/how-it-works/page.tsx`
- [ ] `src/app/(public)/solutions/page.tsx`
- [ ] `src/app/(public)/impact/page.tsx`
- [ ] `src/app/(public)/partners/page.tsx`
- [ ] `src/app/(public)/pricing/page.tsx`
- [ ] `src/app/(public)/faq/page.tsx`
- [ ] `src/app/(public)/contact/page.tsx`
- [ ] `src/app/(public)/book-demo/page.tsx`
- [ ] `src/app/(public)/layout.tsx`
- [ ] `src/components/public/Navbar.tsx`
- [ ] `src/components/public/Footer.tsx`
- [ ] `src/components/public/HeroSection.tsx`
- [ ] `src/components/public/StatsSection.tsx`
- [ ] `src/components/public/InteractiveMap.tsx` — Mapbox Ghana coverage map
- [ ] `src/components/public/HowItWorksTimeline.tsx`
- [ ] `src/components/public/TestimonialsCarousel.tsx`
- [ ] `src/components/public/ImpactMetrics.tsx`
- [ ] `src/components/public/InvestorSection.tsx`
- [ ] `src/components/public/NewsletterForm.tsx`
- [ ] `src/components/public/BookDemoForm.tsx`
- [ ] `src/components/public/PricingCards.tsx`
- [ ] `src/components/public/FAQAccordion.tsx`

**Dependencies:** M01, M03 (for nav auth state)

**Success Criteria:**
- Lighthouse score ≥ 90 on all pages
- All pages render correctly on mobile (375px), tablet (768px), desktop (1440px)
- Mapbox map loads and displays Ghana AgriHub pins
- Newsletter and demo forms submit to Supabase
- Dark/light mode toggles correctly

**Estimated Files/Folders Affected:** ~30 files in `src/app/(public)/`, `src/components/public/`

---

## M05 — Farmer Portal

**Objective:** Build the complete farmer-facing portal with digital identity, wallet, sales history, climate alerts, and loan eligibility.

**Deliverables:**
- [ ] `src/app/(farmer)/dashboard/page.tsx`
- [ ] `src/app/(farmer)/profile/page.tsx`
- [ ] `src/app/(farmer)/digital-id/page.tsx` — QR identity card
- [ ] `src/app/(farmer)/wallet/page.tsx`
- [ ] `src/app/(farmer)/sales/page.tsx`
- [ ] `src/app/(farmer)/yield/page.tsx`
- [ ] `src/app/(farmer)/climate/page.tsx`
- [ ] `src/app/(farmer)/loans/page.tsx`
- [ ] `src/app/(farmer)/layout.tsx`
- [ ] `src/components/farmer/FarmerSidebar.tsx`
- [ ] `src/components/farmer/WalletCard.tsx`
- [ ] `src/components/farmer/SalesChart.tsx` — Recharts monthly sales
- [ ] `src/components/farmer/YieldTrendChart.tsx`
- [ ] `src/components/farmer/IncomeTrendChart.tsx`
- [ ] `src/components/farmer/DigitalIDCard.tsx` — QR code + farmer info
- [ ] `src/components/farmer/LoanEligibilityCard.tsx`
- [ ] `src/components/farmer/ClimateAlertFeed.tsx`
- [ ] `src/components/farmer/CreditScoreGauge.tsx`
- [ ] `src/lib/qr/generateFarmerQR.ts`
- [ ] `src/app/api/farmer/profile/route.ts`
- [ ] `src/app/api/farmer/wallet/route.ts`
- [ ] `src/app/api/farmer/sales/route.ts`

**Dependencies:** M01, M02, M03

**Success Criteria:**
- Farmer can view wallet balance, transaction history
- QR identity card renders and is printable
- Charts render with real data from Supabase
- Climate alerts display based on farmer's GPS region
- Loan eligibility score calculated from credit model

**Estimated Files/Folders Affected:** ~25 files

---

## M06 — Agent Portal

**Objective:** Build the agent-facing portal for farmer onboarding, commodity procurement, grading, payment initiation, and inventory management.

**Deliverables:**
- [ ] `src/app/(agent)/dashboard/page.tsx`
- [ ] `src/app/(agent)/farmers/page.tsx` — farmer list + onboarding
- [ ] `src/app/(agent)/farmers/new/page.tsx` — farmer registration form
- [ ] `src/app/(agent)/farmers/[id]/page.tsx`
- [ ] `src/app/(agent)/procurement/page.tsx`
- [ ] `src/app/(agent)/procurement/new/page.tsx` — procurement form
- [ ] `src/app/(agent)/procurement/[id]/page.tsx` — GRN + receipt
- [ ] `src/app/(agent)/inventory/page.tsx`
- [ ] `src/app/(agent)/payments/page.tsx`
- [ ] `src/app/(agent)/climate/page.tsx`
- [ ] `src/app/(agent)/layout.tsx`
- [ ] `src/components/agent/AgentSidebar.tsx`
- [ ] `src/components/agent/ProcurementForm.tsx` — full form with GPS capture
- [ ] `src/components/agent/GRNDocument.tsx` — printable GRN
- [ ] `src/components/agent/DigitalReceipt.tsx`
- [ ] `src/components/agent/FarmerOnboardingForm.tsx`
- [ ] `src/components/agent/CommodityGradingPanel.tsx`
- [ ] `src/components/agent/PaymentInitiationForm.tsx`
- [ ] `src/components/agent/InventoryTable.tsx`
- [ ] `src/app/api/agent/procurement/route.ts`
- [ ] `src/app/api/agent/farmers/route.ts`
- [ ] `src/app/api/agent/grn/route.ts`
- [ ] `src/lib/grn/generateGRN.ts`

**Dependencies:** M01, M02, M03, M05

**Success Criteria:**
- Agent can register a new farmer with GPS coordinates
- Procurement form validates all fields via Zod
- GRN auto-generated with unique ID and QR code
- Payment instruction generated and queued
- Inventory updated on submission

**Estimated Files/Folders Affected:** ~28 files

---

## M07 — Smart AgriHub Management

**Objective:** Build the hub management dashboard with IoT device monitoring, storage tracking, environmental sensors, and remote status overview.

**Deliverables:**
- [ ] `src/app/(hub)/dashboard/page.tsx`
- [ ] `src/app/(hub)/hubs/page.tsx` — hub list
- [ ] `src/app/(hub)/hubs/[id]/page.tsx` — hub detail
- [ ] `src/app/(hub)/hubs/[id]/devices/page.tsx`
- [ ] `src/app/(hub)/hubs/[id]/inventory/page.tsx`
- [ ] `src/app/(hub)/monitoring/page.tsx` — real-time monitoring
- [ ] `src/app/(hub)/layout.tsx`
- [ ] `src/components/hub/HubSidebar.tsx`
- [ ] `src/components/hub/HubStatusCard.tsx`
- [ ] `src/components/hub/IoTDeviceGrid.tsx`
- [ ] `src/components/hub/EnvironmentalGauges.tsx` — temp, humidity
- [ ] `src/components/hub/StorageCapacityBar.tsx`
- [ ] `src/components/hub/SolarBatteryPanel.tsx`
- [ ] `src/components/hub/CCTVStatusPanel.tsx`
- [ ] `src/components/hub/HubMapView.tsx` — Mapbox hub locations
- [ ] `src/components/hub/AlertsPanel.tsx`
- [ ] `src/app/api/hub/status/route.ts`
- [ ] `src/app/api/hub/devices/route.ts`
- [ ] `src/app/api/hub/telemetry/route.ts`

**Dependencies:** M01, M02, M03

**Success Criteria:**
- Hub list displays all hubs with live status indicators
- IoT device telemetry renders (temp, humidity, battery, solar)
- Storage occupancy shown as percentage with visual gauge
- CCTV and internet status displayed
- Hub map renders with correct coordinates

**Estimated Files/Folders Affected:** ~22 files

---

## M08 — Marketplace

**Objective:** Build the commodity marketplace with inventory visibility, bidding, forward contracts, purchase orders, and logistics scheduling.

**Deliverables:**
- [ ] `src/app/(marketplace)/page.tsx` — marketplace home
- [ ] `src/app/(marketplace)/listings/page.tsx`
- [ ] `src/app/(marketplace)/listings/[id]/page.tsx`
- [ ] `src/app/(marketplace)/bids/page.tsx`
- [ ] `src/app/(marketplace)/contracts/page.tsx`
- [ ] `src/app/(marketplace)/contracts/[id]/page.tsx`
- [ ] `src/app/(marketplace)/orders/page.tsx`
- [ ] `src/app/(marketplace)/orders/[id]/page.tsx`
- [ ] `src/app/(marketplace)/logistics/page.tsx`
- [ ] `src/app/(marketplace)/layout.tsx`
- [ ] `src/components/marketplace/MarketplaceSidebar.tsx`
- [ ] `src/components/marketplace/CommodityListingCard.tsx`
- [ ] `src/components/marketplace/BidForm.tsx`
- [ ] `src/components/marketplace/ContractViewer.tsx`
- [ ] `src/components/marketplace/PurchaseOrderForm.tsx`
- [ ] `src/components/marketplace/LogisticsScheduler.tsx`
- [ ] `src/components/marketplace/PriceChart.tsx`
- [ ] `src/components/marketplace/BuyerTypeFilter.tsx`
- [ ] `src/app/api/marketplace/listings/route.ts`
- [ ] `src/app/api/marketplace/bids/route.ts`
- [ ] `src/app/api/marketplace/contracts/route.ts`
- [ ] `src/app/api/marketplace/orders/route.ts`

**Dependencies:** M01, M02, M03, M07

**Success Criteria:**
- Buyers can browse available commodity inventory
- Bid submission creates a bid record and notifies seller
- Forward contracts can be created with delivery schedule
- Purchase orders linked to contracts and inventory
- Logistics scheduling form saves schedule to DB

**Estimated Files/Folders Affected:** ~26 files

---

## M09 — Finance Engine

**Objective:** Build the embedded finance module with credit scoring, input financing, production loans, crop insurance, and warehouse receipt financing.

**Deliverables:**
- [ ] `src/app/(finance)/dashboard/page.tsx`
- [ ] `src/app/(finance)/credit-scores/page.tsx`
- [ ] `src/app/(finance)/credit-scores/[farmerId]/page.tsx`
- [ ] `src/app/(finance)/loans/page.tsx`
- [ ] `src/app/(finance)/loans/[id]/page.tsx`
- [ ] `src/app/(finance)/insurance/page.tsx`
- [ ] `src/app/(finance)/warehouse-receipts/page.tsx`
- [ ] `src/app/(finance)/layout.tsx`
- [ ] `src/components/finance/FinanceSidebar.tsx`
- [ ] `src/components/finance/CreditScoreCard.tsx`
- [ ] `src/components/finance/CreditScoreBreakdown.tsx` — weighted factor chart
- [ ] `src/components/finance/LoanApplicationForm.tsx`
- [ ] `src/components/finance/LoanRepaymentSchedule.tsx`
- [ ] `src/components/finance/InsuranceCard.tsx`
- [ ] `src/components/finance/WarehouseReceiptCard.tsx`
- [ ] `src/lib/finance/creditScoring.ts` — scoring algorithm
- [ ] `src/lib/finance/loanCalculator.ts`
- [ ] `src/app/api/finance/credit-score/route.ts`
- [ ] `src/app/api/finance/loans/route.ts`
- [ ] `src/app/api/finance/insurance/route.ts`

**Dependencies:** M01, M02, M03, M05, M06

**Success Criteria:**
- Credit score calculated using 5-factor weighted model
- Score breakdown chart shows each factor's contribution
- Loan application form submits and creates pending loan
- Repayment schedule generated automatically
- Insurance policy linked to farmer and commodity batch

**Estimated Files/Folders Affected:** ~24 files

---

## M10 — Payment Engine

**Objective:** Build the payment processing engine with provider abstraction for MTN MoMo, Telecel Cash, AirtelTigo Money, and bank transfers.

**Deliverables:**
- [ ] `src/lib/payments/providers/mtn.ts`
- [ ] `src/lib/payments/providers/telecel.ts`
- [ ] `src/lib/payments/providers/airteltigo.ts`
- [ ] `src/lib/payments/providers/bank.ts`
- [ ] `src/lib/payments/providers/index.ts` — provider abstraction layer
- [ ] `src/lib/payments/paymentEngine.ts` — orchestration logic
- [ ] `src/lib/payments/webhookHandler.ts`
- [ ] `src/app/api/payments/initiate/route.ts`
- [ ] `src/app/api/payments/verify/route.ts`
- [ ] `src/app/api/payments/webhook/route.ts`
- [ ] `src/app/api/payments/wallet/route.ts`
- [ ] `src/components/payments/PaymentStatusBadge.tsx`
- [ ] `src/components/payments/PaymentHistoryTable.tsx`
- [ ] `src/components/payments/WalletTopUp.tsx`
- [ ] `src/components/payments/PaymentMethodSelector.tsx`
- [ ] `src/components/payments/TransactionReceipt.tsx`
- [ ] `src/app/(admin)/payments/page.tsx`
- [ ] `src/app/(admin)/payments/[id]/page.tsx`

**Dependencies:** M01, M02, M03, M06

**Success Criteria:**
- Payment initiation creates transaction record with PENDING status
- Provider abstraction routes to correct MoMo API
- Webhook updates transaction status correctly
- Farmer wallet balance updated on SUCCESSFUL payment
- Failed payments logged with reason and retryable

**Estimated Files/Folders Affected:** ~22 files

---

## M11 — Traceability Engine

**Objective:** Build end-to-end commodity traceability with batch QR generation, scan pages, and full audit trail from farm to market.

**Deliverables:**
- [ ] `src/lib/traceability/batchGenerator.ts`
- [ ] `src/lib/traceability/qrGenerator.ts`
- [ ] `src/app/api/traceability/batch/route.ts`
- [ ] `src/app/api/traceability/scan/[batchId]/route.ts`
- [ ] `src/app/(trace)/scan/[batchId]/page.tsx` — public scan page
- [ ] `src/app/(trace)/batches/page.tsx`
- [ ] `src/app/(trace)/batches/[id]/page.tsx`
- [ ] `src/app/(trace)/layout.tsx`
- [ ] `src/components/traceability/BatchQRCard.tsx`
- [ ] `src/components/traceability/TraceabilityTimeline.tsx`
- [ ] `src/components/traceability/BatchDetailCard.tsx`
- [ ] `src/components/traceability/FarmOriginMap.tsx` — Mapbox origin pin
- [ ] `src/components/traceability/CertificateViewer.tsx`

**Dependencies:** M01, M02, M06, M07

**Status: ⬜**

---

## M12 — Climate Intelligence Engine

**Objective:** Build the climate advisory system with rainfall/temperature forecasts, pest and drought alerts, NDVI, yield predictions, and multi-channel delivery.

**Deliverables:**
- [ ] `src/lib/climate/openWeather.ts`
- [ ] `src/lib/climate/alertEngine.ts`
- [ ] `src/lib/climate/ndviCalculator.ts`
- [ ] `src/lib/climate/yieldPredictor.ts`
- [ ] `src/app/api/climate/forecast/route.ts`
- [ ] `src/app/api/climate/alerts/route.ts`
- [ ] `src/app/api/climate/ndvi/route.ts`
- [ ] `supabase/functions/climate-sync/index.ts`
- [ ] `supabase/functions/send-alerts/index.ts`
- [ ] `src/app/(climate)/dashboard/page.tsx`
- [ ] `src/app/(climate)/forecasts/page.tsx`
- [ ] `src/app/(climate)/alerts/page.tsx`
- [ ] `src/app/(climate)/ndvi/page.tsx`
- [ ] `src/app/(climate)/layout.tsx`
- [ ] `src/components/climate/WeatherForecastCard.tsx`
- [ ] `src/components/climate/RainfallChart.tsx`
- [ ] `src/components/climate/TemperatureChart.tsx`
- [ ] `src/components/climate/AlertBanner.tsx`
- [ ] `src/components/climate/NDVIMap.tsx`
- [ ] `src/components/climate/CropAdvisoryCard.tsx`
- [ ] `src/components/climate/YieldPredictionChart.tsx`

**Dependencies:** M01, M02, M03, M05

**Status: ⬜**

---

## M13 — Executive Dashboard

**Objective:** Build the national/regional analytics dashboard with GIS maps, commodity flow visualization, payment analytics, and performance KPIs.

**Deliverables:**
- [ ] `src/app/(admin)/dashboard/page.tsx`
- [ ] `src/app/(admin)/analytics/national/page.tsx`
- [ ] `src/app/(admin)/analytics/regional/page.tsx`
- [ ] `src/app/(admin)/analytics/payments/page.tsx`
- [ ] `src/app/(admin)/analytics/commodities/page.tsx`
- [ ] `src/app/(admin)/analytics/farmers/page.tsx`
- [ ] `src/app/(admin)/analytics/agents/page.tsx`
- [ ] `src/app/(admin)/analytics/climate/page.tsx`
- [ ] `src/app/(admin)/analytics/storage/page.tsx`
- [ ] `src/app/(admin)/analytics/exports/page.tsx`
- [ ] `src/app/(admin)/layout.tsx`
- [ ] `src/components/admin/AdminSidebar.tsx`
- [ ] `src/components/admin/KPICard.tsx`
- [ ] `src/components/admin/CommodityFlowMap.tsx`
- [ ] `src/components/admin/NationalStatsGrid.tsx`
- [ ] `src/components/admin/RegionalHeatmap.tsx`
- [ ] `src/components/admin/PaymentVolumeChart.tsx`
- [ ] `src/components/admin/FarmerGrowthChart.tsx`
- [ ] `src/components/admin/AgentProductivityTable.tsx`
- [ ] `src/components/admin/StorageUtilizationChart.tsx`
- [ ] `src/components/admin/ExportReadinessTable.tsx`
- [ ] `src/app/api/admin/analytics/route.ts`

**Dependencies:** M01 – M12

**Status: ⬜**

---

## M14 — Notifications & Integrations

**Objective:** Build the multi-channel notification system with SMS (Twilio), WhatsApp Cloud API, and in-app push.

**Deliverables:**
- [ ] `src/lib/notifications/twilio.ts`
- [ ] `src/lib/notifications/whatsapp.ts`
- [ ] `src/lib/notifications/inApp.ts`
- [ ] `src/lib/notifications/dispatcher.ts`
- [ ] `src/lib/notifications/templates.ts`
- [ ] `supabase/functions/notify-farmer/index.ts`
- [ ] `supabase/functions/notify-agent/index.ts`
- [ ] `supabase/functions/notify-buyer/index.ts`
- [ ] `src/app/api/notifications/route.ts`
- [ ] `src/app/api/notifications/preferences/route.ts`
- [ ] `src/components/notifications/NotificationBell.tsx`
- [ ] `src/components/notifications/NotificationDrawer.tsx`
- [ ] `src/components/notifications/NotificationItem.tsx`

**Dependencies:** M01, M02, M03

**Status: ⬜**

---

## M15 — DevOps, Testing & Seed Data

**Objective:** Complete the CI/CD pipeline, write test suites for all critical paths, and finalize realistic Ghana seed data.

**Deliverables:**
- [ ] `.github/workflows/deploy.yml` — Vercel production deploy on merge to main
- [ ] `.github/workflows/supabase-migrate.yml`
- [ ] `src/__tests__/lib/creditScoring.test.ts`
- [ ] `src/__tests__/lib/paymentEngine.test.ts`
- [ ] `src/__tests__/lib/grnGenerator.test.ts`
- [ ] `src/__tests__/lib/alertEngine.test.ts`
- [ ] `src/__tests__/api/payments.test.ts`
- [ ] `src/__tests__/api/procurement.test.ts`
- [ ] `src/__tests__/components/FarmerPortal.test.tsx`
- [ ] `src/__tests__/components/ProcurementForm.test.tsx`
- [ ] `e2e/farmer-registration.spec.ts` — Playwright
- [ ] `e2e/procurement-flow.spec.ts`
- [ ] `e2e/payment-flow.spec.ts`
- [ ] `scripts/seed-dev.sh`

**Dependencies:** M01 – M14

**Status: ⬜**

---

## Progress Log

| Date | Milestone | Action | Commit |
|------|-----------|--------|--------|
| 2026-06-21 | Governance | Created TASKS.md, ARCHITECTURE.md, PRODUCT_REQUIREMENTS.md | — |
| 2026-07-02 | M01 | Project Foundation & Tooling complete | 5f5a9b6 |
| 2026-07-02 | M02 | Database Schema & Migrations complete | 4f52bb4 |

---

*Last updated: 2026-07-02*
*Next action: M03 — Authentication & RBAC*
