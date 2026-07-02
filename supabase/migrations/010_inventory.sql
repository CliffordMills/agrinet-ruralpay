-- Migration 010: Inventory & Commodity Batches

CREATE TABLE public.commodity_batches (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id       TEXT NOT NULL UNIQUE DEFAULT ('BATCH-' || upper(encode(gen_random_bytes(5), 'hex'))),
  farmer_id      UUID NOT NULL REFERENCES public.farmers(id),
  agent_id       UUID NOT NULL REFERENCES public.agents(id),
  hub_id         UUID REFERENCES public.storage_hubs(id),
  commodity_id   UUID NOT NULL REFERENCES public.commodities(id),
  grade_id       UUID REFERENCES public.commodity_grades(id),
  quantity_kg    NUMERIC(12, 3) NOT NULL CHECK (quantity_kg > 0),
  moisture_pct   NUMERIC(5, 2) CHECK (moisture_pct >= 0 AND moisture_pct <= 100),
  purchase_price NUMERIC(12, 4) NOT NULL CHECK (purchase_price > 0),
  total_value    NUMERIC(14, 4) GENERATED ALWAYS AS (quantity_kg * purchase_price) STORED,
  gps_lat        NUMERIC(10, 7),
  gps_lng        NUMERIC(10, 7),
  grn_number     TEXT UNIQUE,    -- Goods Received Note
  qr_code_url    TEXT,
  status         batch_status NOT NULL DEFAULT 'received',
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_batches_farmer ON public.commodity_batches(farmer_id);
CREATE INDEX idx_batches_agent ON public.commodity_batches(agent_id);
CREATE INDEX idx_batches_hub ON public.commodity_batches(hub_id);
CREATE INDEX idx_batches_commodity ON public.commodity_batches(commodity_id);
CREATE INDEX idx_batches_status ON public.commodity_batches(status);
CREATE INDEX idx_batches_created ON public.commodity_batches(created_at DESC);

CREATE TRIGGER trg_batches_updated_at
  BEFORE UPDATE ON public.commodity_batches
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Generate GRN number on insert
CREATE OR REPLACE FUNCTION public.generate_grn()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.grn_number IS NULL THEN
    NEW.grn_number := 'GRN-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substring(encode(gen_random_bytes(3), 'hex'), 1, 6));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_batches_grn
  BEFORE INSERT ON public.commodity_batches
  FOR EACH ROW EXECUTE FUNCTION public.generate_grn();

-- Update hub stock when batch status changes
CREATE OR REPLACE FUNCTION public.update_hub_stock()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.hub_id IS NOT NULL THEN
    IF OLD.status != 'stored' AND NEW.status = 'stored' THEN
      UPDATE public.storage_hubs
        SET current_stock_tonnes = current_stock_tonnes + (NEW.quantity_kg / 1000)
        WHERE id = NEW.hub_id;
    ELSIF OLD.status = 'stored' AND NEW.status IN ('sold', 'exported') THEN
      UPDATE public.storage_hubs
        SET current_stock_tonnes = GREATEST(0, current_stock_tonnes - (NEW.quantity_kg / 1000))
        WHERE id = NEW.hub_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_batches_hub_stock
  AFTER UPDATE ON public.commodity_batches
  FOR EACH ROW EXECUTE FUNCTION public.update_hub_stock();
