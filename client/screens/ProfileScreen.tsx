import { View, StyleSheet, Pressable, Platform, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription, SUBSCRIPTION_TIERS } from "@/contexts/SubscriptionContext";
import { Colors, Spacing, Typography, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { apiRequest } from "@/lib/query-client";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const { tier, isPaid, tierConfig, isLoading: subscriptionLoading, refetchSubscription } = useSubscription();
  const navigation = useNavigation<NavigationProp>();
  const [portalLoading, setPortalLoading] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleUpgrade = () => {
    navigation.navigate("Pricing");
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
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
      setPortalLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <Card style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          {user?.profileImage ? (
            <Image
              source={{ uri: user.profileImage }}
              style={styles.avatar}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Feather name="user" size={40} color={Colors.dark.textMuted} />
            </View>
          )}
        </View>

        <ThemedText style={styles.username}>{user?.username}</ThemedText>
        <ThemedText style={styles.memberSince}>
          Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "today"}
        </ThemedText>
      </Card>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Subscription</ThemedText>
        
        <Card style={styles.subscriptionCard}>
          {subscriptionLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.dark.primary} />
            </View>
          ) : (
            <>
              <View style={styles.subscriptionHeader}>
                <View style={styles.tierBadge}>
                  <Feather 
                    name={isPaid ? "star" : "user"} 
                    size={16} 
                    color={isPaid ? Colors.dark.primary : Colors.dark.textMuted} 
                  />
                  <ThemedText style={[styles.tierName, isPaid && styles.tierNamePaid]}>
                    {tierConfig.name}
                  </ThemedText>
                </View>
                <ThemedText style={styles.tierLabel}>
                  {tierConfig.label} Plan
                </ThemedText>
              </View>

              <View style={styles.subscriptionFeatures}>
                <FeatureRow 
                  label="Monthly Readings" 
                  value={tierConfig.monthlyReadings === Infinity ? "Unlimited" : `${tierConfig.monthlyReadings}`} 
                />
                <FeatureRow 
                  label="Voice Narrations" 
                  value={tierConfig.monthlyTTS === Infinity ? "Unlimited" : `${tierConfig.monthlyTTS}/mo`} 
                />
                <FeatureRow 
                  label="Cloud Journal" 
                  value={tierConfig.cloudJournal ? "Enabled" : "Local Only"} 
                  enabled={tierConfig.cloudJournal}
                />
              </View>

              {isPaid ? (
                <Button
                  title={portalLoading ? "Loading..." : "Manage Billing"}
                  onPress={handleManageBilling}
                  variant="secondary"
                  loading={portalLoading}
                  style={styles.billingButton}
                  testID="button-manage-billing"
                />
              ) : (
                <Button
                  title="Upgrade Plan"
                  onPress={handleUpgrade}
                  variant="primary"
                  style={styles.upgradeButton}
                  testID="button-upgrade"
                />
              )}
            </>
          )}
        </Card>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Account</ThemedText>
        
        <Card style={styles.menuCard}>
          <MenuItem
            icon="credit-card"
            label="Subscription Plans"
            onPress={handleUpgrade}
          />
          <View style={styles.menuDivider} />
          <MenuItem
            icon="settings"
            label="Settings"
            onPress={() => {}}
          />
          <View style={styles.menuDivider} />
          <MenuItem
            icon="help-circle"
            label="Help & Support"
            onPress={() => {}}
          />
          <View style={styles.menuDivider} />
          <MenuItem
            icon="info"
            label="About"
            onPress={() => {}}
          />
        </Card>
      </View>

      <View style={styles.section}>
        <Pressable
          onPress={handleLogout}
          style={styles.logoutButton}
          testID="button-logout"
        >
          <Feather name="log-out" size={18} color={Colors.dark.error} style={styles.logoutIcon} />
          <ThemedText style={styles.logoutText}>Sign Out</ThemedText>
        </Pressable>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

function FeatureRow({ 
  label, 
  value, 
  enabled = true 
}: { 
  label: string; 
  value: string; 
  enabled?: boolean;
}) {
  return (
    <View style={styles.featureRow}>
      <ThemedText style={styles.featureLabel}>{label}</ThemedText>
      <ThemedText style={[styles.featureValue, !enabled && styles.featureValueDisabled]}>
        {value}
      </ThemedText>
    </View>
  );
}

function MenuItem({ 
  icon, 
  label, 
  onPress 
}: { 
  icon: keyof typeof Feather.glyphMap; 
  label: string; 
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Feather name={icon} size={20} color={Colors.dark.textMuted} />
        <ThemedText style={styles.menuItemLabel}>{label}</ThemedText>
      </View>
      <Feather name="chevron-right" size={20} color={Colors.dark.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: "center",
    padding: Spacing["2xl"],
    marginBottom: Spacing.xl,
  },
  avatarContainer: {
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.dark.backgroundTertiary,
    justifyContent: "center",
    alignItems: "center",
  },
  username: {
    ...Typography.h3,
    color: Colors.dark.text,
    fontFamily: "CormorantGaramond_600SemiBold",
    marginBottom: Spacing.xs,
  },
  memberSince: {
    ...Typography.small,
    color: Colors.dark.textMuted,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.caption,
    color: Colors.dark.textMuted,
    marginBottom: Spacing.md,
    marginLeft: Spacing.xs,
  },
  subscriptionCard: {
    padding: Spacing.lg,
  },
  loadingContainer: {
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
  subscriptionHeader: {
    marginBottom: Spacing.lg,
  },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  tierName: {
    ...Typography.h4,
    color: Colors.dark.text,
    fontFamily: "CormorantGaramond_600SemiBold",
  },
  tierNamePaid: {
    color: Colors.dark.primary,
  },
  tierLabel: {
    ...Typography.small,
    color: Colors.dark.textMuted,
  },
  subscriptionFeatures: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featureLabel: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
  },
  featureValue: {
    ...Typography.body,
    color: Colors.dark.text,
    fontWeight: "500",
  },
  featureValueDisabled: {
    color: Colors.dark.textMuted,
  },
  billingButton: {
    marginTop: Spacing.sm,
  },
  upgradeButton: {
    marginTop: Spacing.sm,
  },
  menuCard: {
    padding: 0,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  menuItemLabel: {
    ...Typography.body,
    color: Colors.dark.text,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginHorizontal: Spacing.lg,
  },
  logoutButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.dark.error,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  logoutIcon: {
    marginRight: Spacing.sm,
  },
  logoutText: {
    ...Typography.body,
    color: Colors.dark.error,
    fontWeight: "500",
  },
});
