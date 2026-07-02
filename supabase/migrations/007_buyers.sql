-- Migration 007: Buyers

CREATE TABLE public.buyers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  company_name    TEXT NOT NULL,
  registration_no TEXT UNIQUE,
  country         TEXT NOT NULL DEFAULT 'GH',
  contact_name    TEXT NOT NULL,
  contact_phone   TEXT NOT NULL,
  contact_email   TEXT,
  is_verified     BOOLEAN NOT NULL DEFAULT false,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_buyers_user ON public.buyers(user_id);
CREATE INDEX idx_buyers_verified ON public.buyers(is_verified);

CREATE TRIGGER trg_buyers_updated_at
  BEFORE UPDATE ON public.buyers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
