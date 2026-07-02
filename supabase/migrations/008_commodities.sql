-- Migration 008: Commodities & Grades

CREATE TABLE public.commodities (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name      TEXT NOT NULL UNIQUE,
  code      TEXT NOT NULL UNIQUE,
  unit      TEXT NOT NULL DEFAULT 'kg',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.commodity_grades (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commodity_id      UUID NOT NULL REFERENCES public.commodities(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  code              TEXT NOT NULL,
  min_score         NUMERIC(5, 2) NOT NULL DEFAULT 0,
  max_score         NUMERIC(5, 2) NOT NULL DEFAULT 100,
  price_premium_pct NUMERIC(5, 2) NOT NULL DEFAULT 0,
  description       TEXT,
  UNIQUE (commodity_id, code)
);

CREATE INDEX idx_commodity_grades_commodity ON public.commodity_grades(commodity_id);

-- Market prices (daily reference prices per commodity/grade)
CREATE TABLE public.market_prices (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commodity_id UUID NOT NULL REFERENCES public.commodities(id),
  grade_id     UUID REFERENCES public.commodity_grades(id),
  region_id    UUID REFERENCES public.regions(id),
  price_per_kg NUMERIC(10, 4) NOT NULL,
  currency     TEXT NOT NULL DEFAULT 'GHS',
  price_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  source       TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_market_prices_commodity_date ON public.market_prices(commodity_id, price_date DESC);
