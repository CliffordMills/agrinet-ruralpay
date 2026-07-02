import { create } from "zustand";

interface Listing {
  id: string;
  commodity: string;
  grade: string;
  quantity_kg: number;
  price_per_kg: number;
  hub_name: string;
  region: string;
}

interface MarketplaceState {
  listings: Listing[];
  filters: { commodity?: string; grade?: string; region?: string; };
  setListings: (listings: Listing[]) => void;
  setFilters: (filters: MarketplaceState["filters"]) => void;
  reset: () => void;
}

export const useMarketplaceStore = create<MarketplaceState>((set) => ({
  listings: [],
  filters: {},
  setListings: (listings) => set({ listings }),
  setFilters: (filters) => set({ filters }),
  reset: () => set({ listings: [], filters: {} }),
}));
