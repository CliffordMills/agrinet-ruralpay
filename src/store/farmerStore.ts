import { create } from "zustand";

interface FarmerProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  digital_id: string | null;
  credit_score: number;
  wallet_id: string | null;
}

interface WalletState {
  balance: number;
  currency: string;
}

interface FarmerState {
  profile: FarmerProfile | null;
  wallet: WalletState | null;
  setProfile: (profile: FarmerProfile | null) => void;
  setWallet: (wallet: WalletState | null) => void;
  reset: () => void;
}

export const useFarmerStore = create<FarmerState>((set) => ({
  profile: null,
  wallet: null,
  setProfile: (profile) => set({ profile }),
  setWallet: (wallet) => set({ wallet }),
  reset: () => set({ profile: null, wallet: null }),
}));
