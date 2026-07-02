-- Migration 012: Wallets & Transactions

CREATE TABLE public.wallets (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id  UUID NOT NULL REFERENCES public.farmers(id) ON DELETE RESTRICT,
  balance    NUMERIC(14, 4) NOT NULL DEFAULT 0 CHECK (balance >= 0),
  currency   TEXT NOT NULL DEFAULT 'GHS',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (farmer_id)
);

CREATE INDEX idx_wallets_farmer ON public.wallets(farmer_id);

CREATE TRIGGER trg_wallets_updated_at
  BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Now link farmers to their wallets
ALTER TABLE public.farmers
  ADD CONSTRAINT fk_farmers_wallet FOREIGN KEY (wallet_id) REFERENCES public.wallets(id);

-- Auto-create wallet when farmer is created
CREATE OR REPLACE FUNCTION public.create_farmer_wallet()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  wallet_id UUID;
BEGIN
  INSERT INTO public.wallets (farmer_id) VALUES (NEW.id) RETURNING id INTO wallet_id;
  UPDATE public.farmers SET wallet_id = wallet_id WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_farmers_create_wallet
  AFTER INSERT ON public.farmers
  FOR EACH ROW EXECUTE FUNCTION public.create_farmer_wallet();

CREATE TABLE public.transactions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id     UUID NOT NULL REFERENCES public.wallets(id) ON DELETE RESTRICT,
  payment_id    UUID,               -- FK added after payments table
  type          TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  amount        NUMERIC(14, 4) NOT NULL CHECK (amount > 0),
  balance_after NUMERIC(14, 4) NOT NULL,
  description   TEXT,
  reference     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_wallet ON public.transactions(wallet_id);
CREATE INDEX idx_transactions_created ON public.transactions(created_at DESC);
CREATE INDEX idx_transactions_payment ON public.transactions(payment_id);
