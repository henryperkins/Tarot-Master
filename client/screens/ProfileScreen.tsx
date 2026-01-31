import { View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Colors, Spacing, Typography, BorderRadius } from "@/constants/theme";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
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
        <ThemedText style={styles.sectionTitle}>Account</ThemedText>
        
        <Card style={styles.menuCard}>
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
