import { create } from "zustand";

interface AgentState {
  farmerCount: number;
  procurementVolume: number;
  setStats: (stats: { farmerCount: number; procurementVolume: number }) => void;
  reset: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  farmerCount: 0,
  procurementVolume: 0,
  setStats: (stats) => set(stats),
  reset: () => set({ farmerCount: 0, procurementVolume: 0 }),
}));
