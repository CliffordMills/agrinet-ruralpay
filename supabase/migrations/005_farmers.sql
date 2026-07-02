-- Migration 005: Farmers

CREATE TABLE public.farmers (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  agent_id       UUID NOT NULL,  -- FK added after agents table
  village_id     UUID NOT NULL REFERENCES public.villages(id),
  first_name     TEXT NOT NULL,
  last_name      TEXT NOT NULL,
  phone          TEXT NOT NULL,
  ghana_card_id  TEXT UNIQUE,
  date_of_birth  DATE,
  gender         TEXT CHECK (gender IN ('male', 'female', 'other')),
  photo_url      TEXT,
  digital_id     TEXT UNIQUE,
  wallet_id      UUID,           -- FK added after wallets table
  credit_score   INT NOT NULL DEFAULT 0 CHECK (credit_score >= 0 AND credit_score <= 1000),
  total_farms_ha NUMERIC(10, 4) DEFAULT 0,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at     TIMESTAMPTZ
);

CREATE INDEX idx_farmers_agent ON public.farmers(agent_id);
CREATE INDEX idx_farmers_village ON public.farmers(village_id);
CREATE INDEX idx_farmers_user ON public.farmers(user_id);
CREATE INDEX idx_farmers_phone ON public.farmers(phone);
CREATE INDEX idx_farmers_active ON public.farmers(is_active) WHERE is_active = true;
CREATE INDEX idx_farmers_name_trgm ON public.farmers USING gin((first_name || ' ' || last_name) gin_trgm_ops);

CREATE TRIGGER trg_farmers_updated_at
  BEFORE UPDATE ON public.farmers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Generate digital ID on insert
CREATE OR REPLACE FUNCTION public.generate_farmer_digital_id()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.digital_id IS NULL THEN
    NEW.digital_id := 'AGN-' || upper(substring(encode(gen_random_bytes(4), 'hex'), 1, 8));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_farmers_digital_id
  BEFORE INSERT ON public.farmers
  FOR EACH ROW EXECUTE FUNCTION public.generate_farmer_digital_id();

-- Farms (land parcels)
CREATE TABLE public.farms (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id   UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  name        TEXT,
  area_ha     NUMERIC(10, 4) NOT NULL,
  gps_lat     NUMERIC(10, 7),
  gps_lng     NUMERIC(10, 7),
  soil_type   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_farms_farmer ON public.farms(farmer_id);
