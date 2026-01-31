import { View, ViewProps, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, BorderRadius, Spacing, Shadows } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

export interface CardProps extends ViewProps {
  variant?: "default" | "elevated" | "glow";
}

export function Card({ variant = "default", style, children, ...rest }: CardProps) {
  const { theme } = useTheme();

  if (variant === "glow") {
    return (
      <View style={[styles.glowOuter, style]} {...rest}>
        <LinearGradient
          colors={[theme.backgroundSecondary, theme.backgroundTertiary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.glowInner}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }

  const backgroundColor = 
    variant === "elevated" ? theme.backgroundTertiary : theme.backgroundSecondary;

  return (
    <View
      style={[
        styles.base,
        { backgroundColor, borderColor: theme.borderLight },
        variant === "elevated" && Shadows.md,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.cardPadding,
    borderWidth: 1,
  },
  glowOuter: {
    borderRadius: BorderRadius.lg,
    ...Shadows.glow,
  },
  glowInner: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.cardPadding,
    borderWidth: 1,
    borderColor: Colors.dark.borderLight,
  },
});
