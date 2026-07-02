-- Migration 006: Agents

CREATE TABLE public.agents (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  hub_id      UUID,               -- FK added after hubs table
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  phone       TEXT NOT NULL UNIQUE,
  employee_id TEXT UNIQUE,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ
);

CREATE INDEX idx_agents_user ON public.agents(user_id);
CREATE INDEX idx_agents_hub ON public.agents(hub_id);
CREATE INDEX idx_agents_active ON public.agents(is_active) WHERE is_active = true;

CREATE TRIGGER trg_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Now add FK from farmers to agents
ALTER TABLE public.farmers
  ADD CONSTRAINT fk_farmers_agent FOREIGN KEY (agent_id) REFERENCES public.agents(id);

-- Agent village assignments (which villages an agent covers)
CREATE TABLE public.agent_villages (
  agent_id   UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  village_id UUID NOT NULL REFERENCES public.villages(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (agent_id, village_id)
);

CREATE INDEX idx_agent_villages_village ON public.agent_villages(village_id);
