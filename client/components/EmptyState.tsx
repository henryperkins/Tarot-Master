import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "./ThemedText";
import { Button } from "./Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";

interface EmptyStateProps {
  title: string;
  description: string;
  imageType?: "journal" | "readings" | "generic";
  icon?: keyof typeof Feather.glyphMap;
  actionLabel?: string;
  actionIcon?: keyof typeof Feather.glyphMap;
  onAction?: () => void;
}

const defaultIcons: Record<string, keyof typeof Feather.glyphMap> = {
  journal: "book-open",
  readings: "sun",
  generic: "inbox",
};

export function EmptyState({
  title,
  description,
  imageType = "generic",
  icon,
  actionLabel,
  actionIcon,
  onAction,
}: EmptyStateProps) {
  const { theme } = useTheme();

  const displayIcon = icon || defaultIcons[imageType] || "inbox";

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: theme.backgroundSecondary }]}>
        <Feather name={displayIcon} size={48} color={theme.primary} />
      </View>
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText style={[styles.description, { color: theme.textMuted }]}>
        {description}
      </ThemedText>
      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="outline"
          size="md"
          icon={actionIcon}
          style={styles.button}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing["3xl"],
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing["2xl"],
  },
  title: {
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    marginBottom: Spacing["2xl"],
    maxWidth: 280,
  },
  button: {
    minWidth: 160,
  },
});
