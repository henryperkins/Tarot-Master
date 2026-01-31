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
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  imageType = "generic",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { theme } = useTheme();

  const imageSource = imageType === "journal" 
    ? require("../../assets/images/empty-journal.png")
    : require("../../assets/images/splash-icon.png");

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, { backgroundColor: theme.backgroundSecondary }]}>
        <Image
          source={imageSource}
          style={styles.image}
          contentFit="contain"
        />
      </View>
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText style={[styles.description, { color: theme.textMuted }]}>
        {description}
      </ThemedText>
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="outline"
          size="md"
          style={styles.button}
        />
      )}
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
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing["2xl"],
    overflow: "hidden",
  },
  image: {
    width: 80,
    height: 80,
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
