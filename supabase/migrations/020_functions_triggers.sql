-- Migration 020: Utility Functions & Triggers

-- ============================================================
-- CREDIT SCORING FUNCTION
-- Recomputes credit score from farmer's history
-- ============================================================
CREATE OR REPLACE FUNCTION public.compute_credit_score(p_farmer_id UUID)
RETURNS INT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_score INT := 300;  -- baseline
  v_batch_count INT;
  v_payment_success_rate NUMERIC;
  v_total_volume NUMERIC;
  v_active_loans INT;
BEGIN
  -- Procurement history (+ve)
  SELECT COUNT(*), COALESCE(SUM(quantity_kg), 0)
    INTO v_batch_count, v_total_volume
    FROM public.commodity_batches
    WHERE farmer_id = p_farmer_id AND status IN ('stored', 'sold', 'exported');

  v_score := v_score + LEAST(v_batch_count * 5, 100);
  v_score := v_score + LEAST((v_total_volume / 1000)::INT, 150);

  -- Payment history
  SELECT
    CASE WHEN COUNT(*) > 0 THEN
      (COUNT(*) FILTER (WHERE status = 'successful'))::NUMERIC / COUNT(*) * 100
    ELSE 50 END
    INTO v_payment_success_rate
    FROM public.payments
    WHERE farmer_id = p_farmer_id;

  v_score := v_score + (v_payment_success_rate * 2)::INT;

  -- Active loans (negative impact if many)
  SELECT COUNT(*) INTO v_active_loans
    FROM public.loans
    WHERE farmer_id = p_farmer_id AND status IN ('disbursed', 'repaying');

  v_score := v_score - LEAST(v_active_loans * 20, 100);

  -- Clamp to 0–1000
  v_score := GREATEST(0, LEAST(1000, v_score));

  -- Record history
  INSERT INTO public.credit_score_history (farmer_id, score, previous, reason)
    SELECT p_farmer_id, v_score, credit_score, 'auto_compute'
    FROM public.farmers WHERE id = p_farmer_id;

  RETURN v_score;
END;
$$;

-- ============================================================
-- SEARCH FARMERS (full text + fuzzy)
-- ============================================================
CREATE OR REPLACE FUNCTION public.search_farmers(
  p_query TEXT,
  p_agent_id UUID DEFAULT NULL,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID, first_name TEXT, last_name TEXT, phone TEXT,
  digital_id TEXT, village_name TEXT, credit_score INT,
  similarity REAL
) LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT
    f.id, f.first_name, f.last_name, f.phone, f.digital_id,
    v.name AS village_name, f.credit_score,
    similarity(f.first_name || ' ' || f.last_name, p_query) AS similarity
  FROM public.farmers f
  JOIN public.villages v ON v.id = f.village_id
  WHERE
    f.is_active = true
    AND f.deleted_at IS NULL
    AND (p_agent_id IS NULL OR f.agent_id = p_agent_id)
    AND (
      f.first_name || ' ' || f.last_name ILIKE '%' || p_query || '%'
      OR f.phone ILIKE '%' || p_query || '%'
      OR f.digital_id ILIKE '%' || p_query || '%'
      OR similarity(f.first_name || ' ' || f.last_name, p_query) > 0.2
    )
  ORDER BY similarity DESC, f.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

-- ============================================================
-- PROCUREMENT SUMMARY BY AGENT
-- ============================================================
CREATE OR REPLACE FUNCTION public.agent_procurement_summary(p_agent_id UUID)
RETURNS TABLE (
  total_batches BIGINT,
  total_kg NUMERIC,
  total_value NUMERIC,
  farmer_count BIGINT,
  this_month_kg NUMERIC,
  this_month_value NUMERIC
) LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT
    COUNT(*) AS total_batches,
    COALESCE(SUM(quantity_kg), 0) AS total_kg,
    COALESCE(SUM(total_value), 0) AS total_value,
    COUNT(DISTINCT farmer_id) AS farmer_count,
    COALESCE(SUM(quantity_kg) FILTER (WHERE date_trunc('month', created_at) = date_trunc('month', now())), 0) AS this_month_kg,
    COALESCE(SUM(total_value) FILTER (WHERE date_trunc('month', created_at) = date_trunc('month', now())), 0) AS this_month_value
  FROM public.commodity_batches
  WHERE agent_id = p_agent_id;
$$;

-- ============================================================
-- DASHBOARD STATS (Admin)
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_dashboard_stats()
RETURNS JSONB LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT jsonb_build_object(
    'total_farmers', (SELECT COUNT(*) FROM public.farmers WHERE is_active = true AND deleted_at IS NULL),
    'total_agents', (SELECT COUNT(*) FROM public.agents WHERE is_active = true AND deleted_at IS NULL),
    'total_batches', (SELECT COUNT(*) FROM public.commodity_batches),
    'total_procurement_kg', (SELECT COALESCE(SUM(quantity_kg), 0) FROM public.commodity_batches),
    'total_payments_ghs', (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE status = 'successful'),
    'active_contracts', (SELECT COUNT(*) FROM public.contracts WHERE status NOT IN ('complete')),
    'hub_utilization', (
      SELECT COALESCE(
        jsonb_agg(jsonb_build_object(
          'hub_id', id, 'name', name,
          'utilization_pct', CASE WHEN capacity_tonnes > 0 THEN ROUND((current_stock_tonnes / capacity_tonnes * 100)::NUMERIC, 1) ELSE 0 END
        )),
        '[]'::jsonb
      )
      FROM public.storage_hubs WHERE is_active = true
    )
  );
$$;
