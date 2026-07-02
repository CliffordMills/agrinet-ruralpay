-- Migration 004: Geography
-- Ghana administrative geography: regions → districts → villages

CREATE TABLE public.regions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL UNIQUE,
  code       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.districts (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  region_id  UUID NOT NULL REFERENCES public.regions(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (region_id, name)
);

CREATE INDEX idx_districts_region ON public.districts(region_id);

CREATE TABLE public.villages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  district_id UUID NOT NULL REFERENCES public.districts(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  gps_lat     NUMERIC(10, 7),
  gps_lng     NUMERIC(10, 7),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (district_id, name)
);

CREATE INDEX idx_villages_district ON public.villages(district_id);
CREATE INDEX idx_villages_name_trgm ON public.villages USING gin(name gin_trgm_ops);
