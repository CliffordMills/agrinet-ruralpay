-- Migration 009: Storage Hubs & IoT Devices

CREATE TABLE public.storage_hubs (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                 TEXT NOT NULL,
  code                 TEXT UNIQUE,
  region_id            UUID NOT NULL REFERENCES public.regions(id),
  district_id          UUID NOT NULL REFERENCES public.districts(id),
  address              TEXT,
  gps_lat              NUMERIC(10, 7),
  gps_lng              NUMERIC(10, 7),
  capacity_tonnes      NUMERIC(10, 3) NOT NULL DEFAULT 0,
  current_stock_tonnes NUMERIC(10, 3) NOT NULL DEFAULT 0,
  manager_id           UUID REFERENCES auth.users(id),
  is_active            BOOLEAN NOT NULL DEFAULT true,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_hubs_region ON public.storage_hubs(region_id);
CREATE INDEX idx_hubs_district ON public.storage_hubs(district_id);

CREATE TRIGGER trg_hubs_updated_at
  BEFORE UPDATE ON public.storage_hubs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Now add FK from agents to hubs
ALTER TABLE public.agents
  ADD CONSTRAINT fk_agents_hub FOREIGN KEY (hub_id) REFERENCES public.storage_hubs(id);

-- IoT sensor devices
CREATE TABLE public.iot_devices (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hub_id     UUID NOT NULL REFERENCES public.storage_hubs(id) ON DELETE CASCADE,
  device_id  TEXT NOT NULL UNIQUE,
  type       TEXT NOT NULL CHECK (type IN ('temperature', 'humidity', 'weight', 'camera')),
  is_online  BOOLEAN NOT NULL DEFAULT false,
  last_seen  TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_iot_devices_hub ON public.iot_devices(hub_id);

-- IoT sensor readings
CREATE TABLE public.sensor_readings (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id  UUID NOT NULL REFERENCES public.iot_devices(id) ON DELETE CASCADE,
  value      NUMERIC NOT NULL,
  unit       TEXT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sensor_readings_device_time ON public.sensor_readings(device_id, recorded_at DESC);
