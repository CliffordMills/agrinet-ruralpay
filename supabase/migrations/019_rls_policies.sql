-- Migration 019: Row Level Security Policies

-- Helper to get current user's role from profiles
CREATE OR REPLACE FUNCTION public.auth_role()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role::TEXT FROM public.profiles WHERE id = auth.uid();
$$;

-- Helper to get current user's agent record
CREATE OR REPLACE FUNCTION public.auth_agent_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT id FROM public.agents WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Helper to get current user's farmer record
CREATE OR REPLACE FUNCTION public.auth_farmer_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT id FROM public.farmers WHERE user_id = auth.uid() LIMIT 1;
$$;

-- ============================================================
-- PROFILES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "profiles_select_admin" ON public.profiles
  FOR SELECT USING (public.auth_role() IN ('SUPER_ADMIN', 'ADMIN', 'ANALYST'));

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- ============================================================
-- GEOGRAPHY (read-only for all authenticated users)
-- ============================================================
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "regions_select_all" ON public.regions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "districts_select_all" ON public.districts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "villages_select_all" ON public.villages FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "geography_manage_admin" ON public.regions FOR ALL USING (public.auth_role() IN ('SUPER_ADMIN', 'ADMIN'));
CREATE POLICY "districts_manage_admin" ON public.districts FOR ALL USING (public.auth_role() IN ('SUPER_ADMIN', 'ADMIN'));
CREATE POLICY "villages_manage_admin" ON public.villages FOR ALL USING (public.auth_role() IN ('SUPER_ADMIN', 'ADMIN'));

-- ============================================================
-- FARMERS
-- ============================================================
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "farmers_select_own" ON public.farmers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "farmers_select_agent" ON public.farmers
  FOR SELECT USING (agent_id = public.auth_agent_id());

CREATE POLICY "farmers_select_admin" ON public.farmers
  FOR SELECT USING (public.auth_role() IN ('SUPER_ADMIN', 'ADMIN', 'ANALYST'));

CREATE POLICY "farmers_insert_agent" ON public.farmers
  FOR INSERT WITH CHECK (
    public.auth_role() IN ('AGENT', 'ADMIN', 'SUPER_ADMIN')
    AND agent_id = public.auth_agent_id()
  );

CREATE POLICY "farmers_update_agent" ON public.farmers
  FOR UPDATE USING (
    agent_id = public.auth_agent_id()
    OR public.auth_role() IN ('ADMIN', 'SUPER_ADMIN')
  );

-- ============================================================
-- COMMODITY BATCHES
-- ============================================================
ALTER TABLE public.commodity_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "batches_select_farmer" ON public.commodity_batches
  FOR SELECT USING (farmer_id = public.auth_farmer_id());

CREATE POLICY "batches_select_agent" ON public.commodity_batches
  FOR SELECT USING (agent_id = public.auth_agent_id());

CREATE POLICY "batches_select_admin" ON public.commodity_batches
  FOR SELECT USING (public.auth_role() IN ('SUPER_ADMIN', 'ADMIN', 'ANALYST', 'HUB_MANAGER'));

CREATE POLICY "batches_insert_agent" ON public.commodity_batches
  FOR INSERT WITH CHECK (
    public.auth_role() IN ('AGENT', 'ADMIN', 'SUPER_ADMIN')
    AND agent_id = public.auth_agent_id()
  );

CREATE POLICY "batches_update_hub" ON public.commodity_batches
  FOR UPDATE USING (
    public.auth_role() IN ('AGENT', 'HUB_MANAGER', 'ADMIN', 'SUPER_ADMIN')
  );

-- QR scans are public (no auth required for traceability portal)
ALTER TABLE public.qr_scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qr_scans_insert_public" ON public.qr_scans FOR INSERT WITH CHECK (true);
CREATE POLICY "qr_scans_select_admin" ON public.qr_scans FOR SELECT USING (public.auth_role() IN ('SUPER_ADMIN', 'ADMIN', 'ANALYST'));

-- ============================================================
-- WALLETS & TRANSACTIONS
-- ============================================================
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wallets_select_own" ON public.wallets
  FOR SELECT USING (farmer_id = public.auth_farmer_id());

CREATE POLICY "wallets_select_admin" ON public.wallets
  FOR SELECT USING (public.auth_role() IN ('SUPER_ADMIN', 'ADMIN', 'ANALYST', 'AGENT'));

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_select_own" ON public.transactions
  FOR SELECT USING (
    wallet_id IN (SELECT id FROM public.wallets WHERE farmer_id = public.auth_farmer_id())
  );

CREATE POLICY "transactions_select_admin" ON public.transactions
  FOR SELECT USING (public.auth_role() IN ('SUPER_ADMIN', 'ADMIN', 'ANALYST'));

-- ============================================================
-- PAYMENTS
-- ============================================================
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_select_own" ON public.payments
  FOR SELECT USING (farmer_id = public.auth_farmer_id());

CREATE POLICY "payments_select_agent" ON public.payments
  FOR SELECT USING (
    farmer_id IN (SELECT id FROM public.farmers WHERE agent_id = public.auth_agent_id())
  );

CREATE POLICY "payments_select_admin" ON public.payments
  FOR SELECT USING (public.auth_role() IN ('SUPER_ADMIN', 'ADMIN', 'ANALYST'));

CREATE POLICY "payments_insert_agent" ON public.payments
  FOR INSERT WITH CHECK (public.auth_role() IN ('AGENT', 'ADMIN', 'SUPER_ADMIN'));

-- ============================================================
-- MARKETPLACE
-- ============================================================
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "listings_select_authenticated" ON public.marketplace_listings
  FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

CREATE POLICY "listings_manage_admin" ON public.marketplace_listings
  FOR ALL USING (public.auth_role() IN ('SUPER_ADMIN', 'ADMIN', 'HUB_MANAGER'));

CREATE POLICY "bids_select_buyer" ON public.bids
  FOR SELECT USING (buyer_id IN (SELECT id FROM public.buyers WHERE user_id = auth.uid()));

CREATE POLICY "bids_select_admin" ON public.bids
  FOR SELECT USING (public.auth_role() IN ('SUPER_ADMIN', 'ADMIN', 'ANALYST'));

CREATE POLICY "bids_insert_buyer" ON public.bids
  FOR INSERT WITH CHECK (public.auth_role() = 'BUYER');

CREATE POLICY "contracts_select_buyer" ON public.contracts
  FOR SELECT USING (buyer_id IN (SELECT id FROM public.buyers WHERE user_id = auth.uid()));

CREATE POLICY "contracts_select_admin" ON public.contracts
  FOR SELECT USING (public.auth_role() IN ('SUPER_ADMIN', 'ADMIN', 'ANALYST'));

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_own" ON public.notifications
  FOR ALL USING (user_id = auth.uid());

-- ============================================================
-- AUDIT LOGS (read-only for admin)
-- ============================================================
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_select_admin" ON public.audit_logs
  FOR SELECT USING (public.auth_role() IN ('SUPER_ADMIN', 'ADMIN'));

-- ============================================================
-- FINANCE
-- ============================================================
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "loans_select_own" ON public.loans
  FOR SELECT USING (farmer_id = public.auth_farmer_id());

CREATE POLICY "loans_select_admin" ON public.loans
  FOR SELECT USING (public.auth_role() IN ('SUPER_ADMIN', 'ADMIN', 'ANALYST', 'AGENT'));

CREATE POLICY "loans_insert_agent" ON public.loans
  FOR INSERT WITH CHECK (public.auth_role() IN ('AGENT', 'ADMIN', 'SUPER_ADMIN'));

CREATE POLICY "loans_update_admin" ON public.loans
  FOR UPDATE USING (public.auth_role() IN ('ADMIN', 'SUPER_ADMIN'));

-- ============================================================
-- CLIMATE
-- ============================================================
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.climate_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "weather_select_all" ON public.weather_data FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "alerts_select_all" ON public.climate_alerts FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);
CREATE POLICY "alerts_manage_admin" ON public.climate_alerts FOR ALL USING (public.auth_role() IN ('SUPER_ADMIN', 'ADMIN'));
