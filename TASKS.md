# AGRINET RURALPAY — Project Task Board

> **Single source of truth for all development milestones.**
> Update this file after every commit. Reference it before writing any code.

---

## Milestone Overview

| # | Milestone | Status |
|---|-----------|--------|
| M01 | Project Foundation & Tooling | ✅ |
| M02 | Database Schema & Migrations | ✅ |
| M03 | Authentication & RBAC | ✅ |
| M04 | Public Website | ✅ |
| M05 | Farmer Portal | 🔄 |
| M06 | Agent Portal | ⬜ |
| M07 | Smart AgriHub Management | ⬜ |
| M08 | Marketplace | ⬜ |
| M09 | Finance Engine | ⬜ |
| M10 | Payment Engine | ⬜ |
| M11 | Traceability Engine | ⬜ |
| M12 | Climate Intelligence Engine | ⬜ |
| M13 | Executive Dashboard | ⬜ |
| M14 | Notifications & Integrations | ⬜ |
| M15 | DevOps, Testing & Seed Data | ⬜ |

---

## Completed Milestones

- **M01** ✅ SHA: 5f5a9b6 — Next.js 16 foundation, 19 UI components, Supabase clients, Zustand stores, CI/Docker
- **M02** ✅ SHA: 4f52bb4 — 20 migration files (001–020) + seed.sql, full RLS, triggers, Ghana seed data
- **M03** ✅ SHA: 717f9e9 — Auth pages (login/register/forgot/reset/verify), RoleGuard, edge fn, middleware
- **M04** ✅ SHA: ce3ac3d — Public website: Navbar, Footer, 10 pages, 8 components (Hero, Stats, Timeline, etc.)

---

## M05 — Farmer Portal 🔄

**Objective:** Farmer-facing portal: digital identity, wallet, sales history, climate alerts, loan eligibility, credit score.

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

## M06 — Agent Portal ⬜

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

## M07 — Smart AgriHub Management ⬜

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

## M08 — Marketplace ⬜

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

## M09 — Finance Engine ⬜

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

## M10 — Payment Engine ⬜

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

## M11 — Traceability Engine ⬜

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

## M12 — Climate Intelligence Engine ⬜

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

## M13 — Executive Dashboard ⬜

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

## M14 — Notifications & Integrations ⬜

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

## M15 — DevOps, Testing & Seed Data ⬜

**Deliverables:**
- [ ] `.github/workflows/deploy.yml`
- [ ] `.github/workflows/supabase-migrate.yml`
- [ ] `src/__tests__/lib/creditScoring.test.ts`
- [ ] `src/__tests__/lib/paymentEngine.test.ts`
- [ ] `src/__tests__/api/payments.test.ts`
- [ ] `e2e/farmer-registration.spec.ts`
- [ ] `e2e/procurement-flow.spec.ts`
- [ ] `e2e/payment-flow.spec.ts`
- [ ] `scripts/seed-dev.sh`

**Dependencies:** M01–M14

---

## Progress Log

| Date | Milestone | Commit |
|------|-----------|--------|
| 2026-07-02 | M01 | 5f5a9b6 |
| 2026-07-02 | M02 | 4f52bb4 |
| 2026-07-02 | M03 | 717f9e9 |
| 2026-07-02 | M04 | ce3ac3d |

*Last updated: 2026-07-02 — Next: M05 Farmer Portal*
