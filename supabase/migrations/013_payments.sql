-- Migration 013: Payments

CREATE TABLE public.payments (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id      UUID NOT NULL REFERENCES public.farmers(id),
  batch_id       UUID REFERENCES public.commodity_batches(id),
  amount         NUMERIC(14, 4) NOT NULL CHECK (amount > 0),
  currency       TEXT NOT NULL DEFAULT 'GHS',
  provider       payment_provider NOT NULL,
  provider_ref   TEXT,
  phone_number   TEXT,
  account_number TEXT,
  status         payment_status NOT NULL DEFAULT 'pending',
  initiated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at   TIMESTAMPTZ,
  failure_reason TEXT,
  metadata       JSONB,
  initiated_by   UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_payments_farmer ON public.payments(farmer_id);
CREATE INDEX idx_payments_batch ON public.payments(batch_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_provider_ref ON public.payments(provider_ref) WHERE provider_ref IS NOT NULL;
CREATE INDEX idx_payments_initiated ON public.payments(initiated_at DESC);

-- Add FK from transactions to payments
ALTER TABLE public.transactions
  ADD CONSTRAINT fk_transactions_payment FOREIGN KEY (payment_id) REFERENCES public.payments(id);

-- Credit farmer wallet on successful payment
CREATE OR REPLACE FUNCTION public.credit_wallet_on_payment()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_wallet_id UUID;
  v_new_balance NUMERIC;
BEGIN
  IF NEW.status = 'successful' AND OLD.status != 'successful' THEN
    SELECT wallet_id INTO v_wallet_id FROM public.farmers WHERE id = NEW.farmer_id;
    IF v_wallet_id IS NOT NULL THEN
      UPDATE public.wallets SET balance = balance + NEW.amount WHERE id = v_wallet_id RETURNING balance INTO v_new_balance;
      INSERT INTO public.transactions (wallet_id, payment_id, type, amount, balance_after, description)
        VALUES (v_wallet_id, NEW.id, 'credit', NEW.amount, v_new_balance, 'Payment for batch ' || COALESCE((SELECT grn_number FROM public.commodity_batches WHERE id = NEW.batch_id), 'N/A'));
      UPDATE public.payments SET completed_at = now() WHERE id = NEW.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_payment_credit_wallet
  AFTER UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.credit_wallet_on_payment();
