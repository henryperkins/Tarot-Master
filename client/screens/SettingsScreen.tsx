import { View, StyleSheet, ScrollView, Pressable, Alert, Linking, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { HeaderLogo } from "@/components/HeaderLogo";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Fonts } from "@/constants/theme";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";

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
      {item.onPress && (
        <Feather name="chevron-right" size={18} color={theme.textMuted} />
      )}
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
});
