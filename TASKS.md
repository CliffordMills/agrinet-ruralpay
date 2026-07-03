# AGRINET RURALPAY — BUILD TASKS

## M01 — Foundation & Auth ✅
- Supabase project, schema, RLS policies
- Next.js 16 App Router scaffold
- Auth: login, register, role-based redirect
- `requireSession()`, `getSession()`, `RoleGuard`

## M02 — Farmer Portal ✅
- Farmer dashboard, profile, wallet
- KYC document upload
- Transaction history

## M03 — Admin Portal ✅
- User management, role assignment
- Platform stats dashboard
- Farmer/agent/hub CRUD

## M04 — Commodity & Pricing Engine ✅
- Commodity catalogue, grade definitions
- Dynamic pricing rules
- Price history charts (CSS bars)

## M05 — Storage Hub Registry ✅
- Hub onboarding, capacity management
- Region/district hierarchy
- Hub assignment to agents

## M06 — Agent Portal ✅
- Farmer onboarding form
- Procurement / batch intake
- GRN document generation
- Commodity grading panel
- MoMo payment initiation
- Inventory table with filters

## M07 — Smart AgriHub Management ✅
- Hub dashboard with utilisation gauge
- IoT device grid (online/offline, battery)
- Environmental monitoring gauges
- Climate alert feed
- Batch inventory view

## M08 — Marketplace ✅
- Commodity listing grid + live price ticker
- Listing detail + bid book
- Bid form with real-time total
- Buyer bid history
- Contract list + printable contract viewer
- POST /api/marketplace/bids with stock validation

## M09 — Finance Engine ✅
- `src/lib/finance/creditScoring.ts`
- `src/lib/finance/loanCalculator.ts`
- `CreditScoreCard` component
- `LoanApplicationForm` component
- `LoanRepaymentSchedule` component
- `(finance)` layout
- Credit score history page
- Loan list page
- New loan application page
- Loan detail + schedule page
- Insurance policies page
- GET /api/finance/credit
- GET+POST /api/finance/loans

## M10 — Payment Engine 🔄
- `src/lib/payments/providers.ts` — phone-prefix provider detection ✅
- `src/lib/payments/paymentEngine.ts` — build/initiate/poll abstractions ✅
- POST /api/payments/initiate ✅
- GET /api/payments/status/[reference] ✅
- POST /api/payments/webhook ✅
- GET /api/payments/history ✅

## M11 — Traceability Engine ⬜
- `src/lib/qr/qrGenerator.ts`
- Public scan page `/scan/[batchId]`
- `TraceabilityTimeline`, `BatchQRCard`, `FarmOriginMap`

## M12 — Climate Intelligence Engine ⬜
- OpenWeather API client
- Alert engine
- Climate dashboard pages
- Weather chart components

## M13 — Executive Dashboard ⬜
- Admin layout
- National / regional / payments / commodities analytics
- `AdminSidebar`, `KPICard`
- `admin_dashboard_stats()` RPC

## M14 — Notifications & Integrations ⬜
- Twilio SMS / WhatsApp
- In-app notification system
- `NotificationBell`, `NotificationDrawer`, `NotificationItem`
- Edge functions

## M15 — DevOps, Testing & Seed Data ⬜
- GitHub Actions deploy / supabase-migrate workflows
- Jest unit tests
- Playwright e2e tests
- Enhanced seed script
