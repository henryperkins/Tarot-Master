import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { getApiUrl, apiRequest } from "@/lib/query-client";

export const SUBSCRIPTION_TIERS = {
  free: {
    name: "Seeker",
    label: "Free",
    price: 0,
    monthlyReadings: 5,
    monthlyTTS: 3,
    spreads: ["single", "threeCard", "fiveCard"],
    cloudJournal: false,
    advancedInsights: false,
    adFree: false,
    apiAccess: false,
  },
  plus: {
    name: "Enlightened",
    label: "Plus",
    price: 7.99,
    monthlyReadings: 50,
    monthlyTTS: 50,
    spreads: "all",
    cloudJournal: true,
    advancedInsights: true,
    adFree: true,
    apiAccess: false,
  },
  pro: {
    name: "Mystic",
    label: "Pro",
    price: 19.99,
    monthlyReadings: Infinity,
    monthlyTTS: Infinity,
    spreads: "all+custom",
    cloudJournal: true,
    advancedInsights: true,
    adFree: true,
    apiAccess: true,
    apiCallsPerMonth: 1000,
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

interface SubscriptionContextType {
  tier: SubscriptionTier;
  status: string | null;
  isLoading: boolean;
  isPaid: boolean;
  tierConfig: (typeof SUBSCRIPTION_TIERS)[SubscriptionTier];
  canUseSpread: (spreadKey: string) => boolean;
  refetchSubscription: () => Promise<void>;
  startCheckout: (priceId: string, tier: string) => Promise<void>;
  openBillingPortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>("free");
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSubscription = useCallback(async () => {
    if (!isAuthenticated) {
      setTier("free");
      setStatus(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(new URL("/api/subscription", getApiUrl()).toString(), {
        credentials: "include",
      });
      const data = await response.json();
      
      const normalizedTier = (data.tier || "free").toLowerCase() as SubscriptionTier;
      setTier(SUBSCRIPTION_TIERS[normalizedTier] ? normalizedTier : "free");
      setStatus(data.status);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      setTier("free");
      setStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription, user]);

  const startCheckout = useCallback(async (priceId: string, tierName: string) => {
    try {
      const response = await apiRequest("POST", "/api/checkout", { priceId, tier: tierName });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error starting checkout:", error);
      throw error;
    }
  }, []);

  const openBillingPortal = useCallback(async () => {
    try {
      const response = await apiRequest("POST", "/api/create-portal-session");
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error opening billing portal:", error);
      throw error;
    }
  }, []);

  const tierConfig = SUBSCRIPTION_TIERS[tier];
  const isPaid = tier !== "free" && ["active", "trialing", "past_due"].includes(status || "");

  const canUseSpread = useCallback((spreadKey: string): boolean => {
    if (tierConfig.spreads === "all" || tierConfig.spreads === "all+custom") {
      return true;
    }
    return Array.isArray(tierConfig.spreads) && tierConfig.spreads.includes(spreadKey);
  }, [tierConfig]);

  const value = useMemo(
    () => ({
      tier,
      status,
      isLoading,
      isPaid,
      tierConfig,
      canUseSpread,
      refetchSubscription: fetchSubscription,
      startCheckout,
      openBillingPortal,
    }),
    [tier, status, isLoading, isPaid, tierConfig, canUseSpread, fetchSubscription, startCheckout, openBillingPortal],
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}
