-- Migration 016: Climate Intelligence — Weather Data & Alerts

CREATE TABLE public.weather_data (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  district_id  UUID REFERENCES public.districts(id),
  village_id   UUID REFERENCES public.villages(id),
  gps_lat      NUMERIC(10, 7) NOT NULL,
  gps_lng      NUMERIC(10, 7) NOT NULL,
  temperature  NUMERIC(5, 2),       -- °C
  humidity     NUMERIC(5, 2),       -- %
  rainfall_mm  NUMERIC(8, 2),       -- mm
  wind_speed   NUMERIC(6, 2),       -- m/s
  wind_dir     NUMERIC(5, 1),       -- degrees
  description  TEXT,
  source       TEXT NOT NULL DEFAULT 'openweather',
  recorded_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_weather_district ON public.weather_data(district_id);
CREATE INDEX idx_weather_village ON public.weather_data(village_id);
CREATE INDEX idx_weather_time ON public.weather_data(recorded_at DESC);

-- Climate alerts
CREATE TABLE public.climate_alerts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  region_id    UUID REFERENCES public.regions(id),
  district_id  UUID REFERENCES public.districts(id),
  title        TEXT NOT NULL,
  message      TEXT NOT NULL,
  severity     alert_severity NOT NULL DEFAULT 'info',
  alert_type   TEXT NOT NULL CHECK (alert_type IN ('drought', 'flood', 'frost', 'pest', 'disease', 'general')),
  valid_from   TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until  TIMESTAMPTZ,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_by   UUID REFERENCES auth.users(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_alerts_region ON public.climate_alerts(region_id);
CREATE INDEX idx_alerts_district ON public.climate_alerts(district_id);
CREATE INDEX idx_alerts_active ON public.climate_alerts(is_active, valid_until);
CREATE INDEX idx_alerts_severity ON public.climate_alerts(severity);

-- Crop calendar
CREATE TABLE public.crop_calendar (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commodity_id  UUID NOT NULL REFERENCES public.commodities(id),
  region_id     UUID REFERENCES public.regions(id),
  activity      TEXT NOT NULL,
  month_start   INT NOT NULL CHECK (month_start BETWEEN 1 AND 12),
  month_end     INT NOT NULL CHECK (month_end BETWEEN 1 AND 12),
  notes         TEXT
);

CREATE INDEX idx_crop_calendar_commodity ON public.crop_calendar(commodity_id);
