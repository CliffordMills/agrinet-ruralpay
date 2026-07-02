"use client";

import { useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useFarmerStore } from "@/store/farmerStore";
import { useAuthStore } from "@/store/authStore";

export function useFarmer() {
  const { profile, wallet, setProfile, setWallet } = useFarmerStore();
  const { user } = useAuthStore();

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;
    const supabase = createClient();
    const { data: farmerData } = await supabase
      .from("farmers")
      .select("*, villages(name, districts(name, regions(name)))")
      .eq("user_id", user.id)
      .single();
    if (farmerData) setProfile(farmerData);
  }, [user?.id, setProfile]);

  const fetchWallet = useCallback(async () => {
    if (!user?.id) return;
    const supabase = createClient();
    const { data: walletData } = await supabase
      .from("wallets")
      .select("*")
      .eq("owner_id", user.id)
      .eq("owner_type", "FARMER")
      .single();
    if (walletData) setWallet(walletData);
  }, [user?.id, setWallet]);

  useEffect(() => {
    fetchProfile();
    fetchWallet();
  }, [fetchProfile, fetchWallet]);

  return { profile, wallet, refetchProfile: fetchProfile, refetchWallet: fetchWallet };
}
