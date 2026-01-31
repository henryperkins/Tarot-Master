import { View, StyleSheet, ScrollView, Pressable, Alert, Linking, Platform, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { HeaderLogo } from "@/components/HeaderLogo";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription, SUBSCRIPTION_TIERS } from "@/contexts/SubscriptionContext";
import { Colors, Spacing, BorderRadius, Fonts, Typography } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { apiRequest } from "@/lib/query-client";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SettingsItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Feather.glyphMap;
  onPress?: () => void;
  isDestructive?: boolean;
}

const JOURNAL_STORAGE_KEY = "@tableu_journal";

export function SettingsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavigationProp>();
  const { user, isAuthenticated, login, logout, isLoading: authLoading } = useAuth();
  const { tier, isPaid, tierConfig, isLoading: subscriptionLoading, refetchSubscription } = useSubscription();
  const [portalLoading, setPortalLoading] = useState(false);

  const handleLogin = async () => {
    await login();
  };

  const handleLogout = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await logout();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
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

  const handleClearJournal = () => {
    Alert.alert(
      "Clear Journal",
      "This will permanently delete all your saved readings. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem(JOURNAL_STORAGE_KEY);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("Journal Cleared", "All readings have been removed.");
          },
        },
      ]
    );
  };

  const settingsSections: { title: string; items: SettingsItem[] }[] = [
    {
      title: "Reading Preferences",
      items: [
        {
          id: "reversals",
          title: "Include Reversed Cards",
          subtitle: "Allow cards to appear upside-down",
          icon: "refresh-cw",
        },
        {
          id: "haptics",
          title: "Haptic Feedback",
          subtitle: "Vibration during interactions",
          icon: "smartphone",
        },
      ],
    },
    {
      title: "Data",
      items: [
        {
          id: "clear",
          title: "Clear Journal",
          subtitle: "Remove all saved readings",
          icon: "trash-2",
          onPress: handleClearJournal,
          isDestructive: true,
        },
      ],
    },
    {
      title: "About",
      items: [
        {
          id: "version",
          title: "Version",
          subtitle: Constants.expoConfig?.version || "1.0.0",
          icon: "info",
        },
        {
          id: "privacy",
          title: "Privacy Policy",
          icon: "shield",
          onPress: () => {
            if (Platform.OS !== "web") {
              Linking.openURL("https://example.com/privacy");
            }
          },
        },
        {
          id: "terms",
          title: "Terms of Service",
          icon: "file-text",
          onPress: () => {
            if (Platform.OS !== "web") {
              Linking.openURL("https://example.com/terms");
            }
          },
        },
      ],
    },
  ];

  const renderSettingsItem = (item: SettingsItem) => (
    <Pressable
      key={item.id}
      onPress={item.onPress}
      disabled={!item.onPress}
      style={({ pressed }) => [
        styles.settingsItem,
        { backgroundColor: theme.backgroundSecondary, opacity: pressed && item.onPress ? 0.7 : 1 },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.backgroundRoot }]}>
        <Feather
          name={item.icon}
          size={18}
          color={item.isDestructive ? theme.error : theme.primary}
        />
      </View>
      <View style={styles.itemContent}>
        <ThemedText
          style={[styles.itemTitle, item.isDestructive && { color: theme.error }]}
        >
          {item.title}
        </ThemedText>
        {item.subtitle ? (
          <ThemedText style={[styles.itemSubtitle, { color: theme.textMuted }]}>
            {item.subtitle}
          </ThemedText>
        ) : null}
      </View>
      {item.onPress ? (
        <Feather name="chevron-right" size={18} color={theme.textMuted} />
      ) : null}
    </Pressable>
  );

  return (
    <ThemedView variant="root" style={styles.container}>
      <LinearGradient
        colors={[theme.backgroundRoot, theme.backgroundDefault, theme.backgroundRoot]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + Spacing.lg, paddingBottom: tabBarHeight + Spacing["2xl"] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <HeaderLogo />
          <ThemedText type="caption" style={[styles.headerSubtitle, { color: theme.textMuted }]}>
            Settings
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="caption" style={[styles.sectionTitle, { color: theme.textMuted }]}>
            Account
          </ThemedText>
          <View style={[styles.sectionContent, { backgroundColor: theme.backgroundSecondary }]}>
            {authLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.primary} />
              </View>
            ) : isAuthenticated && user ? (
              <View style={styles.accountCard}>
                <View style={styles.userInfo}>
                  {user.profileImage ? (
                    <Image
                      source={{ uri: user.profileImage }}
                      style={styles.avatar}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder, { backgroundColor: theme.backgroundRoot }]}>
                      <Feather name="user" size={24} color={theme.textMuted} />
                    </View>
                  )}
                  <View style={styles.userDetails}>
                    <ThemedText style={styles.username}>{user.username}</ThemedText>
                    <View style={styles.tierBadge}>
                      <Feather 
                        name={isPaid ? "star" : "user"} 
                        size={12} 
                        color={isPaid ? theme.primary : theme.textMuted} 
                      />
                      <ThemedText style={[styles.tierText, isPaid && { color: theme.primary }]}>
                        {tierConfig.name} Plan
                      </ThemedText>
                    </View>
                  </View>
                </View>
                <Pressable 
                  onPress={handleLogout}
                  style={styles.logoutButton}
                  testID="button-logout"
                >
                  <Feather name="log-out" size={18} color={theme.error} />
                </Pressable>
              </View>
            ) : (
              <View style={styles.signInContainer}>
                <ThemedText style={[styles.signInText, { color: theme.textSecondary }]}>
                  Sign in to sync your readings and unlock premium features
                </ThemedText>
                <Button
                  title="Sign In with Replit"
                  onPress={handleLogin}
                  variant="primary"
                  style={styles.signInButton}
                  testID="button-sign-in"
                />
              </View>
            )}
          </View>
        </View>

        {isAuthenticated ? (
          <View style={styles.section}>
            <ThemedText type="caption" style={[styles.sectionTitle, { color: theme.textMuted }]}>
              Subscription
            </ThemedText>
            <View style={[styles.sectionContent, { backgroundColor: theme.backgroundSecondary }]}>
              {subscriptionLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={theme.primary} />
                </View>
              ) : (
                <View style={styles.subscriptionContainer}>
                  <View style={styles.subscriptionInfo}>
                    <View style={styles.subscriptionRow}>
                      <ThemedText style={styles.subscriptionLabel}>Current Plan</ThemedText>
                      <ThemedText style={[styles.subscriptionValue, isPaid && { color: theme.primary }]}>
                        {tierConfig.name} ({tierConfig.label})
                      </ThemedText>
                    </View>
                    <View style={styles.subscriptionRow}>
                      <ThemedText style={styles.subscriptionLabel}>Monthly Readings</ThemedText>
                      <ThemedText style={styles.subscriptionValue}>
                        {tierConfig.monthlyReadings === Infinity ? "Unlimited" : tierConfig.monthlyReadings}
                      </ThemedText>
                    </View>
                    <View style={styles.subscriptionRow}>
                      <ThemedText style={styles.subscriptionLabel}>Cloud Journal</ThemedText>
                      <ThemedText style={styles.subscriptionValue}>
                        {tierConfig.cloudJournal ? "Enabled" : "Local Only"}
                      </ThemedText>
                    </View>
                  </View>
                  
                  {isPaid ? (
                    <Button
                      title={portalLoading ? "Loading..." : "Manage Billing"}
                      onPress={handleManageBilling}
                      variant="secondary"
                      loading={portalLoading}
                      style={styles.subscriptionButton}
                      testID="button-manage-billing"
                    />
                  ) : (
                    <Button
                      title="Upgrade Plan"
                      onPress={handleUpgrade}
                      variant="primary"
                      style={styles.subscriptionButton}
                      testID="button-upgrade"
                    />
                  )}
                </View>
              )}
            </View>
          </View>
        ) : null}

        <Pressable
          onPress={handleUpgrade}
          style={[styles.pricingLink, { backgroundColor: theme.backgroundSecondary }]}
          testID="button-view-plans"
        >
          <View style={[styles.iconContainer, { backgroundColor: theme.backgroundRoot }]}>
            <Feather name="credit-card" size={18} color={theme.primary} />
          </View>
          <View style={styles.itemContent}>
            <ThemedText style={styles.itemTitle}>View Subscription Plans</ThemedText>
            <ThemedText style={[styles.itemSubtitle, { color: theme.textMuted }]}>
              Unlock premium features
            </ThemedText>
          </View>
          <Feather name="chevron-right" size={18} color={theme.textMuted} />
        </Pressable>

        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <ThemedText type="caption" style={[styles.sectionTitle, { color: theme.textMuted }]}>
              {section.title}
            </ThemedText>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingsItem)}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <ThemedText style={[styles.footerText, { color: theme.textMuted }]}>
            Made with mystical intentions
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing["2xl"],
  },
  headerSubtitle: {
    marginTop: Spacing.sm,
  },
  section: {
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    marginLeft: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionContent: {
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.dark.borderLight,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
  },
  itemSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  footer: {
    alignItems: "center",
    marginTop: Spacing["3xl"],
  },
  footerText: {
    fontSize: 13,
  },
  loadingContainer: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  userDetails: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
  },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  tierText: {
    fontSize: 13,
  },
  logoutButton: {
    padding: Spacing.sm,
  },
  signInContainer: {
    padding: Spacing.lg,
    alignItems: "center",
  },
  signInText: {
    textAlign: "center",
    marginBottom: Spacing.lg,
    fontSize: 14,
  },
  signInButton: {
    width: "100%",
  },
  subscriptionContainer: {
    padding: Spacing.lg,
  },
  subscriptionInfo: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  subscriptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subscriptionLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  subscriptionValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  subscriptionButton: {
    marginTop: Spacing.sm,
  },
  pricingLink: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing["2xl"],
    borderRadius: BorderRadius.lg,
  },
});
