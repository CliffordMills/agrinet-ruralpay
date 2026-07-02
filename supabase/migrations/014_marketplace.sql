-- Migration 014: Marketplace — Orders, Contracts, Bids

CREATE TABLE public.marketplace_listings (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hub_id         UUID NOT NULL REFERENCES public.storage_hubs(id),
  commodity_id   UUID NOT NULL REFERENCES public.commodities(id),
  grade_id       UUID REFERENCES public.commodity_grades(id),
  quantity_kg    NUMERIC(12, 3) NOT NULL CHECK (quantity_kg > 0),
  price_per_kg   NUMERIC(10, 4) NOT NULL CHECK (price_per_kg > 0),
  currency       TEXT NOT NULL DEFAULT 'GHS',
  valid_until    DATE,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_by     UUID REFERENCES auth.users(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_listings_commodity ON public.marketplace_listings(commodity_id);
CREATE INDEX idx_listings_hub ON public.marketplace_listings(hub_id);
CREATE INDEX idx_listings_active ON public.marketplace_listings(is_active) WHERE is_active = true;

CREATE TRIGGER trg_listings_updated_at
  BEFORE UPDATE ON public.marketplace_listings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.bids (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id   UUID NOT NULL REFERENCES public.marketplace_listings(id),
  buyer_id     UUID NOT NULL REFERENCES public.buyers(id),
  quantity_kg  NUMERIC(12, 3) NOT NULL CHECK (quantity_kg > 0),
  price_per_kg NUMERIC(10, 4) NOT NULL CHECK (price_per_kg > 0),
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bids_listing ON public.bids(listing_id);
CREATE INDEX idx_bids_buyer ON public.bids(buyer_id);

CREATE TRIGGER trg_bids_updated_at
  BEFORE UPDATE ON public.bids
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.contracts (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bid_id           UUID REFERENCES public.bids(id),
  listing_id       UUID NOT NULL REFERENCES public.marketplace_listings(id),
  buyer_id         UUID NOT NULL REFERENCES public.buyers(id),
  hub_id           UUID NOT NULL REFERENCES public.storage_hubs(id),
  quantity_kg      NUMERIC(12, 3) NOT NULL,
  price_per_kg     NUMERIC(10, 4) NOT NULL,
  total_value      NUMERIC(14, 4) GENERATED ALWAYS AS (quantity_kg * price_per_kg) STORED,
  currency         TEXT NOT NULL DEFAULT 'GHS',
  status           order_status NOT NULL DEFAULT 'pending',
  delivery_date    DATE,
  payment_terms    TEXT,
  signed_at        TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contracts_buyer ON public.contracts(buyer_id);
CREATE INDEX idx_contracts_hub ON public.contracts(hub_id);
CREATE INDEX idx_contracts_status ON public.contracts(status);

CREATE TRIGGER trg_contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
