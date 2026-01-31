import { View, StyleSheet, Pressable, Platform, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { useState, useEffect } from "react";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription, SUBSCRIPTION_TIERS, SubscriptionTier } from "@/contexts/SubscriptionContext";
import { Colors, Spacing, Typography, BorderRadius } from "@/constants/theme";
import { getApiUrl, apiRequest } from "@/lib/query-client";

interface ProductPrice {
  id: string;
  unit_amount: number;
  currency: string;
  recurring: { interval: string } | null;
  metadata: { tier?: string } | null;
}

interface Product {
  id: string;
  name: string;
  description: string;
  metadata: { tier?: string } | null;
  prices: ProductPrice[];
}

export default function PricingScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { user, isAuthenticated, login } = useAuth();
  const { tier: currentTier, isPaid, refetchSubscription, openBillingPortal } = useSubscription();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(new URL("/api/products", getApiUrl()).toString());
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (priceId: string, tier: string) => {
    if (!isAuthenticated) {
      await login();
      return;
    }

    setCheckoutLoading(priceId);
    try {
      const response = await apiRequest("POST", "/api/checkout", { priceId, tier });
      const data = await response.json();
      
      if (data.url) {
        if (Platform.OS === "web") {
          window.location.href = data.url;
        } else {
          const result = await WebBrowser.openBrowserAsync(data.url);
          if (result.type === "cancel" || result.type === "dismiss") {
            await refetchSubscription();
          }
        }
      }
    } catch (error) {
      console.error("Error starting checkout:", error);
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManageBilling = async () => {
    setCheckoutLoading("portal");
    try {
      const response = await apiRequest("POST", "/api/create-portal-session");
      const data = await response.json();
      
      if (data.url) {
        if (Platform.OS === "web") {
          window.location.href = data.url;
        } else {
          await WebBrowser.openBrowserAsync(data.url);
          await refetchSubscription();
        }
      }
    } catch (error) {
      console.error("Error opening billing portal:", error);
    } finally {
      setCheckoutLoading(null);
    }
  };

  const getPriceForTier = (tier: string): ProductPrice | null => {
    for (const product of products) {
      const productTier = product.metadata?.tier || product.name.toLowerCase();
      if (productTier === tier) {
        return product.prices[0] || null;
      }
      for (const price of product.prices) {
        if (price.metadata?.tier === tier) {
          return price;
        }
      }
    }
    return null;
  };

  const tierEntries = Object.entries(SUBSCRIPTION_TIERS) as [SubscriptionTier, typeof SUBSCRIPTION_TIERS[SubscriptionTier]][];

  return (
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={styles.header}>
        <ThemedText style={styles.title}>Choose Your Path</ThemedText>
        <ThemedText style={styles.subtitle}>
          Unlock deeper insights and unlimited readings
        </ThemedText>
      </View>

      {isPaid && (
        <Card style={styles.currentPlanCard}>
          <View style={styles.currentPlanHeader}>
            <Feather name="check-circle" size={20} color={Colors.dark.primary} />
            <ThemedText style={styles.currentPlanText}>
              Current Plan: {SUBSCRIPTION_TIERS[currentTier].name}
            </ThemedText>
          </View>
          <Button
            title="Manage Billing"
            onPress={handleManageBilling}
            variant="secondary"
            loading={checkoutLoading === "portal"}
            style={styles.manageBillingButton}
          />
        </Card>
      )}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      ) : (
        <View style={styles.tiersContainer}>
          {tierEntries.map(([tierKey, tierConfig]) => {
            const price = getPriceForTier(tierKey);
            const isCurrentTier = currentTier === tierKey;
            const isPopular = tierKey === "plus";

            return (
              <TierCard
                key={tierKey}
                tierKey={tierKey}
                tierConfig={tierConfig}
                price={price}
                isCurrentTier={isCurrentTier}
                isPopular={isPopular}
                isLoading={checkoutLoading === price?.id}
                onSubscribe={() => {
                  if (price) {
                    handleSubscribe(price.id, tierKey);
                  }
                }}
                isPaid={isPaid}
              />
            );
          })}
        </View>
      )}
    </KeyboardAwareScrollViewCompat>
  );
}

function TierCard({
  tierKey,
  tierConfig,
  price,
  isCurrentTier,
  isPopular,
  isLoading,
  onSubscribe,
  isPaid,
}: {
  tierKey: SubscriptionTier;
  tierConfig: typeof SUBSCRIPTION_TIERS[SubscriptionTier];
  price: ProductPrice | null;
  isCurrentTier: boolean;
  isPopular: boolean;
  isLoading: boolean;
  onSubscribe: () => void;
  isPaid: boolean;
}) {
  const priceAmount = price
    ? (price.unit_amount / 100).toFixed(2)
    : tierConfig.price.toFixed(2);
  const isFree = tierKey === "free";

  const features = [
    `${tierConfig.monthlyReadings === Infinity ? "Unlimited" : tierConfig.monthlyReadings} readings/month`,
    `${tierConfig.monthlyTTS === Infinity ? "Unlimited" : tierConfig.monthlyTTS} voice narrations/month`,
    tierConfig.cloudJournal ? "Cloud journal sync" : "Local journal only",
    tierConfig.advancedInsights ? "Advanced insights" : "Basic insights",
    tierConfig.adFree ? "Ad-free experience" : "With ads",
  ];

  if (tierConfig.apiAccess) {
    features.push("API access (1,000 calls/mo)");
  }

  return (
    <Card style={[styles.tierCard, isPopular && styles.popularCard]}>
      {isPopular && (
        <View style={styles.popularBadge}>
          <ThemedText style={styles.popularBadgeText}>Most Popular</ThemedText>
        </View>
      )}

      <View style={styles.tierHeader}>
        <ThemedText style={styles.tierName}>{tierConfig.name}</ThemedText>
        <ThemedText style={styles.tierLabel}>{tierConfig.label}</ThemedText>
      </View>

      <View style={styles.priceContainer}>
        <ThemedText style={styles.priceAmount}>
          ${isFree ? "0" : priceAmount}
        </ThemedText>
        {!isFree && <ThemedText style={styles.pricePeriod}>/month</ThemedText>}
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Feather
              name="check"
              size={16}
              color={Colors.dark.primary}
              style={styles.featureIcon}
            />
            <ThemedText style={styles.featureText}>{feature}</ThemedText>
          </View>
        ))}
      </View>

      {isCurrentTier ? (
        <View style={styles.currentBadge}>
          <ThemedText style={styles.currentBadgeText}>Current Plan</ThemedText>
        </View>
      ) : isFree ? (
        <View style={styles.freeButton}>
          <ThemedText style={styles.freeButtonText}>Free Forever</ThemedText>
        </View>
      ) : (
        <Button
          title={isLoading ? "Loading..." : `Subscribe to ${tierConfig.label}`}
          onPress={onSubscribe}
          variant={isPopular ? "primary" : "secondary"}
          loading={isLoading}
          disabled={isLoading || !price}
          testID={`button-subscribe-${tierKey}`}
        />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    color: Colors.dark.text,
    fontFamily: "CormorantGaramond_600SemiBold",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    ...Typography.body,
    color: Colors.dark.textMuted,
    textAlign: "center",
  },
  currentPlanCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    backgroundColor: Colors.dark.backgroundSecondary,
  },
  currentPlanHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  currentPlanText: {
    ...Typography.body,
    color: Colors.dark.text,
    fontWeight: "600",
  },
  manageBillingButton: {
    marginTop: Spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
  },
  tiersContainer: {
    gap: Spacing.lg,
  },
  tierCard: {
    padding: Spacing.xl,
    position: "relative",
  },
  popularCard: {
    borderWidth: 2,
    borderColor: Colors.dark.primary,
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    alignSelf: "center",
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  popularBadgeText: {
    ...Typography.small,
    color: Colors.dark.text,
    fontWeight: "600",
  },
  tierHeader: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  tierName: {
    ...Typography.h3,
    color: Colors.dark.text,
    fontFamily: "CormorantGaramond_600SemiBold",
  },
  tierLabel: {
    ...Typography.small,
    color: Colors.dark.textMuted,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  priceAmount: {
    ...Typography.h1,
    color: Colors.dark.text,
    fontWeight: "700",
  },
  pricePeriod: {
    ...Typography.body,
    color: Colors.dark.textMuted,
    marginLeft: Spacing.xs,
  },
  featuresContainer: {
    marginBottom: Spacing.xl,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  featureIcon: {
    marginRight: Spacing.sm,
  },
  featureText: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    flex: 1,
  },
  currentBadge: {
    backgroundColor: Colors.dark.backgroundTertiary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  currentBadgeText: {
    ...Typography.body,
    color: Colors.dark.textMuted,
    fontWeight: "500",
  },
  freeButton: {
    backgroundColor: Colors.dark.backgroundTertiary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  freeButtonText: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    fontWeight: "500",
  },
});
