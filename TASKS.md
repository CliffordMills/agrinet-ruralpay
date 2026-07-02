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
| M03 | Authentication & RBAC | ✅ | claude/nice-thompson-bykx5a |
| M04 | Public Website | 🔄 | claude/nice-thompson-bykx5a |
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

## M01 — Project Foundation & Tooling ✅

**Status: ✅ COMPLETE** (SHA: 5f5a9b6)

---

## M02 — Database Schema & Migrations ✅

**Status: ✅ COMPLETE** (SHA: 4f52bb4)

20 migration files (001–020) + seed.sql with Ghana agricultural data.

---

## M03 — Authentication & RBAC ✅

**Status: ✅ COMPLETE** (SHA: 717f9e9)

**Delivered:**
- [x] `src/app/(auth)/layout.tsx` — split-panel auth layout with branding
- [x] `src/app/(auth)/login/page.tsx`
- [x] `src/app/(auth)/register/page.tsx`
- [x] `src/app/(auth)/forgot-password/page.tsx`
- [x] `src/app/(auth)/reset-password/page.tsx`
- [x] `src/app/(auth)/verify/page.tsx`
- [x] `src/components/auth/LoginForm.tsx` — Zod + RHF, role-aware redirect
- [x] `src/components/auth/RegisterForm.tsx` — 4-role picker, Ghana phone validation
- [x] `src/components/auth/RoleGuard.tsx` — client-side role enforcement
- [x] `src/lib/auth/session.ts` — server-side session helpers
- [x] `src/lib/auth/rbac.ts` — permission checker, dashboard router
- [x] `src/lib/auth/roles.ts` — permission matrix per role
- [x] `src/hooks/useAuth.ts` — Supabase auth state subscription
- [x] `src/hooks/usePermissions.ts` — `can()` / `canAny()` hooks
- [x] `supabase/functions/on-user-created/index.ts` — edge fn: set app_metadata role + permissions
- [x] `src/app/unauthorized/page.tsx`
- [x] `middleware.ts` updated — reads app_metadata.role (secure), preserves `next` param

---

## M04 — Public Website

**Objective:** Build the fully responsive public marketing website with landing page, interactive Ghana map, and lead-capture forms.

**Deliverables:**
- [ ] `src/app/(public)/layout.tsx`
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
- [ ] `src/components/public/Navbar.tsx`
- [ ] `src/components/public/Footer.tsx`
- [ ] `src/components/public/HeroSection.tsx`
- [ ] `src/components/public/StatsSection.tsx`
- [ ] `src/components/public/HowItWorksTimeline.tsx`
- [ ] `src/components/public/TestimonialsCarousel.tsx`
- [ ] `src/components/public/ImpactMetrics.tsx`
- [ ] `src/components/public/PricingCards.tsx`
- [ ] `src/components/public/FAQAccordion.tsx`
- [ ] `src/components/public/NewsletterForm.tsx`
- [ ] `src/components/public/BookDemoForm.tsx`

**Dependencies:** M01, M03

**Success Criteria:**
- All pages render at mobile (375px), tablet (768px), desktop (1440px)
- Newsletter and demo forms save to Supabase
- Dark/light mode works across all pages
- No TypeScript errors

**Estimated Files:** ~25 files

---

## M05 — Farmer Portal

**Objective:** Farmer-facing portal with digital identity, wallet, sales history, climate alerts, and loan eligibility.

**Deliverables:**
- [ ] `src/app/(farmer)/layout.tsx`
- [ ] `src/app/(farmer)/dashboard/page.tsx`
- [ ] `src/app/(farmer)/profile/page.tsx`
- [ ] `src/app/(farmer)/digital-id/page.tsx`
- [ ] `src/app/(farmer)/wallet/page.tsx`
- [ ] `src/app/(farmer)/sales/page.tsx`
- [ ] `src/app/(farmer)/climate/page.tsx`
- [ ] `src/app/(farmer)/loans/page.tsx`
- [ ] `src/components/farmer/FarmerSidebar.tsx`
- [ ] `src/components/farmer/WalletCard.tsx`
- [ ] `src/components/farmer/SalesChart.tsx`
- [ ] `src/components/farmer/DigitalIDCard.tsx`
- [ ] `src/components/farmer/CreditScoreGauge.tsx`
- [ ] `src/components/farmer/ClimateAlertFeed.tsx`
- [ ] `src/components/farmer/LoanEligibilityCard.tsx`
- [ ] `src/lib/qr/generateFarmerQR.ts`
- [ ] `src/app/api/farmer/profile/route.ts`
- [ ] `src/app/api/farmer/wallet/route.ts`
- [ ] `src/app/api/farmer/sales/route.ts`

**Dependencies:** M01, M02, M03

---

## M06 — Agent Portal

**Objective:** Agent portal for farmer onboarding, procurement, grading, payment initiation.

**Deliverables:**
- [ ] `src/app/(agent)/layout.tsx`
- [ ] `src/app/(agent)/dashboard/page.tsx`
- [ ] `src/app/(agent)/farmers/page.tsx`
- [ ] `src/app/(agent)/farmers/new/page.tsx`
- [ ] `src/app/(agent)/farmers/[id]/page.tsx`
- [ ] `src/app/(agent)/procurement/page.tsx`
- [ ] `src/app/(agent)/procurement/new/page.tsx`
- [ ] `src/app/(agent)/procurement/[id]/page.tsx`
- [ ] `src/app/(agent)/inventory/page.tsx`
- [ ] `src/app/(agent)/payments/page.tsx`
- [ ] `src/components/agent/AgentSidebar.tsx`
- [ ] `src/components/agent/ProcurementForm.tsx`
- [ ] `src/components/agent/GRNDocument.tsx`
- [ ] `src/components/agent/FarmerOnboardingForm.tsx`
- [ ] `src/components/agent/CommodityGradingPanel.tsx`
- [ ] `src/components/agent/PaymentInitiationForm.tsx`
- [ ] `src/components/agent/InventoryTable.tsx`
- [ ] `src/app/api/agent/procurement/route.ts`
- [ ] `src/app/api/agent/farmers/route.ts`
- [ ] `src/lib/grn/generateGRN.ts`

**Dependencies:** M01, M02, M03, M05

---

## M07 — Smart AgriHub Management

**Objective:** Hub management dashboard with IoT monitoring, storage tracking, and environmental sensors.

**Deliverables:**
- [ ] `src/app/(hub)/layout.tsx`
- [ ] `src/app/(hub)/dashboard/page.tsx`
- [ ] `src/app/(hub)/hubs/page.tsx`
- [ ] `src/app/(hub)/hubs/[id]/page.tsx`
- [ ] `src/app/(hub)/hubs/[id]/devices/page.tsx`
- [ ] `src/app/(hub)/monitoring/page.tsx`
- [ ] `src/components/hub/HubSidebar.tsx`
- [ ] `src/components/hub/HubStatusCard.tsx`
- [ ] `src/components/hub/IoTDeviceGrid.tsx`
- [ ] `src/components/hub/EnvironmentalGauges.tsx`
- [ ] `src/components/hub/StorageCapacityBar.tsx`
- [ ] `src/components/hub/HubMapView.tsx`
- [ ] `src/app/api/hub/status/route.ts`
- [ ] `src/app/api/hub/devices/route.ts`
- [ ] `src/app/api/hub/telemetry/route.ts`

**Dependencies:** M01, M02, M03

---

## M08 — Marketplace

**Objective:** Commodity marketplace with bidding, forward contracts, and purchase orders.

**Deliverables:**
- [ ] `src/app/(marketplace)/layout.tsx`
- [ ] `src/app/(marketplace)/page.tsx`
- [ ] `src/app/(marketplace)/listings/page.tsx`
- [ ] `src/app/(marketplace)/listings/[id]/page.tsx`
- [ ] `src/app/(marketplace)/bids/page.tsx`
- [ ] `src/app/(marketplace)/contracts/page.tsx`
- [ ] `src/app/(marketplace)/contracts/[id]/page.tsx`
- [ ] `src/components/marketplace/CommodityListingCard.tsx`
- [ ] `src/components/marketplace/BidForm.tsx`
- [ ] `src/components/marketplace/ContractViewer.tsx`
- [ ] `src/components/marketplace/PriceChart.tsx`
- [ ] `src/app/api/marketplace/listings/route.ts`
- [ ] `src/app/api/marketplace/bids/route.ts`
- [ ] `src/app/api/marketplace/contracts/route.ts`

**Dependencies:** M01, M02, M03, M07

---

## M09 — Finance Engine

**Objective:** Embedded finance: credit scoring, loans, insurance, warehouse receipt financing.

**Deliverables:**
- [ ] `src/app/(finance)/layout.tsx`
- [ ] `src/app/(finance)/dashboard/page.tsx`
- [ ] `src/app/(finance)/credit-scores/page.tsx`
- [ ] `src/app/(finance)/loans/page.tsx`
- [ ] `src/app/(finance)/loans/[id]/page.tsx`
- [ ] `src/app/(finance)/insurance/page.tsx`
- [ ] `src/components/finance/CreditScoreCard.tsx`
- [ ] `src/components/finance/CreditScoreBreakdown.tsx`
- [ ] `src/components/finance/LoanApplicationForm.tsx`
- [ ] `src/components/finance/LoanRepaymentSchedule.tsx`
- [ ] `src/lib/finance/creditScoring.ts`
- [ ] `src/lib/finance/loanCalculator.ts`
- [ ] `src/app/api/finance/credit-score/route.ts`
- [ ] `src/app/api/finance/loans/route.ts`

**Dependencies:** M01, M02, M03, M05, M06

---

## M10 — Payment Engine

**Objective:** Payment processing with MTN MoMo, Telecel Cash, AirtelTigo Money, bank transfers.

**Deliverables:**
- [ ] `src/lib/payments/providers/mtn.ts`
- [ ] `src/lib/payments/providers/telecel.ts`
- [ ] `src/lib/payments/providers/airteltigo.ts`
- [ ] `src/lib/payments/providers/bank.ts`
- [ ] `src/lib/payments/providers/index.ts`
- [ ] `src/lib/payments/paymentEngine.ts`
- [ ] `src/lib/payments/webhookHandler.ts`
- [ ] `src/app/api/payments/initiate/route.ts`
- [ ] `src/app/api/payments/verify/route.ts`
- [ ] `src/app/api/payments/webhook/route.ts`
- [ ] `src/components/payments/PaymentStatusBadge.tsx`
- [ ] `src/components/payments/PaymentHistoryTable.tsx`
- [ ] `src/components/payments/TransactionReceipt.tsx`

**Dependencies:** M01, M02, M03, M06

---

## M11 — Traceability Engine

**Objective:** End-to-end commodity traceability with QR generation, scan pages, audit trail.

**Deliverables:**
- [ ] `src/lib/traceability/qrGenerator.ts`
- [ ] `src/app/api/traceability/batch/route.ts`
- [ ] `src/app/api/traceability/scan/[batchId]/route.ts`
- [ ] `src/app/(trace)/scan/[batchId]/page.tsx`
- [ ] `src/app/(trace)/batches/page.tsx`
- [ ] `src/app/(trace)/batches/[id]/page.tsx`
- [ ] `src/components/traceability/TraceabilityTimeline.tsx`
- [ ] `src/components/traceability/BatchQRCard.tsx`
- [ ] `src/components/traceability/FarmOriginMap.tsx`

**Dependencies:** M01, M02, M06, M07

---

## M12 — Climate Intelligence Engine

**Objective:** Weather forecasts, pest/drought alerts, NDVI, yield predictions.

**Deliverables:**
- [ ] `src/lib/climate/openWeather.ts`
- [ ] `src/lib/climate/alertEngine.ts`
- [ ] `src/lib/climate/yieldPredictor.ts`
- [ ] `src/app/api/climate/forecast/route.ts`
- [ ] `src/app/api/climate/alerts/route.ts`
- [ ] `supabase/functions/climate-sync/index.ts`
- [ ] `supabase/functions/send-alerts/index.ts`
- [ ] `src/app/(climate)/dashboard/page.tsx`
- [ ] `src/app/(climate)/forecasts/page.tsx`
- [ ] `src/app/(climate)/alerts/page.tsx`
- [ ] `src/components/climate/WeatherForecastCard.tsx`
- [ ] `src/components/climate/RainfallChart.tsx`
- [ ] `src/components/climate/AlertBanner.tsx`
- [ ] `src/components/climate/CropAdvisoryCard.tsx`

**Dependencies:** M01, M02, M03, M05

---

## M13 — Executive Dashboard

**Objective:** National analytics with GIS maps, commodity flow, payment analytics, KPIs.

**Deliverables:**
- [ ] `src/app/(admin)/layout.tsx`
- [ ] `src/app/(admin)/dashboard/page.tsx`
- [ ] `src/app/(admin)/analytics/national/page.tsx`
- [ ] `src/app/(admin)/analytics/regional/page.tsx`
- [ ] `src/app/(admin)/analytics/payments/page.tsx`
- [ ] `src/app/(admin)/analytics/commodities/page.tsx`
- [ ] `src/components/admin/AdminSidebar.tsx`
- [ ] `src/components/admin/KPICard.tsx`
- [ ] `src/components/admin/NationalStatsGrid.tsx`
- [ ] `src/components/admin/PaymentVolumeChart.tsx`
- [ ] `src/components/admin/FarmerGrowthChart.tsx`
- [ ] `src/components/admin/StorageUtilizationChart.tsx`
- [ ] `src/app/api/admin/analytics/route.ts`

**Dependencies:** M01–M12

---

## M14 — Notifications & Integrations

**Objective:** Multi-channel notifications: SMS (Twilio), WhatsApp Cloud API, in-app real-time.

**Deliverables:**
- [ ] `src/lib/notifications/twilio.ts`
- [ ] `src/lib/notifications/whatsapp.ts`
- [ ] `src/lib/notifications/inApp.ts`
- [ ] `src/lib/notifications/dispatcher.ts`
- [ ] `src/lib/notifications/templates.ts`
- [ ] `supabase/functions/notify-farmer/index.ts`
- [ ] `supabase/functions/notify-agent/index.ts`
- [ ] `src/app/api/notifications/route.ts`
- [ ] `src/components/notifications/NotificationBell.tsx`
- [ ] `src/components/notifications/NotificationDrawer.tsx`
- [ ] `src/components/notifications/NotificationItem.tsx`

**Dependencies:** M01, M02, M03

---

## M15 — DevOps, Testing & Seed Data

**Objective:** CI/CD pipeline, test suites for critical paths, finalize seed data.

**Deliverables:**
- [ ] `.github/workflows/deploy.yml`
- [ ] `.github/workflows/supabase-migrate.yml`
- [ ] `src/__tests__/lib/creditScoring.test.ts`
- [ ] `src/__tests__/lib/paymentEngine.test.ts`
- [ ] `src/__tests__/api/payments.test.ts`
- [ ] `src/__tests__/api/procurement.test.ts`
- [ ] `e2e/farmer-registration.spec.ts`
- [ ] `e2e/procurement-flow.spec.ts`
- [ ] `e2e/payment-flow.spec.ts`
- [ ] `scripts/seed-dev.sh`

**Dependencies:** M01–M14

---

## Progress Log

| Date | Milestone | Action | Commit |
|------|-----------|--------|--------|
| 2026-06-21 | Governance | Created TASKS.md, ARCHITECTURE.md, PRODUCT_REQUIREMENTS.md | — |
| 2026-07-02 | M01 | Project Foundation & Tooling complete | 5f5a9b6 |
| 2026-07-02 | M02 | Database Schema & Migrations complete | 4f52bb4 |
| 2026-07-02 | M03 | Authentication & RBAC complete | 717f9e9 |

---

*Last updated: 2026-07-02*
*Next action: M04 — Public Website*
