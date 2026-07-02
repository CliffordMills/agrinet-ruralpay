-- Migration 011: Traceability & Batch Events

CREATE TABLE public.batch_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id    UUID NOT NULL REFERENCES public.commodity_batches(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,
  description TEXT,
  actor_id    UUID REFERENCES auth.users(id),
  gps_lat     NUMERIC(10, 7),
  gps_lng     NUMERIC(10, 7),
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_batch_events_batch ON public.batch_events(batch_id);
CREATE INDEX idx_batch_events_created ON public.batch_events(created_at DESC);

-- QR code scan log
CREATE TABLE public.qr_scans (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id    UUID NOT NULL REFERENCES public.commodity_batches(id) ON DELETE CASCADE,
  scanned_by  UUID REFERENCES auth.users(id),
  gps_lat     NUMERIC(10, 7),
  gps_lng     NUMERIC(10, 7),
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_qr_scans_batch ON public.qr_scans(batch_id);

-- Auto-log batch status changes as events
CREATE OR REPLACE FUNCTION public.log_batch_event()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.batch_events (batch_id, event_type, description)
    VALUES (NEW.id, 'STATUS_CHANGE', OLD.status || ' → ' || NEW.status);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_batches_log_event
  AFTER UPDATE ON public.commodity_batches
  FOR EACH ROW EXECUTE FUNCTION public.log_batch_event();
