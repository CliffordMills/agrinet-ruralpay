-- Migration 015: Finance — Credit Scores, Loans, Insurance

-- Credit score history
CREATE TABLE public.credit_score_history (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id   UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  score       INT NOT NULL CHECK (score >= 0 AND score <= 1000),
  previous    INT,
  reason      TEXT,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_credit_history_farmer ON public.credit_score_history(farmer_id);
CREATE INDEX idx_credit_history_time ON public.credit_score_history(computed_at DESC);

-- Update farmer.credit_score when new history row inserted
CREATE OR REPLACE FUNCTION public.sync_credit_score()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.farmers SET credit_score = NEW.score WHERE id = NEW.farmer_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sync_credit_score
  AFTER INSERT ON public.credit_score_history
  FOR EACH ROW EXECUTE FUNCTION public.sync_credit_score();

-- Loans
CREATE TABLE public.loans (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id        UUID NOT NULL REFERENCES public.farmers(id),
  amount           NUMERIC(14, 4) NOT NULL CHECK (amount > 0),
  currency         TEXT NOT NULL DEFAULT 'GHS',
  interest_rate    NUMERIC(5, 4) NOT NULL DEFAULT 0,
  term_weeks       INT NOT NULL DEFAULT 4,
  status           loan_status NOT NULL DEFAULT 'applied',
  disbursed_at     TIMESTAMPTZ,
  due_date         DATE,
  repaid_amount    NUMERIC(14, 4) NOT NULL DEFAULT 0,
  purpose          TEXT,
  approved_by      UUID REFERENCES auth.users(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_loans_farmer ON public.loans(farmer_id);
CREATE INDEX idx_loans_status ON public.loans(status);
CREATE INDEX idx_loans_due ON public.loans(due_date) WHERE status = 'repaying';

CREATE TRIGGER trg_loans_updated_at
  BEFORE UPDATE ON public.loans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insurance
CREATE TABLE public.insurance_policies (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id    UUID NOT NULL REFERENCES public.farmers(id),
  farm_id      UUID REFERENCES public.farms(id),
  policy_no    TEXT UNIQUE,
  type         TEXT NOT NULL CHECK (type IN ('crop', 'weather', 'livestock')),
  coverage_amt NUMERIC(14, 4) NOT NULL,
  premium_amt  NUMERIC(14, 4) NOT NULL,
  currency     TEXT NOT NULL DEFAULT 'GHS',
  start_date   DATE NOT NULL,
  end_date     DATE NOT NULL,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_insurance_farmer ON public.insurance_policies(farmer_id);
CREATE INDEX idx_insurance_active ON public.insurance_policies(is_active, end_date);
